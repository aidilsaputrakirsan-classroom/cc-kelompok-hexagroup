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

---

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

---
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

---

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


