from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
from sqlalchemy import text
from auth_client import auth_circuit

from database import get_db, Base, engine
from schemas import TransactionCreate
from crud import (
    create_transaction, get_all_transactions, get_transaction_by_id, update_transaction, delete_transaction,
)
import auth_client

app = FastAPI(
    title="Finance Service",
    version="1.0.0",
    docs_url="/finance/docs",
    openapi_url="/finance/openapi.json",
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
@app.get("/finance/health")
def health():
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
        "service": "finance-service",
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

# ── Finance / Transactions ───────────────────────────────
@app.post("/finance/transactions")
def create_tx(t: TransactionCreate, _=Depends(require_role("bendahara")), db=Depends(get_db)):
    return create_transaction(db, t)


@app.get("/finance/transactions")
def list_tx(skip: int = 0, limit: int = 10, category: str = None, _=Depends(get_current_user), db=Depends(get_db)):
    return get_all_transactions(db, skip, limit, category)


@app.get("/finance/transactions/{tid}")
def get_tx(tid: int, _=Depends(get_current_user), db=Depends(get_db)):
    tx = get_transaction_by_id(db, tid)
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return tx


@app.put("/finance/transactions/{tid}")
def update_tx(tid: int, data: TransactionCreate, _=Depends(require_role("bendahara")), db=Depends(get_db)):
    updated = update_transaction(db, tid, data.dict(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return updated


@app.delete("/finance/transactions/{tid}")
def delete_tx(tid: int, _=Depends(require_role("bendahara")), db=Depends(get_db)):
    if not delete_transaction(db, tid):
        raise HTTPException(status_code=404, detail="Transaction not found")
    return {"detail": "Transaction deleted"}


@app.get("/finance/summary")
def summary(category: str = None, _=Depends(get_current_user), db=Depends(get_db)):
    txs = get_all_transactions(db, skip=0, limit=10000, category=category)
    income = sum(t.amount for t in txs if t.type == "income")
    expense = sum(t.amount for t in txs if t.type == "expense")
    return {"total_income": income, "total_expense": expense, "balance": income - expense, "transaction_count": len(txs)}
