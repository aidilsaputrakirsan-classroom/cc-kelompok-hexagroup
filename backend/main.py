from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
from dotenv import load_dotenv

from database import get_db, Base, engine
from schemas import UserRegister, UserLogin, UserCreateByKetua, TransactionCreate, LetterCreate, TransactionResponse, LetterResponse, UserResponse, RefreshToken, UserUpdate
from crud import (
    create_user, get_user_by_email, get_user_by_id, verify_password,
    create_transaction, get_all_transactions, get_transaction_by_id, update_transaction, delete_transaction,
    create_letter, get_all_letters, get_letter_by_id, update_letter, delete_letter, update_letter_status,
    get_all_users, update_user, delete_user
)
from auth import create_access_token, decode_token, create_refresh_token
from models import User, UserRole

load_dotenv()

# Initialize DB
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Organization Management System",
    description="Monolith API with Role-Based Access Control",
    version="2.0.0"
)

# CORS Configuration
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db=Depends(get_db)):
    """Get authenticated user from token"""
    token = credentials.credentials
    payload = decode_token(token)
    if payload is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = get_user_by_email(db, payload["sub"])
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


def require_role(*allowed_roles: UserRole):
    """Dependency to check user has required role"""
    def role_checker(user: User = Depends(get_current_user)):
        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"This action requires one of these roles: {', '.join([r.value for r in allowed_roles])}"
            )
        return user
    return role_checker


# ===== PUBLIC ENDPOINTS =====
@app.get("/")
def root():
    return {"message": "Sikasi App API", "status": "running", "version": "2.0.0"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/team")
def team_info():
    return {
        "team": "cc-kelompok-hexagroup",
        "members": [
            {"name": "Achmad Bayhaqi", "nim": "10231001", "role": "Lead Backend"},
            {"name": "Indah Nur Fortuna", "nim": "10231044", "role": "Lead Frontend"},
            {"name": "Alfiani Dwiyuniarti", "nim": "10231010", "role": "Lead DevOps"},
            {"name": "Zahwa Hanna Dwi Putri", "nim": "10231092", "role": "Lead CI/CD"},
            {"name": "Nilam Ayu NandaStari Romdoni", "nim": "10231070", "role": "Lead QA"},
        ],
    }


# ===== AUTH ENDPOINTS =====
@app.post("/auth/register")
def register(user_data: UserRegister, db=Depends(get_db)):
    """Register new member (only anggota role)"""
    existing_user = get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = create_user(db, user_data.email, user_data.password, user_data.full_name, role="anggota")

    access_token = create_access_token(user.email)
    refresh_token = create_refresh_token(user.email)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role
        }
    }


@app.post("/auth/login")
def login(user_data: UserLogin, db=Depends(get_db)):
    """Login for all roles"""
    user = get_user_by_email(db, user_data.email)
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(user.email)
    refresh_token = create_refresh_token(user.email)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role
        }
    }

@app.post("/auth/refresh")
def refresh(body: RefreshToken):
    """Refresh access token"""
    payload = decode_token(body.refresh_token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    access_token = create_access_token(payload["sub"])
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/auth/me")
def get_me(user: User = Depends(get_current_user)):
    """Get current user info"""
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role
    }


# ===== FINANCE ENDPOINTS =====
@app.post("/finance/transactions")
def create_transaction_endpoint(
    transaction: TransactionCreate,
    user: User = Depends(require_role(UserRole.bendahara)),
    db=Depends(get_db)
):
    """Create transaction - only bendahara"""
    trans = create_transaction(db, transaction)
    return trans


@app.get("/finance/transactions")
def list_transactions(
    skip: int = 0,
    limit: int = 10,
    user: User = Depends(get_current_user),
    db=Depends(get_db)
):
    """List all transactions - all authenticated users can read"""
    transactions = get_all_transactions(db, skip, limit)
    return transactions


