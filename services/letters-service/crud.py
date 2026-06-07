from sqlalchemy.orm import Session
from models import Letter, LetterStatus
from schemas import LetterCreate
from datetime import datetime


# ── Letter CRUD ──────────────────────────────────────────
def create_letter(db: Session, letter: LetterCreate):
    db_letter = Letter(
        title=letter.title,
        letter_type=letter.letter_type,
        content=letter.content,
        status=LetterStatus.draft
    )
    db.add(db_letter)
    db.commit()
    db.refresh(db_letter)
    return db_letter


def get_all_letters(db: Session, status: str = None, skip: int = 0, limit: int = 10):
    query = db.query(Letter)
    if status:
        query = query.filter(Letter.status == status)
    return query.offset(skip).limit(limit).all()


def get_letter_by_id(db: Session, letter_id: int):
    return db.query(Letter).filter(Letter.id == letter_id).first()


def update_letter(db: Session, letter_id: int, letter_data: dict):
    letter = get_letter_by_id(db, letter_id)
    if letter:
        for key, value in letter_data.items():
            if value is not None:
                setattr(letter, key, value)
        letter.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(letter)
    return letter


def update_letter_status(db: Session, letter_id: int, status: str):
    letter = get_letter_by_id(db, letter_id)
    if letter:
        letter.status = status
        letter.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(letter)
    return letter


def delete_letter(db: Session, letter_id: int):
    letter = get_letter_by_id(db, letter_id)
    if letter:
        db.delete(letter)
        db.commit()
    return letter
