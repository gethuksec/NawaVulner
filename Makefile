.PHONY: help build test lint dev-api dev-fe migrate-hint

help:
	@echo "NawaVulner — target umum"
	@echo "  make build     — build API (tsc) + frontend (vite)"
	@echo "  make test      — tes API (verify flag)"
	@echo "  make lint      — typecheck API (noEmit)"
	@echo "  make dev-api   — jalankan API dev (host, perlu DATABASE_URL)"
	@echo "  make dev-fe    — jalankan Vite dev (host)"
	@echo "  make migrate-hint — cetak cara apply init.sql / init-fase1.sql"

build:
	cd dashboard/api && npm run build
	cd dashboard/frontend && npm run build

test:
	cd dashboard/api && npm run test

lint:
	cd dashboard/api && npm run typecheck

dev-api:
	cd dashboard/api && npm run dev

dev-fe:
	cd dashboard/frontend && npm run dev

migrate-hint:
	@echo "DB baru (volume kosong): init.sql otomatis dari container Postgres."
	@echo "DB lama + kolom/tabel baru: psql \"$$DATABASE_URL\" -f dashboard/api/db/init-fase1.sql"
