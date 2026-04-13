## Panduan Setup Aplikasi SIKASI

Aplikasi SIKASI (Sistem Informasi Keuangan dan Administrasi HMSI) adalah aplikasi berbasis web yang digunakan untuk mendukung pengelolaan keuangan dan administrasi di organisasi HMSI. Aplikasi ini dibangun menggunakan React untuk frontend, FastAPI untuk backend, dan menggunakan PostgreSQL sebagai database. Aplikasi ini juga dibangun dengan Docker untuk mempermudah pengelolaan dan menjalankan berbagai service secara bersamaan.
Berikut adalah panduan langkah demi langkah untuk menyiapkan dan menjalankan aplikasi SIKASI di komputer lokal.

### 1. Persiapan Environment
Sebelum menjalankan aplikasi, pastikan beberapa software berikut sudah terpasang di komputer:

- Git: Untuk mengunduh (clone) repository proyek dari GitHub.
- Docker Desktop: Untuk menjalankan aplikasi dalam container.
- Docker Compose: Untuk menjalankan seluruh service aplikasi secara bersamaan.

Jika belum memiliki Docker Desktop dan Docker Compose, kamu bisa mengunduhnya dari situs resmi mereka:
- Docker Desktop
- Docker Compose
  
Mengapa Docker?
Aplikasi SIKASI dibangun dengan beberapa service backend yang terpisah berdasarkan fungsinya (misalnya auth-service, finance-service, dll.). Docker memudahkan kita untuk menjalankan semua service ini dalam satu perintah saja, memastikan bahwa semua komponen aplikasi dapat saling terhubung tanpa masalah konfigurasi.

### 2. Mengunduh Repository Proyek

Langkah pertama adalah meng-clone repository proyek ini ke komputer lokal kamu.

- Langkah-langkah:
Pastikan Git terpasang di komputer. Jika belum, bisa mengunduh dan menginstal Git dari sini
- Buka terminal atau command prompt, lalu jalankan perintah berikut untuk mengunduh repository proyek:
```
git clone https://github.com/username/repository-name.git
cd repository-name
```
Gantilah 
```
https://github.com/username/repository-name.git dengan URL repository proyek yang sesuai.
```

#### Struktur Proyek 
Setelah mengunduh repository, struktur folder proyek secara umum akan terlihat seperti ini:
```
frontend/                    # Berisi aplikasi React
services/
  auth-service/              # Service autentikasi dan user
  finance-service/           # Service keuangan
  letter-service/            # Service surat
  gateway/                   # Konfigurasi gateway
docs/                        # Berisi dokumentasi proyek
```
Setiap folder dan file dalam struktur ini memiliki peran tertentu dalam proyek. Misalnya, frontend/ berisi aplikasi React untuk antarmuka pengguna, dan services/ berisi berbagai service backend seperti auth-service, finance-service, dan lainnya.

### 2. Menyiapkan File Environment
Sebelum menjalankan aplikasi, beberapa service memerlukan file konfigurasi environment agar bisa berjalan dengan baik. Pada repository ini, sudah tersedia file contoh konfigurasi environment untuk setiap service.

#### Langkah-langkah:
- Salin file contoh .env.example menjadi file .env untuk setiap service. Misalnya, untuk auth-service, finance-service, dan letter-service, jalankan perintah berikut:
```
cp services/auth-service/.env.example services/auth-service/.env
cp services/finance-service/.env.example services/finance-service/.env
cp services/letter-service/.env.example services/letter-service/.env
```
- File .env ini menyimpan informasi penting seperti koneksi database, secret key, dan pengaturan lainnya yang dibutuhkan oleh setiap service. Pastikan informasi dalam file .env sudah sesuai dengan kebutuhan proyek.

### 3. Menjalankan Aplikasi di Backend

Backend aplikasi ini menggunakan FastAPI. Untuk menjalankan backend, perlu menginstal beberapa dependensi dan mengonfigurasi database.

