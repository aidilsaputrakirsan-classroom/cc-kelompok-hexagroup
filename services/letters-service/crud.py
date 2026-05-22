from sqlalchemy.orm import Session
from models import Letter, LetterStatus
from schemas import LetterCreate
from datetime import datetime

# ── Letter ───────────────────────────────────────────────
def create_letter(db: Session, l: LetterCreate):
    obj = Letter(title=l.title, letter_type=l.letter_type, content=l.content, status=LetterStatus.draft)
    db.add(obj); db.commit(); db.refresh(obj)
    return obj


def get_all_letters(db: Session, status: str = None, skip: int = 0, limit: int = 10):
    q = db.query(Letter)
    if status:
        q = q.filter(Letter.status == status)
    return q.offset(skip).limit(limit).all()


def get_letter_by_id(db: Session, lid: int):
    return db.query(Letter).filter(Letter.id == lid).first()


def update_letter(db: Session, lid: int, data: dict):
    l = get_letter_by_id(db, lid)
    if l:
        for k, v in data.items():
            if v is not None:
                setattr(l, k, v)
        l.updated_at = datetime.utcnow()
        db.commit(); db.refresh(l)
    return l


def update_letter_status(db: Session, lid: int, status: str):
    l = get_letter_by_id(db, lid)
    if l:
        l.status = status
        l.updated_at = datetime.utcnow()
        db.commit(); db.refresh(l)
    return l


def delete_letter(db: Session, lid: int):
    l = get_letter_by_id(db, lid)
    if l:
        db.delete(l); db.commit()
    return l
