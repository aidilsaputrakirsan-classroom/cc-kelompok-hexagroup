# ==========================================
# Cloud Computing - Information Systems ITK
# Makefile for Project Management
# ==========================================
.PHONY: help build run stop restart logs ps clean seed \
shell-backend shell-db push pull \
build-backend build-frontend images inspect-backend
inspect-frontend prune \
lint test pr-check
# --- Help Menu ---
help:
@echo "--- Docker Compose Commands ---"
@echo "make build - Build dan jalankan semua
services"
@echo "make run - Jalankan project (detached
mode)"
@echo "make stop - Hentikan project"
@echo "make restart - Restart semua service"
@echo "make logs - Lihat logs semua service"
@echo "make ps - Lihat status container"
@echo "make clean - Hapus container dan volumes
(Data hilang!)"
@echo "make seed - Isi data awal (dummy data)"
@echo ""
@echo "--- Container Access ---"
@echo "make shell-backend - Masuk ke bash backend"
@echo "make shell-db - Masuk ke PostgreSQL terminal"
@echo ""
@echo "--- Docker Image Management ---"
@echo "make build-backend - Build image backend saja"
@echo "make build-frontend - Build image frontend saja"
@echo "make images - Lihat daftar local images"
@echo "make push - Push images ke Registry/Docker
Hub"
@echo "make pull - Pull images dari Registry"
@echo "make prune - Bersihkan dangling images"
@echo ""
@echo "--- CI/CD & Quality Check ---"
@echo "make lint - Jalankan linter (flake8)"
@echo "make test - Jalankan pengujian

(placeholder)"
@echo "make pr-check - Validasi sebelum Pull Request
(Build + Test)"
# --- Core Commands ---
run:
docker compose up -d
build:
docker compose up --build -d
stop:
docker compose stop
down:
docker compose down
restart:
docker compose down
docker compose up -d
clean:
docker compose down -v
docker system prune -f
logs:
docker compose logs -f
ps:
docker compose ps
# --- Access ---
shell-backend:
	docker compose exec auth-service bash

shell-db:
	docker compose exec auth-db psql -U postgres -d auth_db

seed:
	docker compose exec auth-service python scripts/seed_db.py

lint:
	docker compose exec auth-service flake8 .
# --- Image Management ---
build-backend:
docker build -t backend-image ./backend
build-frontend:
docker build -t frontend-image ./frontend

images:
docker images
push:
docker compose push
pull:
docker compose pull
prune:
docker image prune -f
# --- CI/CD & Quality Check (Pembaruan Lead DevOps) ---
lint:
docker compose exec backend flake8 .
test:
@echo "Menjalankan proses pengujian (testing)... (Placeholder)"
pr-check: build test
@echo "Pemeriksaan validasi Pull Request selesai. Kode siap
di-push."