@app.get("/finance/transactions/{transaction_id}")
def get_transaction(
    transaction_id: int,
    user: User = Depends(get_current_user),
    db=Depends(get_db)
):
    """Get single transaction"""
    transaction = get_transaction_by_id(db, transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction


@app.put("/finance/transactions/{transaction_id}")
def update_transaction_endpoint(
    transaction_id: int,
    transaction_data: TransactionCreate,
    user: User = Depends(require_role(UserRole.bendahara)),
    db=Depends(get_db)
):
    """Update transaction - only bendahara"""
    updated = update_transaction(db, transaction_id, transaction_data.dict(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return updated


@app.delete("/finance/transactions/{transaction_id}")
def delete_transaction_endpoint(
    transaction_id: int,
    user: User = Depends(require_role(UserRole.bendahara)),
    db=Depends(get_db)
):
    """Delete transaction - only bendahara"""
    deleted = delete_transaction(db, transaction_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return {"detail": "Transaction deleted"}

@app.get("/finance/summary")
def get_finance_summary(
    user: User = Depends(get_current_user),
    db=Depends(get_db)
):
    """Get finance summary - all roles can view"""
    transactions = get_all_transactions(db, skip=0, limit=10000)  # Get all for calculation

    total_income = sum(t.amount for t in transactions if t.type == "income")
    total_expense = sum(t.amount for t in transactions if t.type == "expense")
    balance = total_income - total_expense

    return {
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": balance,
        "transaction_count": len(transactions)
    }



# ===== LETTER ENDPOINTS =====
@app.post("/letters")
def create_letter_endpoint(
    letter: LetterCreate,
    user: User = Depends(require_role(UserRole.sekretaris)),
    db=Depends(get_db)
):
    """Create letter - only sekretaris"""
    ltr = create_letter(db, letter)
    return ltr


@app.get("/letters")
def list_letters(
    status: str = None,
    skip: int = 0,
    limit: int = 10,
    user: User = Depends(get_current_user),
    db=Depends(get_db)
):
    """List all letters - all authenticated users can read"""
    letters = get_all_letters(db, status, skip, limit)
    return letters


@app.get("/letters/{letter_id}")
def get_letter(
    letter_id: int,
    user: User = Depends(get_current_user),
    db=Depends(get_db)
):
    """Get single letter"""
    letter = get_letter_by_id(db, letter_id)
    if not letter:
        raise HTTPException(status_code=404, detail="Letter not found")
    return letter


@app.put("/letters/{letter_id}")
def update_letter_endpoint(
    letter_id: int,
    letter_data: LetterCreate,
    user: User = Depends(require_role(UserRole.sekretaris)),
    db=Depends(get_db)
):
    """Update letter - only sekretaris, only if status is draft"""
    letter = get_letter_by_id(db, letter_id)
    if not letter:
        raise HTTPException(status_code=404, detail="Letter not found")
    if letter.status != "draft":
        raise HTTPException(status_code=400, detail="Can only edit letters in draft status")
    updated = update_letter(db, letter_id, letter_data.dict(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Letter not found")
    return updated


@app.delete("/letters/{letter_id}")
def delete_letter_endpoint(
    letter_id: int,
    user: User = Depends(require_role(UserRole.sekretaris)),
    db=Depends(get_db)
):
    """Delete letter - only sekretaris"""
    deleted = delete_letter(db, letter_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Letter not found")
    return {"detail": "Letter deleted"}


@app.post("/letters/{letter_id}/submit")
def submit_letter(
    letter_id: int,
    user: User = Depends(require_role(UserRole.sekretaris)),
    db=Depends(get_db)
):
    """Submit letter for review"""
    letter = get_letter_by_id(db, letter_id)
    if not letter:
        raise HTTPException(status_code=404, detail="Letter not found")
    if letter.status != "draft":
        raise HTTPException(status_code=400, detail="Can only submit letters in draft status")

    updated = update_letter_status(db, letter_id, "submitted")
    if not updated:
        raise HTTPException(status_code=404, detail="Letter not found")
    return updated

@app.post("/letters/{letter_id}/approve")
def approve_letter(
    letter_id: int,
    user: User = Depends(require_role(UserRole.sekretaris)),
    db=Depends(get_db)
):
    """Approve letter - only sekretaris"""
    letter = get_letter_by_id(db, letter_id)
    if not letter:
        raise HTTPException(status_code=404, detail="Letter not found")
    if letter.status != "submitted":
        raise HTTPException(status_code=400, detail="Can only approve submitted letters")

    updated = update_letter_status(db, letter_id, "approved")
    if not updated:
        raise HTTPException(status_code=404, detail="Letter not found")
    return updated


@app.post("/letters/{letter_id}/reject")
def reject_letter(
    letter_id: int,
    user: User = Depends(require_role(UserRole.sekretaris)),
    db=Depends(get_db)
):
    """Reject letter - only sekretaris"""
    letter = get_letter_by_id(db, letter_id)
    if not letter:
        raise HTTPException(status_code=404, detail="Letter not found")
    if letter.status != "submitted":
        raise HTTPException(status_code=400, detail="Can only reject submitted letters")

    updated = update_letter_status(db, letter_id, "rejected")
    if not updated:
        raise HTTPException(status_code=404, detail="Letter not found")
    return updated


# ===== USER MANAGEMENT (Ketua only) =====
@app.post("/users")
def create_user_by_ketua(
    user_data: UserCreateByKetua,
    ketua: User = Depends(require_role(UserRole.ketua)),
    db=Depends(get_db)
):
    """Create new user (bendahara, sekretaris, anggota) - only ketua"""
    existing_user = get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    user = create_user(db, user_data.email, user_data.password, user_data.full_name, user_data.role)
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role
    }


@app.get("/users")
def list_users(
    skip: int = 0,
    limit: int = 10,
    ketua: User = Depends(require_role(UserRole.ketua)),
    db=Depends(get_db)
):
    """List all users - only ketua"""
    users = get_all_users(db, skip, limit)
    return [{"id": u.id, "email": u.email, "full_name": u.full_name, "role": u.role} for u in users]


@app.get("/users/{user_id}")
def get_user(
    user_id: int,
    ketua: User = Depends(require_role(UserRole.ketua)),
    db=Depends(get_db)
):
    """Get user details - only ketua"""
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"id": user.id, "email": user.email, "full_name": user.full_name, "role": user.role}


@app.put("/users/{user_id}")
def update_user_endpoint(
    user_id: int,
    user_data: UserUpdate,
    ketua: User = Depends(require_role(UserRole.ketua)),
    db=Depends(get_db)
):
    """Update user - only ketua"""
    updated = update_user(db, user_id, user_data.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return {"id": updated.id, "email": updated.email, "full_name": updated.full_name, "role": updated.role}


@app.delete("/users/{user_id}")
def delete_user_endpoint(
    user_id: int,
    ketua: User = Depends(require_role(UserRole.ketua)),
    db=Depends(get_db)
):
    """Delete user - only ketua. Cannot delete ketua role or the last ketua"""
    user_to_delete = get_user_by_id(db, user_id)
    if not user_to_delete:
        raise HTTPException(status_code=404, detail="User not found")

    # Prevent deleting ketua role
    if user_to_delete.role == UserRole.ketua:
        # Check if this is the last ketua
        ketua_count = db.query(User).filter(User.role == UserRole.ketua).count()
        if ketua_count <= 1:
            raise HTTPException(status_code=400, detail="Cannot delete the last ketua. At least one ketua must exist.")
        raise HTTPException(status_code=403, detail="Cannot delete ketua account")

    deleted = delete_user(db, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": "User deleted"}
