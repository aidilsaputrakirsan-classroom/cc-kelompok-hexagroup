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

    A[Browser User] -->|http://localhost:3000| B[Frontend - SikasiApp UI]

    subgraph Services
        B[Frontend - Nginx / React (SikasiApp UI)\nPort: 3000:80\nbuild: ./frontend]

        C[Backend API - SikasiApp\nPort: 8000:8000\nbuild: ./backend]

        D[(PostgreSQL 16 - SikasiApp DB\nPort: 5432:5432\nimage: postgres:16-alpine)]
    end

    B -->|Fetch API| C
    C -->|CRUD Data| D

    C -->|depends_on: service_healthy| D

    subgraph Infrastructure
        E[Docker Network: sikasi-net (bridge)]
        F[Volume: sikasi_pgdata (data persistence)]
    end

    D --> F
    B --> E
    C --> E
    D --> E
end