#### 4.1 Install Dependencies Backend
Setelah meng-clone repository, langkah pertama adalah menginstal dependensi yang diperlukan untuk menjalankan backend.
- Masuk ke folder backend:
```
cd services/auth-service
```
- Install dependencies menggunakan pip:
```
pip install -r requirements.txt
```
Perintah ini akan menginstal semua paket Python yang dibutuhkan untuk menjalankan aplikasi backend. Paket-paket ini tercantum dalam file requirements.txt yang ada di folder auth-service.

#### 4.2 Setup Database PostgreSQL

Aplikasi ini menggunakan PostgreSQL sebagai database. Pastikan PostgreSQL sudah terinstal di komputer. Jika belum, bisa mengunduh dan menginstal PostgreSQL dari sini. Setelah PostgreSQL terpasang, perlu membuat database yang akan digunakan oleh aplikasi ini.

- Login ke PostgreSQL:
```
psql -U postgres
```
- CREATE DATABASE sesuai database yang ingin dibuat 

Ganti postgres dengan nama pengguna PostgreSQL jika berbeda. Jangan lupa untuk mengingat password yang digunakan saat instalasi PostgreSQL.

#### 4.3 Jalankan Backend
Setelah menginstal dependensi dan mengonfigurasi database, sekarang waktunya untuk menjalankan aplikasi backend.
- Jalankan aplikasi menggunakan Uvicorn:
```
uvicorn main:app --reload --port 8000
```
- reload memungkinkan aplikasi untuk reload secara otomatis ketika ada perubahan pada kode sumber.
- Backend akan berjalan di 
```
http://localhost:8000.
```

### 5. Menjalankan Aplikasi Frontend

Frontend aplikasi ini dibangun dengan React. Untuk menjalankan frontend, perlu menginstal dependensi dan mengonfigurasi file .env.
- Masuk ke folder frontend:
```
cd frontend
```
#### 5.1 Install dependencies yang diperlukan:
```
npm install
```
Perintah ini akan menginstal semua paket yang dibutuhkan untuk menjalankan aplikasi frontend.

#### 5.2 Konfigurasi .env
File .env di frontend digunakan untuk menyimpan pengaturan seperti URL API backend. Buat file .env di dalam folder frontend dan masukkan pengaturan berikut:
```
VITE_API_URL=http://localhost:8000
```
File .env.example sudah disediakan sebagai template untuk frontend.

#### 5.3 Jalankan Frontend
Setelah menginstal dependensi dan mengonfigurasi file .env, jalankan aplikasi frontend menggunakan perintah berikut:
```
npm run dev
```
Frontend akan berjalan di 
```
http://localhost:5173.
```

### 6. Akses Aplikasi melalui Browser
Setelah aplikasi berhasil dijalankan, bisa mengakses aplikasi melalui browser. Secara umum, aplikasi SIKASI akan berjalan pada localhost.

#### Langkah-langkah:
- Frontend: Akses aplikasi frontend di http://localhost.
- Backend: Akses API di http://localhost, yang akan diatur oleh gateway.


### 7. Fitur yang Dapat Dicoba

Setelah aplikasi berhasil dijalankan, bisa mencoba beberapa fitur utama dari aplikasi SIKASI, seperti:
- Login dan registrasi pengguna: Membuat akun baru dan login ke aplikasi.
- Dashboard: Melihat ringkasan keuangan di dashboard.
- Modul Keuangan: Mengakses dan mengelola data transaksi keuangan.
- Modul Surat: Mengelola dan melihat surat-surat masuk dan keluar.
- Pengelolaan Pengguna: Admin dapat mengelola data pengguna sesuai dengan role yang dimiliki.

### 8. Verifikasi Aplikasi Berjalan
Untuk memastikan aplikasi berjalan dengan benar, lakukan beberapa pengecekan berikut:
- Halaman utama aplikasi dapat dibuka di browser.
- Halaman login tampil dengan baik.
- Proses login dan registrasi dapat dilakukan dengan lancar.
- Menu dashboard dapat diakses dan menampilkan informasi yang benar.
- Modul keuangan dan surat dapat dibuka tanpa error.

Jika semua langkah tersebut berhasil, berarti aplikasi SIKASI sudah berjalan dengan baik di lokal.

