from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os

from database import get_db, Base, engine
from schemas import (
    UserRegister,
    UserLogin,
    UserCreateByKetua,
    RefreshToken,
    UserUpdate,
    TokenVerifyRequest,
    TokenVerifyResponse,
)
from crud import (
    create_user,
    get_user_by_email,
    get_user_by_id,
    verify_password,
    get_all_users,
    update_user,
    delete_user,
)
from auth import create_access_token, create_refresh_token, decode_token
from models import User, UserRole

app = FastAPI(
    title="Auth Service",
    version="1.0.0",
    openapi_url="/auth/openapi.json",
    docs_url="/auth/docs",
    redoc_url="/auth/redoc",
)


@app.on_event("startup")
async def startup():
    if os.getenv("TESTING", "false").lower() not in {"1", "true", "yes"}:
        Base.metadata.create_all(bind=engine)


CORS_ORIGINS = os.getenv(
    "CORS_ORIGINS",
    "http://localhost,http://localhost:5173"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db=Depends(get_db),
):
    payload = decode_token(credentials.credentials)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = get_user_by_email(db, payload["sub"])

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user


def require_role(*roles: UserRole):
    def checker(user: User = Depends(get_current_user)):
        if user.role not in roles:
            raise HTTPException(
                status_code=403,
                detail=f"Requires roles: {', '.join(r.value for r in roles)}",
            )
        return user

    return checker


# ─────────────────────────────────────────────────────────
# HEALTH
# ─────────────────────────────────────────────────────────

@app.get("/auth/health")
def health():
    return {
        "status": "healthy",
        "service": "auth-service",
    }


# ─────────────────────────────────────────────────────────
# INTERNAL
# ─────────────────────────────────────────────────────────

@app.post(
    "/auth/internal/verify-token",
    response_model=TokenVerifyResponse,
)
def verify_token(body: TokenVerifyRequest, db=Depends(get_db)):
    payload = decode_token(body.token)

    if not payload:
        return TokenVerifyResponse(valid=False)

    user = get_user_by_email(db, payload["sub"])

    if not user:
        return TokenVerifyResponse(valid=False)

    return TokenVerifyResponse(
        valid=True,
        email=user.email,
        role=user.role.value,
        user_id=user.id,
    )


# ─────────────────────────────────────────────────────────
# AUTH
# ─────────────────────────────────────────────────────────

@app.post("/auth/register")
def register(data: UserRegister, db=Depends(get_db)):
    if get_user_by_email(db, data.email):
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )

    user = create_user(
        db,
        data.email,
        data.password,
        data.full_name,
        role="anggota",
    )

    return {
        "access_token": create_access_token(user.email),
        "refresh_token": create_refresh_token(user.email),
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
        },
    }


@app.post("/auth/login")
def login(data: UserLogin, db=Depends(get_db)):
    user = get_user_by_email(db, data.email)

    if not user or not verify_password(
        data.password,
        user.hashed_password,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
        )

    return {
        "access_token": create_access_token(user.email),
        "refresh_token": create_refresh_token(user.email),
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
        },
    }


@app.post("/auth/refresh")
def refresh(body: RefreshToken):
    payload = decode_token(body.refresh_token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid refresh token",
        )

    return {
        "access_token": create_access_token(payload["sub"]),
        "token_type": "bearer",
    }


@app.get("/auth/me")
def me(user: User = Depends(get_current_user)):
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
    }


# ─────────────────────────────────────────────────────────
# USER MANAGEMENT
# ─────────────────────────────────────────────────────────

@app.post("/auth/users")
def create_user_endpoint(
    data: UserCreateByKetua,
    _=Depends(require_role(UserRole.ketua)),
    db=Depends(get_db),
):
    if get_user_by_email(db, data.email):
        raise HTTPException(
            status_code=400,
            detail="Email already exists",
        )

    user = create_user(
        db,
        data.email,
        data.password,
        data.full_name,
        data.role,
    )

    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
    }


@app.get("/auth/users")
def list_users(
    skip: int = 0,
    limit: int = 10,
    _=Depends(require_role(UserRole.ketua)),
    db=Depends(get_db),
):
    return [
        {
            "id": u.id,
            "email": u.email,
            "full_name": u.full_name,
            "role": u.role,
        }
        for u in get_all_users(db, skip, limit)
    ]


@app.get("/auth/users/{user_id}")
def get_user(
    user_id: int,
    _=Depends(require_role(UserRole.ketua)),
    db=Depends(get_db),
):
    user = get_user_by_id(db, user_id)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
    }


@app.put("/auth/users/{user_id}")
def update_user_endpoint(
    user_id: int,
    data: UserUpdate,
    _=Depends(require_role(UserRole.ketua)),
    db=Depends(get_db),
):
    updated = update_user(
        db,
        user_id,
        data.model_dump(exclude_unset=True),
    )

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return {
        "id": updated.id,
        "email": updated.email,
        "full_name": updated.full_name,
        "role": updated.role,
    }


@app.delete("/auth/users/{user_id}")
def delete_user_endpoint(
    user_id: int,
    _=Depends(require_role(UserRole.ketua)),
    db=Depends(get_db),
):
    user = get_user_by_id(db, user_id)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    if user.role == UserRole.ketua:
        count = db.query(User).filter(
            User.role == UserRole.ketua
        ).count()

        if count <= 1:
            raise HTTPException(
                status_code=400,
                detail="Cannot delete the last ketua",
            )

        raise HTTPException(
            status_code=403,
            detail="Cannot delete ketua account",
        )

    delete_user(db, user_id)

    return {
        "detail": "User deleted",
    }
