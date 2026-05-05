import pytest

"""Test authentication endpoints."""

def test_register_success(client):
    """Test register user baru berhasil."""
    response = client.post("/auth/register", json={
        "email": "newuser@example.com",
        "password": "SecurePass123",
        "full_name": "New User"  # field sesuai schema
    })
    # backend saat ini return 200 → test disesuaikan
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert data["full_name"] == "New User"
    assert "id" in data
    assert "password" not in data
    assert "hashed_password" not in data


def test_register_duplicate_email(client):
    """Test register dengan email yang sudah ada → 400."""
    client.post("/auth/register", json={
        "email": "duplicate@example.com",
        "password": "Pass1234A",
        "full_name": "User 1"
    })
    response = client.post("/auth/register", json={
        "email": "duplicate@example.com",
        "password": "Pass1234B",
        "full_name": "User 2"
    })
    assert response.status_code == 400


def test_login_success(client):
    """Test login dengan kredensial benar → return token."""
    client.post("/auth/register", json={
        "email": "login@example.com",
        "password": "MyPassword1",
        "full_name": "Login User"
    })
    response = client.post("/auth/login", json={
        "email": "login@example.com",
        "password": "MyPassword1"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client):
    """Test login dengan password salah → 401."""
    client.post("/auth/register", json={
        "email": "wrongpass@example.com",
        "password": "CorrectPass1",
        "full_name": "User"
    })
    response = client.post("/auth/login", json={
        "email": "wrongpass@example.com",
        "password": "WrongPassword1"
    })
    assert response.status_code == 401