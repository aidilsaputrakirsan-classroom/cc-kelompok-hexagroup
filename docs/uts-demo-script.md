# UTS - DEMO SCRIPT

Demo Project SikasiApp - Step by Step Presentation Script

## 🧑‍💻 1. Persiapan Awal
Sebelum demo dimulai, pastikan:
- Docker sudah running
- Semua container aktif (```backend```, ```frontend```, ```database```)
- Aplikasi bisa diakses di browser
    - Frontend: http://localhost:3000
    - Backend API: http://localhost:8000 (atau sesuai konfigurasi)

---

## 2. 🐳 Menjalankan Sistem
Jalankan di terminal : 
```
docker compose up -d
```
Lalu cek : 
```
docker compose ps
```

Pastikan : 
- db = Up (healthy)
- backend = Up
- frontend = Up

Jika belum healthy, tunggu ±10–30 detik

---

## 3. 🌐 Buka Aplikasi
Buka browser untuk Frontend: 
```
http://localhost:3000
```
Pastikan halaman sudah tampil

---

## 4. 🔐 Authentication

### **Registrasi user baru**
1. Klik ```Daftar Disini``` pada halaman Login
2. Isi Data Akun Baru (Nama Lengkap, Email, Password)
3. Klik Tombol Daftar

### **Login**
1. Masukkan `email` & `password` dengan benar 
2. Klik Tombol Masuk
3. Pastikan masuk halaman dashboard

### **Endpoint dilindungi - tidak bisa akses tanpa login**
1. Ketika pengguna telah berada pada halaman Dashboard, Klik ```Logout``` dan akan diarahkan pada halaman Login
2. Coba akses halaman Dashboard langsung
3. Akses halaman Dashboard ditolak

---

## 5. 📦 CRUD Operations

### Ketua Organisasi
Pada role Ketua Organisasi dapat mengelola semua halaman keuangan (*finance*), administrasi (*letters*), dan Admin/Akun Pengguna dengan melakukan Create, Read, Update, dan Delete (CRUD).

#### ➕ CREATE (Tambah Data)<p>
**Mengelola Keuangan**<br>
1. Buka halaman `Finance`
2. Klik `Transaksi Baru`
3. Isi form dengan data transaksi baru (Jenis, Kategori, Iuran, Nominal, Keterangan)
4. Klik tombol `Konfirmasi & Simpan`
5. Data Transaksi baru akan tersimpan pada daftar Keuangan

**Mengelola Administrasi**<br>
1. Buka halaman `Letters` 
2. Klik `Buat Surat`
3. Isi form dengan data surat baru (Judul, Jenis, Deskripsi)
4. Klik tombol `Buat Surat`
5. Data surat baru akan tersimpan pada daftar surat

**Mengelola Akun Pengguna** <br>
1. Buka halaman `Admin` untuk mengakses User Management
2. Klik `Add New User`
3. Isi form dengan data pengguna baru (Nama, Email, Password, Role)
4. Klik tombol `Confirm`
5. Data pengguna baru akan tersimpan pada daftar akun pengguna

<p><br>

#### 👁️ READ (Tampil Data)
**Keuangan**
1. Daftar transaksi tampil pada halaman `Finance`
2. Fitur search untuk mencari keuangan berdasarkan kategori

**Administrasi**
1. Daftar surat administrasi tampil pada halaman `Letters`
2. Fitur search untuk mencari surat administrasi berdasarkan kata kunci dan kategori

**Akun Pengguna**
1. Daftar akun pengguna tampil pada halaman `Admin`
2. Fitur search untuk mencari akun pengguna berdasarkan kata kunci dan jabatan

<p><br>

#### 📝 UPDATE (Edit Data)
**Keuangan**
1. Buka halaman `Finance`
2. Pilih transaksi yang ingin di edit
3. Klik `Edit` pada transaksi yang dipilih
4. Menampilkan data transaksi
5. Ubah data transaksi
6. Klik tombol `Simpan Perubahan`
7. Data Transaksi yang diubah akan tersimpan dan diperbarui pada daftar Keuangan

