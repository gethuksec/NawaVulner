# NawaVulner — Task Tracker (Implementasi MVP)

Dokumen ini adalah **backlog tugas terstruktur** untuk melacak implementasi sesuai [NawaVulner_SDD_v1.0.md](./NawaVulner_SDD_v1.0.md) dan [prd/NawaVulner_PRD_v1.0.md](../prd/NawaVulner_PRD_v1.0.md).

## Cara memakai

- Centang `- [x]` saat selesai; biarkan `- [ ]` untuk belum / sedang berjalan.
- **ID** dipakai untuk commit message, issue tracker, atau PR: `TASK-PLAT-AUTH-001`.
- Urutan **fase** mengikuti roadmap PRD §12; dalam satu fase, beberapa epic bisa paralel jika dependensi jelas.
- **Blokir** = task lain tidak boleh selesai tanpa ini.

### Legenda prioritas (opsional)

| Tag | Arti |
|-----|------|
| `P0` | Blokir MVP |
| `P1` | Penting untuk UX/kredibilitas rilis |
| `P2` | Bisa dipangkas jika deadline ketat |

### Ringkasan status tag `P0` (jawaban singkat: **belum semua**)

| Lingkup | Apa artinya | Di repo sekarang |
|---------|-------------|-------------------|
| **P0 modul challenge** (CH-* di P1-G, P1-H, P2–P4, dst.) | Setiap judul PRD punya **app lab vulnerable + flag** yang bisa diselesaikan | **Fase 1 A01+A02+A05:** selesai lewat `challenge-phase1-bundle` (18 slug). Modul OWASP lain di metadata seed masih **tanpa** lab bundle per judul sampai iterasi berikutnya. |
| **P0 fondasi platform Fase 0** (F0-A … F0-D) | Compose, DB, API, proxy, lab URL | **Selesai** — lihat tabel Fase 0; F0-E (kerangka dashboard) terpenuhi oleh implementasi dashboard saat ini. |
| **P0 fitur platform Fase 1** (P1-A … P1-C) | List, detail, lab link, flag, hints/writeup | **Selesai** termasuk first blood & filter URL; lab 18 slug lewat bundle. |
| **P0 rilis & hardening Fase 5** (P5-B, P5-D, P5-E) | Keamanan produksi, QA penuh, artefak rilis | **Belum** |

**Kesimpulan:** tag `P0` di dokumen ini mencakup **seluruh roadmap PRD**; yang sudah “hijau” hanya **subset platform + pilot**. Centang per baris di bawah adalah sumber kebenaran.

### Status bootstrap terakhir

**2026-05-06:** Fondasi awal di repo — DEC terpenuhi (lihat [DECISIONS.md](./DECISIONS.md)), Compose + Nginx + API + frontend + seed 60 challenge + CI build. **Fase 0:** override dev (`docker-compose.override.example.yml` + `Dockerfile.dev`), profil `docker-compose.lite.yml`, middleware `requestId` + injeksi `error.requestId`, skrip tes verify flag (`npm run test` di API), CONTRIBUTING + Makefile. **Fase 1 (2026):** bundle lab 18 slug A01+A02+A05 (`challenge-phase1-bundle`), first blood + badge engine + mode `strict`, dashboard filter URL, `/stats`, `/submissions`, narasi detail — **QA:** [QA-FASE1.md](./QA-FASE1.md). **Arah produk:** variasi tema & studi kasus — X-009–X-011 & **P1-J**. Bukti build: [VERIFICATION.md](./VERIFICATION.md). **P0:** lihat **Ringkasan status tag `P0`** — modul CH di **fase berikutnya** masih backlog.

---

## 0. Prasyarat & keputusan desain (blokir)

> Selesaikan lebih dulu agar implementasi tidak bolak-balik.

