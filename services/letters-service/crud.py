from sqlalchemy.orm import Session
from models import Transaction
from schemas import TransactionCreate


# ── Transaction ──────────────────────────────────────────
def create_transaction(db: Session, t: TransactionCreate):
    obj = Transaction(type=t.type, category=t.category, amount=t.amount, description=t.description)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def get_all_transactions(db: Session, skip: int = 0, limit: int = 10, category: str = None):
    q = db.query(Transaction)
    if category:
        q = q.filter(Transaction.category.ilike(f"%{category}%"))
    return q.offset(skip).limit(limit).all()


def get_transaction_by_id(db: Session, tid: int):
    return db.query(Transaction).filter(Transaction.id == tid).first()


def update_transaction(db: Session, tid: int, data: dict):
    t = get_transaction_by_id(db, tid)
    if t:
        for k, v in data.items():
            if v is not None:
                setattr(t, k, v)
        db.commit()
        db.refresh(t)
    return t


def delete_transaction(db: Session, tid: int):
    t = get_transaction_by_id(db, tid)
    if t:
        db.delete(t)
        db.commit()
    return t