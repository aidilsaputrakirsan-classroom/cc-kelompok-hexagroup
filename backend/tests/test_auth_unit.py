"""
test_auth_unit.py — Unit test untuk fungsi di auth.py
(tidak butuh HTTP client, langsung test fungsinya)
"""
import time
import os

os.environ.setdefault("SECRET_KEY", "test-secret-key-for-pytest-only")
os.environ.setdefault("DATABASE_URL", "sqlite:///./test.db")

import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from auth import create_access_token, create_refresh_token, decode_token


class TestCreateAccessToken:
    def test_returns_string(self):
        token = create_access_token("user@test.com")
        assert isinstance(token, str)
        assert len(token) > 0

    def test_token_has_three_parts(self):
        token = create_access_token("user@test.com")
        assert len(token.split(".")) == 3

    def test_decode_contains_email(self):
        email = "user@test.com"
        token = create_access_token(email)
        payload = decode_token(token)
        assert payload is not None
        assert payload["sub"] == email

    def test_different_emails_produce_different_tokens(self):
        t1 = create_access_token("a@test.com")
        t2 = create_access_token("b@test.com")
        assert t1 != t2


class TestCreateRefreshToken:
    def test_returns_string(self):
        token = create_refresh_token("user@test.com")
        assert isinstance(token, str)

    def test_decode_contains_email(self):
        email = "user@test.com"
        token = create_refresh_token(email)
        payload = decode_token(token)
        assert payload["sub"] == email

    def test_refresh_token_has_type_field(self):
        token = create_refresh_token("user@test.com")
        payload = decode_token(token)
        assert payload.get("type") == "refresh"

    def test_access_token_does_not_have_type_field(self):
        token = create_access_token("user@test.com")
        payload = decode_token(token)
        assert "type" not in payload


class TestDecodeToken:
    def test_valid_token_decoded(self):
        token = create_access_token("user@test.com")
        payload = decode_token(token)
        assert payload is not None

    def test_invalid_token_returns_none(self):
        result = decode_token("ini.bukan.token")
        assert result is None

    def test_empty_string_returns_none(self):
        result = decode_token("")
        assert result is None

    def test_tampered_token_returns_none(self):
        token = create_access_token("user@test.com")
        # Tambah karakter di signature
        tampered = token + "tampered"
        result = decode_token(tampered)
        assert result is None

    def test_token_contains_exp(self):
        token = create_access_token("user@test.com")
        payload = decode_token(token)
        assert "exp" in payload

    def test_exp_is_in_future(self):
        token = create_access_token("user@test.com")
        payload = decode_token(token)
        assert payload["exp"] > time.time()