| ID | Task | Output / kriteria selesai | Status |
|----|------|---------------------------|--------|
| DEC-001 | Putuskan model autentikasi platform (session server-side vs JWT+cookie) dan dokumentasikan di SDD/ADR | ADR singkat + satu implementasi konsisten di API | [x] |
| DEC-002 | Putuskan pola routing lab: path `/lab/:slug` vs subdomain; catat dampak cookie `SameSite` | Keputusan tertulis + contoh URL di README | [x] |
| DEC-003 | Putuskan mekanisme **reset lab**: Docker socket dari API vs sidecar service vs `docker compose run` wrapper | Spike POC + risiko keamanan host didokumentasikan | [x] |
| DEC-004 | Putuskan tooling migrasi DB (Prisma / Drizzle / node-pg-migrate / raw SQL) | Repo punya skema awal + perintah migrate di dokumentasi | [x] |
| DEC-005 | Standarisasi internal port & healthcheck challenge (`GET /health` JSON) | Template Dockerfile + contoh `nginx` upstream | [x] |

---

## Epic cross-cutting — standar & template

| ID | Task | Output / kriteria selesai | Status |
|----|------|---------------------------|--------|
| X-001 | Struktur monorepo sesuai PRD §9.2 (`dashboard/frontend`, `dashboard/api`, `challenges/*`) | Folder ada + README root menjelaskan layout | [x] |
| X-002 | `docker-compose.yml` minimal: `nawa-db`, `nawa-api`, `nawa-dashboard`, `nawa-proxy` | `docker compose up` jalan; healthcheck service | [x] |
| X-003 | `.env.example` lengkap (lihat SDD §13 + secret dev) | Semua variabel wajib terdokumentasi | [x] |
| X-004 | Template challenge: Dockerfile, app skeleton, `FLAG{...}` dev, `/health` | `challenges/_template` atau dokumentasi "scaffold" | [x] |
| X-005 | Konvensi penamaan service Docker = slug challenge | Tabel mapping di `docs/` atau seed DB | [x] |
| X-006 | Skrip atau target Makefile: `migrate`, `seed`, `dev`, `lint`, `test` | README mencantumkan perintah | [x] |
| X-007 | CI dasar (GitHub Actions / setara): lint + test API + build frontend | Pipeline hijau pada branch default | [x] |
| X-008 | Kebijakan penamaan branch & PR (opsional tim) | CONTRIBUTING.md ringkas | [x] |
| X-009 | **Variasi lab:** tiap challenge lab punya tema visual & nada copy yang berbeda (bukan satu tampilan template generik untuk semua) | [`docs/lab-experience.md`](../docs/lab-experience.md) + 2 persona referensi & pilot A01 | [x] |
| X-010 | **Studi kasus dunia nyata (fiksi/anonim):** narasi konteks per lab (siapa pengguna, apa yang “salah”) | `STORY.md` pilot + pola untuk slug berikut | [x] |
| X-011 | **Checklist PR lab:** fungsi vulnerable & `/health` tetap; UI/narasi tidak copy-paste `challenges/_template` apa adanya | Checklist di `challenges/README.md` | [x] |

---

## Fase 0 — Fondasi infrastuktur (PRD: Minggu 1–2)

### Epic F0-A — Docker & jaringan `P0`

| ID | Task | Output / kriteria selesai | Status |
|----|------|---------------------------|--------|
| F0-A-001 | Definisikan Docker network(s): bridge default + kebijakan akses antar-service | `docker-compose.yml` + `depends_on`; satu origin via `nawa-proxy` (README) | [x] |
| F0-A-002 | Service `nawa-db`: PostgreSQL 15, volume persisten, user non-superuser app | Compose + `init.sql`; API connect | [x] |
| F0-A-003 | Service `nawa-api`: image build dari source, env `DATABASE_URL`, wait-for-db | `GET /api/v1/health` + `depends_on` DB healthy | [x] |
| F0-A-004 | Service `nawa-dashboard`: build statis atau dev server; env `VITE_API_URL` | Image frontend + proxy `/` | [x] |
| F0-A-005 | Service `nawa-proxy`: Nginx route ke dashboard + prefix API (dev) | `nginx/nawa-proxy.conf`; cookie same-origin | [x] |
| F0-A-006 | `docker-compose.override.yml` untuk dev (hot reload, volume mount) | `docker-compose.override.example.yml` + `dashboard/api/Dockerfile.dev`; README | [x] |
| F0-A-007 | Profil opsional `docker-compose.lite.yml` (subset modul — PRD §13) | `docker-compose.lite.yml` + README | [x] |

