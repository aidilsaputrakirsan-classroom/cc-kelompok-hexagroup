"""
test_finance.py — /finance/transactions & /finance/summary
Hanya bendahara yang bisa CREATE / UPDATE / DELETE.
Semua user ter-autentikasi bisa READ.
"""
import pytest
from conftest import transaction_payload


# ════════════════════════════════════════════════════════════
# CREATE TRANSACTION
# ════════════════════════════════════════════════════════════
class TestCreateTransaction:
    def test_bendahara_can_create(self, client, bendahara_headers):
        resp = client.post(
            "/finance/transactions",
            json=transaction_payload(),
            headers=bendahara_headers,
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["type"] == "income"
        assert data["amount"] == 100000.0
        assert data["category"] == "Iuran"
        assert "id" in data

    def test_anggota_cannot_create(self, client, anggota_headers):
        resp = client.post(
            "/finance/transactions",
            json=transaction_payload(),
            headers=anggota_headers,
        )
        assert resp.status_code == 403

    def test_sekretaris_cannot_create(self, client, sekretaris_headers):
        resp = client.post(
            "/finance/transactions",
            json=transaction_payload(),
            headers=sekretaris_headers,
        )
        assert resp.status_code == 403

    def test_ketua_cannot_create(self, client, ketua_headers):
        resp = client.post(
            "/finance/transactions",
            json=transaction_payload(),
            headers=ketua_headers,
        )
        assert resp.status_code == 403

    def test_unauthenticated_cannot_create(self, client):
        resp = client.post("/finance/transactions", json=transaction_payload())
        assert resp.status_code == 403

    def test_create_expense_type(self, client, bendahara_headers):
        resp = client.post(
            "/finance/transactions",
            json=transaction_payload(type="expense", category="Konsumsi", amount=50000.0),
            headers=bendahara_headers,
        )
        assert resp.status_code == 200
        assert resp.json()["type"] == "expense"

    def test_create_invalid_type(self, client, bendahara_headers):
        resp = client.post(
            "/finance/transactions",
            json=transaction_payload(type="transfer"),
            headers=bendahara_headers,
        )
        assert resp.status_code == 422

    def test_create_missing_amount(self, client, bendahara_headers):
        payload = {"type": "income", "category": "Iuran", "description": "test"}
        resp = client.post(
            "/finance/transactions",
            json=payload,
            headers=bendahara_headers,
        )
        assert resp.status_code == 422


# ════════════════════════════════════════════════════════════
# LIST TRANSACTIONS
# ════════════════════════════════════════════════════════════
class TestListTransactions:
    def _create(self, client, headers, **kw):
        client.post("/finance/transactions", json=transaction_payload(**kw), headers=headers)

    def test_anggota_can_list(self, client, bendahara_headers, anggota_headers):
        self._create(client, bendahara_headers)
        resp = client.get("/finance/transactions", headers=anggota_headers)
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    def test_list_returns_created_items(self, client, bendahara_headers):
        self._create(client, bendahara_headers, description="Iuran A")
        self._create(client, bendahara_headers, description="Iuran B")
        resp = client.get("/finance/transactions", headers=bendahara_headers)
        assert len(resp.json()) == 2

    def test_list_pagination_limit(self, client, bendahara_headers):
        for i in range(5):
            self._create(client, bendahara_headers, description=f"TX {i}")
        resp = client.get("/finance/transactions?limit=3", headers=bendahara_headers)
        assert len(resp.json()) == 3

    def test_list_pagination_skip(self, client, bendahara_headers):
        for i in range(5):
            self._create(client, bendahara_headers, description=f"TX {i}")
        resp = client.get("/finance/transactions?skip=3&limit=10", headers=bendahara_headers)
        assert len(resp.json()) == 2

    def test_list_filter_by_category(self, client, bendahara_headers):
        self._create(client, bendahara_headers, category="Iuran")
        self._create(client, bendahara_headers, category="Konsumsi")
        resp = client.get("/finance/transactions?category=Iuran", headers=bendahara_headers)
        for tx in resp.json():
            assert "iuran" in tx["category"].lower()

    def test_unauthenticated_cannot_list(self, client):
        resp = client.get("/finance/transactions")
        assert resp.status_code == 403


# ════════════════════════════════════════════════════════════
# GET SINGLE TRANSACTION
# ════════════════════════════════════════════════════════════
class TestGetTransaction:
    def _create(self, client, headers):
        return client.post(
            "/finance/transactions",
            json=transaction_payload(),
            headers=headers,
        ).json()

    def test_get_existing(self, client, bendahara_headers, anggota_headers):
        tx = self._create(client, bendahara_headers)
        resp = client.get(f"/finance/transactions/{tx['id']}", headers=anggota_headers)
        assert resp.status_code == 200
        assert resp.json()["id"] == tx["id"]

    def test_get_not_found(self, client, anggota_headers):
        resp = client.get("/finance/transactions/9999", headers=anggota_headers)
        assert resp.status_code == 404

    def test_unauthenticated_cannot_get(self, client, bendahara_headers):
        tx = self._create(client, bendahara_headers)
        resp = client.get(f"/finance/transactions/{tx['id']}")
        assert resp.status_code == 403


# ════════════════════════════════════════════════════════════
# UPDATE TRANSACTION
# ════════════════════════════════════════════════════════════
class TestUpdateTransaction:
    def _create(self, client, headers):
        return client.post(
            "/finance/transactions",
            json=transaction_payload(),
            headers=headers,
        ).json()

    def test_bendahara_can_update(self, client, bendahara_headers):
        tx = self._create(client, bendahara_headers)
        updated_payload = transaction_payload(amount=999999.0, description="Updated")
        resp = client.put(
            f"/finance/transactions/{tx['id']}",
            json=updated_payload,
            headers=bendahara_headers,
        )
        assert resp.status_code == 200
        assert resp.json()["amount"] == 999999.0
        assert resp.json()["description"] == "Updated"

    def test_anggota_cannot_update(self, client, bendahara_headers, anggota_headers):
        tx = self._create(client, bendahara_headers)
        resp = client.put(
            f"/finance/transactions/{tx['id']}",
            json=transaction_payload(amount=1.0),
            headers=anggota_headers,
        )
        assert resp.status_code == 403

    def test_update_not_found(self, client, bendahara_headers):
        resp = client.put(
            "/finance/transactions/9999",
            json=transaction_payload(),
            headers=bendahara_headers,
        )
        assert resp.status_code == 404


# ════════════════════════════════════════════════════════════
# DELETE TRANSACTION
# ════════════════════════════════════════════════════════════
class TestDeleteTransaction:
    def _create(self, client, headers):
        return client.post(
            "/finance/transactions",
            json=transaction_payload(),
            headers=headers,
        ).json()

    def test_bendahara_can_delete(self, client, bendahara_headers, anggota_headers):
        tx = self._create(client, bendahara_headers)
        resp = client.delete(
            f"/finance/transactions/{tx['id']}",
            headers=bendahara_headers,
        )
        assert resp.status_code == 200
        assert "deleted" in resp.json()["detail"].lower()
        # Verify gone
        get_resp = client.get(f"/finance/transactions/{tx['id']}", headers=anggota_headers)
        assert get_resp.status_code == 404

    def test_anggota_cannot_delete(self, client, bendahara_headers, anggota_headers):
        tx = self._create(client, bendahara_headers)
        resp = client.delete(
            f"/finance/transactions/{tx['id']}",
            headers=anggota_headers,
        )
        assert resp.status_code == 403

    def test_delete_not_found(self, client, bendahara_headers):
        resp = client.delete("/finance/transactions/9999", headers=bendahara_headers)
        assert resp.status_code == 404


# ════════════════════════════════════════════════════════════
# FINANCE SUMMARY
# ════════════════════════════════════════════════════════════
class TestFinanceSummary:
    def test_summary_authenticated(self, client, anggota_headers):
        resp = client.get("/finance/summary", headers=anggota_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert "total_income" in data
        assert "total_expense" in data
        assert "balance" in data
        assert "transaction_count" in data

    def test_summary_correct_calculation(self, client, bendahara_headers, anggota_headers):
        client.post("/finance/transactions",
                    json=transaction_payload(type="income", amount=500000.0),
                    headers=bendahara_headers)
        client.post("/finance/transactions",
                    json=transaction_payload(type="expense", amount=200000.0),
                    headers=bendahara_headers)
        resp = client.get("/finance/summary", headers=anggota_headers)
        data = resp.json()
        assert data["total_income"] == 500000.0
        assert data["total_expense"] == 200000.0
        assert data["balance"] == 300000.0
        assert data["transaction_count"] == 2

    def test_summary_empty_db(self, client, anggota_headers):
        resp = client.get("/finance/summary", headers=anggota_headers)
        data = resp.json()
        assert data["balance"] == 0
        assert data["transaction_count"] == 0

    def test_summary_unauthenticated(self, client):
        resp = client.get("/finance/summary")
        assert resp.status_code == 403

    def test_summary_filter_by_category(self, client, bendahara_headers, anggota_headers):
        client.post("/finance/transactions",
                    json=transaction_payload(type="income", category="Iuran", amount=100000.0),
                    headers=bendahara_headers)
        client.post("/finance/transactions",
                    json=transaction_payload(type="income", category="Donasi", amount=50000.0),
                    headers=bendahara_headers)
        resp = client.get("/finance/summary?category=Iuran", headers=anggota_headers)
        data = resp.json()
        assert data["total_income"] == 100000.0
        assert data["transaction_count"] == 1
