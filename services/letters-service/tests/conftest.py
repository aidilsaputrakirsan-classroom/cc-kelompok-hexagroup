import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
import sys

os.environ.setdefault("SECRET_KEY", "test-secret-key-for-pytest-only")
os.environ.setdefault("DATABASE_URL", "sqlite:///./test.db")
os.environ.setdefault("TESTING", "true")
os.environ.setdefault("AUTH_SERVICE_URL", "http://fake-auth")

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from database import Base, get_db
from main import app
import auth_client

TEST_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


@pytest.fixture(scope="function", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def db():
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture(scope="function")
def client(db):
    def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db

    client = TestClient(app, raise_server_exceptions=True)

    yield client

    app.dependency_overrides.clear()


# ── AUTH MOCK ────────────────────────────────────────────
ROLE_MAP = {
    "Bearer sekretaris-token": "sekretaris",
    "Bearer bendahara-token": "bendahara",
    "Bearer ketua-token": "ketua",
    "Bearer anggota-token": "anggota",
}


@pytest.fixture(autouse=True)
def mock_smart_auth(monkeypatch):
    def smart_verify(token):
        role = ROLE_MAP.get(f"Bearer {token}", "anggota")

        return {
            "valid": True,
            "email": f"{role}@test.com",
            "role": role,
            "user_id": 1,
        }

    monkeypatch.setattr(auth_client, "verify_token", smart_verify)


# ── HEADERS ──────────────────────────────────────────────
@pytest.fixture
def sekretaris_headers():
    return {"Authorization": "Bearer sekretaris-token"}


@pytest.fixture
def anggota_headers():
    return {"Authorization": "Bearer anggota-token"}


@pytest.fixture
def bendahara_headers():
    return {"Authorization": "Bearer bendahara-token"}


@pytest.fixture
def ketua_headers():
    return {"Authorization": "Bearer ketua-token"}


# ── PAYLOAD ──────────────────────────────────────────────
def letter_payload(**overrides):
    base = {
        "title": "Surat Izin",
        "letter_type": "leave",
        "content": "Isi surat izin test",
    }

    return {**base, **overrides}
