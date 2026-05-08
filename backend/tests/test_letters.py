"""
test_letters.py — /letters (CRUD + status workflow)

Status workflow:  draft → submitted → approved | rejected
- CREATE / UPDATE / DELETE / SUBMIT / APPROVE / REJECT : sekretaris only
- READ (list + detail)                                 : semua user login
"""
import pytest
from conftest import letter_payload


# ════════════════════════════════════════════════════════════
# CREATE LETTER
# ════════════════════════════════════════════════════════════
class TestCreateLetter:
    def test_sekretaris_can_create(self, client, sekretaris_headers):
        resp = client.post("/letters", json=letter_payload(), headers=sekretaris_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["title"] == "Surat Izin"
        assert data["status"] == "draft"
        assert "id" in data

    def test_anggota_cannot_create(self, client, anggota_headers):
        resp = client.post("/letters", json=letter_payload(), headers=anggota_headers)
        assert resp.status_code == 403

    def test_bendahara_cannot_create(self, client, bendahara_headers):
        resp = client.post("/letters", json=letter_payload(), headers=bendahara_headers)
        assert resp.status_code == 403

    def test_ketua_cannot_create(self, client, ketua_headers):
        resp = client.post("/letters", json=letter_payload(), headers=ketua_headers)
        assert resp.status_code == 403

    def test_unauthenticated_cannot_create(self, client):
        resp = client.post("/letters", json=letter_payload())
        assert resp.status_code == 403

    def test_create_missing_title(self, client, sekretaris_headers):
        payload = {"letter_type": "leave", "content": "isi"}
        resp = client.post("/letters", json=payload, headers=sekretaris_headers)
        assert resp.status_code == 422

    def test_create_missing_content(self, client, sekretaris_headers):
        payload = {"title": "Surat", "letter_type": "leave"}
        resp = client.post("/letters", json=payload, headers=sekretaris_headers)
        assert resp.status_code == 422


# ════════════════════════════════════════════════════════════
# LIST LETTERS
# ════════════════════════════════════════════════════════════
class TestListLetters:
    def _create(self, client, headers, **kw):
        return client.post("/letters", json=letter_payload(**kw), headers=headers).json()

    def test_anggota_can_list(self, client, sekretaris_headers, anggota_headers):
        self._create(client, sekretaris_headers)
        resp = client.get("/letters", headers=anggota_headers)
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    def test_list_returns_created_items(self, client, sekretaris_headers):
        self._create(client, sekretaris_headers, title="Surat A")
        self._create(client, sekretaris_headers, title="Surat B")
        resp = client.get("/letters", headers=sekretaris_headers)
        assert len(resp.json()) == 2

    def test_list_pagination_limit(self, client, sekretaris_headers):
        for i in range(5):
            self._create(client, sekretaris_headers, title=f"Surat {i}")
        resp = client.get("/letters?limit=2", headers=sekretaris_headers)
        assert len(resp.json()) == 2

    def test_list_filter_by_status(self, client, sekretaris_headers):
        ltr = self._create(client, sekretaris_headers)
        # submit supaya ada status berbeda
        client.post(f"/letters/{ltr['id']}/submit", headers=sekretaris_headers)
        self._create(client, sekretaris_headers)  # letter draft kedua

        resp = client.get("/letters?status=draft", headers=sekretaris_headers)
        for l in resp.json():
            assert l["status"] == "draft"

    def test_unauthenticated_cannot_list(self, client):
        resp = client.get("/letters")
        assert resp.status_code == 403


# ════════════════════════════════════════════════════════════
# GET SINGLE LETTER
# ════════════════════════════════════════════════════════════
class TestGetLetter:
    def _create(self, client, headers):
        return client.post("/letters", json=letter_payload(), headers=headers).json()

    def test_get_existing(self, client, sekretaris_headers, anggota_headers):
        ltr = self._create(client, sekretaris_headers)
        resp = client.get(f"/letters/{ltr['id']}", headers=anggota_headers)
        assert resp.status_code == 200
        assert resp.json()["id"] == ltr["id"]

    def test_get_not_found(self, client, anggota_headers):
        resp = client.get("/letters/9999", headers=anggota_headers)
        assert resp.status_code == 404

    def test_unauthenticated_cannot_get(self, client, sekretaris_headers):
        ltr = self._create(client, sekretaris_headers)
        resp = client.get(f"/letters/{ltr['id']}")
        assert resp.status_code == 403


# ════════════════════════════════════════════════════════════
# UPDATE LETTER
# ════════════════════════════════════════════════════════════
class TestUpdateLetter:
    def _create(self, client, headers):
        return client.post("/letters", json=letter_payload(), headers=headers).json()

    def test_sekretaris_can_update_draft(self, client, sekretaris_headers):
        ltr = self._create(client, sekretaris_headers)
        updated = letter_payload(title="Judul Baru", content="Konten baru")
        resp = client.put(f"/letters/{ltr['id']}", json=updated, headers=sekretaris_headers)
        assert resp.status_code == 200
        assert resp.json()["title"] == "Judul Baru"

    def test_cannot_update_submitted_letter(self, client, sekretaris_headers):
        ltr = self._create(client, sekretaris_headers)
        client.post(f"/letters/{ltr['id']}/submit", headers=sekretaris_headers)
        resp = client.put(
            f"/letters/{ltr['id']}",
            json=letter_payload(title="Coba Edit"),
            headers=sekretaris_headers,
        )
        assert resp.status_code == 400
        assert "draft" in resp.json()["detail"].lower()

    def test_anggota_cannot_update(self, client, sekretaris_headers, anggota_headers):
        ltr = self._create(client, sekretaris_headers)
        resp = client.put(
            f"/letters/{ltr['id']}",
            json=letter_payload(title="Hacked"),
            headers=anggota_headers,
        )
        assert resp.status_code == 403

    def test_update_not_found(self, client, sekretaris_headers):
        resp = client.put(
            "/letters/9999",
            json=letter_payload(),
            headers=sekretaris_headers,
        )
        assert resp.status_code == 404


# ════════════════════════════════════════════════════════════
# DELETE LETTER
# ════════════════════════════════════════════════════════════
class TestDeleteLetter:
    def _create(self, client, headers):
        return client.post("/letters", json=letter_payload(), headers=headers).json()

    def test_sekretaris_can_delete(self, client, sekretaris_headers, anggota_headers):
        ltr = self._create(client, sekretaris_headers)
        resp = client.delete(f"/letters/{ltr['id']}", headers=sekretaris_headers)
        assert resp.status_code == 200
        assert "deleted" in resp.json()["detail"].lower()
        # verify gone
        get_resp = client.get(f"/letters/{ltr['id']}", headers=anggota_headers)
        assert get_resp.status_code == 404

    def test_anggota_cannot_delete(self, client, sekretaris_headers, anggota_headers):
        ltr = self._create(client, sekretaris_headers)
        resp = client.delete(f"/letters/{ltr['id']}", headers=anggota_headers)
        assert resp.status_code == 403

    def test_delete_not_found(self, client, sekretaris_headers):
        resp = client.delete("/letters/9999", headers=sekretaris_headers)
        assert resp.status_code == 404


# ════════════════════════════════════════════════════════════
# STATUS WORKFLOW: SUBMIT → APPROVE / REJECT
# ════════════════════════════════════════════════════════════
class TestLetterStatusWorkflow:
    def _create(self, client, headers):
        return client.post("/letters", json=letter_payload(), headers=headers).json()

    # ── SUBMIT ──────────────────────────────────────────────
    def test_submit_draft_letter(self, client, sekretaris_headers):
        ltr = self._create(client, sekretaris_headers)
        resp = client.post(f"/letters/{ltr['id']}/submit", headers=sekretaris_headers)
        assert resp.status_code == 200
        assert resp.json()["status"] == "submitted"

    def test_cannot_submit_non_draft(self, client, sekretaris_headers):
        ltr = self._create(client, sekretaris_headers)
        client.post(f"/letters/{ltr['id']}/submit", headers=sekretaris_headers)
        # coba submit lagi
        resp = client.post(f"/letters/{ltr['id']}/submit", headers=sekretaris_headers)
        assert resp.status_code == 400
        assert "draft" in resp.json()["detail"].lower()

    def test_anggota_cannot_submit(self, client, sekretaris_headers, anggota_headers):
        ltr = self._create(client, sekretaris_headers)
        resp = client.post(f"/letters/{ltr['id']}/submit", headers=anggota_headers)
        assert resp.status_code == 403

    def test_submit_not_found(self, client, sekretaris_headers):
        resp = client.post("/letters/9999/submit", headers=sekretaris_headers)
        assert resp.status_code == 404

    # ── APPROVE ─────────────────────────────────────────────
    def test_approve_submitted_letter(self, client, sekretaris_headers):
        ltr = self._create(client, sekretaris_headers)
        client.post(f"/letters/{ltr['id']}/submit", headers=sekretaris_headers)
        resp = client.post(f"/letters/{ltr['id']}/approve", headers=sekretaris_headers)
        assert resp.status_code == 200
        assert resp.json()["status"] == "approved"

    def test_cannot_approve_draft_letter(self, client, sekretaris_headers):
        ltr = self._create(client, sekretaris_headers)
        resp = client.post(f"/letters/{ltr['id']}/approve", headers=sekretaris_headers)
        assert resp.status_code == 400
        assert "submitted" in resp.json()["detail"].lower()

    def test_anggota_cannot_approve(self, client, sekretaris_headers, anggota_headers):
        ltr = self._create(client, sekretaris_headers)
        client.post(f"/letters/{ltr['id']}/submit", headers=sekretaris_headers)
        resp = client.post(f"/letters/{ltr['id']}/approve", headers=anggota_headers)
        assert resp.status_code == 403

    def test_approve_not_found(self, client, sekretaris_headers):
        resp = client.post("/letters/9999/approve", headers=sekretaris_headers)
        assert resp.status_code == 404

    # ── REJECT ──────────────────────────────────────────────
    def test_reject_submitted_letter(self, client, sekretaris_headers):
        ltr = self._create(client, sekretaris_headers)
        client.post(f"/letters/{ltr['id']}/submit", headers=sekretaris_headers)
        resp = client.post(f"/letters/{ltr['id']}/reject", headers=sekretaris_headers)
        assert resp.status_code == 200
        assert resp.json()["status"] == "rejected"

    def test_cannot_reject_draft_letter(self, client, sekretaris_headers):
        ltr = self._create(client, sekretaris_headers)
        resp = client.post(f"/letters/{ltr['id']}/reject", headers=sekretaris_headers)
        assert resp.status_code == 400
        assert "submitted" in resp.json()["detail"].lower()

    def test_anggota_cannot_reject(self, client, sekretaris_headers, anggota_headers):
        ltr = self._create(client, sekretaris_headers)
        client.post(f"/letters/{ltr['id']}/submit", headers=sekretaris_headers)
        resp = client.post(f"/letters/{ltr['id']}/reject", headers=anggota_headers)
        assert resp.status_code == 403

    def test_reject_not_found(self, client, sekretaris_headers):
        resp = client.post("/letters/9999/reject", headers=sekretaris_headers)
        assert resp.status_code == 404

    # ── Full happy path ──────────────────────────────────────
    def test_full_workflow_approve(self, client, sekretaris_headers, anggota_headers):
        ltr = self._create(client, sekretaris_headers)
        assert ltr["status"] == "draft"

        s = client.post(f"/letters/{ltr['id']}/submit", headers=sekretaris_headers)
        assert s.json()["status"] == "submitted"

        a = client.post(f"/letters/{ltr['id']}/approve", headers=sekretaris_headers)
        assert a.json()["status"] == "approved"

        # Verify via GET
        get = client.get(f"/letters/{ltr['id']}", headers=anggota_headers)
        assert get.json()["status"] == "approved"

    def test_full_workflow_reject(self, client, sekretaris_headers):
        ltr = self._create(client, sekretaris_headers)
        client.post(f"/letters/{ltr['id']}/submit", headers=sekretaris_headers)
        r = client.post(f"/letters/{ltr['id']}/reject", headers=sekretaris_headers)
        assert r.json()["status"] == "rejected"
