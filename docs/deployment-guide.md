# Deployment Guide — HexaGroup

## Overview

Deployment dilakukan otomatis via CD Pipeline (GitHub Actions)
setiap kali ada merge ke branch `main`.

---

## Alur Deployment

```
Merge ke main
     ↓
CD Pipeline jalan otomatis
     ↓
Deploy ke Railway (backend + frontend)
     ↓
Health Check /health endpoint
     ↓
✅ Sukses / ❌ Gagal (alert di GitHub Actions)
```

---

## Environment Variables di Railway

Tambahkan variabel berikut di Railway Dashboard → Project → Service → Variables:

| Variable | Keterangan |
|----------|------------|
| `DATABASE_URL` | URL PostgreSQL Railway |
| `SECRET_KEY` | JWT secret key (random, panjang) |
| `CORS_ORIGINS` | URL frontend production |

Tambahkan variabel berikut di GitHub → Settings → Secrets → Actions:

| Secret | Keterangan |
|--------|------------|
| `RAILWAY_TOKEN` | Token dari Railway Dashboard |
| `RAILWAY_BACKEND_URL` | URL backend Railway |

---

## Rollback Manual

Gunakan langkah ini jika health check gagal atau aplikasi bermasalah setelah deploy.

### Langkah Rollback via Railway Dashboard

1. Buka [Railway Dashboard](https://railway.app/dashboard)
2. Pilih project **HexaGroup**
3. Klik service **backend**
4. Buka tab **Deployments**
5. Cari deployment sebelumnya (status: `SUCCESS`)
6. Klik tombol **Redeploy** pada deployment tersebut
7. Ulangi langkah 3–6 untuk service **frontend**

### Verifikasi Setelah Rollback

Setelah rollback selesai, verifikasi manual:

```bash
curl https://RAILWAY_BACKEND_URL/health
# Expected: {"status": "healthy"}
```

### Kapan Harus Rollback?

- Health check gagal setelah deploy baru
- Error 500 muncul di production setelah merge
- Fitur baru menyebabkan aplikasi crash

---

## Kontak

Jika deploy bermasalah, hubungi **Lead CI/CD** tim HexaGroup.