### Epic F0-B — Skema database & seed metadata `P0`

| ID | Task | Output / kriteria selesai | Status |
|----|------|---------------------------|--------|
| F0-B-001 | Migrasi: tabel `users` (username, email, password_hash, locale, timestamps) | `dashboard/api/db/init.sql` + Drizzle | [x] |
| F0-B-002 | Migrasi: tabel `challenges` (slug, owasp_category, difficulty, points_base, docker_service, proxy_path, flag_hash, order, title_id, title_en, …) | 60 baris seed (`seed-if-empty` + `challenges-data.ts`) | [x] |
| F0-B-003 | Migrasi: `user_challenge_progress` (status, unlocked_at, solved_at) | PK + constraint status | [x] |
| F0-B-004 | Migrasi: `flag_submissions` (audit trail) | Index user/challenge + waktu | [x] |
| F0-B-005 | Migrasi: `hint_unlocks` | Level 1–3 + timestamp | [x] |
| F0-B-006 | Migrasi: `badges`, `user_badges` | Tabel + seed minimal (`first_step`, `owasp_master`) | [x] |
| F0-B-007 | Migrasi: `writeups` atau penyimpanan terenkripsi (opsional MVP) | Tabel `writeups` ada; konten writeup lab MVP lewat API kode (`hints-writeups.ts`) | [x] |
| F0-B-008 | Seed: semua slug & metadata 60 challenge (judul bisa placeholder) | API `GET /challenges` mengembalikan 60 entri setelah seed | [x] |
| F0-B-009 | Hash flag: fungsi verify dengan pepper env (Argon2id/bcrypt) | bcrypt + verify di API; `npm run test` (`src/test/run-flag-verify.ts`) | [x] |

### Epic F0-C — API inti (kerangka) `P0`

| ID | Task | Output / kriteria selesai | Status |
|----|------|---------------------------|--------|
| F0-C-001 | Middleware: `requestId`, JSON error shape SDD §9 | `request-context.ts`: header `X-Request-Id`, injeksi `error.requestId` pada `res.json` | [x] |
| F0-C-002 | `POST /api/v1/auth/register` — validasi email/username/password policy | 201 + user tidak expose hash | [x] |
| F0-C-003 | `POST /api/v1/auth/login` — sesuai DEC-001 | Session PG + cookie | [x] |
| F0-C-004 | `POST /api/v1/auth/logout` | Sesi invalid | [x] |
| F0-C-005 | `GET /api/v1/auth/me` | Profil + solved count + total poin (dengan penalti hint) | [x] |
| F0-C-006 | Middleware auth untuk route terproteksi | 401 jika belum login | [x] |
| F0-C-007 | Rate limit: register, login, flag submit (nominal) | `express-rate-limit` + env | [x] |

### Epic F0-D — Proxy routing challenge `P0`

| ID | Task | Output / kriteria selesai | Status |
|----|------|---------------------------|--------|
| F0-D-001 | Nginx template upstream dinamis atau include per-service | Blok `location` pilot + variabel upstream (DNS Docker) | [x] |
| F0-D-002 | Header proxy aman (`X-Forwarded-*`) dokumentasi | `proxy_set_header` di `nawa-proxy.conf` + README satu origin | [x] |
| F0-D-003 | `GET /api/v1/challenges/:slug/lab-url` (opsional signed TTL) | Respons JSON `url`/`path` (+ signed TTL belum) | [x] |

### Epic F0-E — Dashboard kerangka `P1`

| ID | Task | Output / kriteria selesai | Status |
|----|------|---------------------------|--------|
| F0-E-001 | Setup React+Vite+Tailwind; tema warna PRD §11.1 | `dashboard/frontend` (Tailwind + tema) | [x] |
| F0-E-002 | Router: landing, login, register, dashboard shell | React Router di frontend | [x] |
| F0-E-003 | Client API wrapper (fetch/axios) + handling error | modul API client + pesan error di UI | [x] |
| F0-E-004 | Halaman placeholder profil & challenge list | Protected route + daftar challenge / profil | [x] |

