from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
from sqlalchemy import text
from database import get_db
from auth_client import auth_circuit

from database import get_db, Base, engine
from schemas import LetterCreate
from crud import (
    create_letter, get_all_letters, get_letter_by_id, update_letter, delete_letter, update_letter_status
)
import auth_client

app = FastAPI(
    title="Letters Service",
    version="1.0.0",
    docs_url="/letters/docs",
    openapi_url="/letters/openapi.json",
    redirect_slashes=False,
)


@app.on_event("startup")
async def startup():
    if os.getenv("TESTING", "false").lower() not in {"1", "true", "yes"}:
        Base.metadata.create_all(bind=engine)


CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost,http://localhost:5173").split(",")
app.add_middleware(CORSMiddleware, allow_origins=CORS_ORIGINS, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

security = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return auth_client.verify_token(credentials.credentials)


def require_role(*roles: str):
    def checker(user: dict = Depends(get_current_user)):
        if user.get("role") not in roles:
            raise HTTPException(status_code=403, detail=f"Requires roles: {', '.join(roles)}")
        return user
    return checker


# ── Health ───────────────────────────────────────────────
@app.get("/letters/health")
def health():
    # Cek database
    db_status = "connected"
    try:
        db = next(get_db())
        db.execute(text("SELECT 1"))
        db.close()
    except Exception:
        db_status = "disconnected"

    cb = auth_circuit.get_status()
    overall = "healthy"
    if cb["state"] != "CLOSED":
        overall = "degraded"
    if db_status != "connected":
        overall = "unhealthy"

    return {
        "status": overall,
        "service": "letters-service",
        "dependencies": {
            "auth-service": {
                "status": "available" if cb["state"] == "CLOSED" else "unavailable",
                "circuit_breaker": cb,
            },
            "database": {
                "status": db_status,
            },
        },
    }

# ── Letters ──────────────────────────────────────────────
@app.post("/letters")
def create_ltr(letter: LetterCreate, _=Depends(require_role("sekretaris")), db=Depends(get_db)):
    return create_letter(db, letter)


@app.get("/letters")
def list_ltr(status: str = None, skip: int = 0, limit: int = 10, _=Depends(get_current_user), db=Depends(get_db)):
    return get_all_letters(db, status, skip, limit)


@app.get("/letters/{id}")
def get_ltr(id: int, _=Depends(get_current_user), db=Depends(get_db)):
    letter = get_letter_by_id(db, id)
    if not letter:
        raise HTTPException(status_code=404, detail="Letter not found")
    return letter


@app.put("/letters/{id}")
def update_ltr(id: int, data: LetterCreate, _=Depends(require_role("sekretaris")), db=Depends(get_db)):
    letter = get_letter_by_id(db, id)
    if not letter:
        raise HTTPException(status_code=404, detail="Letter not found")
    if letter.status != "draft":
        raise HTTPException(status_code=400, detail="Can only edit letters in draft status")
    return update_letter(db, id, data.dict(exclude_unset=True))


@app.delete("/letters/{id}")
def delete_ltr(id: int, _=Depends(require_role("sekretaris")), db=Depends(get_db)):
    if not delete_letter(db, id):
        raise HTTPException(status_code=404, detail="Letter not found")
    return {"detail": "Letter deleted"}


@app.post("/letters/{id}/submit")
def submit_ltr(id: int, _=Depends(require_role("sekretaris")), db=Depends(get_db)):
    letter = get_letter_by_id(db, id)
    if not letter:
        raise HTTPException(status_code=404, detail="Letter not found")
    if letter.status != "draft":
        raise HTTPException(status_code=400, detail="Can only submit letters in draft status")
    return update_letter_status(db, id, "submitted")


@app.post("/letters/{id}/approve")
def approve_ltr(id: int, _=Depends(require_role("sekretaris")), db=Depends(get_db)):
    letter = get_letter_by_id(db, id)
    if not letter:
        raise HTTPException(status_code=404, detail="Letter not found")
    if letter.status != "submitted":
        raise HTTPException(status_code=400, detail="Can only approve submitted letters")
    return update_letter_status(db, id, "approved")


@app.post("/letters/{id}/reject")
def reject_ltr(id: int, _=Depends(require_role("sekretaris")), db=Depends(get_db)):
    letter = get_letter_by_id(db, id)
    if not letter:
        raise HTTPException(status_code=404, detail="Letter not found")
    if letter.status != "submitted":
        raise HTTPException(status_code=400, detail="Can only reject submitted letters")
    return update_letter_status(db, id, "rejected")
