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

#
## MANAGE CONTAINER

### Melihat container yang sedang berjalan
    docker ps

👉 menampilkan container yang sedang aktif saja

### Meihat semua container (aktif & tidak aktif)
    docker ps -a

👉 menampilkan semua container termasuk yang sudah mati

### Melihat log container
    docker logs sikasi-backend

👉 menampilkan catatan aktivitas container untuk debug error

### Melihat log secara real-time
    docker logs -f sikasi-backend

👉 -f (follow) = update terus

👉 monitoring live aplikasi yang sedang berjalan

### Masuk ke dalam container
    docker exec -it sikasi-backend bash

👉 seperti SSH ke container untuk mengecek file di dalam container

### Cek status kesehatan container (healthcheck)
    docker inspect --format='{{.State.Health.Status}}' sikasi-backend

👉 hasil : healthy (normal) / unhealthy (ada masalah)

### Menghentikan container
    docker stop sikasi-backend

👉 menghentikan container dengan aman

### Menjalankan kembali container
    docker start sikasi-backend

👉 menjalankan container yang sebelumnya sudah stop

### Restart container
    docker restart sikasi-backend

👉 stop + start otomatis untuk mereload aplikasi dan apply perubahan config

### Menghapus container
    docker rm sikasi-backend

👉 menghapus container tetapi harus dalam keadaan stop

### Paksa hapus container
    docker rm -f sikasi-backend

👉 langsung stop + hapus (digunakan apabila tidak bisa dihentikan secara normal)

# 
## DOCKER HUB (REGISTRY)

### Login ke Docker Hub
    docker login

👉 digunakan untuk masuk ke akun Docker Hub

### Memberi nama (tag) image sebelum upload
    docker tag sikasi-backend:v1 USERNAME/sikasi-backend:v1

👉 format wajib = username/nama-image (Contoh: docker tag sikasi-backend:v1 indahfortuna/sikasi-backend:v1)

👉 Image lokal = sikasi-backend:v1 -> Diubah jadi : USERNAME/sikasi-backend:v1

### Push image ke Docker Hub
    docker push USERNAME/sikasi-backend:v1

👉 mengirim image dari laptop ke Docker Hub (cloud)

### Pull image dari Docker Hub
    docker pull USERNAME/sikasi-backend:v1

👉 nengambil image dari Docker Hub ke server/laptop lain

### Jalankan langsung dari Docker Hub (Tanpa Build)
    docker run -p 8000:8000 --env-file .env USERNAME/sikasi-backend:v1

👉 tidak perlu docker build lagi, tinggal pull dan akan langsung jalan