**Gate Fase 0:** compose up → register/login → lihat daftar challenge (kosong boleh) → health OK.

---

## Fase 1 — Modul A01 + A02 + A05 + fitur platform lab (PRD: Minggu 3–6)

### Epic P1-A — Challenge list, detail, filter (PRD §6.2) `P0`

| ID | Task | Output / kriteria selesai | Status |
|----|------|---------------------------|--------|
| P1-A-001 | `GET /api/v1/challenges` — filter category, difficulty, status, search `q` | Filter server-side; **pagination belum** | [x] |
| P1-A-002 | `GET /api/v1/challenges/:slug` — detail + status user | Locked/unlocked/solved | [x] |
| P1-A-003 | Dashboard: grid/list card (nama, kategori, difficulty, poin, status) | Grid responsif + filter OWASP/difficulty | [x] |
| P1-A-004 | Sidebar filter: OWASP, difficulty, status | Filter + **sync URL query** (`useSearchParams`); status ke API | [x] |
| P1-A-005 | Tombol "Start Lab" → buka URL lab (tab baru) | Halaman detail + `Buka lab` | [x] |

### Epic P1-B — Flag submission & scoring (PRD §6.4, SDD §10.1) `P0`

| ID | Task | Output / kriteria selesai | Status |
|----|------|---------------------------|--------|
| P1-B-001 | `POST /api/v1/challenges/:slug/flags` — validasi benar/salah | Persist submission + update progress | [x] |
| P1-B-002 | Hitung poin: base Easy/Medium/Hard | `points_base` per seed + penalti hint saat solve | [x] |
| P1-B-003 | Hint penalty pada solve (hint 2: −25%, hint 3: −50% dari base) | Logika di API + `/auth/me`; unit test skenario belum | [x] |
| P1-B-004 | First blood (sesuai `FIRST_BLOOD_SCOPE`) | Tabel `challenge_first_bloods` + bonus env `FIRST_BLOOD_BONUS_POINTS`; scope per-challenge | [x] |
| P1-B-005 | UI submit flag + feedback langsung | Form label + pesan hasil | [x] |

### Epic P1-C — Hints & writeup solve-gated (PRD §6.5) `P0`

| ID | Task | Output / kriteria selesai | Status |
|----|------|---------------------------|--------|
| P1-C-001 | `GET .../hints` + `POST .../hints/:level` — unlock bertahap | Baris `hint_unlocks`; penalti saat flag | [x] |
| P1-C-002 | `GET .../writeup` — 403 sampai solved; bilingual `?lang=` | Konten placeholder (`hints-writeups.ts`) | [x] |
| P1-C-003 | UI hint + writeup (konfirmasi unlock; konten HTML dari API, render `dangerouslySetInnerHTML`) | PRD §11.4 | [x] |

### Epic P1-D — Progress & profil (PRD §6.6) `P1`

| ID | Task | Output / kriteria selesai | Status |
|----|------|---------------------------|--------|
| P1-D-001 | Progress bar per modul OWASP | `GET /challenges/progress/modules` + bar di dashboard & `/stats` | [x] |
| P1-D-002 | Halaman statistik: total poin, rank, solved count | `/stats` + `/auth/me` (`rankApprox`, catatan) | [x] |
| P1-D-003 | Riwayat submission | `GET /challenges/me/submissions` + halaman `/submissions` | [x] |

### Epic P1-E — Unlock mode & reset lab (PRD §6.7, §10.3) `P1`

| ID | Task | Output / kriteria selesai | Status |
|----|------|---------------------------|--------|
| P1-E-001 | `CHALLENGE_UNLOCK_MODE=strict|free` — evaluasi di API | `progress-sync` + rantai unlock per kategori; unit test dedikasi belum | [x] |
| P1-E-002 | `POST .../lab/reset` — idempotent | Log audit + rate limit | [x] |
| P1-E-003 | Integrasi DEC-003 (restart/reseed challenge) | [`P1-LAB-RESET.md`](./P1-LAB-RESET.md) | [x] |

### Epic P1-F — Badge system (PRD §10.2) `P2`

