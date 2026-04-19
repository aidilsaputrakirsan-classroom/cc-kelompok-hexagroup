# 🐳 Docker Architecture - SikasiApp

```mermaid
graph TD

User --> Frontend
Frontend --> Backend
Backend --> Database

subgraph sikasiapp-network
    Frontend[sikasiapp-frontend Nginx]
    Backend[sikasiapp-backend FastAPI]
    Database[sikasiapp-db PostgreSQL]
end