# Panduan Operasional 

Dokumen ini berfungsi sebagai panduan operasional untuk memantau dan menangani masalah pada aplikasi SIKASI (Sistem Informasi Keuangan dan Administrasi HMSI). 

---

## Menjalankan Sistem
1. Untuk menjalankan seluruh service, gunakan perintah berikut:
    ```bash
    docker compose up -d --build
    ```

2. Untuk melihat status container:
    ```bash
    docker compose ps
    ```
    Pastikan container utama berada dalam status `Up`. Untuk database, pastikan statusnya `healthy`.

---

## Cara Check Health
Health check digunakan untuk memverifikasi apakah backend berjalan dengan baik dan database PostgreSQL terhubung. Setiap service di SIKASI menyediakan endpoint `/health` (atau `/service-name/health` melalui gateway) yang mengembalikan status kesehatan internal secara real-time.
### Check Health melalui Gateway
Check Health dapat diakses melalui API Gateway (port 80) maupun secara langsung ke port masing-masing service (jika port dibuka pada environment development):
| Layanan | Endpoint Internal (Container) | Endpoint Gateway (Eksternal) | Deskripsi |
| :--- | :--- | :--- | :--- |
| **API Gateway** | `http://gateway:80/health` | `http://localhost/health` | Memeriksa status operasional Nginx gateway. |
| **Auth Service** | `http://auth-service:8001/auth/health` | `http://localhost/auth/health` | Memeriksa status auth-service dan konektivitas db. |
| **Finance Service** | `http://finance-service:8002/finance/health` | `http://localhost/finance/health` | Memeriksa status finance-service, koneksi db, dan dependency auth-service. |
| **Letters Service** | `http://letters-service:8003/letters/health` | `http://localhost/letters/health` | Memeriksa status letters-service, koneksi db, dan dependency auth-service. |

**Status Kesehatan**<br>
Response dari health check mengembalikan objek JSON yang mendefinisikan status layanan. Terdapat 4 status utama yang dapat dilaporkan:
*   **`healthy`**: Layanan berfungsi penuh. Semua database terhubung dan ketergantungan (dependencies) eksternal tersedia.
*   **`degraded`**: Layanan masih berjalan, tetapi ada dependensi non-kritis yang bermasalah atau Circuit Breaker dalam kondisi `OPEN` (misalnya, `letters-service` tidak dapat memverifikasi token karena `auth-service` lambat/mati, sehingga circuit breaker aktif).
*   **`unhealthy`**: Layanan mengalami kegagalan internal yang fatal (misalnya database terputus), sehingga layanan tidak dapat memproses request.
*   **`unreachable`**: Container layanan mati atau tidak dapat diakses sama sekali (HTTP timeout / network error).

**Contoh Response Healthy:**<br>
```json
{
  "status": "healthy",
  "service": "letters-service",
  "dependencies": {
    "auth-service": {
      "status": "available",
      "circuit_breaker": {
        "state": "CLOSED",
        "failures": 0
      }
    },
    "database": {
      "status": "connected"
    }
  }
}
```

### Check Health Manual
1. Menggunakan cURL
Jalankan perintah berikut di terminal untuk memeriksa status salah satu service:
    ```
    curl -s http://localhost/auth/health
    ```
2. Menggunakan Halaman Dashboard Status (Web UI)
Aplikasi SIKASI dilengkapi dengan halaman status real-time yang dapat diakses di browser pada URL `http://localhost/status`. Halaman ini memperbarui status kesehatan setiap 10 detik dan menampilkan grafik error rate dari tiap service.

---