| ID | Task | Output / kriteria selesai | Status |
|----|------|---------------------------|--------|
| P1-F-001 | Engine evaluasi rule badge (JSON atau kode) | 3 badge (`first_step`, `owasp_master`, `first_blood`) + `evaluateBadgesForUser` | [x] |
| P1-F-002 | Notifikasi UI saat badge earned | Teks di respons flag + `/auth/me` badgeCount | [x] |

### Epic P1-G — Modul **A01** Broken Access Control (6 challenge) `P0`

> **Catatan:** lab vulnerable **bundle** Fase 1 (`challenge-phase1-bundle`) — didaktik ringkas; flag tercetak di beberapa halaman untuk mempercepat QA.
>
> **Progres persona (2026):** keenam lab A01 memiliki persona UI di bundle — lihat [`STORIES-phase1.md`](../challenges/STORIES-phase1.md).

| ID | Challenge PRD §7.1 | Kriteria selesai (definisi done) | Status |
|----|----------------------|----------------------------------|--------|
| CH-A01-E1 | IDOR — Akses Profil User Lain | Route lab + flag di platform | [x] |
| CH-A01-E2 | Force Browsing ke Admin Panel | Idem | [x] |
| CH-A01-M1 | JWT Privilege Escalation | Idem | [x] |
| CH-A01-M2 | SSRF — Internal Service Discovery | Idem | [x] |
| CH-A01-H1 | CSRF + CORS Bypass Chain | Idem | [x] |
| CH-A01-H2 | Mass Assignment + Horizontal Priv Esc | Idem | [x] |

### Epic P1-H — Modul **A05** Injection (6 challenge) `P0`

> **Catatan:** bundle Fase 1 — skenario ringkas per judul.

| ID | Challenge PRD §7.5 | Kriteria selesai | Status |
|----|---------------------|-------------------|--------|
| CH-A05-E1 | Classic SQL Injection Login Bypass | App + flag | [x] |
| CH-A05-E2 | Reflected XSS | App + flag | [x] |
| CH-A05-M1 | Union-Based SQL Injection | App + flag | [x] |
| CH-A05-M2 | Stored XSS + Cookie Stealing | App + flag | [x] |
| CH-A05-H1 | Blind SQLi (Time-Based) | App + flag | [x] |
| CH-A05-H2 | SSTI (Jinja2/Twig) RCE | App + flag | [x] |

### Epic P1-I — Konten & i18n untuk lab bundle Fase 1 `P1`

| ID | Task | Output / kriteria selesai | Status |
|----|------|---------------------------|--------|
| P1-I-001 | Backstory landing per challenge (ID+EN) | `challenge-narrative.ts` + field di `GET .../challenges/:slug` | [x] |
| P1-I-002 | Hint 3 level per challenge yang punya lab di bundle (A01+A02+A05) | `hints-writeups.ts` (slug berlab punya tier; lainnya fallback MVP) | [x] |
| P1-I-003 | Writeup solve-gated per challenge berlab (ID+EN) | HTML di `hints-writeups.ts`, field API `html` | [x] |
| P1-I-004 | Ringkasan studi kasus (ID+EN) di metadata dashboard / halaman detail | `caseSummaryId/En` di detail + [`STORIES-phase1.md`](../challenges/STORIES-phase1.md) | [x] |

### Epic P1-J — Lab-app: tema, studi kasus & variasi UX `P1`

| ID | Task | Output / kriteria selesai | Status |
|----|------|---------------------------|--------|
| P1-J-001 | Dokumen pedoman pengalaman lab (persona/industri, palet, tone UI) | [`docs/lab-experience.md`](../docs/lab-experience.md); dirujuk saat review PR challenge | [x] |
| P1-J-002 | Pilot `a01-idor-profil-user`: ganti lab dari placeholder template → **satu** studi kasus konkret + tampilan beda (warna/layout/copy) | Image dari `challenges/a01-idor-profil-user/`; `STORY.md` + UI terang pemerintahan fiksi | [x] |
| P1-J-003 | Backlog persona + sinopsis studi kasus per slug **A01+A02+A05** (18 lab) | [`STORIES-phase1.md`](../challenges/STORIES-phase1.md) + narasi API per slug | [x] |
| P1-J-004 | Saat modul Fase 2+ ditambahkan, terapkan pola yang sama (tema unik per slug, bukan duplikat visual) | P2-D-003 / P3-D-003 / P4-C-002 mengacu X-009 | [x] |

