# Reset lab (Fase 1) — batasan MVP

Sesuai **DEC-003** / `sdd/DECISIONS.md`, endpoint `POST /api/v1/challenges/:slug/lab/reset` hanya:

1. Mencatat audit ke tabel `lab_resets`.
2. Mengembalikan JSON sukses dengan pesan bahwa **restart container** dilakukan di luar API.

## Yang dilakukan operator / instruktur

- `docker compose restart challenge-phase1-bundle` — memuat ulang proses Node (state in-memory lab, mis. komentar XSS, direset).
- Untuk reset penuh data platform: gunakan alur backup/restore DB terpisah (bukan scope endpoint ini).

## Rujukan

- `nginx/nawa-proxy.conf` — routing `/lab/(a01-|a02-|a05-).../` ke bundle.
- `challenges/phase1-bundle/server.mjs` — state volatil per proses.