**Administrasi**
1. Buka halaman `Letters` 
2. Pilih surat yang ingin di edit
3. Klik `Edit` pada surat yang dipilih
4. Menampilkan data surat
5. Ubah data surat
6. Klik tombol `Simpan Perubahan`
7. Data surat yang diubah akan tersimpan dan diperbarui pada daftar Surat Administrasi

<p><br>

#### 🗑️ DELETE (Hapus Data)
**Keuangan**
1. Buka halaman `Finance`
2. Pilih transaksi yang ingin di hapus
3. Klik `Hapus` pada transaksi yang dipilih
4. Menampilkan dialog konfirmasi
5. Klik OK untuk konfirmasi penghapusan transaksi
6. Data transaksi terhapus dan hilang dari daftar keuangan

**Administrasi**
1. Buka halaman `Letters`
2. Pilih surat yang ingin di hapus
3. Klik `Hapus` pada surat yang dipilih
4. Menampilkan dialog konfirmasi
5. Klik OK untuk konfirmasi penghapusan surat
6. Data surat terhapus dan hilang dari daftar surat administrasi

**Akun Pengguna**
1. Buka halaman `Admin`
2. Pilih akun pengguna yang ingin di hapus
3. Klik `Hapus` pada akun pengguna yang dipilih
4. Menampilkan dialog konfirmasi
5. Klik OK untuk konfirmasi penghapusan akun pengguna
6. Data akun pengguna terhapus dan hilang dari daftar akun pengguna

---

### Bendahara Organisasi
Pada role Bendahara Organisasi hanya dapat mengelola halaman keuangan (*finance*) dengan melakukan Create, Read, Update, dan Delete (CRUD). Halaman Administrasi (*Letters*) hanya dapat Read.

#### ➕ CREATE (Tambah Data)<p>
**Mengelola Keuangan**<br>
1. Buka halaman `Finance`
2. Klik `Transaksi Baru`
3. Isi form dengan data transaksi baru (Jenis, Kategori, Iuran, Nominal, Keterangan)
4. Klik tombol `Konfirmasi & Simpan`
5. Data Transaksi baru akan tersimpan pada daftar Keuangan

<p><br>

#### 👁️ READ (Tampil Data)
**Keuangan**
1. Daftar transaksi tampil pada halaman `Finance`
2. Fitur search untuk mencari keuangan berdasarkan kategori

**Administrasi**
1. Daftar surat administrasi tampil pada halaman `Letters`
2. Fitur search untuk mencari surat administrasi berdasarkan kata kunci dan kategori

<p><br>

#### 📝 UPDATE (Edit Data)
**Keuangan**
1. Buka halaman `Finance`
2. Pilih transaksi yang ingin di edit
3. Klik `Edit` pada transaksi yang dipilih
4. Menampilkan data transaksi
5. Ubah data transaksi
6. Klik tombol `Simpan Perubahan`
7. Data Transaksi yang diubah akan tersimpan dan diperbarui pada daftar Keuangan

<p><br>

#### 🗑️ DELETE (Hapus Data)
**Keuangan**
1. Buka halaman `Finance`
2. Pilih transaksi yang ingin di hapus
3. Klik `Hapus` pada transaksi yang dipilih
4. Menampilkan dialog konfirmasi
5. Klik OK untuk konfirmasi penghapusan transaksi
6. Data transaksi terhapus dan hilang dari daftar keuangan

---

### Sekretaris Organisasi
Pada role Sekretaris Organisasi hanya dapat mengelola halaman Administrasi (*Letters*) dengan melakukan Create, Read, Update, dan Delete (CRUD). Halaman Keuangan (*Finance*) hanya dapat Read.

#### ➕ CREATE (Tambah Data)<p>
**Mengelola Administrasi**<br>
1. Buka halaman `Letters` 
2. Klik `Buat Surat`
3. Isi form dengan data surat baru (Judul, Jenis, Deskripsi)
4. Klik tombol `Buat Surat`
5. Data surat baru akan tersimpan pada daftar surat

<p><br>

#### 👁️ READ (Tampil Data)
**Keuangan**
1. Daftar transaksi tampil pada halaman `Finance`
2. Fitur search untuk mencari keuangan berdasarkan kategori

**Administrasi**
1. Daftar surat administrasi tampil pada halaman `Letters`
2. Fitur search untuk mencari surat administrasi berdasarkan kata kunci dan kategori

