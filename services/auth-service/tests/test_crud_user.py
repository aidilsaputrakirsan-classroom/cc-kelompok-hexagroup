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
    verify_password, hash_password, get_all_users, update_user, delete_user,
)


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
