# Sinopsis cepat — 18 lab Fase 1 (A01 + A02 + A05)

Ringkasan satu baris per slug (ID). Detail panjang di `dashboard/api/src/content/challenge-narrative.ts` dan halaman lab.

### OWASP A01 — task list lab (`challenges/phase1-bundle/server.mjs`)

**Status ringkas:** **6 / 6** persona & UI lab A01 selesai (tanpa panduan langkah di situs lab; hint/write-up HTML di platform). Urutan kesulitan naik: easy → medium → hard.

Legenda: **Selesai** = UI/narasi per persona + vektor jelas, flag tidak “bocor” di landing generik. **MVP** = route vulnerable jalan, beranda masih `land()` template gelap + hint + flag di `/`. **Belum** = belum ada di bundle (bukan kasus A01 Fase 1).

| # | Slug | Sinopsis | Status | Catatan singkat |
|---|------|----------|--------|-------------------|
| 1 | `a01-idor-profil-user` | Portal pemohon: IDOR parameter profil. | **Selesai** | Portal **Sariwangi**; [`WALKTHROUGH-a01-idor-profil-user.md`](./phase1-bundle/WALKTHROUGH-a01-idor-profil-user.md). |
| 2 | `a01-force-browse-admin` | Admin tersembunyi lewat path. | **Selesai** | **BengkelSnap**; [`WALKTHROUGH-a01-force-browse-admin.md`](./phase1-bundle/WALKTHROUGH-a01-force-browse-admin.md). |
| 3 | `a01-jwt-privilege-escalation` | JWT klaim role tidak diverifikasi ketat. | **Selesai** | **Mitabisa SSO**; [`WALKTHROUGH-a01-jwt-privilege-escalation.md`](./phase1-bundle/WALKTHROUGH-a01-jwt-privilege-escalation.md). |
| 4 | `a01-ssrf-internal-discovery` | Pratinjau URL perimeter ke metadata internal. | **Selesai** | **LautanLink Sentinel** (cyan/teal); `periksa`, `hasil?url=`, `fetch?url=`; [`WALKTHROUGH-a01-ssrf-internal-discovery.md`](./phase1-bundle/WALKTHROUGH-a01-ssrf-internal-discovery.md). |
| 5 | `a01-csrf-cors-chain` | On-call roster: CSRF + CORS permisif (roster, ganti email, verifikasi). | **Selesai** | **NusaOps** (biru malam); `api/roster`, `email/change`, `email/verify`; [`WALKTHROUGH-a01-csrf-cors-chain.md`](./phase1-bundle/WALKTHROUGH-a01-csrf-cors-chain.md). |
| 6 | `a01-mass-assignment-hpe` | Self-service HR: merge JSON tanpa allowlist + kebijakan departemen. | **Selesai** | **Helios People** (warm serif); `POST api/me`; [`WALKTHROUGH-a01-mass-assignment-hpe.md`](./phase1-bundle/WALKTHROUGH-a01-mass-assignment-hpe.md). |

### OWASP A02 — Security Misconfiguration (6 lab, bundle `server.mjs`)

| # | Slug | Sinopsis | Status | Catatan |
|---|------|----------|--------|---------|
| 1 | `a02-default-or-hardcoded-credentials` | Bootstrap / hardcoded di noise OEM. | **Selesai** | **KlinikLogin OEM**; view-source + `POST login`; [`WALKTHROUGH-a02-default-or-hardcoded-credentials.md`](./phase1-bundle/WALKTHROUGH-a02-default-or-hardcoded-credentials.md). |
| 2 | `a02-directory-listing` | Rantai artefak CDN + autoindex tersembunyi. | **Selesai** | **ArsipStatis**; log → parent → manifest → `_unlisted/`; [`WALKTHROUGH-a02-directory-listing.md`](./phase1-bundle/WALKTHROUGH-a02-directory-listing.md). |
| 3 | `a02-verbose-errors` | Rollup fiskal mem-bocorkan trace error. | **Selesai** | **LaporHub**; `api/fiscal/rollup`; [`WALKTHROUGH-a02-verbose-errors.md`](./phase1-bundle/WALKTHROUGH-a02-verbose-errors.md). |
| 4 | `a02-missing-security-headers` | Tanpa X-Frame-Options, embed same-origin membocorkan token. | **Selesai** | **EdgeLite**; handbook + `panel/sensor-grid`, iframe same-origin; [`WALKTHROUGH-a02-missing-security-headers.md`](./phase1-bundle/WALKTHROUGH-a02-missing-security-headers.md). |
| 5 | `a02-cloud-metadata-ssrf` | Atlas + sesi shard, lalu fetch metadata. | **Selesai** | **VeloraMesh**; `api/atlas/session`, `api/atlas/fetch`; [`WALKTHROUGH-a02-cloud-metadata-ssrf.md`](./phase1-bundle/WALKTHROUGH-a02-cloud-metadata-ssrf.md). |
| 6 | `a02-debug-endpoint-leak` | Mass assignment + debug Whoops membocorkan snapshot request. | **Selesai** | **CargoShip CI**; `POST login` / `POST api/profile`; [`WALKTHROUGH-a02-debug-endpoint-leak.md`](./phase1-bundle/WALKTHROUGH-a02-debug-endpoint-leak.md). |

### OWASP A05 — sinopsis (task detail bundle = backlog sama pola A01)

| Slug | Sinopsis |
|------|----------|
| a05-sqli-login-bypass | Login query string-concat. |
| a05-reflected-xss | Parameter search direfleksikan. |
| a05-sqli-union | Parameter id union-based. |
| a05-stored-xss-cookie-steal | Komentar tersimpan tanpa escape. |
| a05-sqli-blind-time | Parameter check time-based. |
| a05-ssti-rce | Render template dengan input pengguna. |