## Cara Baca Log
Aplikasi SIKASI mengimplementasikan Structured Logging menggunakan format JSON.
### Format Log JSON 
Setiap baris log yang dihasilkan oleh service backend diformat sebagai JSON satu baris dengan struktur sebagai berikut:
```
{
  "timestamp": "2026-06-12T16:05:22.456Z",
  "level": "INFO",
  "service": "finance-service",
  "logger": "logging_middleware",
  "message": "POST /finance/transactions → 201 (45.2ms)",
  "correlation_id": "req-9a8b7c6d",
  "method": "POST",
  "path": "/finance/transactions",
  "status_code": 201,
  "duration_ms": 45.2,
  "user_id": 12
}
```
**Field Log**
* `timestamp`: Waktu terjadinya event dalam format ISO 8601 (UTC).
* `level`: Kategori keparahan log (`DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL`).
* `service`: Nama microservice penghasil log (misal: `auth-service`, `finance-service`).
* `logger`: Nama logger/modul python yang mencatat pesan.
* `message`: Deskripsi singkat tentang kejadian atau status request.
* `correlation_id`: ID unik request untuk melacak aliran data lintas service.
* `method`: HTTP Method (`GET`, `POST`, `PUT`, `DELETE`).
* `path`: Endpoint API yang dipanggil.
* `status_code`: Kode HTTP Response yang dikembalikan.
* `duration_ms`: Waktu pemrosesan request dalam milidetik.
* `exception`: Traceback error lengkap (hanya muncul jika level log adalah `ERROR` atau `CRITICAL` akibat unhandled exception).

### Klasifikasi Log Levels
Untuk menjaga kebersihan log di production, default log level diatur ke INFO.
* `DEBUG`: Detail teknis yang verbose. Digunakan hanya pada environment development/troubleshooting mendalam.
* `INFO`: Event operasional normal. Contoh: Server startup, request HTTP sukses (2xx/3xx).
* `WARNING`: Situasi tidak ideal namun sistem masih berjalan. Contoh: Percobaan retry panggilan HTTP, response lambat, token kedaluwarsa.
* `ERROR`: Masalah operasional yang mengakibatkan kegagalan request. Contoh: Gagal terhubung ke service eksternal, validation error fatal, database error ringan.
* `CRITICAL`: Kegagalan sistem fatal yang memerlukan tindakan darurat. Contoh: Database mati total, disk penuh, port bentrok.


### Cara membaca Log Menggunakan Docker CLI
Karena log diatur menggunakan docker logging driver `json-file` dengan mekanisme **log rotation**, dapat menggunakan perintah Docker Compose berikut:
1. Melihat Log Semua Service
    ```
    docker compose logs -f
    ```
2. Melihat Log Auth Service
    ```
    docker compose logs -f auth-service
    ```
3. Melihat Log Finance Service
    ```
    docker compose logs -f finance-service
    ```
4. Melihat Log Letters Service
    ```
    docker compose logs -f letters-service
    ```
5. Melihat Log Gateway
    ```
    docker compose logs -f gateway
    ```
6. Melihat Log secara Real-Time
    ```
    docker compose logs -f auth-service item-service
    ```
    Gunakan perintah ini ketika ingin memantau log saat melakukan request dari frontend, Swagger, atau terminal.

---

## Cara Trace Request Menggunakan Correlation ID
Correlation ID digunakan untuk melacak satu request yang melewati beberapa service. Dengan correlation ID, tim dapat mengetahui alur request dari gateway ke service lain.

Correlation ID biasanya muncul pada response header dengan nama:
```
x-correlation-id
```
1. Melihat Correlation ID dari Response
    ```
    curl.exe -i http://localhost:8001/health
    ```
    Cari bagian header seperti berikut ini:
    ```
    x-correlation-id: contoh-correlation-id
    ```
2. Mencari Correlation ID di Log <br>
Untuk mencari semua log yang memiliki correlation ID:
    ```
    docker compose logs auth-service item-service --tail=100 | Select-String "correlation_id"
    ```
    Untuk mencari correlation ID tertentu:
    ```
    docker compose logs auth-service item-service --tail=100 | Select-String "isi-correlation-id"
    ```
    Jika correlation ID yang sama muncul pada lebih dari satu service, maka request tracing sudah berjalan dengan baik.

---

## Cara Check Metriks
Setiap service (kecuali API Gateway) mengekspos endpoint `/metrics` yang mengumpulkan metrik kinerja in-memory secara thread-safe. Metrik ini mengacu pada **Four Golden Signals** (Latency, Traffic, Errors, Saturation).

### Entpoint Metrik
- **Auth Service**: `http://localhost/auth/metrics`
- **Finance Service**: `http://localhost/finance/metrics`
- **Letters Service**: `http://localhost/letters/metrics`