<p><br>

#### 📝 UPDATE (Edit Data)
**Administrasi**
1. Buka halaman `Letters` 
2. Pilih surat yang ingin di edit
3. Klik `Edit` pada surat yang dipilih
4. Menampilkan data surat
5. Ubah data surat
6. Klik tombol `Simpan Perubahan`
7. Data surat yang diubah akan tersimpan dan diperbarui pada daftar Surat Administrasi

<p><br>

#### 🗑️ DELETE (Hapus Data)
**Administrasi**
1. Buka halaman `Letters`
2. Pilih surat yang ingin di hapus
3. Klik `Hapus` pada surat yang dipilih
4. Menampilkan dialog konfirmasi
5. Klik OK untuk konfirmasi penghapusan surat
6. Data surat terhapus dan hilang dari daftar surat administrasi

---

### Anggota Organisasi
Pada role Anggota Organisasi hanya dapat Menampilkan daftar keuangan (`Finance`) dan administrasi (`Letters`) dengan Read.

#### 👁️ READ (Tampil Data)
**Keuangan**
1. Daftar transaksi tampil pada halaman `Finance`
2. Fitur search untuk mencari keuangan berdasarkan kategori

**Administrasi**
1. Daftar surat administrasi tampil pada halaman `Letters`
2. Fitur search untuk mencari surat administrasi berdasarkan kata kunci dan kategori

---

## 6. 💾 Data Persistence Test

Melakukan pengujian data persistence untuk memastikan data tidak hilang meskipun container dimatikan.

Jalankan perintah berikut untuk mematikan seluruh container yang sedang berjalan
```
docker compose down
```

Lalu nyalakan kembali dengan perintah
```
docker compose up -d
```

Setelah container dijalankan kembali, sistem akan otomatis melakukan instalisasi ulang tanpa menghapus data di database.

Kemudian : 
- Buka `http://localhost:3000`
- Login ulang ke sistem
- Pastikan data CRUD sebelumnya masih ada pada sistem

---

## 🧠 Code Walkthrough
### 1. docker-compose.yml
File ini mendefinisikan seluruh arsitektur aplikasi SikasiApp yang berjalan menggunakan Docker. Menggunakan Docker Compose untuk menjalankan seluruh sistem secara terintegrasi.
- Terdapat 3 service utama
    - `database`
    - `backend`
    - `frontend`
- `depends_on` digunakan untuk mengatur startup, sehingga database dijalankan terlebih dahulu sebelum backend.
- `healthcheck` digunakan untuk memastikan database benar-benar siap digunakan sebelum service lain berjalan.
- `network` menunjukkan semua container berada dalam satu network agar dapat saling berkomunikasi.

**Database**

- Database menggunakan PostgreSQL versi 16 alpine.
    ```
    db:
    image: postgres:16-alpine
    container_name: sikasiapp-db
    ```
- Port 5433 agar tidak bentrok dengan service lain di host.
    ```
    "5433:5432"
    ```

- Volume untuk menyimpan data agar tetap persistem meskipun container dimatikan
    ```
    pgdata:/var/lib/postgresql/data
    ```

- healthcheck memastikan database bener-bener siap sebelum backend dijalankan
    ```
    pg_isready
    ```
<p><br>

**Backend**

- Backend dibangun dari Dockerfile di folder backend
    ```
    backend:
        build:
            context: ./backend
    ```
- depends_on, backend hanya dapat berjalan ketika database dalam kondisi healthy
    ```
    db:
        condition: service_healthy
    ```

- Backend dapat diakses melalui port 8000
    ```
    "8000:8000"
    ```

- Healthcheck backend untuk memastikan service berjalan dengan baik.
    ```
    /health
    ```
<p><br>

**Frontend**

- Frontend dibuild dari folder frontend
    ```
    frontend:
        build:
            context: ./frontend
    ```

- Build args digunakan agar frontend dapat terhubung ke backend API.
    ```
    VITE_API_URL: http://localhost:8000
    ```

- Frontend dijalankan pada port 3000 dan diserve oleh Nginx di port 80 dalam container.
    ```
    "3000:80"
    ```

