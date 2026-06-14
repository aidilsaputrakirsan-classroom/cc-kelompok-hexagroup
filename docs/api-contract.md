# API Contract — Cloud App Microservices

Dokumen ini mendefinisikan kontrak REST API untuk setiap microservice di aplikasi **SIKASI** (Sistem Informasi Keuangan dan Administrasi HMSI).

## Base URLs

| Environment | Gateway URL | Port / Prefiks |
|-------------|-------------|---|
| **Local Development** | `http://localhost` | Port 80 (Gateway) |
| **Production** | `https://sikasi-gateway-production.up.railway.app` | - |

## Authentication

Seluruh endpoint yang dilindungi (Protected Endpoints) memerlukan JWT Token pada header request dengan format:

```text
Authorization: Bearer <JWT_TOKEN>
```

---

## 🔐 1. Auth Service Endpoints (Prefiks: `/auth`)

### 1.1 Registrasi Pengguna Baru
*   **Endpoint:** `POST /auth/register`
*   **Akses:** Publik (Tanpa Token)
*   **Request Body (JSON):**
    ```json
    {
      "email": "user@example.com",
      "password": "Password123",
      "full_name": "Nama Pengguna"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "access_token": "eyJhbG...",
      "refresh_token": "eyJhbG...",
      "token_type": "bearer",
      "user": {
        "id": 1,
        "email": "user@example.com",
        "full_name": "Nama Pengguna",
        "role": "anggota"
      }
    }
    ```

### 1.2 Login Pengguna
*   **Endpoint:** `POST /auth/login`
*   **Akses:** Publik (Tanpa Token)
*   **Request Body (JSON):**
    ```json
    {
      "email": "user@example.com",
      "password": "Password123"
    }
    ```
*   **Response (200 OK):** Sama dengan respons registrasi.

### 1.3 Refresh Token
*   **Endpoint:** `POST /auth/refresh`
*   **Akses:** Publik (Tanpa Token)
*   **Request Body (JSON):**
    ```json
    {
      "refresh_token": "eyJhbG..."
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "access_token": "eyJhbG...",
      "token_type": "bearer"
    }
    ```

### 1.4 Mendapatkan Informasi Profil Sendiri
*   **Endpoint:** `GET /auth/me`
*   **Akses:** Terproteksi (Memerlukan Token)
*   **Response (200 OK):**
    ```json
    {
      "id": 1,
      "email": "user@example.com",
      "full_name": "Nama Pengguna",
      "role": "anggota"
    }
    ```

### 1.5 Manajemen Pengguna (Khusus Ketua)
*   **Daftar User:** `GET /auth/users` (Mengembalikan list users)
*   **Detail User:** `GET /auth/users/{user_id}`
*   **Tambah User Baru:** `POST /auth/users` (Untuk menambahkan role `bendahara`/`sekretaris`)
*   **Update User:** `PUT /auth/users/{user_id}`
*   **Hapus User:** `DELETE /auth/users/{user_id}`

---

## 💰 2. Finance Service Endpoints (Prefiks: `/finance`)

### 2.1 Membuat Transaksi Baru
*   **Endpoint:** `POST /finance/transactions`
*   **Akses:** Terproteksi (Khusus role **`bendahara`**)
*   **Request Body (JSON):**
    ```json
    {
      "title": "Pembelian Kertas HVS",
      "type": "expense",
      "category": "Operasional",
      "amount": 55000.0,
      "description": "Beli 1 rim kertas HVS A4 untuk sekretariat"
    }
    ```
*   **Response (201 Created):** Objek data transaksi yang berhasil disimpan beserta `id`.

### 2.2 List Transaksi Keuangan
*   **Endpoint:** `GET /finance/transactions`
*   **Akses:** Terproteksi (Semua Pengguna Terautentikasi)
*   **Query Parameters (Opsional):** `skip` (default: 0), `limit` (default: 10), `category`
*   **Response (200 OK):** Array berisi daftar riwayat transaksi.

### 2.3 Ringkasan Keuangan (Summary)
*   **Endpoint:** `GET /finance/summary`
*   **Akses:** Terproteksi (Semua Pengguna Terautentikasi)
*   **Response (200 OK):**
    ```json
    {
      "total_income": 1500000.0,
      "total_expense": 250000.0,
      "balance": 1250000.0,
      "transaction_count": 12
    }
    ```

---

## 📄 3. Letters Service Endpoints (Prefiks: `/letters`)

### 3.1 Membuat Surat Baru
*   **Endpoint:** `POST /letters`
*   **Akses:** Terproteksi (Khusus role **`sekretaris`**)
*   **Request Body (JSON):**
    ```json
    {
      "title": "Surat Undangan Rapat Pleno",
      "letter_type": "undangan",
      "content": "Isi detail undangan rapat..."
    }
    ```
*   **Response (201 Created):** Objek data surat yang disimpan dengan status default `"draft"`.

### 3.2 List Surat Menyurat
*   **Endpoint:** `GET /letters`
*   **Akses:** Terproteksi (Semua Pengguna Terautentikasi)
*   **Response (200 OK):** Array berisi daftar surat masuk/keluar.

### 3.3 Alur Persetujuan Surat
*   **Submit Surat:** `POST /letters/{letter_id}/submit` (Mengubah status dari `draft` $\rightarrow$ `submitted`)
*   **Approve Surat:** `POST /letters/{letter_id}/approve` (Mengubah status menjadi `approved`)
*   **Reject Surat:** `POST /letters/{letter_id}/reject` (Mengubah status menjadi `rejected`)