### Contoh Response Metrik
```
{
  "service": "finance-service",
  "uptime_seconds": 12504.2,
  "total_requests": 3520,
  "total_errors": 12,
  "error_rate_percent": 0.34,
  "status_codes": {
    "200": 3100,
    "201": 400,
    "401": 8,
    "500": 12
  },
  "latency": {
    "p50_ms": 12.5,
    "p95_ms": 110.2,
    "p99_ms": 450.6,
    "avg_ms": 18.7
  },
  "endpoints": {
    "GET /finance/transactions": {
      "count": 2800,
      "errors": 0,
      "avg_latency_ms": 9.4
    },
    "POST /finance/transactions": {
      "count": 720,
      "errors": 12,
      "avg_latency_ms": 55.1
    }
  }
}
```
### Metrik yang perlu diperhatikan:
|Metrics|Fungsi|
|-------|------|
|`total_requests`|Menampilkan jumlah request yang diterima service|
|`total_errors`|Menampilkan jumlah request yang mengalami error|
|`error_rate_percent`|Menampilkan persentase error|
|`latency.avg_ms`|Menampilkan rata-rata waktu response|
|`latency.p95_ms`|Menampilkan estimasi latency p95|
|`uptime_seconds`|Menampilkan lama service berjalan|

---
## Common Troubleshooting
Berikut adalah beberapa masalah operasional yang sering ditemui beserta langkah investigasi dan solusinya: <br>
#### Masalah 1
Layanan Laporkan Status `unreachable` di Halaman Status
- Gejala : Status card berwarna abu-abu (`unreachable`) pada halaman Dasbor Status. cURL ke endpoint mengembalikan error *Connection Refused*.
- Penyebab : Container service mati (crashed) atau tidak berjalan karena port bentrok di komputer host.
- Langkah Investigasi: <br>
    1. Periksa status container di Docker menggunakan perintah: 
        ```
        docker compose ps
        ```
    2. Periksa log container yang bermasalah untuk mencari penyebab crash dengan perintah:
        ```
        docker compose logs <service-name>
        ```
- Solusi: 
    - Jika container mati, jalankan kembali perintah:
        ```
        docker compose up -d <service-name>
        ```
    - Jika port bentrok dengan aplikasi lokal lain, ubah pemetaan port di `docker-compose.dev`.yml lalu jalankan kembali.

#### Masalah 2
Status `degraded` (Circuit Breaker OPEN) Secara Terus-menerus
- Gejala : Status card berwarna kuning (`degraded`). Request yang memerlukan komunikasi antar service langsung gagal dengan status HTTP 503 ("*Circuit breaker OPEN*").
- Penyebab : Service tujuan (misal `auth-service`) lambat merespons atau mati sehingga service pemanggil menghentikan panggilan untuk mencegah kegagalan berantai (cascading failure).
- Langkah Investigasi:
    1. Periksa log service pemanggil (misal `finance-service` atau `letters-service`):
        ```
        docker compose logs finance-service | grep -i "circuit"
        ```
    2. Cek apakah `auth-service` sedang mengalami utilisasi tinggi atau downtime database.
- Solusi:
    - Tangani downtime pada auth-service terlebih dahulu.
    - Setelah `auth-service` sehat, biarkan circuit breaker melewati masa cooldown (default: 30 detik). Sistem akan masuk ke state `HALF-OPEN` dan secara otomatis menutup kembali (`CLOSED`) setelah request uji coba berhasil.

#### Masalah 3
Layanan Berstatus `unhealthy`
- Gejala : Status card berwarna merah (`unhealthy`). Log menunjukkan exception `sqlalchemy.exc.OperationalError: `(`psycopg2.OperationalError`).
- Penyebab : Container database (`auth-db`, `finance-db`, atau `letter-db`) mati, kredensial password PostgreSQL di `.env` salah, atau penyimpanan disk host penuh.
- Langkah Investigasi: 
    1. Jalankan pemeriksaan kesehatan database dengan perintah:
        ```
        docker compose exec <db-service-name> pg_isready -U postgres
        ```
    2. Verifikasi kesesuaian password pada file `.env` di root proyek.
- Solusi:
    - Jika database mati, restart container database dengan perintah:
        ```
        docker compose restart <db-service-name>
        ```
    - Periksa kapasitas disk host dengan perintah df -h. Hapus data yang tidak terpakai jika disk space penuh ($>95%$).