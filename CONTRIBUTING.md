# Kontribusi — NawaVulner

## Cabang & PR

- Gunakan cabang fitur: `feat/<ringkas>`, `fix/<ringkas>`, atau `chore/<ringkas>`.
- Satu PR fokus satu topik; deskripsi dalam kalimat lengkap (bukan hanya judul commit).
- Sebelum PR: `make build` atau setara (`dashboard/api` + `dashboard/frontend` build hijau, `npm run test` di API).

## Lab & Docker

- Perubahan routing lab: selaraskan `nginx/nawa-proxy.conf`, `docker-compose.yml`, dan default `LAB_DEPLOYED_SLUGS`.
- Ikuti checklist di `challenges/README.md` (X-011).

## Konvensi kode

- TypeScript ketat; hindari `any` kecuali terisolasi.
- Respons error API: `{ "error": { "code", "message", "requestId", ... } }` — `requestId` diisi middleware.
