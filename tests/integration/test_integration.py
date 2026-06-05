"""
Integration Tests — sikasi App
Syarat: docker compose up -d && semua services healthy
Jalankan: pytest tests/integration/ -v
"""
import pytest
import httpx

GATEWAY_URL = "http://localhost"


# ── Fixtures ─────────────────────────────────────────────

@pytest.fixture(scope="session")
def bendahara_token():
    resp = httpx.post(f"{GATEWAY_URL}/auth/login", json={
        "email": "bendahara@cloud.com",
        "password": "Bendahara123",
    })
    assert resp.status_code == 200, f"Login bendahara gagal: {resp.text}"
    return resp.json()["access_token"]


@pytest.fixture(scope="session")
def sekretaris_token():
    resp = httpx.post(f"{GATEWAY_URL}/auth/login", json={
        "email": "sekretaris@cloud.com",
        "password": "Sekretaris123",
    })
    assert resp.status_code == 200, f"Login sekretaris gagal: {resp.text}"
    return resp.json()["access_token"]


# ── Tests ─────────────────────────────────────────────────

def test_letters_health():
    """Health letters-service harus return status + dependency info."""
    resp = httpx.get(f"{GATEWAY_URL}/letters/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["service"] == "letters-service"
    assert "status" in data
    assert "dependencies" in data
    assert "auth-service" in data["dependencies"]
    assert "database" in data["dependencies"]


def test_finance_health():
    """Health finance-service harus return status + dependency info."""
    resp = httpx.get(f"{GATEWAY_URL}/finance/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["service"] == "finance-service"
    assert "status" in data
    assert "dependencies" in data
    assert "auth-service" in data["dependencies"]
    assert "database" in data["dependencies"]


def test_letters_tanpa_token():
    """Request ke letters tanpa token harus ditolak."""
    resp = httpx.get(f"{GATEWAY_URL}/letters")
    assert resp.status_code in [401, 403, 422]


def test_finance_tanpa_token():
    """Request ke finance tanpa token harus ditolak."""
    resp = httpx.get(f"{GATEWAY_URL}/finance/transactions")
    assert resp.status_code in [401, 403, 422]


def test_token_invalid_ditolak_letters():
    """Token palsu harus ditolak letters-service."""
    resp = httpx.get(f"{GATEWAY_URL}/letters", headers={
        "Authorization": "Bearer token-palsu-banget"
    })
    assert resp.status_code == 401


def test_token_invalid_ditolak_finance():
    """Token palsu harus ditolak finance-service."""
    resp = httpx.get(f"{GATEWAY_URL}/finance/transactions", headers={
        "Authorization": "Bearer token-palsu-banget"
    })
    assert resp.status_code == 401


def test_cross_service_letters(sekretaris_token):
    """Login → akses letters → cross-service auth verification berhasil."""
    resp = httpx.get(f"{GATEWAY_URL}/letters", headers={
        "Authorization": f"Bearer {sekretaris_token}"
    })
    assert resp.status_code == 200


def test_cross_service_finance(bendahara_token):
    """Login → akses finance → cross-service auth verification berhasil."""
    resp = httpx.get(f"{GATEWAY_URL}/finance/transactions", headers={
        "Authorization": f"Bearer {bendahara_token}"
    })
    assert resp.status_code == 200
