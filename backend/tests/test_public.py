"""
test_public.py — Endpoint publik: /, /health, /team
"""
import pytest


class TestRootEndpoint:
    def test_root_returns_200(self, client):
        resp = client.get("/")
        assert resp.status_code == 200

    def test_root_contains_app_name(self, client):
        data = resp = client.get("/")
        assert "Sikasi" in resp.json()["message"]

    def test_root_version(self, client):
        resp = client.get("/")
        assert resp.json()["version"] == "2.0.0"

    def test_root_status_running(self, client):
        resp = client.get("/")
        assert resp.json()["status"] == "running"


class TestHealthEndpoint:
    def test_health_returns_200(self, client):
        resp = client.get("/health")
        assert resp.status_code == 200

    def test_health_status_healthy(self, client):
        resp = client.get("/health")
        assert resp.json()["status"] == "healthy"


class TestTeamEndpoint:
    def test_team_returns_200(self, client):
        resp = client.get("/team")
        assert resp.status_code == 200

    def test_team_has_members(self, client):
        resp = client.get("/team")
        data = resp.json()
        assert "members" in data
        assert len(data["members"]) == 5

    def test_team_name(self, client):
        resp = client.get("/team")
        assert "hexagroup" in resp.json()["team"]
