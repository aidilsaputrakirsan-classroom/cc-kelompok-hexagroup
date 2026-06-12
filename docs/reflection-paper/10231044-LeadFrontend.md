# Reflection Paper – Lead Frontend Developer

## Pendahuluan
Sebagai Lead Frontend Developer di proyek aplikasi berbasis *cloud* dan *microservices* ini, peran saya tidak cuma soal bikin tampilan yang bagus. Saya punya tanggung jawab untuk memastikan antarmuka yang dibuat itu responsif, aman, dan kodenya gampang di-*maintain*. Proyek ini benar-benar menuntut saya untuk paham cara kerja *frontend* modern, terutama soal gimana aplikasi React yang kita buat bisa ngobrol dengan banyak layanan *backend* (API) dengan lancar. Selama mengerjakan proyek ini, fokus saya bukan sekadar *ngoding* UI, tapi juga memikirkan arsitektur aplikasi, *state management*, dan gimana cara kerja bareng tim biar lebih sinkron. Pengalaman ini jadi tempat saya belajar menerapkan prinsip *software engineering* ke dalam aplikasi *cloud-native* di dunia nyata, sekaligus menguji seberapa jauh saya bisa memecahkan masalah integrasi sistem yang lumayan kompleks.

## Refleksi atas Keputusan Teknis
Waktu merancang arsitektur *frontend*, keputusan paling mendasar yang saya ambil adalah membuat komponen React yang modular supaya bisa dipakai berulang kali (*reusable*). Alasannya karena kalau proyeknya makin besar, kita bakal susah *maintain* kodenya kalau logika bisnis dan tampilan UI dicampur aduk. Untuk mengurus komunikasi dengan *backend*, saya memutuskan untuk memisahkan konfigurasi URL API lewat *environment variables* (untuk *development* dan *production*). Awalnya kelihatan biasa, tapi keputusan ini terasa banget manfaatnya waktu kita mulai *deploy* aplikasi pakai Docker, karena kita jadi gampang ganti-ganti *environment* tanpa harus ubah kode.

Selain itu, ada juga keputusan soal autentikasi pakai JSON Web Token (JWT). Saya memilih untuk menyimpan dan mengatur *state* token ini secara terpusat di sisi klien biar *user* bisa pindah-pindah halaman tanpa terasa *delay* atau harus *login* ulang terus. Keputusan ini memang bikin *state management* jadi sedikit lebih rumit, tapi dampaknya luar biasa bagus buat keamanan dan kenyamanan *user* waktu mengakses fitur-fitur aplikasi. Kalau dipikir-pikir lagi sekarang, mungkin menggunakan pola *Context API* yang lebih rapi atau *library global state* bisa bikin aliran datanya lebih enak dibaca, tapi setidaknya pendekatan yang saya pakai kemarin sudah cukup stabil buat kebutuhan proyek ini.

## Tantangan dan Proses Penyelesaian
Selama masa pengembangan, beberapa tantangan utama yang saya hadapi dan selesaikan antara lain :

* **Integrasi CORS Beda Domain:** 
  * **Tantangan:** Menyambungkan *frontend* dengan API FastAPI yang berjalan di *port* atau *domain* yang berbeda sering memunculkan *error Cross-Origin Resource Sharing* (CORS). Masalah ini membuat *browser* terus menolak permintaan data sehingga progres sempat terhambat.
  * **Penyelesaian:** Saya berkoordinasi dengan *backend* untuk menyamakan *setting* CORS-nya, agar keamanan tetap terjaga tapi data bisa diakses. Momen ini menyadarkan saya bahwa komunikasi lintas disiplin (*frontend-backend*) itu harus terjadi di arsitektur terdistribusi.

* **Routing Error saat Containerization:**
  * **Tantangan:** Membuat *image* Docker untuk aplikasi React butuh *multi-stage build* (proses nge-*build* dipisah dengan proses nge-*serve* pakai Nginx). Sayangnya, sempat terjadi *error routing* (halaman jadi 404) kalau *user refresh* halaman atau langsung mengetik URL secara manual.
  * **Penyelesaian:** Setelah melakukan riset dokumentasi dan *trial-error* pada konfigurasi server, saya berhasil menemukan *setting* Nginx yang pas untuk mengembalikan semua *request* navigasi ke `index.html`. Tanpa penyelesaian ini, aplikasi SPA kita bakal cacat saat di-*deploy* ke *cloud*.

## Pelajaran yang Diperoleh
Ikut terlibat penuh dari awal proyek sampai tahap akhir benar-benar membuka wawasan saya. Beberapa pelajaran berharga yang bisa saya ambil adalah:

* **Pentingnya Pemahaman Infrastruktur bagi Frontend:** Di ekosistem *microservices*, *frontend engineer* tidak cukup hanya jago UI. Saya jadi belajar dasar-dasar operasional seperti cara kerja Docker dan *deployment* aplikasi. 
* **Otomatisasi Mencegah Kesalahan:** Kedisiplinan tim dalam memakai *Git workflow* dan menjalankan CI/CD via GitHub Actions sangat membantu. *Continuous Deployment* bikin kita merasa aman, karena fitur baru atau perubahan kode divalidasi otomatis sebelum sampai ke fase *production*.
* **Persiapan Kontrak API dan Observabilitas:** Pengalaman ini menjadi bekal buat saya ke depannya. Saya bakal lebih menekankan pentingnya membuat kesepakatan struktur data (*API contract*) di awal proyek, serta menyiapkan sistem *monitoring* aplikasi *frontend* agar *error* lebih cepat terdeteksi.

## Kesimpulan
Menjadi Lead Frontend Developer di proyek *cloud* ini memberikan pengalaman yang tidak sedikit, tapi juga meningkatkan *skill* saya. Berbagai keputusan teknis yang saya ambil, mulai dari menyusun struktur komponen React sampai mengatur cara *user login*, terbukti membuat aplikasinya jadi rapi dan gampang dikembangkan. Walaupun di tengah jalan banyak drama seperti *error* CORS dan pusingnya mengatur *routing* Docker Nginx, proses mengatasi masalah-masalah itu justru bikin saya dapat melakukan *problem solving* dan belajar kerja sama tim dengan lebih baik. 