"""
test_auth.py — /auth/register, /auth/login, /auth/refresh, /auth/me
"""


VALID_REGISTER = {
    "email": "newuser@test.com",
    "password": "Secure123!",
    "full_name": "New User",
}


# ════════════════════════════════════════════════════════════
# REGISTER
# ════════════════════════════════════════════════════════════
class TestRegister:
    def test_register_success(self, client):
        resp = client.post("/auth/register", json=VALID_REGISTER)
        assert resp.status_code == 200
        data = resp.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"

    def test_register_returns_user_info(self, client):
        resp = client.post("/auth/register", json=VALID_REGISTER)
        user = resp.json()["user"]
        assert user["email"] == VALID_REGISTER["email"]
        assert user["full_name"] == VALID_REGISTER["full_name"]
        assert user["role"] == "anggota"          # register selalu anggota

    def test_register_duplicate_email(self, client):
        client.post("/auth/register", json=VALID_REGISTER)
        resp = client.post("/auth/register", json=VALID_REGISTER)
        assert resp.status_code == 400
        assert "already registered" in resp.json()["detail"].lower()

    def test_register_invalid_email(self, client):
        payload = {**VALID_REGISTER, "email": "bukan-email"}
        resp = client.post("/auth/register", json=payload)
        assert resp.status_code == 422

    # ── Password validator ──────────────────────────────────
    def test_register_password_too_short(self, client):
        payload = {**VALID_REGISTER, "password": "Ab1"}
        resp = client.post("/auth/register", json=payload)
        assert resp.status_code == 422

    def test_register_password_no_uppercase(self, client):
        payload = {**VALID_REGISTER, "password": "secure123!"}
        resp = client.post("/auth/register", json=payload)
        assert resp.status_code == 422

    def test_register_password_no_lowercase(self, client):
        payload = {**VALID_REGISTER, "password": "SECURE123!"}
        resp = client.post("/auth/register", json=payload)
        assert resp.status_code == 422

    def test_register_password_no_digit(self, client):
        payload = {**VALID_REGISTER, "password": "SecurePass!"}
        resp = client.post("/auth/register", json=payload)
        assert resp.status_code == 422

    def test_register_missing_full_name(self, client):
        payload = {"email": "x@test.com", "password": "Secure123!"}
        resp = client.post("/auth/register", json=payload)
        assert resp.status_code == 422


# ════════════════════════════════════════════════════════════
# LOGIN
# ════════════════════════════════════════════════════════════
class TestLogin:
    def test_login_success(self, client, anggota_user):
        resp = client.post("/auth/login", json={
            "email": "anggota@test.com",
            "password": "Anggota123!",
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "access_token" in data
        assert "refresh_token" in data

    def test_login_wrong_password(self, client, anggota_user):
        resp = client.post("/auth/login", json={
            "email": "anggota@test.com",
            "password": "WrongPass999!",
        })
        assert resp.status_code == 401

    def test_login_unknown_email(self, client):
        resp = client.post("/auth/login", json={
            "email": "ghost@test.com",
            "password": "Ghost123!",
        })
        assert resp.status_code == 401

    def test_login_returns_correct_role(self, client, ketua_user):
        resp = client.post("/auth/login", json={
            "email": "ketua@test.com",
            "password": "Ketua123!",
        })
        assert resp.json()["user"]["role"] == "ketua"

    def test_login_invalid_email_format(self, client):
        resp = client.post("/auth/login", json={
            "email": "bukan-email",
            "password": "Anggota123!",
        })
        assert resp.status_code == 422


# ════════════════════════════════════════════════════════════
# REFRESH TOKEN
# ════════════════════════════════════════════════════════════
class TestRefreshToken:
    def test_refresh_success(self, client, anggota_user):
        login = client.post("/auth/login", json={
            "email": "anggota@test.com",
            "password": "Anggota123!",
        })
        refresh_token = login.json()["refresh_token"]
        resp = client.post("/auth/refresh", json={"refresh_token": refresh_token})
        assert resp.status_code == 200
        assert "access_token" in resp.json()

    def test_refresh_invalid_token(self, client):
        resp = client.post("/auth/refresh", json={"refresh_token": "token.tidak.valid"})
        assert resp.status_code == 401

    def test_refresh_missing_body(self, client):
        resp = client.post("/auth/refresh", json={})
        assert resp.status_code == 422


# ════════════════════════════════════════════════════════════
# GET ME
# ════════════════════════════════════════════════════════════
class TestGetMe:
    def test_get_me_success(self, client, anggota_headers, anggota_user):
        resp = client.get("/auth/me", headers=anggota_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["email"] == "anggota@test.com"
        assert data["role"] == "anggota"

    def test_get_me_no_token(self, client):
        resp = client.get("/auth/me")
        assert resp.status_code == 403      # FastAPI HTTPBearer returns 403

    def test_get_me_invalid_token(self, client):
        resp = client.get("/auth/me", headers={"Authorization": "Bearer invalidtoken"})
        assert resp.status_code == 401

    def test_get_me_returns_id(self, client, anggota_headers, anggota_user):
        resp = client.get("/auth/me", headers=anggota_headers)
        assert "id" in resp.json()
