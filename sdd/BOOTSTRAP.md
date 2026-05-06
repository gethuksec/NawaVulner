# Siklus Ask → Eksekusi → Verifikasi → Dokumentasi (sesi bootstrap)

## 1. Ask

Pertanyaan & jawaban dicatat di [DECISIONS.md](./DECISIONS.md) (session DB, routing `/lab/:slug`, stub reset lab, Drizzle, satu origin `:8080`).

## 2. Eksekusi (kode yang dibuat)

- Monorepo `dashboard/api` + `dashboard/frontend`, `docker-compose.yml`, `nginx/nawa-proxy.conf`, `.env.example`, `.gitignore`.
- Skema PostgreSQL: `dashboard/api/db/init.sql`.
- Seed 60 challenge + 2 badge: `src/seed/challenges-data.ts`, `src/seed/seed-if-empty.ts`.
- API: auth (register/login/logout/me), challenges list/detail/flag, lab reset stub, session `connect-pg-simple`, sinkron progress mode `free`.
- UI: landing, login, register, dashboard filter, detail challenge + submit flag.

## 3. Verifikasi

Lihat [VERIFICATION.md](./VERIFICATION.md).

## 4. Dokumentasi

- Root [README.md](../README.md) — cara Docker & dev lokal.
- Task tracker: centang item selesai di [TASKS.md](./TASKS.md) (DEC, X, Fase 0 sebagian).