**Gate Fase 1:** user dapat menyelesaikan **semua** 6 A01 + 6 A02 + 6 A05 via lab bundle + flag di platform — lihat [`QA-FASE1.md`](./QA-FASE1.md).

---

## Fase 2 — A02 + A04 + A07 (PRD: Minggu 7–10)

### Epic P2-A — Modul **A02** Security Misconfiguration (6) `P0`

| ID | Challenge PRD §7.2 | Kriteria selesai | Status |
|----|-------------------|------------------|--------|
| CH-A02-E1 | Default Credentials Discovery | App + flag di `phase1-bundle` | [x] |
| CH-A02-E2 | Directory Listing Exposed | App + flag di `phase1-bundle` | [x] |
| CH-A02-M1 | Verbose Error Message Exploitation | App + flag di `phase1-bundle` | [x] |
| CH-A02-M2 | Missing Security Headers | App + flag di `phase1-bundle` | [x] |
| CH-A02-H1 | Cloud Metadata Exfiltration | App + flag di `phase1-bundle` | [x] |
| CH-A02-H2 | Debug Endpoint + Env Variable Leak | App + flag di `phase1-bundle` | [x] |

### Epic P2-B — Modul **A04** Cryptographic Failures (6) `P0`

| ID | Challenge PRD §7.4 | Kriteria selesai | Status |
|----|-------------------|------------------|--------|
| CH-A04-E1 | MD5 Password Hash Cracking | [ ] |
| CH-A04-E2 | Hardcoded Secret Key | [ ] |
| CH-A04-M1 | Weak JWT Secret Brute Force | [ ] |
| CH-A04-M2 | Insecure Cookie (no Secure/HttpOnly) | [ ] |
| CH-A04-H1 | CBC Padding Oracle Attack | [ ] |
| CH-A04-H2 | ECB Mode Block Manipulation | [ ] |

### Epic P2-C — Modul **A07** Authentication Failures (6) `P0`

| ID | Challenge PRD §7.7 | Kriteria selesai | Status |
|----|-------------------|------------------|--------|
| CH-A07-E1 | Credential Stuffing dengan Wordlist | [ ] |
| CH-A07-E2 | Session Token Tidak Expire | [ ] |
| CH-A07-M1 | Brute Force OTP 4-Digit (No Rate Limit) | [ ] |
| CH-A07-M2 | Session Fixation Attack | [ ] |
| CH-A07-H1 | JWT Algorithm Confusion (RS256 → HS256) | [ ] |
| CH-A07-H2 | OAuth2 Implicit Flow Token Theft | [ ] |

### Epic P2-D — Konten A02+A04+A07 `P1`

| ID | Task | Output | Status |
|----|------|--------|--------|
| P2-D-001 | Hint + writeup untuk 18 challenge fase ini | ID+EN | [ ] |
| P2-D-002 | Nginx/proxy: daftar upstream baru terdaftar | Compose valid | [ ] |
| P2-D-003 | Lab 18 challenge: tema & narasi studi kasus **berbeda per slug** (merujuk X-009 / P1-J) | Tidak monoton template; checklist X-011 terpenuhi | [ ] |

---

## Fase 3 — A06 + A08 + A03 (PRD: Minggu 11–14)

### Epic P3-A — Modul **A06** Insecure Design (6) `P0`

| ID | Challenge PRD §7.6 | Kriteria selesai | Status |
|----|-------------------|------------------|--------|
| CH-A06-E1 | Username Enumeration via Response Diff | [ ] |
| CH-A06-E2 | Insecure Password Reset Flow | [ ] |
| CH-A06-M1 | Business Logic Bypass (Negative Price) | [ ] |
| CH-A06-M2 | Race Condition — Double Spend | [ ] |
| CH-A06-H1 | Multi-Step Auth Bypass | [ ] |
| CH-A06-H2 | Account Takeover via Insecure Direct Link | [ ] |

