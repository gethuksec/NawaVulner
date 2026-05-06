# Keputusan desain — NawaVulner MVP (Fase Ask → disepakati untuk eksekusi)

Dokumen ini mencatat **pertanyaan (Ask)** dan **jawaban yang dipakai** untuk implementasi awal. Ubah di sini bila keputusan berubah, lalu sesuaikan kode.

## Ask — hal yang perlu diputuskan

| ID | Pertanyaan | Dampak jika salah |
|----|------------|-------------------|
| Q1 | Autentikasi platform: session DB vs JWT? | Cookie, revoke sesi, kompleksitas refresh |
| Q2 | Routing lab: path `/lab/:slug` vs subdomain? | Cookie, konfigurasi Nginx |
| Q3 | Reset lab: integrasi Docker vs stub MVP? | Butuh akses socket Docker di host |
| Q4 | ORM / migrasi: Drizzle vs Prisma vs raw? | Pola repo & CI |
| Q5 | Satu entry URL untuk pengguna akhir? | UX & CORS |

## Jawaban (defaults eksekusi awal)

| ID | Keputusan | Alasan singkat |
|----|-----------|----------------|
| Q1 | **Session server-side** (`express-session` + `connect-pg-simple`) | Selaras PRD §6.1 & rekomendasi SDD; revoke mudah; satu origin lewat proxy |
| Q2 | **Path-based** `http://<host>:8080/lab/<slug>/` | Lebih mudah di localhost/LAN; Nginx `nawa-proxy` meroute (stub 503 sampai image challenge ada) |
| Q3 | **Stub API**: `POST .../lab/reset` mencatat audit + mengembalikan sukses; **restart container** dokumentasikan sebagai langkah manual/opsi DEC lanjutan | Menghindari Docker socket di MVP tanpa menunda API kontrak; pesan ke pengguna disederhanakan (segarkan tab lab, tanpa menyebut “stub” di UI) |
| Q4 | **Drizzle ORM** + migrasi SQL di repo (`drizzle-kit generate`) | Type-safe ringan, cocok Express TypeScript |
| Q5 | **`http://localhost:8080`** — hanya `nawa-proxy` yang di-publish ke host; `/` → dashboard statis, `/api` → API | Cookie same-site; satu pintu masuk |

## Yang masih bisa dibuka ulang

- Integrasi reset lab dengan Docker API / sidecar (lihat `sdd/NawaVulner_SDD_v1.0.md` §18).
- JWT jika kebutuhan stateless mobile muncul.

## Tambahan (lanjutan implementasi)

- **Rate limiting:** `express-rate-limit` pada `POST /auth/register`, `POST /auth/login`, serta `POST` flag & lab reset (nilai default bisa di-override env `RATE_LIMIT_*`).
- **Lab pilot:** satu container template + routing Nginx eksplisit; API `GET /challenges/:slug/lab-url` + env `PUBLIC_BASE_URL` / `LAB_DEPLOYED_SLUGS`.
- **Hint & writeup MVP:** tiga level + writeup bilingual (ID/EN) di modul `hints-writeups.ts` sebagai **HTML** (bukan Markdown); respons API `GET .../writeup` memakai field `html`; unlock di `hint_unlocks`; penalti poin saat solve mengikuti `awardPointsForSolve` (hint 2: −25% base, hint 3: −50% base, stack); total poin di `/auth/me` dari `totalAwardedPointsForUser`.
- **Lab per challenge:** `_template` hanya scaffold; **Fase 1:** satu image `challenge-phase1-bundle` melayani 18 slug A01+A02+A05 (Nginx + header `X-Nawa-Lab-Slug`). Referensi tema: `challenges/a01-idor-profil-user/`. Pedoman: `docs/lab-experience.md`; sinopsis ringkas: `challenges/STORIES-phase1.md`.

---

*Dibuat pada bootstrap implementasi Fase 0.*
