"""
Integration Tests — Verifikasi komunikasi antar services.
Jalankan dengan: pytest tests/integration/ -v
Syarat: docker compose up -d (semua services running)
"""
import httpx
import pytest


def test_gateway_health(gateway_url):
    """Test 1: Gateway bisa diakses."""
    response = httpx.get(f"{gateway_url}/health")
    assert response.status_code == 200


def test_auth_service_health(gateway_url):
    """Test 2: Auth Service health check via gateway."""
    response = httpx.get(f"{gateway_url}/auth/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_finance_service_health(gateway_url):
    """Test 3: Finance Service health check via gateway."""
    response = httpx.get(f"{gateway_url}/finance/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_letters_service_health(gateway_url):
    """Test 4: Letters Service health check via gateway."""
    response = httpx.get(f"{gateway_url}/letters/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_register_login_flow(gateway_url):
    """Test 5: Full flow register → login → get token."""
    import time
    email = f"flow-test-{int(time.time())}@example.com"

    # Register
    resp = httpx.post(f"{gateway_url}/auth/register", json={
        "email": email,
        "password": "FlowTest123",
        "full_name": "Flow User"
    })
    assert resp.status_code == 201

    # Login
    resp = httpx.post(f"{gateway_url}/auth/login", json={
        "email": email,
        "password": "FlowTest123"
    })
    assert resp.status_code == 200
    assert "access_token" in resp.json()


def test_unauthorized_without_token(gateway_url):
    """Test 6: Request tanpa token harus ditolak."""
    resp = httpx.get(f"{gateway_url}/finance/")
    assert resp.status_code in [401, 422, 403]


def test_invalid_token_rejected(gateway_url):
    """Test 7: Token invalid harus ditolak."""
    resp = httpx.get(
        f"{gateway_url}/finance/",
        headers={"Authorization": "Bearer invalid-fake-token"}
    )
    assert resp.status_code == 401


def test_cross_service_auth_verification(gateway_url, test_user):
    """Test 8: Finance/Letters Service verifikasi token via Auth Service."""
    resp = httpx.get(
        f"{gateway_url}/finance/",
        headers=test_user["headers"],
    )
    # 200 = berhasil, 404 = endpoint tidak ada tapi auth OK
    assert resp.status_code in [200, 404]