## Database Schema

Database schema pada aplikasi **SIKASI** digunakan untuk menyimpan data utama yang berkaitan dengan proses autentikasi pengguna, pengelolaan keuangan, dan administrasi surat. Berbeda dengan sistem inventory yang hanya berfokus pada data item, aplikasi SIKASI memiliki beberapa tabel utama agar setiap modul dapat berjalan secara terstruktur dan saling terhubung.

Melalui database ini, sistem dapat mengelola data pengguna, kategori transaksi, transaksi keuangan, serta surat masuk dan surat keluar. Dengan adanya pembagian tabel tersebut, proses penyimpanan data menjadi lebih rapi, mudah diproses, dan sesuai dengan kebutuhan aplikasi.

---

### Table: users

Tabel `users` digunakan untuk menyimpan seluruh data pengguna yang dapat mengakses sistem SIKASI. Tabel ini menjadi pusat penyimpanan informasi akun, mulai dari identitas pengguna, email, password yang sudah dienkripsi, role, status akun, hingga waktu pembuatan data. Dengan adanya tabel ini, sistem dapat mengatur proses login, registrasi, serta pembagian hak akses sesuai jabatan pengguna di dalam organisasi.

| Kolom | Tipe | Penjelasan |
|------|------|------|
| id | Integer | Primary key, auto increment |
| username | String(100) | Nama pengguna untuk identitas akun |
| email | String(255) | Email pengguna, bersifat unik |
| password_hash | String(255) | Password yang disimpan dalam bentuk hash |
| role | String(20) | Role pengguna, misalnya Anggota, Bendahara, Sekretaris, atau Ketua |
| is_active | Boolean | Status aktif atau tidaknya akun |
| created_at | DateTime | Waktu akun dibuat |
| updated_at | DateTime | Waktu terakhir data akun diperbarui |

---

### Penjelasan Kolom Tabel users
- `id` = Primary key dari tabel users. Nilai dibuat otomatis.
- `username` = Nama pengguna yang digunakan sebagai identitas akun.
- `email` = Email pengguna yang dipakai untuk menyimpan informasi kontak akun.
- `password_hash` = Password pengguna yang sudah dienkripsi agar lebih aman.
- `role` = Menentukan hak akses pengguna di dalam sistem.
- `is_active` = Menandai apakah akun masih aktif atau tidak.
- `created_at` = Waktu saat akun pertama kali dibuat.
- `updated_at` = Waktu terakhir data akun diperbarui.

---

### Table: categories

Tabel `categories` digunakan untuk menyimpan data kategori transaksi pada modul keuangan. Tabel ini berfungsi untuk mengelompokkan transaksi berdasarkan jenisnya, misalnya pemasukan atau pengeluaran. Dengan adanya tabel ini, sistem dapat menampilkan transaksi secara lebih terstruktur dan memudahkan pengelolaan data keuangan organisasi.

| Kolom | Tipe | Penjelasan |
|------|------|------|
| id | Integer | Primary key, auto increment |
| name | String(100) | Nama kategori transaksi |
| type | String(20) | Jenis kategori, misalnya income atau expense |
| created_at | DateTime | Waktu kategori dibuat |
| updated_at | DateTime | Waktu terakhir kategori diperbarui |

---

### Penjelasan Kolom Tabel categories
- `id` = Primary key dari tabel categories.
- `name` = Nama kategori transaksi, misalnya Kas Masuk, Donasi, atau Operasional.
- `type` = Menunjukkan apakah kategori termasuk pemasukan atau pengeluaran.
- `created_at` = Waktu saat kategori pertama kali dibuat.
- `updated_at` = Waktu terakhir data kategori diperbarui.

---

### Table: transactions

Tabel `transactions` digunakan untuk menyimpan seluruh data transaksi keuangan pada sistem SIKASI. Tabel ini menjadi pusat pencatatan pemasukan dan pengeluaran yang terjadi di organisasi. Melalui tabel ini, sistem dapat menambahkan transaksi baru, menampilkan daftar transaksi, menghitung total cash flow, serta membuat ringkasan saldo secara otomatis.

