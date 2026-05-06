# NawaVulner

Platform latihan keamanan web **self-hosted** (OWASP Top 10:2025) — dokumentasi produk: [prd/NawaVulner_PRD_v1.0.md](./prd/NawaVulner_PRD_v1.0.md), arsitektur & SDD: [sdd/NawaVulner_SDD_v1.0.md](./sdd/NawaVulner_SDD_v1.0.md).

---

## Deploy cepat (Docker Compose)

**Satu perintah** setelah clone (default env sudah di `docker-compose.yml`; cukup untuk coba lokal):

```powershell
docker compose up -d --build
```

Buka **http://localhost:8080** — Nginx mem-proxy dashboard SPA, API `/api`, dan lab **`/lab/<slug>/`** ke bundle Fase 1.

**Produksi / kelas:** salin env lalu ubah secret:

```powershell
Copy-Item .env.example .env
# Edit .env — wajib kuat: SESSION_SECRET, PEPPER_FLAG, POSTGRES_PASSWORD
docker compose up -d --build
```

| Variabel penting | Catatan |
|------------------|---------|
| `PUBLIC_PORT` | Port host (default **8080**). |
| `PUBLIC_BASE_URL` | Harus cocok dengan URL yang dipakai browser (mis. `http://localhost:8080`); dipakai API untuk link “Buka lab”. |
| `LAB_DEPLOYED_SLUGS` | Daftar slug yang dianggap “lab hidup”; default 18 challenge Fase 1 (sama `.env.example` / Compose). |

**Reset database penuh** (hapus volume Postgres): `docker compose down -v` lalu `up` lagi.

---

## Daftar perintah (cheat sheet)

| Perintah | Keterangan |
|----------|------------|
| `docker compose up -d --build` | Build image + jalankan stack di background. |
| `docker compose ps` | Status container. |
| `docker compose logs -f nawa-api` | Log API (ganti service: `nawa-proxy`, `nawa-db`, `challenge-phase1-bundle`). |
| `docker compose restart nawa-proxy` | Setelah ubah `nginx/nawa-proxy.conf` atau bila proxy “stale” ke upstream. |
| `docker compose down` | Stop & hapus container (volume DB **tetap**). |
| `docker compose down -v` | Stop + hapus volume (**data Postgres hilang**). |
| `curl http://localhost:8080/api/v1/health` | Cek API lewat proxy (sesuaikan port jika `PUBLIC_PORT` diubah). |

**Bash / macOS / Linux** — sama, ganti `Copy-Item` dengan `cp .env.example .env`.

**Dev API hot-reload di Compose:** salin `docker-compose.override.example.yml` → `docker-compose.override.yml` (file ini di-ignore Git).

**Stack ringan (hanya DB + API):** `docker compose -f docker-compose.lite.yml up -d --build` — lihat file tersebut untuk port `API_PORT`.

**Makefile** (perlu `make`): `make help`, `make build`, `make test`, `make lint` — lihat [Makefile](./Makefile).

---

## Struktur repo

| Path | Isi |
|------|-----|
| `dashboard/frontend` | React + Vite + Tailwind (SPA) |
| `dashboard/api` | Express + TypeScript + Drizzle + PostgreSQL |
| `nginx/nawa-proxy.conf` | Reverse proxy: `/`, `/api`, `/lab/` |
| `challenges/phase1-bundle` | Satu image Node melayani semua lab Fase 1 (`/lab/<slug>/`) |
| `sdd/` | Task, QA, verifikasi |
| `CONTRIBUTING.md` | Cabang, PR, konvensi |

Lab runtime memakai **`challenge-phase1-bundle`**; folder `challenges/a01-*` lain bisa jadi referensi tema. QA Fase 1: [sdd/QA-FASE1.md](./sdd/QA-FASE1.md). Pedoman UX lab: [docs/lab-experience.md](./docs/lab-experience.md).

---

## Pengembangan lokal (tanpa full stack Docker)

1. Postgres 15 + jalankan `dashboard/api/db/init.sql` sekali pada DB kosong.
2. API: `cd dashboard/api` → set `DATABASE_URL`, `SESSION_SECRET`, `PEPPER_FLAG`, `CHALLENGE_UNLOCK_MODE` → `npm install` → `npm run dev`.
3. Frontend: `cd dashboard/frontend` → `npm install` → `npm run dev` → biasanya **http://localhost:5173** (Vite mem-proxy `/api`; untuk `/lab` dari UI dev biasanya perlu proxy/jalankan stack lab).

Set `PUBLIC_BASE_URL` di API agar link lab absolut benar (mis. `http://localhost:8080` jika lab lewat Compose).

---

## Verifikasi build (lokal / CI)

```powershell
cd dashboard\api; npm install; npm run test; npm run build
cd ..\frontend; npm install; npm run build
```

Detail: [sdd/VERIFICATION.md](./sdd/VERIFICATION.md). Kontribusi: [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## Troubleshooting singkat

- **502 di login/register:** upstream API berganti IP — `docker compose restart nawa-proxy`. Penjelasan: komentar di `nginx/nawa-proxy.conf` (resolver Docker + `proxy_pass` via variabel).
- **`docker compose build` TLS timeout ke Docker Hub:** ulangi build, atau set `NODE_IMAGE=node:20-bookworm-slim` di `.env` lalu build ulang.

---

## Push ke GitHub (ringkas)

Jika folder **belum** punya Git: `git init` dulu. Lalu:

```powershell
git remote add origin https://github.com/ORG/REPO.git
git add .
git status
git commit -m "Initial commit: NawaVulner"
git branch -M main
git push -u origin main
```

Sesuaikan URL remote SSH/HTTPS. Pastikan `.env` dan `node_modules/` tidak ikut commit (sudah di `.gitignore`).

---

## Legal

NawaVulner untuk **edukasi** pada sistem yang Anda kuasai atau punya izin. Lihat disclaimer di PRD §13.1.
