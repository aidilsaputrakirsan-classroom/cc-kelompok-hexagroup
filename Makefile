.PHONY: help build run stop restart logs ps clean seed \
shell-backend shell-db push pull \
build-backend build-frontend images inspect-backend inspect-frontend prune

# Help (semua command yg ada di Makefile)
# Docker Compose
help:
	@echo make build            - Build semua services
	@echo make run              - Jalankan project
	@echo make stop             - Stop project
	@echo make restart          - Restart project
	@echo make logs             - Logs semua service
	@echo make ps               - Status container
	@echo make clean            - Hapus container
	@echo make seed          	- Isi data awal

# Container Access
	@echo make shell-backend    - Masuk backend container
	@echo make shell-db         - Masuk PostgreSQL

# Docker Image
	@echo make build-backend    - Build image backend
	@echo make build-frontend   - Build image frontend
	@echo make images           - Lihat semua images
	@echo make inspect-backend  - Detail image backend
	@echo make inspect-frontend - Detail image frontend
	@echo make push             - Push images ke Docker Hub
	@echo make pull             - Pull images dari Docker Hub
	@echo make prune            - Hapus dangling images

# Start semua services
run/up:
	docker compose up -d

# mengirim docker image ke docker hubnya
push:
	docker compose push

# Start dengan rebuild
build:
	docker compose up --build -d

# Stop & remove containers
down:
	docker compose down

# Stop, remove, DAN hapus volumes (data hilang!)
clean:
	docker compose down -v
	docker system prune -f

# Restart semua
restart:
	docker compose down
	docker compose up -d

# Lihat logs (semua services)
logs:
	docker compose logs -f

# Lihat logs backend saja
logs-backend:
	docker compose logs -f backend

# Lihat status
ps:
	docker compose ps

# Masuk ke backend shell
shell-backend:
	docker compose exec backend bash

# Masuk ke database
shell-db:
	docker compose exec db psql -U postgres -d sikasiapp

# Isi data awal (dummy)
seed:
	docker compose exec backend python scripts/seed_db.py

# Dockerfile
build-backend:
	docker build -t $(BACKEND_IMAGE) ./backend

build-frontend:
	docker build -t $(FRONTEND_IMAGE) ./frontend

images:
	docker images

inspect-backend:
	docker inspect $(BACKEND_IMAGE)

inspect-frontend:
	docker inspect $(FRONTEND_IMAGE)

push:
	docker push $(BACKEND_IMAGE)
	docker push $(FRONTEND_IMAGE)

pull:
	docker pull $(BACKEND_IMAGE)
	docker pull $(FRONTEND_IMAGE)

prune:
	docker image prune -f