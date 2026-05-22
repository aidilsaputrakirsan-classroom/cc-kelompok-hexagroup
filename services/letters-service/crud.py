from sqlalchemy.orm import Session
from models import Letter, LetterStatus
from schemas import LetterCreate
from datetime import datetime


# ── Letter ───────────────────────────────────────────────
def create_letter(db: Session, letter_data: LetterCreate):
    obj = Letter(title=letter_data.title, letter_type=letter_data.letter_type, content=letter_data.content, status=LetterStatus.draft)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def get_all_letters(db: Session, status: str = None, skip: int = 0, limit: int = 10):
    q = db.query(Letter)
    if status:
        q = q.filter(Letter.status == status)
    return q.offset(skip).limit(limit).all()


def get_letter_by_id(db: Session, lid: int):
    return db.query(Letter).filter(Letter.id == lid).first()


def update_letter(db: Session, lid: int, data: dict):
    letter = get_letter_by_id(db, lid)
    if letter:
        for k, v in data.items():
            if v is not None:
                setattr(letter, k, v)
        letter.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(letter)
    return letter


def update_letter_status(db: Session, lid: int, status: str):
    letter = get_letter_by_id(db, lid)
    if letter:
        letter.status = status
        letter.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(letter)
    return letter


def delete_letter(db: Session, lid: int):
    letter = get_letter_by_id(db, lid)
    if letter:
        db.delete(letter)
        db.commit()
    return letter