### Epic P3-B — Modul **A08** SW/Data Integrity Failures (6) `P0`

| ID | Challenge PRD §7.8 | Kriteria selesai | Status |
|----|-------------------|------------------|--------|
| CH-A08-E1 | Insecure Deserialization — Cookie Manipulation | [ ] |
| CH-A08-E2 | Unsigned Software Update | [ ] |
| CH-A08-M1 | Python Pickle RCE | [ ] |
| CH-A08-M2 | XML External Entity (XXE) Injection | [ ] |
| CH-A08-H1 | Java Deserialization RCE (ysoserial) | [ ] |
| CH-A08-H2 | CI/CD Pipeline Injection | [ ] |

### Epic P3-C — Modul **A03** Software Supply Chain Failures (6) `P0`

| ID | Challenge PRD §7.3 | Kriteria selesai | Status |
|----|-------------------|------------------|--------|
| CH-A03-E1 | Outdated Library CVE Lookup | [ ] |
| CH-A03-E2 | Package Manifest Exposure | [ ] |
| CH-A03-M1 | Known CVE Exploitation (Log4Shell-style) | [ ] |
| CH-A03-M2 | Dependency Confusion Attack | [ ] |
| CH-A03-H1 | Typosquatting Package RCE | [ ] |
| CH-A03-H2 | SRI Bypass + Malicious CDN Injection | [ ] |

### Epic P3-D — Konten & stack khusus `P1`

| ID | Task | Output | Status |
|----|------|--------|--------|
| P3-D-001 | Hint + writeup 18 challenge | ID+EN | [ ] |
| P3-D-002 | Review image Java/Python/Node untuk hardening non-root | Catatan di README modul | [ ] |
| P3-D-003 | Lab 18 challenge: tema & studi kasus unik per slug (X-009 / P1-J) | Variasi UX/narasi; bukan duplikat template | [ ] |

---

## Fase 4 — A09 + A10 (PRD: Minggu 15–16)

### Epic P4-A — Modul **A09** Logging & Alerting Failures (6) `P0`

| ID | Challenge PRD §7.9 | Kriteria selesai | Status |
|----|-------------------|------------------|--------|
| CH-A09-E1 | Log Injection (CRLF Injection) | [ ] |
| CH-A09-E2 | Bypass Audit Trail via Parameter Pollution | [ ] |
| CH-A09-M1 | Log Poisoning untuk LFI Escalation | [ ] |
| CH-A09-M2 | Blind Spot Exploitation (Unmonitored Endpoint) | [ ] |
| CH-A09-H1 | IDS/WAF Evasion + Attack Obfuscation | [ ] |
| CH-A09-H2 | Forensic Anti-Analysis (Log Tampering) | [ ] |

### Epic P4-B — Modul **A10** Mishandling Exceptional Conditions (6) `P0`

| ID | Challenge PRD §7.10 | Kriteria selesai | Status |
|----|---------------------|------------------|--------|
| CH-A10-E1 | Error Message Information Disclosure | [ ] |
| CH-A10-E2 | Null Byte Injection | [ ] |
| CH-A10-M1 | Integer Overflow / Underflow | [ ] |
| CH-A10-M2 | Resource Exhaustion (ReDoS) | [ ] |
| CH-A10-H1 | Type Juggling Exploit (PHP loose comparison) | [ ] |
| CH-A10-H2 | Crash Recovery State Manipulation | [ ] |

### Epic P4-C — Konten A09+A10 `P1`

| ID | Task | Output | Status |
|----|------|--------|--------|
| P4-C-001 | Hint + writeup 12 challenge | ID+EN | [ ] |
| P4-C-002 | Lab 12 challenge: tema & studi kasus unik per slug (X-009 / P1-J) | Variasi UX/narasi | [ ] |

---

## Fase 5 — Polish & rilis MVP (PRD: Minggu 17–18)

### Epic P5-A — UI/UX polish (PRD §11) `P1`

