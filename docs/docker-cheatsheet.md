# DOCKER CHEATSHEET — SIKASI 

#
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

# 
## RUN CONTAINER

### Jalankan container (foreground / testing)
    docker run -p 8000:8000 --env-file .env sikasi-backend:v1

👉 docker run = menjalankan image jadi container

👉 -p 8000:8000 = mapping port (8000 kiri = port di laptop/server & 8000 kanan = port di dalam container)

👉 --env-file .env =  ambil semua environment variable dari file .env

👉 sikasi-backend:v1 = image yang dijalankan

👉 log langsung tampil di terminal

### Jalankan container di background
    docker run -d -p 8000:8000 --env-file .env --name sikasi-backend sikasi-backend:v1

👉 -d (detached mode) = jalan di background

👉 --name = kasih nama container biar gampang diakses

### Jalankan dengan environment variable manual
    docker run -d -p 8000:8000 \
    -e DATABASE_URL=postgresql://postgres:password@host.docker.internal:5432/sikasi_db \
    -e SECRET_KEY=your-secret-key \
    --name sikasi-backend \
    sikasi-backend:v1

👉 -e =  set environment variable satu per satu (bisa dipakai jika tidak memakai .env)

👉 host.docker.internal = akses database di komputer host

