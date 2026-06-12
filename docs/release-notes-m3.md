# Release Notes — Milestone 3 (Final)

## Version: 3.0.0
**Release Date:** [Senin, 15 Juni 2026]  
**Tag:** v3.0.0

## 🆕 Fitur Baru (dari Milestone 2)

### Microservices Architecture
- Monolith SIKASI berhasil di-decomposed menjadi 3 microservice independen: `auth-service`, `finance-service`, dan `letters-service`.
- Database per service untuk menjaga independensi data (auth-db untuk `auth-service`, finance-db untuk `finance-service`, )
- Database per service untuk menjaga independensi data (auth-db untuk `auth-service`, finance-db untuk `finance-service`, letter-db untuk `letters-service`)
- API Gateway (`gateway` berbasis Nginx) sebagai pintu masuk utama (port 80) yang meneruskan request ke masing-masing service.
- Komunikasi antar-service terjalin melalui HTTP REST API.

### Reliability
- Penerapan logika Retry dengan exponential backoff (maksimal 3 kali percobaan) saat service lain menghubungi `auth-service`.
- Integrasi Circuit Breaker pattern pada client (5 kegagalan berturut-turut $\rightarrow$ state `OPEN`, dengan masa cooldown 30 detik).
- Penerapan *Graceful Degradation* di mana jika `auth-service` mengalami downtime, service pemanggil tidak ikut crash melainkan melaporkan status `degraded`.

### Monitoring & Observability
- *Structured Logging* berformat JSON pada semua service dengan metadata lengkap (timestamp, level, service, duration_ms, method, dll).
- Pelacakan request ujung-ke-ujung (request tracing) menggunakan `correlation_id` (`X-Correlation-ID`) lintas service.
- *In-memory metrics* pada setiap service untuk melacak Golden Signals (jumlah request, error rate, uptime, rata-rata latency, dan latency p95).
- Halaman dasbor status sistem (/status) di frontend dengan indikator countdown auto-refresh 10 detik dan bagan visual error rate.

### Security Hardening
- Penerapan Rate Limiting di API Gateway Nginx (`limit_req_zone` dan `limit_req`) untuk membatasi request spammer.
- Penguatan validasi input pada sisi API schema (Pydantic) dan form frontend.
- Secrets audit — pemisahan seluruh kredensial database dan JWT keys ke dalam environment variables (.env).
- Konfigurasi CORS yang dibatasi hanya untuk domain tepercaya.

## 📊 Statistik Proyek

| Metric | Nilai |
|--------|-------|
| Total Services | 8 (3 APIs, 3 DBs, 1 frontend, 1 gateway) |
| Total Endpoints | 18 |
| Unit Tests | [X] tests |
| Integration Tests | 8 tests |
| CI Pipeline Jobs | [X] jobs |
| Total Commits | [X] |
| Total PRs Merged | [X] |

## 👥 Kontribusi
| Nama | NIM | Peran Utama | Area Kontribusi |
|------|---------|-----|-------|
| Ahmad Bayhaqi | 10231001 | Lead Backend | Struktur database ORM, logika API Microservices (Auth, Finance, Letters), integrasi FastAPI.|
| Indah Nur Fortuna | 10231044 | Lead Frontend | UI/UX React, Halaman Dashboard, Integrasi API, Dashboard Halaman Status Pemantauan (/status). |
| Alfiani Dwiyuniarti | 10231010 | Lead DevOps | Konfigurasi Gateway Nginx, penataan network container Docker Compose, volume logging, rate limiting. |
| Zahwa Hanna Dwi Putri | 10231092 | Lead CI/CD & Deploy | Otomatisasi CI/CD workflow GitHub Actions, manajemen secrets, deployment aplikasi ke Railway Cloud. |
| Nilam Ayu NandaStari Romdoni | 10231070 | Lead QA & Docs | Integrasi testing, unit testing backend & frontend, dokumentasi API, Operations Guide, Release Notes. |