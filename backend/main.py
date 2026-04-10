from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
from dotenv import load_dotenv

from database import get_db, Base, engine
from schemas import UserRegister, UserLogin, TransactionCreate, LetterCreate
from crud import (
    create_user, get_user_by_email, verify_password,
    create_transaction, get_user_transactions, create_letter,
    get_user_letters, update_letter_status
)
from auth import create_access_token, decode_token, create_refresh_token
from models import User

load_dotenv()

# Initialize DB
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Organization Management System",
    description="Monolith API for Auth, Finance, and Letters",
    version="1.0.0"
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

# Dependency
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db=Depends(get_db)):
    token = credentials.credentials
    payload = decode_token(token)
    if payload is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    user = get_user_by_email(db, payload["sub"])
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    return user


# ===== PUBLIC ENDPOINTS =====
@app.get("/")
def root():
    return {
        "message": "Hello from Sikasi App API!",
        "status": "running",
        "version": "1.0.0"
    }


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
            {"name": "Zahwa Hanna Dwi Putri", "nim": "10231092", "role": "Lead CI/CD dan Deploy"},
            {"name": "Nilam Ayu NandaStari Romdoni", "nim": "10231070", "role": "Lead QA & Docs"},
        ],
    }


# ===== AUTH ENDPOINTS =====
@app.post("/auth/register")
def register(user_data: UserRegister, db=Depends(get_db)):
    existing_user = get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = create_user(db, user_data.email, user_data.password, user_data.full_name)

    access_token = create_access_token(user.email)
    refresh_token = create_refresh_token(user.email)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name
        }
    }


@app.post("/auth/login")
def login(user_data: UserLogin, db=Depends(get_db)):
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
            "full_name": user.full_name
        }
    }


@app.post("/auth/refresh")
def refresh(refresh_token: dict):
    payload = decode_token(refresh_token.get("refresh_token"))
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    access_token = create_access_token(payload["sub"])
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/auth/me")
def get_me(user: User = Depends(get_current_user)):
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name
    }


# ===== FINANCE ENDPOINTS =====
@app.post("/finance/transactions")
def create_transaction_endpoint(transaction: TransactionCreate, user: User = Depends(get_current_user), db=Depends(get_db)):
    trans = create_transaction(db, user.id, transaction)
    return {
        "id": trans.id,
        "user_id": trans.user_id,
        "type": trans.type,
        "amount": trans.amount,
        "description": trans.description,
        "date": trans.date
    }


@app.get("/finance/transactions")
def get_transactions(skip: int = 0, limit: int = 10, user: User = Depends(get_current_user), db=Depends(get_db)):
    transactions = get_user_transactions(db, user.id, skip, limit)
    total_income = sum(t.amount for t in transactions if t.type == "income")
    total_expense = sum(t.amount for t in transactions if t.type == "expense")

    return {
        "transactions": [
            {
                "id": t.id,
                "type": t.type,
                "amount": t.amount,
                "description": t.description,
                "date": t.date
            } for t in transactions
        ],
        "summary": {
            "total_income": total_income,
            "total_expense": total_expense,
            "balance": total_income - total_expense
        }
    }


@app.delete("/finance/transactions/{transaction_id}")
def delete_transaction(transaction_id: int, user: User = Depends(get_current_user), db=Depends(get_db)):
    from crud import delete_transaction
    delete_transaction(db, transaction_id, user.id)
    return {"message": "Transaction deleted"}


# ===== LETTER ENDPOINTS =====
@app.post("/letters")
def create_letter_endpoint(letter: LetterCreate, user: User = Depends(get_current_user), db=Depends(get_db)):
    letter_obj = create_letter(db, user.id, letter)
    return {
        "id": letter_obj.id,
        "user_id": letter_obj.user_id,
        "title": letter_obj.title,
        "content": letter_obj.content,
        "status": letter_obj.status,
        "created_at": letter_obj.created_at
    }


@app.get("/letters")
def get_letters(status: str = None, skip: int = 0, limit: int = 10, user: User = Depends(get_current_user), db=Depends(get_db)):
    letters = get_user_letters(db, user.id, status, skip, limit)
    return {
        "letters": [
            {
                "id": l.id,
                "title": l.title,
                "content": l.content,
                "status": l.status,
                "created_at": l.created_at,
                "updated_at": l.updated_at
            } for l in letters
        ]
    }


@app.post("/letters/{letter_id}/submit")
def submit_letter(letter_id: int, user: User = Depends(get_current_user), db=Depends(get_db)):
    letter = update_letter_status(db, letter_id, "submitted", user.id)
    return {"message": "Letter submitted", "status": letter.status}


@app.put("/letters/{letter_id}")
def update_letter(letter_id: int, letter_data: dict, user: User = Depends(get_current_user), db=Depends(get_db)):
    from crud import update_letter_content
    letter = update_letter_content(db, letter_id, letter_data, user.id)
    return {
        "id": letter.id,
        "title": letter.title,
        "content": letter.content,
        "status": letter.status
    }


@app.delete("/letters/{letter_id}")
def delete_letter(letter_id: int, user: User = Depends(get_current_user), db=Depends(get_db)):
    from crud import delete_letter
    delete_letter(db, letter_id, user.id)
    return {"message": "Letter deleted"}


if __name__ == "__main__":
    import uvicorn
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", 8000))
    uvicorn.run(app, host=host, port=port)
