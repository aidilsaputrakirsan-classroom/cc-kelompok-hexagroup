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

Jika belum healthy, tunggu 30 detik

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
Pada role Ketua Organisasi hanya dapat mengelola Admin/Akun Pengguna dengan melakukan Create, Read, dan Delete. Kemudian untuk Finance dan Latter hanya bisa menampilkan data saja (Read).

#### ➕ CREATE (Tambah Data)<p>
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

#### 🗑️ DELETE (Hapus Data)
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
File ini mendefinisikan seluruh arsitektur aplikasi SikasiApp yang berjalan menggunakan Docker. 
Docker Compose digunakan untuk menjalankan dan menghubungkan beberapa container agar bekerja sebagai satu sistem.
- Terdapat 3 service utama
    - `database`
    - `backend`
    - `frontend`
- `depends_on` digunakan untuk mengatur startup, sehingga database dijalankan terlebih dahulu sebelum backend.
- `healthcheck` digunakan untuk memastikan database benar-benar siap digunakan sebelum service lain berjalan.
- `network` menunjukkan semua container berada dalam satu network agar dapat saling berkomunikasi.

**Database**
| Komponen                    | Fungsi                                                   |
| --------------------------- | -------------------------------------------------------- |
| `image: postgres:16-alpine` | Menggunakan PostgreSQL sebagai database                  |
| `container_name`            | Memberi nama container (`sikasiapp-db`)                  |
| `env_file`                  | Menyimpan konfigurasi database (user, password, db name) |
| `ports: 5433:5432`          | Menghubungkan port database ke host                      |
| `volumes`                   | Menyimpan data agar tidak hilang ketika container dimatikan (persistent)            |
| `networks`                  | Menghubungkan dengan service lain                        |
| `healthcheck`               | Mengecek apakah database sudah siap digunakan            |

Service database berfungsi sebagai penyimpanan data utama aplikasi.

<p><br>

**Backend**
| Komponen           | Fungsi                                    |
| ------------------ | ----------------------------------------- |
| `build`            | Membangun image dari Dockerfile backend   |
| `container_name`   | Nama container (`sikasiapp-backend`)      |
| `env_file`         | Konfigurasi backend (DB URL, secret, dll) |
| `ports: 8000:8000` | Akses API dari luar                       |
| `depends_on`       | Menunggu database siap dulu               |
| `networks`         | Terhubung ke database & frontend          |
| `healthcheck`      | Mengecek backend berjalan dengan baik     |

Backend berfungsi sebagai API yang memproses data dan menghubungkan frontend dengan database.

<p><br>

**Frontend**

| Komponen         | Fungsi                                      |
| ---------------- | ------------------------------------------- |
| `build`          | Membangun aplikasi frontend dari Dockerfile |
| `container_name` | Nama container (`sikasiapp-frontend`)       |
| `ports: 3000:80` | Akses aplikasi di browser                   |
| `depends_on`     | Menunggu backend siap                       |
| `networks`       | Terhubung ke backend                        |

Frontend berfungsi sebagai tampilan aplikasi yang digunakan oleh user.

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
digunakan untuk menyimpan data PostgreSQL secara permanen. Jika Container dimatikan data tetap ada.

---

### 2. backend/Dockerfile
Backend Dockerfile digunakan untuk membangun environment backend, dengan memanfaatkan layer caching agar proses build lebih cepat dan optimal.

| Instruksi | Fungsi |
|----------|--------|
| `FROM python:3.12-slim` | Menentukan base image |
| `AS (builder)` | Memberi nama stage (multi-stage) |
| `WORKDIR /app` | Menentukan folder kerja di container|
| `COPY requirements.txt` | Menyalin file ke container |
| `RUN pip install ...` | Menjalankan perintah saat build |
| `ENV PATH=...` | Mengatur environment variable |
| `COPY --from=builder` | Ambil hasil dari stage builder sebelumnya |
| `USER appuser` | Menjalankan container sebagai user non-root |
| `EXPOSE 8000` | Menandakan port aplikasi |
| `cek endpoint /health` | Mengecek kondisi aplikasi dan Memastikan backend berjalan|
| `CMD ["python", ...]` | Perintah saat container dijalankan |

Docker menyimpan setiap instruksi sebagai layer, sehingga jika tidak ada perubahan, layer tersebut tidak perlu di-build ulang.
```
COPY requirements.txt .
RUN pip install -r requirements.txt
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