# DOCKER CHEATSHEET — SIKASI 

## BUILD & IMAGE

### Masuk ke folder backend 
    cd backend

👉 semua proses docker build ambil dari folder ini

### Build image dari Dockerfile 
    docker build -t sikasi-backend:v1 .

👉 -t = nama image + versi

👉 "." = ambil semua file di folder backend

### Build dengan versi baru (apabila ada update code)
    docker build -t sikasi-backend:v2 .

👉 gunakan versi berbeda untuk keamanan (rollback)

### Lihat semua image
    docker images

👉 mengecek apakah semua image sudah berhasil dibuat dan sudah ada

### Lihat ukuran image tertentu
    docker images sikasi-backend

👉 mengecek size biar tau apakah ukuran efisien atau tidak

### Lihat histori layer image
    docker history sikasi-backend:v1

👉 melihat step Dockerfile (RUN, COPY, dan lain - lain)

### Hapus image
    docker rmi sikasi-backend:v1

👉 tidak bisa dihapus kalau masih dipakai container
