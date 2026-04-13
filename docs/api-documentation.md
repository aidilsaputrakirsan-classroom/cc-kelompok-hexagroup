# API Documentation - Sikasi App
## Base URL

http://localhost:8000

---

## Authentication

Gunakan header berikut untuk endpoint yang membutuhkan autentikasi:

Authorization: Bearer <access_token>

---

## PUBLIC ENDPOINTS

### GET /

Deskripsi: Status API

Auth: Tidak perlu

Response:

```json
{
  "message": "Sikasi App API",
  "status": "running",
  "version": "2.0.0"
}
```

---

### GET /health

Deskripsi: Cek kesehatan API

Auth: Tidak perlu

Response:

```json
{
  "status": "healthy"
}
```

---

### GET /team

Deskripsi: Informasi tim

Auth: Tidak perlu

---

## AUTH ENDPOINTS

### POST /auth/register

Deskripsi: Register user (role default: anggota)

Auth: Tidak perlu

Request Body:

```json
{
  "email": "user@email.com",
  "password": "Password123",
  "full_name": "User Name"
}
```

Response:

```json
{
  "access_token": "...",
  "refresh_token": "...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "...",
    "full_name": "...",
    "role": "anggota"
  }
}
```

cURL:

```bash
curl -X POST http://localhost:8000/auth/register \
-H "Content-Type: application/json" \
-d '{"email":"user@email.com","password":"Password123","full_name":"User"}'
```

---

### POST /auth/login

Deskripsi: Login semua role

Auth: Tidak perlu

Request Body:

```json
{
  "email": "user@email.com",
  "password": "Password123"
}
```

---

### POST /auth/refresh

Deskripsi: Refresh access token

Auth: Tidak perlu

Request Body:

```json
{
  "refresh_token": "..."
}
```

---

### GET /auth/me

Deskripsi: Ambil data user login

Auth: Perlu

---

## FINANCE ENDPOINTS

### POST /finance/transactions

Deskripsi: Tambah transaksi

Role: bendahara

Auth: Perlu

Request Body:

```json
{
  "type": "income",
  "category": "Salary",
  "amount": 1000,
  "description": "Monthly salary"
}
```

---

### GET /finance/transactions

Deskripsi: Ambil semua transaksi

Auth: Perlu

Query:

* skip (integer)
* limit (integer)

---

### GET /finance/transactions/{id}

Deskripsi: Detail transaksi

Auth: Perlu

---

### PUT /finance/transactions/{id}

Deskripsi: Update transaksi

Role: bendahara

Auth: Perlu

---

### DELETE /finance/transactions/{id}

Deskripsi: Hapus transaksi

Role: bendahara

Auth: Perlu

---

### GET /finance/summary

Deskripsi: Ringkasan keuangan

Auth: Perlu

Response:

```json
{
  "total_income": 5000,
  "total_expense": 2000,
  "balance": 3000,
  "transaction_count": 10
}
```

---

## LETTER ENDPOINTS

### POST /letters

Deskripsi: Buat surat

Role: sekretaris

Auth: Perlu

Request Body:

```json
{
  "title": "Leave Request",
  "letter_type": "leave",
  "content": "I request leave..."
}
```

---

### GET /letters

Deskripsi: Ambil semua surat

Auth: Perlu

Query:

* status (optional)

---

### GET /letters/{id}

Deskripsi: Detail surat

Auth: Perlu

---

### PUT /letters/{id}

Deskripsi: Update surat (hanya status draft)

Auth: Perlu

---

### DELETE /letters/{id}

Deskripsi: Hapus surat

Auth: Perlu

---

### POST /letters/{id}/submit

Deskripsi: Submit surat

Auth: Perlu

---

### POST /letters/{id}/approve

Deskripsi: Approve surat

Auth: Perlu

---

### POST /letters/{id}/reject

Deskripsi: Reject surat

Auth: Perlu

---

## USER MANAGEMENT (Ketua Only)

### POST /users

Deskripsi: Tambah user

Role: ketua

Auth: Perlu

Request Body:

```json
{
  "email": "user@email.com",
  "password": "Password123",
  "full_name": "User",
  "role": "bendahara"
}
```

---

### GET /users

Deskripsi: List user

Auth: Perlu

---

### GET /users/{id}

Deskripsi: Detail user

Auth: Perlu

---

### PUT /users/{id}

Deskripsi: Update user

Auth: Perlu

---

### DELETE /users/{id}

Deskripsi: Hapus user

Auth: Perlu

---

## NOTES

* Endpoint tanpa autentikasi:

  * /
  * /health
  * /team
  * /auth/register
  * /auth/login
  * /auth/refresh

* Role-based access:

  * ketua: akses penuh
  * bendahara: finance
  * sekretaris: letters
  * anggota: hanya read