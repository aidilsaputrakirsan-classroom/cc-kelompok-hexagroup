"""
test_crud_unit.py — Unit test langsung untuk fungsi CRUD
Pakai SQLite in-memory, tidak butuh HTTP.
"""
import pytest
import os

os.environ.setdefault("SECRET_KEY", "test-secret-key-for-pytest-only")
os.environ.setdefault("DATABASE_URL", "sqlite:///./test_crud.db")

import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base
from crud import (
    create_user, get_user_by_email, get_user_by_id,
    verify_password, hash_password,
    create_transaction, get_all_transactions, get_transaction_by_id,
    update_transaction, delete_transaction,
    create_letter, get_all_letters, get_letter_by_id,
    update_letter, update_letter_status, delete_letter,
    get_all_users, update_user, delete_user,
)
from schemas import TransactionCreate, LetterCreate


# ── Setup DB ────────────────────────────────────────────────
@pytest.fixture(scope="function")
def db():
    engine = create_engine(
        "sqlite:///./test_crud.db",
        connect_args={"check_same_thread": False},
    )
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()
    Base.metadata.drop_all(bind=engine)


# ════════════════════════════════════════════════════════════
# PASSWORD UTILS
# ════════════════════════════════════════════════════════════
class TestPasswordUtils:
    def test_hash_returns_different_string(self):
        hashed = hash_password("Secret123!")
        assert hashed != "Secret123!"

    def test_verify_correct_password(self):
        hashed = hash_password("Secret123!")
        assert verify_password("Secret123!", hashed) is True

    def test_verify_wrong_password(self):
        hashed = hash_password("Secret123!")
        assert verify_password("Wrong999!", hashed) is False

    def test_two_hashes_of_same_password_differ(self):
        h1 = hash_password("Secret123!")
        h2 = hash_password("Secret123!")
        assert h1 != h2   # bcrypt pakai salt random


# ════════════════════════════════════════════════════════════
# USER CRUD
# ════════════════════════════════════════════════════════════
class TestUserCRUD:
    def test_create_user(self, db):
        user = create_user(db, "u@test.com", "Pass123!", "User Test", "anggota")
        assert user.id is not None
        assert user.email == "u@test.com"
        assert user.role == "anggota"

    def test_get_user_by_email(self, db):
        create_user(db, "u@test.com", "Pass123!", "User Test", "anggota")
        found = get_user_by_email(db, "u@test.com")
        assert found is not None
        assert found.email == "u@test.com"

    def test_get_user_by_email_not_found(self, db):
        result = get_user_by_email(db, "ghost@test.com")
        assert result is None

    def test_get_user_by_id(self, db):
        user = create_user(db, "u@test.com", "Pass123!", "User Test", "anggota")
        found = get_user_by_id(db, user.id)
        assert found.id == user.id

    def test_get_user_by_id_not_found(self, db):
        result = get_user_by_id(db, 9999)
        assert result is None

    def test_get_all_users(self, db):
        create_user(db, "a@test.com", "Pass123!", "A", "anggota")
        create_user(db, "b@test.com", "Pass123!", "B", "bendahara")
        users = get_all_users(db)
        assert len(users) == 2

    def test_get_all_users_pagination(self, db):
        for i in range(5):
            create_user(db, f"u{i}@test.com", "Pass123!", f"User {i}", "anggota")
        result = get_all_users(db, skip=2, limit=2)
        assert len(result) == 2

    def test_update_user_full_name(self, db):
        user = create_user(db, "u@test.com", "Pass123!", "Lama", "anggota")
        updated = update_user(db, user.id, {"full_name": "Baru"})
        assert updated.full_name == "Baru"

    def test_update_user_not_found(self, db):
        result = update_user(db, 9999, {"full_name": "Ghost"})
        assert result is None

    def test_delete_user(self, db):
        user = create_user(db, "u@test.com", "Pass123!", "User", "anggota")
        deleted = delete_user(db, user.id)
        assert deleted is not None
        assert get_user_by_id(db, user.id) is None

    def test_delete_user_not_found(self, db):
        result = delete_user(db, 9999)
        assert result is None

    def test_password_is_hashed_in_db(self, db):
        user = create_user(db, "u@test.com", "Pass123!", "User", "anggota")
        assert user.hashed_password != "Pass123!"


