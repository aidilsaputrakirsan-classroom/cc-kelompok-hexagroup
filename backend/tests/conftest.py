"""
conftest.py — Shared fixtures for all tests.
Uses SQLite in-memory database so no PostgreSQL needed.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# ── patch DATABASE_URL sebelum import apapun dari project ──────────────────
import os
os.environ.setdefault("SECRET_KEY", "test-secret-key-for-pytest-only")
os.environ.setdefault("DATABASE_URL", "sqlite:///./test.db")
os.environ.setdefault("TESTING", "true")

import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from database import Base, get_db
from main import app
from models import User, UserRole
from crud import create_user, hash_password

# ── Engine SQLite khusus test ───────────────────────────────────────────────
TEST_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function", autouse=True)
def setup_database():
    """Buat & drop tabel fresh untuk setiap test function."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def db():
    """SQLAlchemy session untuk test."""
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture(scope="function")
def client(db):
    """TestClient dengan DB override."""
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    c = TestClient(app, raise_server_exceptions=True)
    yield c
    app.dependency_overrides.clear()


# ── Helper: buat user langsung di DB ───────────────────────────────────────
def make_user(db, email: str, password: str, full_name: str, role: str):
    return create_user(db, email, password, full_name, role)


# ── Fixtures per role ───────────────────────────────────────────────────────
@pytest.fixture
def ketua_user(db):
    return make_user(db, "ketua@test.com", "Ketua123!", "Ketua Satu", "ketua")

@pytest.fixture
def bendahara_user(db):
    return make_user(db, "bendahara@test.com", "Bendahara1!", "Bendahara Satu", "bendahara")

@pytest.fixture
def sekretaris_user(db):
    return make_user(db, "sekretaris@test.com", "Sekretaris1!", "Sekretaris Satu", "sekretaris")

@pytest.fixture
def anggota_user(db):
    return make_user(db, "anggota@test.com", "Anggota123!", "Anggota Satu", "anggota")


# ── Helper: login → ambil token ─────────────────────────────────────────────
def get_token(client, email: str, password: str) -> str:
    resp = client.post("/auth/login", json={"email": email, "password": password})
    assert resp.status_code == 200, f"Login gagal untuk {email}: {resp.text}"
    return resp.json()["access_token"]

def auth_headers(client, email: str, password: str) -> dict:
    return {"Authorization": f"Bearer {get_token(client, email, password)}"}


# ── Fixtures token per role ─────────────────────────────────────────────────
@pytest.fixture
def ketua_headers(client, ketua_user):
    return auth_headers(client, "ketua@test.com", "Ketua123!")

@pytest.fixture
def bendahara_headers(client, bendahara_user):
    return auth_headers(client, "bendahara@test.com", "Bendahara1!")

@pytest.fixture
def sekretaris_headers(client, sekretaris_user):
    return auth_headers(client, "sekretaris@test.com", "Sekretaris1!")

@pytest.fixture
def anggota_headers(client, anggota_user):
    return auth_headers(client, "anggota@test.com", "Anggota123!")


# ── Payload factories ───────────────────────────────────────────────────────
def transaction_payload(**overrides):
    base = {
        "type": "income",
        "category": "Iuran",
        "amount": 100000.0,
        "description": "Iuran bulanan",
    }
    return {**base, **overrides}

def letter_payload(**overrides):
    base = {
        "title": "Surat Izin",
        "letter_type": "leave",
        "content": "Isi surat izin test",
    }
    return {**base, **overrides}
