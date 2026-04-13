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
def create_user(db: Session, email: str, password: str, full_name: str, role: str = "anggota"):
    hashed_password = hash_password(password)
    user = User(email=email, hashed_password=hashed_password, full_name=full_name, role=role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


# ===== TRANSACTION CRUD =====
def create_transaction(db: Session, transaction: TransactionCreate):
    db_transaction = Transaction(
        type=transaction.type,
        category=transaction.category,
        amount=transaction.amount,
        description=transaction.description
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction


def get_all_transactions(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Transaction).offset(skip).limit(limit).all()


def get_transaction_by_id(db: Session, transaction_id: int):
    return db.query(Transaction).filter(Transaction.id == transaction_id).first()


def update_transaction(db: Session, transaction_id: int, transaction_data: dict):
    transaction = get_transaction_by_id(db, transaction_id)
    if transaction:
        for key, value in transaction_data.items():
            if value is not None:
                setattr(transaction, key, value)
        db.commit()
        db.refresh(transaction)
    return transaction


def delete_transaction(db: Session, transaction_id: int):
    transaction = get_transaction_by_id(db, transaction_id)
    if transaction:
        db.delete(transaction)
        db.commit()
    return transaction


# ===== LETTER CRUD =====
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


# ===== USER MANAGEMENT (For Ketua) =====
def get_all_users(db: Session, skip: int = 0, limit: int = 10):
    return db.query(User).offset(skip).limit(limit).all()


def update_user(db: Session, user_id: int, user_data: dict):
    user = get_user_by_id(db, user_id)
    if user:
        for key, value in user_data.items():
            if value is not None and key != "password":
                setattr(user, key, value)
        db.commit()
        db.refresh(user)
    return user


def delete_user(db: Session, user_id: int):
    user = get_user_by_id(db, user_id)
    if user:
        db.delete(user)
        db.commit()
    return user
