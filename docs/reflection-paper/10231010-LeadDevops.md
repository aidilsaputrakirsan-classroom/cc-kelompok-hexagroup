# Reflection Paper – Lead DevOps

## Pendahuluan

Sebagai Lead DevOps di proyek aplikasi berbasis *cloud* dan *microservices* ini, tanggung jawab saya berfokus pada infrastruktur mulai dari containerization, CI/CD pipeline, hingga keamanan gateway. Peran ini menuntut saya untuk tidak hanya memahami kode aplikasi, tetapi juga cara kerja sistem secara keseluruhan: bagaimana container saling berkomunikasi, bagaimana kode bisa sampai ke *production* secara otomatis, dan bagaimana memastikan sistem tetap berjalan stabil di lingkungan cloud. Pengalaman ini menjadi kesempatan nyata untuk menerapkan praktik DevOps modern yang selama ini hanya saya pelajari secara teori.

## Refleksi atas Keputusan Teknis

Salah satu keputusan teknis paling mendasar yang saya ambil adalah merancang **Docker Compose dengan healthcheck dan dependency conditions**. Alih-alih menggunakan `depends_on` sederhana yang hanya menjamin urutan *start* container, saya memilih menggunakan `condition: service_healthy` yang memastikan setiap service benar-benar siap menerima koneksi sebelum service berikutnya dijalankan. Keputusan ini terbukti krusial tanpa ini, backend sering gagal connect ke database karena PostgreSQL belum selesai melakukan inisialisasi meskipun container-nya sudah berjalan.

Keputusan lain yang berdampak besar adalah memisahkan konfigurasi menjadi tiga file Docker Compose: `docker-compose.yml` sebagai base, `docker-compose.dev.yml` untuk *development* dengan hot-reload, dan `docker-compose.prod.yml` untuk *production* dengan konfigurasi yang lebih ketat. Pendekatan *override* ini mengikuti prinsip 12-Factor App konfigurasi yang berbeda antar *environment* dikelola secara eksplisit dan terpisah dari kode. Hasilnya, tim *frontend* bisa menikmati hot-reload saat development, sementara *production* tetap berjalan dengan `restart: always` dan resource limits yang terkontrol.

Untuk CD pipeline, saya memutuskan menambahkan **health check step** setelah deployment ke Railway dengan mekanisme retry mencoba hingga 5 kali dengan jeda 10 detik sebelum dinyatakan gagal. Keputusan ini diambil karena Railway membutuhkan waktu *spin up* yang tidak konsisten, dan pipeline yang langsung gagal di detik pertama akan menyebabkan false alarm yang mengganggu tim.

## Tantangan dan Proses Penyelesaian

Beberapa tantangan utama yang saya hadapi selama pengerjaan proyek:

* **Merge Conflict saat Berpindah Branch:**
  * **Tantangan:** Saat memindahkan perubahan dari branch main ke feature branch menggunakan `git stash`, terjadi conflict di file `backend/tests/conftest.py` yang bukan tanggung jawab saya. Conflict ini memblokir proses commit seluruh pekerjaan DevOps.
  * **Penyelesaian:** Saya menggunakan `git checkout --theirs` untuk mengambil versi file dari branch tujuan, kemudian melakukan `git revert` untuk mengembalikan file tersebut ke versi main yang bersih. Dari sini saya belajar pentingnya selalu membuat branch baru dari main yang sudah ter-update sebelum mulai mengerjakan tugas.

* **CI Pipeline Gagal karena File yang Tidak Relevan:**
  * **Tantangan:** Setelah commit, CI pipeline menunjukkan kegagalan pada *Lint Backend* bukan karena perubahan Docker Compose saya, melainkan karena file `conftest.py` yang ikut ter-commit saat resolve conflict mengandung import yang tidak terpakai (`hash_password` dan `UserRole`).
  * **Penyelesaian:** Saya melakukan `git revert` khusus untuk file tersebut dan melakukan push ulang. Pengalaman ini mengajarkan bahwa dalam kolaborasi tim, setiap anggota harus sangat berhati-hati dengan file di luar scope tugasnya saat menyelesaikan conflict.

* **Risiko Mengubah nginx.conf di Sistem yang Sudah Berjalan:**
  * **Tantangan:** Saat mengerjakan tugas Modul 15 (rate limiting gateway), saya dihadapkan pada dilema menambahkan rate limiting ke `nginx.conf` yang sudah berjalan di production berisiko merusak sistem yang sedang aktif digunakan tim.
  * **Penyelesaian:** Saya memilih pendekatan konservatif: menambahkan rate limiting tanpa mengubah routing yang sudah ada sama sekali, hanya menambahkan blok `limit_req_zone` dan `limit_req` di atas konfigurasi yang sudah berjalan. Saya juga mendokumentasikan prosedur rollback menggunakan fitur *Redeploy* Railway sebagai antisipasi jika terjadi masalah. Pendekatan ini mengajarkan pentingnya prinsip *backward compatible changes* dalam pengelolaan infrastruktur production.

## Pelajaran yang Diperoleh

Menjalani peran Lead DevOps selama proyek ini memberikan beberapa pelajaran berharga:

* **Infrastructure as Code adalah Investasi:** Meluangkan waktu untuk merancang Docker Compose yang proper dengan healthcheck, resource limits, dan environment separation terasa merepotkan di awal, tetapi sangat menghemat waktu debugging di kemudian hari ketika tim menemukan masalah *race condition* antar service.

* **DevOps adalah Jembatan, Bukan Silo:** Peran DevOps mengharuskan saya memahami kebutuhan tim *frontend* (hot-reload saat development), tim *backend* (urutan startup yang benar), dan tim CI/CD (pipeline yang efisien). Saya menyadari bahwa DevOps yang baik tidak bisa bekerja secara terisolasi komunikasi dengan semua peran sangat menentukan keberhasilan infrastruktur.

* **Keamanan adalah Proses Berkelanjutan:** Mengerjakan secret audit dan rate limiting di Modul 15 membuat saya sadar bahwa keamanan bukan fitur yang ditambahkan di akhir, melainkan pertimbangan yang seharusnya ada sejak awal. Rate limiting pada endpoint login seharusnya sudah ada sejak Modul 12 ketika gateway pertama kali dikonfigurasi.

* **Dokumentasi Sama Pentingnya dengan Kode:** Membuat `Makefile` dengan target yang jelas (`make dev`, `make prod`, `make logs`) dan `deployment-guide.md` dengan instruksi rollback manual ternyata sangat diapresiasi oleh anggota tim lain. Infrastruktur yang tidak terdokumentasi sama berbahayanya dengan infrastruktur yang tidak stabil.

## Kesimpulan

Menjadi Lead DevOps di proyek cloud-native berbasis microservices ini memberikan pemahaman mendalam tentang kompleksitas mengelola infrastruktur sistem terdistribusi. Setiap keputusan teknis dari cara container berkomunikasi hingga bagaimana kode mencapai production memiliki dampak nyata pada stabilitas dan keamanan sistem. Tantangan yang dihadapi, mulai dari merge conflict hingga dilema risiko perubahan di sistem production, melatih kemampuan berpikir sistemik dan pengambilan keputusan yang terukur. Pengalaman ini meyakinkan saya bahwa DevOps bukan sekadar menjalankan perintah Docker atau menulis YAML, tetapi tentang membangun kepercayaan tim terhadap infrastruktur yang kita kelola.