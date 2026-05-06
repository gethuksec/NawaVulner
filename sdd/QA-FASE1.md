# QA — Fase 1 (NawaVulner)

Dokumen ini untuk **uji cepat AFK**: setelah `docker compose up -d --build`, ikuti checklist. Catatan bug di bagian akhir.

## Prasyarat

- Docker Desktop / engine jalan.
- Salin `.env.example` → `.env` (atau minimal `SESSION_SECRET`, `PEPPER_FLAG`, `POSTGRES_PASSWORD`).
- **DB volume lama:** jika `challenge_first_bloods` belum ada, jalankan sekali:

  ```bash
  psql "$DATABASE_URL" -f dashboard/api/db/init-fase1.sql
  ```

  Atau `docker compose down -v` (menghapus data) lalu `up` agar `init.sql` penuh dijalankan ulang.

## 1. Stack & health

| # | Langkah | Yang diharapkan |
|---|---------|------------------|
| 1.1 | `docker compose up -d --build` | Semua service `running` (termasuk `challenge-phase1-bundle`). |
| 1.2 | Buka `http://localhost:8080/api/v1/health` | JSON `status` ok, `db` true. |
| 1.3 | Buka `http://localhost:8080/` | Landing / login dapat diakses. |

## 2. Auth & dashboard

| # | Langkah | Yang diharapkan |
|---|---------|------------------|
| 2.1 | Register user baru | Redirect ke dashboard; daftar challenge terisi. |
| 2.2 | `GET /api/v1/auth/me` (browser sudah login) | `stats.totalPoints`, `stats.badgeCount`, `stats.rankApprox`, catatan rank ID/EN. |
| 2.3 | Dashboard: filter OWASP / difficulty / **status** | Daftar berubah; **URL** berisi query `?category=&difficulty=&status=` (bisa di-refresh). |
| 2.4 | Blok **Progres modul OWASP** | Bar progress per kategori A01–A10. |
| 2.5 | Link **Statistik** (`/stats`) | Ringkasan angka + bar yang sama. |
| 2.6 | Link **Riwayat flag** (`/submissions`) | Tabel submission terbaru. |

## 3. Detail challenge & konten

| # | Langkah | Yang diharapkan |
|---|---------|------------------|
| 3.1 | Buka salah satu challenge A01, A02, atau A05 | Ada blok **Latar (backstory)** + **Studi kasus** (ID + EN). |
| 3.2 | Blok **Hint** di detail challenge | Selalu terlihat: jika challenge **locked**, penjelasan singkat; jika **unlocked/solved**, unlock bertahap + penalti; toggle ID/EN hint. |
| 3.3 | Setelah **solved** | Write-up tersedia; flag submit tidak lagi unlock hint. |

## 4. Lab bundle (18 slug: A01×6 + A02×6 + A05×6)

Proxy memakai **satu** container `challenge-phase1-bundle` + header `X-Nawa-Lab-Slug`.