| ID | Task | Output | Status |
|----|------|--------|--------|
| P5-A-001 | Landing: hero, statistik, CTA, section kategori OWASP | Sesuai PRD §11.2 | [ ] |
| P5-A-002 | Animasi subtle: progress, badge pop, flag feedback | Tidak mengganggu performa | [ ] |
| P5-A-003 | Font JetBrains Mono + Inter | Terapkan global | [ ] |
| P5-A-004 | A11y pass dasar (kontras, focus, labels) | Checklist | [ ] |

### Epic P5-B — Keamanan platform & hardening (PRD §13 + SDD §12) `P0`

| ID | Task | Output | Status |
|----|------|--------|--------|
| P5-B-001 | Container: non-root, `no-new-privileges`, read-only root FS + tmpfs | Semua service | [ ] |
| P5-B-002 | Cookie flags: HttpOnly, Secure (prod), SameSite | Sesuai DEC auth | [ ] |
| P5-B-003 | CSP untuk dashboard SPA | Tidak memecah build | [ ] |
| P5-B-004 | Disclaimer legal di UI (PRD §13.1) | Halaman footer/modal pertama kali | [ ] |
| P5-B-005 | Review: tidak ada secret di image; gunakan build-args hati-hati | Laporan ringkas | [ ] |

### Epic P5-C — Observabilitas (SDD §14) `P2`

| ID | Task | Output | Status |
|----|------|--------|--------|
| P5-C-001 | Structured logging API (JSON) | Tanpa log isi flag | [ ] |
| P5-C-002 | Request ID di response header | Debugging | [ ] |

### Epic P5-D — Pengujian & QA (SDD §17) `P0`

| ID | Task | Output | Status |
|----|------|--------|--------|
| P5-D-001 | Unit test kritis: scoring, unlock, flag verify | Coverage target tim | [ ] |
| P5-D-002 | Integration test API+DB | CI | [ ] |
| P5-D-003 | Playwright E2E: register → solve satu challenge → writeup unlock | CI atau manual scheduled | [ ] |
| P5-D-004 | Uji manual semua 60 path solve (spreadsheet hasil) | Artefak QA | [ ] |
| P5-D-005 | Dua reviewer independen per PRD §13 (minimal sampling) | Catatan temuan | [ ] |

### Epic P5-E — Dokumentasi rilis `P0`

| ID | Task | Output | Status |
|----|------|--------|--------|
| P5-E-001 | README root: prasyarat, deploy 3 langkah, troubleshooting | README root memuat langkah Compose + dev; **tinjau kelengkapan vs PRD §9.3** | [x] |
| P5-E-002 | CHANGELOG / GitHub Release notes v1.0 | Tag semver | [ ] |
| P5-E-003 | Dokumentasi instruktur: reset instance, mode `lite`, LAN | Opsional README | [ ] |

**Gate Rilis MVP:** 60 challenge terdaftar di DB + proxy + semua solve path diverifikasi QA sampling + CI hijau + disclaimer.

---

## Epic opsional pasca-MVP (backlog)

| ID | Task | Catatan | Status |
|----|------|---------|--------|
| O-001 | Leaderboard global + pagination | API SDD §9.4 | [ ] |
| O-002 | Admin UI untuk metadata challenge | SDD §18 | [ ] |
| O-003 | TLS termination (Caddy/Traefik) + HSTS | Produksi | [ ] |
| O-004 | Export sertifikat/partisipasi PDF | Edukasi | [ ] |
| O-005 | OIDC/SAML untuk institusi | Enterprise | [ ] |

---

## Ringkasan hitungan tugas

| Kategori | Jumlah perkiraan |
|----------|------------------|
| Keputusan desain (DEC) | 5 |
| Cross-cutting (X) | 11 |
| Fase 0 (sub-epic) | ~35 |
| Fase 1 platform | ~25 |
| Challenge A01+A02+A05 (lab bundle) | 18 |
| Fase 2–4 challenge | 42 |
| Fase 5 polish | ~18 |
| Opsional | 5 |

**Challenge total:** 60 task baris terpisah di epik CH-*.

---

*Terakhir diselaraskan dengan SDD v1.0 / PRD v1.0. Perbarui dokumen ini saat scope berubah.*