# ════════════════════════════════════════════════════════════
# TRANSACTION CRUD
# ════════════════════════════════════════════════════════════
class TestTransactionCRUD:
    def _tx(self, **kw):
        base = {"type": "income", "category": "Iuran", "amount": 50000.0, "description": "Test"}
        return TransactionCreate(**{**base, **kw})

    def test_create_transaction(self, db):
        tx = create_transaction(db, self._tx())
        assert tx.id is not None
        assert tx.amount == 50000.0

    def test_get_all_transactions(self, db):
        create_transaction(db, self._tx(description="A"))
        create_transaction(db, self._tx(description="B"))
        result = get_all_transactions(db)
        assert len(result) == 2

    def test_get_all_transactions_filter_category(self, db):
        create_transaction(db, self._tx(category="Iuran"))
        create_transaction(db, self._tx(category="Konsumsi"))
        result = get_all_transactions(db, category="Iuran")
        assert len(result) == 1
        assert result[0].category == "Iuran"

    def test_get_all_transactions_filter_case_insensitive(self, db):
        create_transaction(db, self._tx(category="Iuran"))
        result = get_all_transactions(db, category="iuran")
        assert len(result) == 1

    def test_get_transaction_by_id(self, db):
        tx = create_transaction(db, self._tx())
        found = get_transaction_by_id(db, tx.id)
        assert found.id == tx.id

    def test_get_transaction_by_id_not_found(self, db):
        result = get_transaction_by_id(db, 9999)
        assert result is None

    def test_update_transaction(self, db):
        tx = create_transaction(db, self._tx(amount=100.0))
        updated = update_transaction(db, tx.id, {"amount": 999.0})
        assert updated.amount == 999.0

    def test_update_transaction_not_found(self, db):
        result = update_transaction(db, 9999, {"amount": 1.0})
        assert result is None

    def test_delete_transaction(self, db):
        tx = create_transaction(db, self._tx())
        deleted = delete_transaction(db, tx.id)
        assert deleted is not None
        assert get_transaction_by_id(db, tx.id) is None

    def test_delete_transaction_not_found(self, db):
        result = delete_transaction(db, 9999)
        assert result is None

    def test_pagination_skip_limit(self, db):
        for i in range(5):
            create_transaction(db, self._tx(description=f"TX {i}"))
        result = get_all_transactions(db, skip=3, limit=10)
        assert len(result) == 2


# ════════════════════════════════════════════════════════════
# LETTER CRUD
# ════════════════════════════════════════════════════════════
class TestLetterCRUD:
    def _ltr(self, **kw):
        base = {"title": "Surat Test", "letter_type": "leave", "content": "Isi surat"}
        return LetterCreate(**{**base, **kw})

    def test_create_letter(self, db):
        ltr = create_letter(db, self._ltr())
        assert ltr.id is not None
        assert ltr.status == "draft"

    def test_get_all_letters(self, db):
        create_letter(db, self._ltr(title="A"))
        create_letter(db, self._ltr(title="B"))
        result = get_all_letters(db)
        assert len(result) == 2

    def test_get_all_letters_filter_status(self, db):
        ltr = create_letter(db, self._ltr())
        update_letter_status(db, ltr.id, "submitted")
        create_letter(db, self._ltr())  # tetap draft
        result = get_all_letters(db, status="submitted")
        assert len(result) == 1

    def test_get_letter_by_id(self, db):
        ltr = create_letter(db, self._ltr())
        found = get_letter_by_id(db, ltr.id)
        assert found.id == ltr.id

    def test_get_letter_by_id_not_found(self, db):
        result = get_letter_by_id(db, 9999)
        assert result is None

    def test_update_letter(self, db):
        ltr = create_letter(db, self._ltr(title="Lama"))
        updated = update_letter(db, ltr.id, {"title": "Baru"})
        assert updated.title == "Baru"

    def test_update_letter_not_found(self, db):
        result = update_letter(db, 9999, {"title": "Ghost"})
        assert result is None

    def test_update_letter_status(self, db):
        ltr = create_letter(db, self._ltr())
        updated = update_letter_status(db, ltr.id, "submitted")
        assert updated.status == "submitted"

    def test_delete_letter(self, db):
        ltr = create_letter(db, self._ltr())
        deleted = delete_letter(db, ltr.id)
        assert deleted is not None
        assert get_letter_by_id(db, ltr.id) is None

    def test_delete_letter_not_found(self, db):
        result = delete_letter(db, 9999)
        assert result is None
