# Release Notes - Milestone 2

## Fitur yang sudah ada 
**Modul Autentikasi**
| No | Fitur | Keterangan | 
| -- | ---- | ------- | 
| 1 | Registrasi Akun | Mendaftarkan pengguna (user) baru ke dalam sistem | 
| 2 | Login Pengguna | Autentikasi pengguna dan mendapatkan access token | 
| 3 | Refresh Token | Memperbarui access token yang telah kedaluwarsa |

**Modul Keuangan (Finance)**
| No | Fitur | Keterangan | 
| -- | ---- | ------- | 
| 1 | Catat Transaksi| Membuat dan menyimpan data transaksi baru |
| 2 | List Transaksi| Mengambil seluruh daftar riwayat transaksi keuangan |
| 3 | Detail Transaksi| Melihat rincian satu transaksi secara spesifik berdasarkan ID |
| 4 | Update Transaksi| Mengubah atau memperbarui data transaksi tertentu |
| 5 | Hapus Transaksi| Menghapus pencatatan transaksi dari database |
| 6 | Summary Keuangan | Mengambil akumulasi/ringkasan total pemasukan & pengeluaran |

**Modul Surat (Letters)**
| No | Fitur | Keterangan | 
| -- | ---- | ------- | 
| 1 | Buat Surat Baru| Membuat draf surat baru |
| 2 | List Surat| Menampilkan semua daftar surat yang tersimpan |
| 3 | Detail Surat| Melihat isi detail dan status terkini dari satu surat |
| 4 | Update Surat| Memperbarui konten surat selama statusnya masih draf |

**Modul Pengguna (Users)**
| No | Fitur | Keterangan | 
| -- | ---- | ------- | 
| 1 | Tambah User | Membuat akun user baru langsung dari panel admin/ketua |
| 2 | List User | Mengambil seluruh daftar user yang ada di database |
| 3 | Detail User | Melihat informasi profil lengkap user tertentu |
| 4 | Update User | Memperbarui data atau mengubah role user |
| 5 | Hapus User | Menonaktifkan atau menghapus akun user dari sistem |

---
## URL Production 
| Service | URL |
|---------|-----|
| Frontend | [https://sikasi-frontend-production-5f57.up.railway.app](https://sikasi-frontend-production-5f57.up.railway.app) |
| Backend API | [https://sikasi-backend-production-a11c.up.railway.app](https://sikasi-backend-production-a11c.up.railway.app) |
| API Docs (Swagger) | [https://sikasi-backend-production.up.railway.app/docs](https://sikasi-backend-production.up.railway.app/docs) |

---

## Known Issues
**Autentikasi Gagal**
- Autentikasi gagal akibat token tidak valid dimana pada siklus validasi token JWT di mana pengguna mengalami *Authentication Failed* secara berulang (hingga 4 kali percobaan login) sebelum sesi berhasil dikenali dengan benar. Investigasi sementara menunjukkan adanya ketidaksinkronan masa kedaluwarsa (*expiration time*) antara server lokal dan waktu produksi.

**Konektivitas Backend API Terputus**
- Komunikasi data antara server Frontend dan Backend API sempat mengalami kegagalan interkoneksi pada lingkungan produksi, mengakibatkan beberapa *request* dari sisi pengguna tidak mendapatkan respons (*timeout*).

**Pipeline CI/CD Gagal**
- Otomasi pengujian pada GitHub Actions tidak berjalan lancar akibat kesalahan sintaksis atau konfigurasi pada file YAML. Masalah ini menyebabkan status integrasi kode utama tertahan pada status *Failing* (Merah).

---

## Tech Stack
**Frontend**
- React.js
- Vite
- Vitest (Testing)
- Tailwind CSS

**Backend**
- Python
- FestAPI
- Pydantic
- Pytest (Testing)

**Database**
- PostgreSQL (Hosted via Railway)

**DevOps & Infrastructure**
- Docker
- Github Action (CI/CD)
- Railway Cloud Platform