| Kolom | Tipe | Penjelasan |
|------|------|------|
| id | Integer | Primary key, auto increment |
| category_id | Integer | Foreign key yang mengacu ke tabel categories |
| amount | Float | Nominal transaksi |
| description | Text | Keterangan tambahan transaksi |
| type | String(20) | Jenis transaksi, yaitu income atau expense |
| created_at | DateTime | Waktu transaksi dibuat |
| updated_at | DateTime | Waktu terakhir transaksi diperbarui |

---

### Penjelasan Kolom Tabel transactions
- `id` = Primary key dari tabel transactions.
- `category_id` = Relasi ke kategori transaksi agar setiap transaksi memiliki kelompok yang jelas.
- `amount` = Nilai nominal dari transaksi.
- `description` = Keterangan tambahan yang menjelaskan isi transaksi.
- `type` = Menentukan apakah transaksi merupakan pemasukan atau pengeluaran.
- `created_at` = Waktu saat transaksi pertama kali dicatat.
- `updated_at` = Waktu terakhir data transaksi diperbarui.

---

### Table: letters

Tabel `letters` digunakan untuk menyimpan seluruh data surat pada modul administrasi. Tabel ini menampung data surat masuk maupun surat keluar, termasuk nomor surat, judul, isi surat, pengirim, penerima, dan file pendukung jika ada. Dengan adanya tabel ini, sistem dapat membantu proses pencatatan surat secara lebih terorganisir.

| Kolom | Tipe | Penjelasan |
|------|------|------|
| id | Integer | Primary key, auto increment |
| number | String(100) | Nomor surat |
| type | String(20) | Jenis surat, misalnya in atau out |
| title | String(255) | Judul surat |
| content | Text | Isi atau deskripsi surat |
| sender_name | String(100) | Nama pengirim surat |
| recipient_name | String(100) | Nama penerima surat |
| file_path | String(255) | Lokasi file surat jika disimpan |
| created_at | DateTime | Waktu surat dibuat |
| updated_at | DateTime | Waktu terakhir surat diperbarui |

---

### Penjelasan Kolom Tabel letters
- `id` = Primary key dari tabel letters.
- `number` = Nomor surat yang digunakan sebagai identitas surat.
- `type` = Menentukan apakah surat termasuk surat masuk atau surat keluar.
- `title` = Judul surat.
- `content` = Isi atau deskripsi singkat surat.
- `sender_name` = Nama pihak yang mengirim surat.
- `recipient_name` = Nama pihak yang menerima surat.
- `file_path` = Lokasi file surat jika ada lampiran digital.
- `created_at` = Waktu saat data surat pertama kali dibuat.
- `updated_at` = Waktu terakhir data surat diperbarui.

---

### Relasi Antar Tabel

Secara umum, hubungan antar tabel pada aplikasi SIKASI adalah sebagai berikut:

- Tabel `users` digunakan untuk menyimpan data akun dan role pengguna.
- Tabel `categories` digunakan untuk mengelompokkan transaksi keuangan.
- Tabel `transactions` terhubung dengan `categories` melalui `category_id`.
- Tabel `letters` berdiri sendiri untuk mengelola data surat masuk dan surat keluar.

Dengan struktur ini, aplikasi SIKASI dapat mendukung proses login, manajemen pengguna, pencatatan transaksi, perhitungan cash flow, dan administrasi surat secara terintegrasi.

---

### Ringkasan

Database pada aplikasi SIKASI tidak hanya berfokus pada satu jenis data, tetapi mencakup beberapa bagian penting sesuai kebutuhan sistem, yaitu data pengguna, kategori transaksi, transaksi keuangan, dan surat. Dengan pembagian tabel yang jelas, sistem dapat mengelola data organisasi dengan lebih terstruktur, aman, dan mudah dikembangkan di kemudian hari.