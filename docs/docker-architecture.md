# 🐳 Docker Architecture - SikasiApp

Dalam SikasiApp terdapa 3 service utama :
- Frontend (UI)
- Backend (API)
- Database (PostgreSQL)

---

## 🧱 Overview Arsitektur
SikasiApp berjalan menggunakan Docker Compose dengan tiga container utama yang saling terhubung melalui jaringan internal Docker (bridge network).



```mermaid
flowchart TD

    A[Browser User] -->|http://localhost:3000| B

    B[Frontend - Nginx / React SikasiApp UI Port 3000:80]

    subgraph Services
        C[Backend API - SikasiApp Port 8000:8000]
        D[(PostgreSQL 16 - SikasiApp DB Port 5432:5432)]
    end

    B -->|Fetch API| C
    C -->|CRUD Data| D
    C -->|depends_on health| D

    subgraph Infrastructure
        E[Docker Network sikasi-net]
        F[Volume sikasi_pgdata]
    end

    B --> E
    C --> E
    D --> E
    D --> F

```

## 📦 Services Detail
### 1. Frontend (UI Service)
- Container: sikasi-frontend
- Build: ./frontend
- Port Mapping: 3000:80
- Network: sikasi-net

**Environment Variables**
```
REACT_APP_API_URL=http://backend:8000
```

**Fungsi**
- Menampilkan UI aplikasi SikasiApp
- Mengirim request ke backend API

### 2. Backend (API Service)
- Container: sikasi-backend
- Build: ./backend
- Port Mapping: 8000:8000
- Network: sikasi-net

**Environment Variables**
```
DATABASE_URL=postgresql://postgres:password@db:5432/sikasiapp
```

**Fungsi**
- Menangani logic aplikasi
- Menyediakan REST API
- Menghubungkan frontend dengan database

### 3. Database (PostgreSQL)
- Container: sikasi-db
- Image : postgres:16-alpine
- Port Mapping: 5432:5432
- Network: sikasi-net

**Environment Variables**
```
POSTGRES_DB=sikasiapp
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
```
**Volume**
```
sikasi_pgdata:/var/lib/postgresql/data
```

**Fungsi**
- Menyimpan data aplikasi secara persistent

## 🌐 Network Configuration
```
networks:
  sikasi-net:
    driver: bridge
```
- Semua container berada dalam satu network internal
- Backend dapat mengakses database menggunakan hostname db

## 💾 Volume Configuration
```
volumes:
  sikasi_pgdata:
```

- Menyimpan data PostgreSQL agar tidak hilang saat container di-restart

## 🔁 Data Flow
1. User membuka aplikasi → ```localhost:3000```
2. Frontend mengirim request ke backend
3. Backend memproses request
4. Backend mengambil/menyimpan data ke PostgreSQL
5. Backend mengembalikan response ke frontend
Frontend menampilkan data ke user