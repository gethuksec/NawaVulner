# Verifikasi — bootstrap Fase 0 (NawaVulner)

Dokumen ini mencatat **bukti verifikasi** setelah siklus Ask → Eksekusi (lihat [BOOTSTRAP.md](./BOOTSTRAP.md)).

## Lingkungan uji

| Alat | Hasil |
|------|--------|
| Node.js | ≥ 20 (disarankan) |
| Docker Compose | `docker compose config` **OK** (2026-05-06) |
| `docker compose build` | **Tidak dijalankan** — daemon Docker tidak tersedia di mesin CI lokal (`dockerDesktopLinuxEngine` tidak ditemukan). Jalankan manual saat Docker Desktop aktif. |

## Build statis (lokal, sukses)

| Perintah | Exit code |
|----------|-------------|
| `dashboard/api`: `npm install` + `npm run build` (`tsc`) | 0 |
| `dashboard/frontend`: `npm install` + `npm run build` (`vite build`) | 0 |

## Uji fungsional manual (setelah `docker compose up` atau DB + API dev)

- [ ] `GET http://localhost:8080/api/v1/health` mengembalikan JSON `{ "status": "ok", "db": true }`.
- [ ] `GET http://localhost:8080/lab/a01-idor-profil-user/` (setelah `docker compose up`) menampilkan halaman lab bundle (bukan 503).
- [ ] `GET http://localhost:8080/lab/a05-sqli-login-bypass/` menampilkan form login lab.
- [ ] `GET /api/v1/challenges/progress/modules` dan `GET /api/v1/challenges/me/submissions` (dengan sesi) mengembalikan JSON.
- [ ] `GET /api/v1/challenges/a01-idor-profil-user/lab-url` (dengan cookie sesi) mengembalikan `containerReady: true` dan `url` mengarah ke proxy.
- [ ] Registrasi pengguna baru di UI → redirect dashboard.
- [ ] `GET /api/v1/challenges` mengembalikan **60** entri.
- [ ] Submit flag benar untuk satu challenge (contoh `a01-idor-profil-user`: `FLAG{idor_basic_1}`) → status `solved`, poin bertambah di `/api/v1/auth/me` (total memperhitungkan penalti hint jika hint 2/3 pernah dibuka).
- [ ] `GET /api/v1/challenges/:slug/hints` (sesi, challenge tidak `locked`) → daftar level + `nextUnlockableLevel`.
- [ ] `POST /api/v1/challenges/:slug/hints/1` → 201; `GET .../writeup` sebelum solve → 403; setelah solve → 200 + body JSON berisi `html` (bukan Markdown).
- [ ] `POST /api/v1/challenges/:slug/lab/reset` mengembalikan pesan stub + baris di tabel `lab_resets`.

## Keamanan cepat

- Secret tidak di-hardcode di kode; gunakan `.env` / Compose environment.
- `npm audit` pada `dashboard/api` melaporkan temuan dari rantai dependensi dev (`drizzle-kit` / `esbuild`); tinjau sebelum rilis produksi.
