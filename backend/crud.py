from sqlalchemy.orm import Session
from passlib.context import CryptContext
from models import User, Transaction, Letter, LetterStatus
from schemas import UserRegister, TransactionCreate, LetterCreate
from datetime import datetime

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# ===== USER CRUD =====
def create_user(db: Session, email: str, password: str, full_name: str):
    hashed_password = hash_password(password)
    user = User(email=email, hashed_password=hashed_password, full_name=full_name)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


# ===== TRANSACTION CRUD =====
def create_transaction(db: Session, user_id: int, transaction: TransactionCreate):
    db_transaction = Transaction(
        user_id=user_id,
        type=transaction.type,
        amount=transaction.amount,
        description=transaction.description
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction


def get_user_transactions(db: Session, user_id: int, skip: int = 0, limit: int = 10):
    return db.query(Transaction).filter(
        Transaction.user_id == user_id
    ).offset(skip).limit(limit).all()


def delete_transaction(db: Session, transaction_id: int, user_id: int):
    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == user_id
    ).first()
    if transaction:
        db.delete(transaction)
        db.commit()
    return transaction


# ===== LETTER CRUD =====
def create_letter(db: Session, user_id: int, letter: LetterCreate):
    db_letter = Letter(
        user_id=user_id,
        title=letter.title,
        content=letter.content,
        status=LetterStatus.draft
    )
    db.add(db_letter)
    db.commit()
    db.refresh(db_letter)
    return db_letter


def get_user_letters(db: Session, user_id: int, status: str = None, skip: int = 0, limit: int = 10):
    query = db.query(Letter).filter(Letter.user_id == user_id)
    if status:
        query = query.filter(Letter.status == status)
    return query.offset(skip).limit(limit).all()


def get_letter_by_id(db: Session, letter_id: int, user_id: int):
    return db.query(Letter).filter(
        Letter.id == letter_id,
        Letter.user_id == user_id
    ).first()


def update_letter_status(db: Session, letter_id: int, status: str, user_id: int):
    letter = get_letter_by_id(db, letter_id, user_id)
    if letter:
        letter.status = status
        letter.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(letter)
    return letter


def update_letter_content(db: Session, letter_id: int, letter_data: dict, user_id: int):
    letter = get_letter_by_id(db, letter_id, user_id)
    if letter:
        if "title" in letter_data:
            letter.title = letter_data["title"]
        if "content" in letter_data:
            letter.content = letter_data["content"]
        letter.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(letter)
    return letter


def delete_letter(db: Session, letter_id: int, user_id: int):
    letter = get_letter_by_id(db, letter_id, user_id)
    if letter:
        db.delete(letter)
        db.commit()
    return letter
