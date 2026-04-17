.PHONY: help up run down build push logs ps clean restart logs-backend shell-backend shell-db seed

# Help (semua command yg ada di Makefile)
@echo Available commands:
	@echo make up
	@echo make build
	@echo make down
	@echo make restart
	@echo make logs
	@echo make logs-backend
	@echo make ps
	@echo make shell-backend
	@echo make shell-db
	@echo make seed
	@echo make clean

# Start semua services

# Jalankan tanpa rebuild (jalanin semua containers)
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