- depends_on backend, frontend hanya dapat berjalan jika backend sudah siap.
    ```
    backend:
        condition: service_healthy
    ```

<p><br>

**Network**
```
networks:
  sikasinet:
```
Semua container berada dalam satu network bernama sikasinet agar dapat saling berkomunikasi.

<p><br>

**Volume**
```
pgdata:
```
digunakan untuk menyimpan data PostgreSQL secara permanen.

---

### 2. backend/Dockerfile
Menggunakan Dockerfile untuk membangun environment dan menginstall dependency backend dengan konsep multi-stage build agar lebih optimal.

**1. Builder**
- Menyiapkan environment dan menginstall semua dependency
    ```
    FROM python:3.12-slim AS builder
    WORKDIR /app
    COPY requirements.txt .
    RUN python -m venv /opt/venv
    ```
- Virtual environment agar dependency tidak bercampur dengan sistem utama
    ```
    RUN python -m venv /opt/venv
    ```

- Install dependency semua library backend berdasarkan requirements.txt
    ```
    RUN pip install --no-cache-dir -r requirements.txt
    ```
<p><br>

**2. Production**

Production digunakan untuk menjalankan aplikasi secara ringan tanpa build tools.
```
FROM python:3.12-slim
WORKDIR /app
```

- Copy venv dari builder
    ```
    COPY --from=builder /opt/venv /opt/venv
    ```
    Dependency dari stage pertama dipindahkan ke production agar build lebih efisien.

- Copy source code
    ```
    COPY . .
    ```
    Kode aplikasi backend kemudian disalin ke dalam container.

<p><br>

**3. Security (User Non-Root)**
Aplikasi dijalankan menggunakan user non-root untuk keamanan agar lebih secure.
```
RUN useradd -m appuser && chown -R appuser /app
USER appuser
```
<p><br>

**4. Expose Port**
Backend berjalan pada port 8000
```
EXPOSE 8000
```

<p><br>

**5. HealthCheck**
Untuk memastikan backend bener-bener hidup dan dapat diakses
```
HEALTHCHECK --interval=30s ...
```

<p><br>

**6. CMD (Jalankan Aplikasi)**
Untuk menjalankan backend setelah database siap.
```
CMD ["python", "wait-for-db.py"]
```

---

### 3. Frontend/Dockerfile
Menggunakan multi-stage build agar hasil image lebih ringan dan aplikasi disajikan dengan menggunakan Nginx untuk performa yang optimal.

**1. Multi-Stage Build**
- Menggunakan Node.js untuk melakukan proses build aplikasi React.
    ```
    FROM node:20-alpine AS builder
    WORKDIR /app
    ```

- Copy file dependency agar dapat memanfaatan layer caching sehingga tidak memerlukan penginstalan ulang.
    ```
    COPY package.json package-lock.json* ./
    RUN npm ci
    ```

- Seluruh source frontend disalin ke dalam container.
    ```
    COPY . .
    ```

- Environment variabel API digunakan agar dapat terhubung ke backend API saat build.
    ```
    COPY . .
    ```

- Build Aplikasi menjadi file static yang siap untuk production di folder dist.
    ```
    RUN npm run build
    ```

<p><br>

**2. Production (Nginx)**
- Menggunakan Nginx sebagai web server untuk menyajikan hasil build frontend.
    ```
    FROM nginx:alpine
    ```

- Copy File hasil build dari stage dipindahkan ke folder default Nginx.
    ```
    COPY --from=builder /app/dist/ /usr/share/nginx/html/
    ```

- Konfigurasi Nginx custom untuk mengatur routing dan optimasi.
    ```
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    ```

- Frontend disajikan melalui port 80 di dalam container.
    ```
    EXPOSE 80
    ```

- Nginx dijalankan di foreground agara container tetap aktif.
    ```
    CMD ["nginx", "-g", "daemon off;"]
    ```
<br> <P>
Multi-Stage Build digunakan agar image final lebih kecil karena hanya membawa hasil build, tanpa Node.js dan dependency development.

Nginx digunakan karena ringan, cepat, dan optimal untuk menyajikan file static seperti hasil build React.

Sehingga dengan menggunakan multi-stage build dan Nginx, frontend dapat berjalan lebih ringan, cepat, dan siap digunakan di environment production.