# Reflection Paper – Lead QA & Docs

## Pendahuluan
Di proyek SIKASI (Sistem Informasi Keuangan dan Administrasi HMSI) ini, saya bertanggung jawab sebagai Lead QA & Docs. Perjalanan proyek ini sangat panjang, mulai dari kami melakukan setup awal secara lokal, membangun aplikasi monolith dengan FastAPI dan React, meng-containerize kode dengan Docker, menyusun pipeline CI/CD di GitHub Actions, hingga puncaknya melakukan dekomposisi menjadi microservices dan menambahkan fitur pemantauan. Selama seluruh fase ini, tugas saya bukan hanya menulis deskripsi atau mencari bug di akhir, melainkan menjaga agar kualitas sistem tetap stabil dan memastikan dokumentasi selalu sinkron dengan kode nyata di setiap langkah transisi teknologi tersebut.

## Refleksi atas Keputusan Teknis
Pada fase awal **Monolith**, keputusan teknis penting yang saya ambil adalah langsung menerapkan pengujian terstruktur menggunakan `pytest` untuk backend dan `Vitest` untuk frontend. Pilihan ini memudahkan kami untuk memvalidasi fungsi CRUD dasar pada modul Keuangan dan Surat sejak dini. Di fase **Docker & CI/CD**, saya memutuskan untuk menyelaraskan pengujian otomatis ini ke dalam workflow GitHub Actions. Dengan keputusan ini, setiap kali ada anggota tim yang melakukan pull request, sistem akan menguji kodenya secara otomatis sebelum bisa digabungkan ke branch `main`.

Saat masuk ke fase **Microservices & Observability**, keputusan terbesar saya di bidang QA adalah mensimulasikan kegagalan komunikasi inter-service secara sengaja untuk menguji keandalan Circuit Breaker dan Retry dengan Exponential Backoff. Di sisi dokumentasi, saya memutuskan untuk membagi dokumen menjadi `api-contract.md` (kontrak API hidup untuk acuan kerja tim) dan `operations-guide.md` (panduan pemeliharaan sistem). Keputusan pemisahan dokumen ini terbukti sangat efektif untuk mempercepat integrasi tim frontend dan backend tanpa menimbulkan tumpang tindih info.

## Tantangan dan Proses Penyelesaian
**Integrasi Awal Frontend-Backend (Fase Monolith)** <br>
- Tantangan : Di awal proyek, tipe data respons backend sering kali tidak cocok dengan yang diharapkan frontend, sehingga halaman web sering blank atau error saat tombol diklik.
- Solusi : Saya membuat draf API contract awal di folder docs/ sebagai kesepakatan tertulis mengenai format JSON respons antara backend dan frontend developer.

**Masalah Database pada Automated Testing (Fase CI/CD)**
- Tantangan : Ketika otomatisasi test dijalankan di GitHub Actions, pengetesan sering kali gagal karena test container tidak bisa terhubung ke database PostgreSQL tiruan.
- Solusi : Melakukan konfigurasi database PostgreSQL sebagai service container terintegrasi langsung di file YAML GitHub Actions, lengkap dengan healthcheck-nya agar database siap sebelum pengujian dimulai.

**Kesulitan Melacak Error Lintas Service (Fase Observability)**
- Tantangan : Karena log terbagi di banyak kontainer microservices, pelacakan alur request dari gateway ke database menjadi sangat menyulitkan saat terjadi error transaksi.
- Solusi : Mendorong penerapan Structured Logging (JSON) dan penggunaan Correlation ID (X-Correlation-ID) agar kami bisa mencari satu ID unik untuk melacak seluruh siklus request di semua log kontainer.


## Pelajaran yang diperoleh
- Saya belajar bahwa kualitas sistem tidak bisa dipastikan hanya dengan ngetes di akhir, melainkan harus dikawal sejak setup awal, penulisan skema API, hingga deployment.
- Otomatisasi testing di GitHub Actions benar-benar menyelamatkan kami dari error regresi (kode baru merusak fitur lama) setiap kali ada penggabungan kode baru.
- Belajar bahwa dokumentasi bukan sekadar laporan formalitas UAS, melainkan alat komunikasi tim yang harus selalu diperbarui secara real-time mengikuti perkembangan kode.

## Kesimpulan
Perjalanan proyek SIKASI dari monolith hingga menjadi microservices mengajarkan saya betapa pentingnya peran QA & Docs dalam menjaga stabilitas sistem berbasis cloud. Meskipun kami menghadapi banyak tantangan sinkronisasi data dan konektivitas antar-kontainer selama pengembangan, penerapan automated testing, log JSON terstruktur, dan panduan operasional yang jelas berhasil membawa proyek ini ke tahap final dengan sukses. Pengalaman berharga ini memperkuat pemahaman saya mengenai siklus hidup pengembangan perangkat lunak cloud yang andal untuk proyek-proyek mendatang.