| # | Langkah | Yang diharapkan |
|---|---------|------------------|
| 4.1 | Buka `http://localhost:8080/lab/a01-idor-profil-user/` | Portal **Sariwangi** (hijau); halaman `profile?id=1` … `5`; bukan 503. |
| 4.2 | `GET .../lab/a01-idor-profil-user/profile?id=` (enumerasi) atau `api/profile?id=` | Pada satu referensi valid, catatan verifikator / `internalNote` berisi flag; id di luar rentang demo → 404. Walkthrough: [`../challenges/phase1-bundle/WALKTHROUGH-a01-idor-profil-user.md`](../challenges/phase1-bundle/WALKTHROUGH-a01-idor-profil-user.md). |
| 4.3 | **Force browse admin:** [`../challenges/phase1-bundle/WALKTHROUGH-a01-force-browse-admin.md`](../challenges/phase1-bundle/WALKTHROUGH-a01-force-browse-admin.md) (nav lab tetap di `/lab/...`). |
| 4.4 | `.../lab/a01-jwt-privilege-escalation/`: login (kredensial di latar platform); cookie `mitabisa_jwt`; tamper `role`→`admin`; buka **admin** / **profil** atau `api/me` | Flag di panel admin / `secret`. Walkthrough: [`../challenges/phase1-bundle/WALKTHROUGH-a01-jwt-privilege-escalation.md`](../challenges/phase1-bundle/WALKTHROUGH-a01-jwt-privilege-escalation.md). |
| 4.5 | `.../lab/a01-ssrf-internal-discovery/` · **LautanLink Sentinel** | `periksa` → `hasil?url=` snapshot; host metadata tiruan; flag di JSON field `lab-bootstrap`. [`WALKTHROUGH-a01-ssrf-internal-discovery.md`](../challenges/phase1-bundle/WALKTHROUGH-a01-ssrf-internal-discovery.md). |
| 4.6 | `.../lab/a01-csrf-cors-chain/` · **NusaOps** | Rantai: `GET api/roster` → `POST email/change` → `POST email/verify` (PIN di log); CORS `*`. [`WALKTHROUGH-a01-csrf-cors-chain.md`](../challenges/phase1-bundle/WALKTHROUGH-a01-csrf-cors-chain.md). |
| 4.7 | `.../lab/a01-mass-assignment-hpe/` · **Helios People** | `POST api/me` dengan field tambahan + `department` IT yang cocok → `bonus` = flag (tanpa popup JSON). [`WALKTHROUGH-a01-mass-assignment-hpe.md`](../challenges/phase1-bundle/WALKTHROUGH-a01-mass-assignment-hpe.md). |
| 4.8 | Uji minimal satu slug **A05**, mis. `a05-sqli-login-bypass/` | Form login; POST dengan payload OR 1=1 mengembalikan flag. |
| 4.9 | `.../lab/a02-default-or-hardcoded-credentials/` | KlinikLogin OEM: view-source (noise vendor + komentar commissioning); `POST login` bootstrap; flag di halaman sukses. [`WALKTHROUGH-a02-default-or-hardcoded-credentials.md`](../challenges/phase1-bundle/WALKTHROUGH-a02-default-or-hardcoded-credentials.md). |
| 4.10 | `.../lab/a02-directory-listing/` | ArsipStatis: log build → parent index `tier2/` → `manifest/` → `staging/_unlisted/SECRETS.flag`. |
| 4.11 | `.../lab/a02-verbose-errors/` | LaporHub: minggu 1–52 sukses; error generik untuk format salah / minggu &lt;1 / &gt;52; flag hanya di `trace` saat indeks minggu sangat besar (batas int32), mis. `?isoWeek=2025-W2147483647`. |
| 4.12 | `.../lab/a02-missing-security-headers/` | EdgeLite: `docs/partner-handbook` → `panel/sensor-grid`; embed same-origin iframe (halaman uji sendiri); payload XOR; token di iframe. |
| 4.13 | `.../lab/a02-cloud-metadata-ssrf/` | VeloraMesh: runbook berisi banyak `tenantKey`; satu kunci valid → `POST api/atlas/session` lalu `GET api/atlas/fetch?url=` ke metadata tiruan; field `lab-bootstrap`. |
| 4.14 | `.../lab/a02-debug-endpoint-leak/` | CargoShip CI: Latar (kredensial) → `POST login` (email+password saja) → dashboard → `POST api/profile` dengan field tambahan (mass assignment) → Whoops; flag di `policy_snapshot.debug_correlation` pada dump request. |
| 4.15 | Slug di luar bundle (mis. slug typo) di `/lab/...` | 503 dari nginx atau 404 dari app. |

Referensi hint tier 1–3 di platform: `dashboard/api/src/content/hints-writeups.ts`. Fallback singkat di `challenges/phase1-bundle/server.mjs` untuk path yang tidak punya halaman khusus.

## 5. Flag, first blood, badge, strict

| # | Langkah | Yang diharapkan |
|---|---------|------------------|
| 5.1 | Submit flag **benar** pertama untuk suatu challenge | Respons JSON `isFirstBlood: true`, `firstBloodBonus` > 0; pesan UI menyebut first blood. |
| 5.2 | User kedua submit flag benar **yang sama** | `isFirstBlood: false`, bonus first blood 0. |
| 5.3 | Setelah solve pertama global | Badge **Langkah Pertama** (jika belum); first blood badge saat memenuhi syarat. |
| 5.4 | `CHALLENGE_UNLOCK_MODE=strict` di `.env`, restart API | User baru: hanya challenge **pertama per kategori OWASP** unlocked; setelah solve, berikutnya di kategori itu terbuka. |
| 5.5 | `POST /api/v1/challenges/:slug/lab/reset` | 200 + pesan singkat (reset dicatat, segarkan tab lab); baris di `lab_resets`. |

## 6. Regresi cepat

- Login / register tidak 502 (Nginx + DNS Docker).
- `/lab/<slug>/` dengan slash akhir — redirect tanpa memutus port host.

## Catatan produk / batasan

- **Ranking** `rankApprox` memakai **jumlah poin base** solved (tanpa penalti hint); total poin di `/me` tetap memakai penalti + first blood.
- Lab bundle **didaktik minimal** (bukan replika aplikasi penuh). Beberapa lab mencetak flag di halaman untuk QA; contoh **force browse** menyembunyikan flag di beranda (lihat walkthrough di `challenges/phase1-bundle/WALKTHROUGH-a01-force-browse-admin.md`).
- **Sinkron flag** lab dengan seed: `challenges/phase1-bundle/server.mjs` harus cocok dengan `dashboard/api/src/seed/challenges-data.ts`.

## Template laporan temuan

```
[Tanggal] Tester:
- Lingkungan: Docker / OS / browser
- Pass: (nomor checklist)
- Fail: (nomor + gejala + log jika ada)
- Saran:
```
