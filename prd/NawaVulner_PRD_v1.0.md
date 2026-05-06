# NawaVulner
## Product Requirements Document v1.0

> **Platform Latihan Keamanan Web Berbasis OWASP Top 10:2025**

| Atribut | Detail |
|---|---|
| Versi | 1.0.0 — PRD Awal |
| Status | Draft untuk Review |
| Target Rilis | v1.0 MVP |
| Referensi | OWASP Top 10:2025 |

---

## Daftar Isi

1. [Executive Summary](#1-executive-summary)
2. [Latar Belakang & Problem Statement](#2-latar-belakang--problem-statement)
3. [Tujuan & Target Pengguna](#3-tujuan--target-pengguna)
4. [Analisis OWASP Top 10:2025](#4-analisis-owasp-top-102025)
5. [Arsitektur Platform](#5-arsitektur-platform)
6. [Fitur & Fungsionalitas](#6-fitur--fungsionalitas-mvp-v10)
7. [Challenge Design per Kategori](#7-challenge-design-per-kategori)
8. [Tech Stack](#8-tech-stack)
9. [Docker Deployment Architecture](#9-docker-deployment-architecture)
10. [Gamifikasi & Sistem Poin](#10-gamifikasi--sistem-poin)
11. [UI/UX Guidelines](#11-uiux-guidelines)
12. [Roadmap & Milestones](#12-roadmap--milestones)
13. [Risiko & Mitigasi](#13-risiko--mitigasi)

---

## 1. Executive Summary

NawaVulner adalah platform latihan keamanan web **self-hosted** yang dirancang untuk membantu berbagai kalangan — mulai dari mahasiswa IT, developer, security analyst, hingga penetration tester profesional — dalam memahami dan mempraktikkan konsep keamanan aplikasi web secara hands-on.

Platform ini mengimplementasikan seluruh **10 kategori kerentanan dari OWASP Top 10:2025** dalam bentuk challenge interaktif bergaya CTF (Capture The Flag). Tiap kategori memiliki tiga tingkat kesulitan: Easy, Medium, dan Hard — total **60 challenge** tersebar di 10 modul.

NawaVulner dapat di-deploy dengan **satu perintah Docker Compose**, menjadikannya sangat mudah digunakan baik untuk pembelajaran mandiri, konten edukasi YouTube, maupun sesi training formal.

| Atribut | Detail |
|---|---|
| Nama Platform | NawaVulner |
| Tipe | Self-Hosted Vulnerable Web Application (CTF-style) |
| Referensi Utama | OWASP Top 10:2025 |
| Total Challenge | 60 challenge (6 per kategori × 10 kategori) |
| Bahasa | Bilingual — Bahasa Indonesia & English |
| Deployment | `docker compose up` — 1 perintah, fully isolated |
| Arsitektur | Hybrid: Dashboard Utama + Isolated Challenge Containers |
| Target Pengguna | Mahasiswa, Developer, Security Analyst, Pentester |

---

## 2. Latar Belakang & Problem Statement

### 2.1 Konteks

Keamanan siber menjadi salah satu bidang dengan permintaan tenaga ahli tertinggi secara global. Namun, belajar keamanan web secara praktis masih menghadapi beberapa hambatan:

- Platform latihan berbayar (HTB, THM) tidak selalu terjangkau oleh peserta didik di Indonesia.
- Platform gratis yang ada (DVWA, WebGoat) sudah usang dan tidak mencakup OWASP Top 10 terbaru (2025).
- Tidak ada platform berbahasa Indonesia yang bisa digunakan offline/self-hosted untuk training.
- Instruktur dan pembuat konten YouTube kesulitan menyediakan lab yang mudah di-setup oleh audiens mereka.

### 2.2 Solusi

NawaVulner hadir sebagai platform latihan keamanan web open-source, self-hosted, bilingual, dan up-to-date dengan OWASP 2025, yang bisa:

- Di-deploy oleh siapapun dengan satu perintah Docker.
- Digunakan sebagai bahan konten YouTube edukatif tentang cybersecurity.
- Menjadi materi training formal untuk institusi pendidikan atau perusahaan.
- Diakses secara offline tanpa ketergantungan layanan cloud.

---

## 3. Tujuan & Target Pengguna

### 3.1 Tujuan Platform

1. Menyediakan lingkungan latihan yang aman dan terisolasi untuk mempelajari kerentanan web.
2. Mengimplementasikan semua kategori OWASP Top 10:2025 dengan contoh nyata yang bisa dieksploitasi.
3. Memberikan pengalaman belajar terstruktur dari level Easy hingga Hard untuk tiap kategori.
4. Mendukung pembuatan konten edukasi (YouTube, blog, training) dengan lab yang reproducible.
5. Mempermudah instruktur untuk setup lab training tanpa infrastruktur rumit.

### 3.2 Target Pengguna

| Segmen | Profil | Kebutuhan Utama |
|---|---|---|
| Mahasiswa IT | Belajar keamanan web dari dasar | Konten bergaya tutorial, hint tersedia, bilingual |
| Developer | Memahami kerentanan untuk nulis kode aman | Konteks dev-focused, penjelasan mitigasi |
| Security Analyst | Asah skill detection & response | Logging challenge, realistis, berbasis CVE |
| Pentester Pro | Latihan teknik exploitation lanjutan | Challenge Hard yang kompleks, multi-step exploit chain |
| Konten Kreator | Bikin video YouTube / blog tutorial | Lab reproducible, mudah di-reset, screenshot-friendly |

---

## 4. Analisis OWASP Top 10:2025

| ID | Kategori | Posisi 2025 | Dampak | Catatan |
|---|---|---|---|---|
| A01 | Broken Access Control | #1 (tetap) | Sangat Tinggi | 40 CWEs, 1.8M+ occurrences |
| A02 | Security Misconfiguration | #2 (naik dari #5) | Tinggi | Termasuk XXE masuk di sub-kategori baru |
| A03 | Software Supply Chain Failures | **#3 (BARU)** | Tinggi | Kategori baru — relevan dengan ekosistem npm/PyPI |
| A04 | Cryptographic Failures | #4 (turun dari #2) | Tinggi | Dulu bernama Sensitive Data Exposure |
| A05 | Injection | #5 (turun dari #3) | Sangat Tinggi | Mencakup XSS, SQLi, SSTI, Command Injection |
| A06 | Insecure Design | #6 | Medium-Tinggi | Fokus pada design flaw, bukan implementation flaw |
| A07 | Authentication Failures | #7 (turun dari #2) | Tinggi | Dulu Broken Authentication |
| A08 | SW/Data Integrity Failures | #8 | Tinggi | Termasuk insecure deserialization & CI/CD issues |
| A09 | Logging & Alerting Failures | #9 (turun dari #8) | Medium | Kritikal untuk IR & forensik |
| A10 | Mishandling Exceptional Conditions | **#10 (BARU)** | Medium | Kategori baru — error handling & exception management |

> ⚠️ **Perhatian khusus:**
> - **A03** dan **A10** adalah kategori BARU di 2025 — NawaVulner akan menjadi salah satu sedikit lab yang mengimplementasikan keduanya secara hands-on.
> - **A01** tetap #1 untuk tahun ketiga berturut-turut — coverage harus paling komprehensif.

---

## 5. Arsitektur Platform

### 5.1 Overview Arsitektur

NawaVulner menggunakan arsitektur **Hybrid**: satu Dashboard Container sebagai pusat kendali, dan beberapa Challenge Containers yang terisolasi secara penuh.

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Network                        │
│                                                          │
│  ┌──────────────┐    ┌──────────────┐                   │
│  │ nawa-dashboard│    │   nawa-api   │                   │
│  │  React + Vite │◄──►│ Node/Express │                   │
│  └──────────────┘    └──────┬───────┘                   │
│                             │                            │
│                      ┌──────▼───────┐                   │
│                      │   nawa-db    │                    │
│                      │ PostgreSQL 15│                    │
│                      └──────────────┘                   │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │challenge │  │challenge │  │challenge │  │  ...   │  │
│  │  a01-*   │  │  a02-*   │  │  a03-*   │  │a04-a10 │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘  │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │              nawa-proxy (Nginx)                  │    │
│  │         Routing + Reverse Proxy                  │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

| Komponen | Teknologi | Fungsi |
|---|---|---|
| nawa-dashboard | React + Vite | UI utama: daftar challenge, flag submission, progress, hints |
| nawa-api | Node.js / Express | Backend API: auth, scoring, progress tracking, flag validation |
| nawa-db | PostgreSQL 15 | Database: user, progress, flags, hints, scoring |
| challenge-a01-* | PHP / Node.js | Container terisolasi per challenge OWASP A01 |
| challenge-a02-* | PHP / Python | Container terisolasi per challenge OWASP A02 |
| ... (A03–A10) | Mixed stack | Masing-masing berjalan di port dan network terpisah |
| nawa-proxy | Nginx | Reverse proxy — routing traffic ke challenge container |

### 5.2 Network Isolation

Setiap challenge container berjalan dalam Docker network yang terisolasi. Challenge tidak bisa saling berkomunikasi secara langsung, kecuali melalui proxy. Ini penting untuk:

- Mencegah "cross-contamination" antar challenge (flag satu challenge tidak bisa ditemukan dari challenge lain).
- Mensimulasikan lingkungan production yang realistis.
- Keamanan host: container tidak punya akses ke filesystem host.

### 5.3 Volume & Persistence

Database PostgreSQL menggunakan Docker volume untuk persistensi. Progress, poin, dan flag submission pengguna tetap tersimpan meski container di-restart. Challenge container bersifat stateless dan dapat di-reset kapan saja.

---

## 6. Fitur & Fungsionalitas (MVP v1.0)

### 6.1 Registrasi & Autentikasi
- Registrasi akun lokal dengan username, email, dan password.
- Login dengan session-based authentication.
- Halaman profil dengan statistik personal (total poin, badge, challenge diselesaikan).

### 6.2 Dashboard Challenge
- Tampilan grid/list semua 60 challenge, dikelompokkan per modul OWASP.
- Status visual per challenge: **Locked**, **Unlocked**, **Solved**.
- Filter berdasarkan kategori OWASP, difficulty (Easy/Medium/Hard), dan status.
- Setiap challenge memiliki: deskripsi, kategori OWASP, tingkat kesulitan, poin, dan tombol "Start Lab".

### 6.3 Lab Environment
- Tombol "Start Lab" mengarahkan pengguna ke isolated challenge container via proxy.
- Setiap challenge memiliki halaman landing yang menjelaskan konteks serangan (backstory realistis).
- Challenge berjalan di browser — tidak perlu install tools tambahan untuk level Easy & Medium.
- Untuk level Hard, pengguna diasumsikan memiliki Burp Suite / tools CLI standar.

### 6.4 Flag Submission & Scoring
- Setiap challenge memiliki flag dalam format `FLAG{...}` yang harus ditemukan/dieksploitasi.
- Sistem validasi flag real-time dengan feedback langsung (benar/salah).
- Poin berdasarkan difficulty: **Easy = 100 poin**, **Medium = 250 poin**, **Hard = 500 poin**.
- Bonus poin untuk first blood (pertama yang solve dalam sesi tertentu).

### 6.5 Hints & Writeup
- Setiap challenge memiliki **3 level hint** yang bisa di-unlock secara bertahap.
- Hint 1 gratis, Hint 2 mengurangi 25% poin, Hint 3 mengurangi 50% poin.
- Writeup lengkap ter-lock sampai challenge berhasil diselesaikan (**solve-gated**).
- Writeup bilingual (Bahasa Indonesia & English), mencakup penjelasan teknis dan cara mitigasi.

### 6.6 Progress Tracking
- Progress bar per modul OWASP (berapa challenge yang sudah selesai dari total).
- Halaman statistik global: total poin, rank, challenge selesai, badge diperoleh.
- History submission (kapan solve, berapa poin, hint digunakan atau tidak).

### 6.7 Reset Lab
- Pengguna bisa reset state challenge (mengembalikan ke kondisi awal) tanpa menghapus progress.
- Berguna untuk latihan ulang atau mencoba teknik berbeda.

---

## 7. Challenge Design per Kategori

> **Total: 60 challenge | 10 modul | 6 challenge per modul (2 Easy + 2 Medium + 2 Hard)**
> Setiap challenge dibangun sebagai aplikasi web mandiri dalam Docker container terisolasi.

---

### 7.1 Modul A01 — Broken Access Control

**Deskripsi:** Kontrol akses yang lemah memungkinkan penyerang mengakses sumber daya, fungsi, atau data yang seharusnya tidak boleh diakses. Mencakup IDOR, Path Traversal, Privilege Escalation, CSRF, dan SSRF.

**Dampak:** Unauthorized data disclosure, modifikasi/penghapusan data, hingga akses admin penuh.

| Level | Challenge | Deskripsi | Flag |
|---|---|---|---|
| 🟢 Easy | IDOR — Akses Profil User Lain | Ubah parameter `?user_id=` di URL untuk mengakses profil pengguna lain tanpa otorisasi | `FLAG{idor_basic_1}` |
| 🟢 Easy | Force Browsing ke Admin Panel | Akses langsung `/admin/dashboard` tanpa login sebagai admin | `FLAG{force_browse_1}` |
| 🟡 Medium | JWT Privilege Escalation | Manipulasi claim `role` di JWT dari `"user"` menjadi `"admin"` (algorithm confusion / none attack) | `FLAG{jwt_privesc_1}` |
| 🟡 Medium | SSRF — Internal Service Discovery | Eksploitasi fitur URL fetch untuk mengakses layanan internal (metadata cloud, Redis) | `FLAG{ssrf_internal_1}` |
| 🔴 Hard | CSRF + CORS Bypass Chain | Eksploitasi CSRF dengan memanfaatkan CORS misconfiguration untuk pencurian token dan aksi atas nama korban | `FLAG{csrf_cors_chain_1}` |
| 🔴 Hard | Mass Assignment + Horizontal Priv Esc | Kirim field tersembunyi (`is_admin`, `role`) melalui API JSON untuk eskalasi hak akses + akses data semua user | `FLAG{mass_assign_1}` |

---

### 7.2 Modul A02 — Security Misconfiguration

**Deskripsi:** Konfigurasi keamanan yang tidak tepat pada server, framework, cloud, database, atau middleware. Termasuk default credentials, direktori listing, error message verbose, dan header keamanan yang tidak ada.

**Dampak:** Remote code execution, data breach, akses tidak sah ke sistem backend.

| Level | Challenge | Deskripsi | Flag |
|---|---|---|---|
| 🟢 Easy | Default Credentials Discovery | Login ke panel admin menggunakan kombinasi default credential (admin/admin, root/root) | `FLAG{default_cred_1}` |
| 🟢 Easy | Directory Listing Exposed | Akses direktori yang listing-nya terbuka untuk mendapatkan file sensitif (backup, config) | `FLAG{dir_listing_1}` |
| 🟡 Medium | Verbose Error Message Exploitation | Trigger error server untuk mendapatkan stack trace, path file, versi library, dan kredensial DB | `FLAG{verbose_error_1}` |
| 🟡 Medium | Missing Security Headers | Eksploitasi absennya CSP, X-Frame-Options, HSTS untuk clickjacking dan XSS | `FLAG{missing_headers_1}` |
| 🔴 Hard | Cloud Metadata Exfiltration | Akses endpoint metadata cloud (`169.254.169.254`) untuk mendapatkan IAM credentials melalui SSRF | `FLAG{cloud_meta_1}` |
| 🔴 Hard | Debug Endpoint + Env Variable Leak | Temukan endpoint debug aktif (`/actuator`, `/.env`) yang mengekspos konfigurasi rahasia dan secret keys | `FLAG{debug_endpoint_1}` |

---

### 7.3 Modul A03 — Software Supply Chain Failures ⭐ NEW

**Deskripsi:** Kegagalan pada rantai pasok perangkat lunak: dependensi pihak ketiga yang tidak aman atau sudah usang, komponen dengan kerentanan yang diketahui, dan penggunaan library tanpa verifikasi integritas.

**Dampak:** RCE melalui library vulnerable, backdoor melalui paket palsu, data theft.

| Level | Challenge | Deskripsi | Flag |
|---|---|---|---|
| 🟢 Easy | Outdated Library CVE Lookup | Identifikasi versi library vulnerable dari respons header/error dan cari CVE yang relevan | `FLAG{outdated_lib_1}` |
| 🟢 Easy | Package Manifest Exposure | Akses `package.json` / `requirements.txt` yang ter-expose untuk enumerate dependensi vulnerable | `FLAG{pkg_manifest_1}` |
| 🟡 Medium | Known CVE Exploitation (Log4Shell-style) | Eksploitasi simulasi CVE pada library logging untuk JNDI injection / arbitrary code loading | `FLAG{cve_exploit_1}` |
| 🟡 Medium | Dependency Confusion Attack | Upload paket palsu ke registry publik yang namanya sama dengan paket internal perusahaan | `FLAG{dep_confusion_1}` |
| 🔴 Hard | Typosquatting Package RCE | Install paket typosquatted yang mengandung malicious install script untuk mendapat shell | `FLAG{typosquat_rce_1}` |
| 🔴 Hard | SRI Bypass + Malicious CDN Injection | Bypass Subresource Integrity untuk inject script berbahaya dari CDN yang dikendalikan attacker | `FLAG{sri_bypass_1}` |

---

### 7.4 Modul A04 — Cryptographic Failures

**Deskripsi:** Kegagalan kriptografi yang mengekspos data sensitif: algoritma lemah, password plaintext, transmisi data tidak terenkripsi, key hardcoded, dan penggunaan fungsi hashing yang tidak aman untuk password.

**Dampak:** Pencurian data sensitif, credential compromise, impersonasi pengguna.

| Level | Challenge | Deskripsi | Flag |
|---|---|---|---|
| 🟢 Easy | MD5 Password Hash Cracking | Crack password hash MD5 yang bocor dari database menggunakan rainbow table / hashcat | `FLAG{md5_crack_1}` |
| 🟢 Easy | Hardcoded Secret Key | Temukan API key atau secret yang di-hardcode di dalam source code yang ter-expose | `FLAG{hardcoded_secret_1}` |
| 🟡 Medium | Weak JWT Secret Brute Force | Brute-force secret key JWT yang lemah untuk forge token dengan privilege lebih tinggi | `FLAG{jwt_brute_1}` |
| 🟡 Medium | Insecure Cookie (no Secure/HttpOnly) | Intercept cookie sesi yang dikirim via HTTP karena flag `Secure` tidak diset | `FLAG{insecure_cookie_1}` |
| 🔴 Hard | CBC Padding Oracle Attack | Eksploitasi padding oracle pada enkripsi AES-CBC untuk decrypt ciphertext tanpa kunci | `FLAG{padding_oracle_1}` |
| 🔴 Hard | ECB Mode Block Manipulation | Manipulasi ciphertext AES-ECB dengan memindahkan/menduplikasi blok untuk privilege escalation | `FLAG{ecb_manip_1}` |

---

### 7.5 Modul A05 — Injection

**Deskripsi:** Data berbahaya yang dikirim ke interpreter sebagai bagian dari perintah atau kueri. Mencakup SQL Injection, NoSQL Injection, LDAP Injection, OS Command Injection, SSTI, dan XSS.

**Dampak:** Data breach total, RCE, bypass autentikasi, defacement.

| Level | Challenge | Deskripsi | Flag |
|---|---|---|---|
| 🟢 Easy | Classic SQL Injection Login Bypass | Bypass login dengan payload `' OR '1'='1` tanpa mengetahui password | `FLAG{sqli_login_1}` |
| 🟢 Easy | Reflected XSS | Inject script melalui parameter URL yang langsung direfleksikan ke halaman tanpa sanitasi | `FLAG{xss_reflect_1}` |
| 🟡 Medium | Union-Based SQL Injection | Eksploitasi SQLi UNION SELECT untuk dump skema database dan data sensitif | `FLAG{sqli_union_1}` |
| 🟡 Medium | Stored XSS + Cookie Stealing | Inject persistent XSS di fitur komentar/profil untuk mencuri sesi cookie admin | `FLAG{xss_stored_1}` |
| 🔴 Hard | Blind SQLi (Time-Based) | Eksploitasi blind SQL injection dengan teknik time-based untuk exfiltrate data karakter per karakter | `FLAG{sqli_blind_1}` |
| 🔴 Hard | Server-Side Template Injection (SSTI) | Inject template expression (`{{7*7}}`) untuk mencapai RCE melalui engine Jinja2/Twig | `FLAG{ssti_rce_1}` |

---

### 7.6 Modul A06 — Insecure Design

**Deskripsi:** Kelemahan pada level desain dan arsitektur aplikasi: tidak ada rate limiting, logika bisnis yang cacat, alur autentikasi yang tidak aman secara by-design, dan absennya threat modeling.

**Dampak:** Account takeover, bypass business logic, fraud, enumerasi data.

| Level | Challenge | Deskripsi | Flag |
|---|---|---|---|
| 🟢 Easy | Username Enumeration via Response Diff | Bedakan respons login untuk username valid vs invalid untuk enumerate akun yang terdaftar | `FLAG{user_enum_1}` |
| 🟢 Easy | Insecure Password Reset Flow | Eksploitasi token reset password yang lemah (sequential, predictable, atau tidak expire) | `FLAG{pw_reset_1}` |
| 🟡 Medium | Business Logic Bypass (Negative Price) | Kirim nilai negatif pada harga/quantity di order untuk mendapatkan kredit atau produk gratis | `FLAG{biz_logic_1}` |
| 🟡 Medium | Race Condition — Double Spend | Eksploitasi race condition pada proses transfer saldo untuk mengirim dana melebihi saldo | `FLAG{race_cond_1}` |
| 🔴 Hard | Multi-Step Auth Bypass | Skip langkah verifikasi OTP/2FA dalam alur multi-step dengan memanipulasi state/parameter | `FLAG{auth_bypass_multi_1}` |
| 🔴 Hard | Account Takeover via Insecure Direct Link | Kombinasikan user enumeration + weak token + logic flaw untuk full account takeover | `FLAG{ato_chain_1}` |

---

### 7.7 Modul A07 — Authentication Failures

**Deskripsi:** Kegagalan dalam implementasi autentikasi: tidak ada perlindungan brute force, session fixation, session tidak di-invalidate setelah logout, credential stuffing, dan penyimpanan password yang tidak aman.

**Dampak:** Account takeover, session hijacking, akses tidak sah.

| Level | Challenge | Deskripsi | Flag |
|---|---|---|---|
| 🟢 Easy | Credential Stuffing dengan Wordlist | Gunakan daftar credential yang bocor (rockyou.txt) untuk login ke akun yang ada | `FLAG{cred_stuff_1}` |
| 🟢 Easy | Session Token Tidak Expire | Gunakan session token lama (post-logout) yang masih aktif karena tidak di-invalidate server-side | `FLAG{session_expire_1}` |
| 🟡 Medium | Brute Force OTP 4-Digit (No Rate Limit) | Brute force OTP 4 digit tanpa rate limiting dan account lockout untuk bypass 2FA | `FLAG{otp_brute_1}` |
| 🟡 Medium | Session Fixation Attack | Inject session ID yang sudah diketahui sebelum login untuk hijack sesi setelah korban autentikasi | `FLAG{session_fix_1}` |
| 🔴 Hard | JWT Algorithm Confusion (RS256 → HS256) | Ganti algoritma JWT dari RS256 ke HS256 menggunakan public key sebagai secret untuk forge token | `FLAG{jwt_alg_conf_1}` |
| 🔴 Hard | OAuth2 Implicit Flow Token Theft | Eksploitasi misconfigured `redirect_uri` di OAuth2 untuk mencuri access token melalui open redirect | `FLAG{oauth_token_theft_1}` |

---

### 7.8 Modul A08 — Software or Data Integrity Failures

**Deskripsi:** Kegagalan dalam memastikan integritas perangkat lunak dan data: deserialisasi tidak aman, update mekanisme yang tidak diverifikasi, pipeline CI/CD yang rentan, dan penggunaan komponen dari sumber tidak tepercaya.

**Dampak:** RCE melalui deserialisasi, supply chain attack, code injection.

| Level | Challenge | Deskripsi | Flag |
|---|---|---|---|
| 🟢 Easy | Insecure Deserialization — Cookie Manipulation | Modifikasi objek serialized di cookie (base64 PHP/Python pickle) untuk mengubah hak akses | `FLAG{deserial_cookie_1}` |
| 🟢 Easy | Unsigned Software Update | Ganti paket update yang tidak diverifikasi tanda tangannya dengan versi berbahaya | `FLAG{unsigned_update_1}` |
| 🟡 Medium | Python Pickle RCE | Eksploitasi deserialisasi Python pickle dengan payload berbahaya untuk mendapat shell | `FLAG{pickle_rce_1}` |
| 🟡 Medium | XML External Entity (XXE) Injection | Inject XXE payload dalam input XML untuk membaca file lokal (`/etc/passwd`) atau SSRF | `FLAG{xxe_file_read_1}` |
| 🔴 Hard | Java Deserialization RCE (ysoserial) | Eksploitasi deserialisasi Java dengan gadget chain untuk mencapai Remote Code Execution | `FLAG{java_deserial_1}` |
| 🔴 Hard | CI/CD Pipeline Injection | Inject perintah berbahaya ke dalam konfigurasi pipeline (`Jenkinsfile`, `.github/workflows`) melalui PR | `FLAG{cicd_inject_1}` |

---

### 7.9 Modul A09 — Security Logging and Alerting Failures

**Deskripsi:** Ketidakmampuan sistem untuk mendeteksi, merespons, dan melaporkan insiden keamanan. Termasuk log tidak ada, log tidak lengkap, log dapat dimanipulasi, dan tidak ada alerting untuk aktivitas mencurigakan.

**Dampak:** Serangan tidak terdeteksi, incident response terganggu, bukti forensik hilang.

| Level | Challenge | Deskripsi | Flag |
|---|---|---|---|
| 🟢 Easy | Log Injection (CRLF Injection) | Inject karakter CRLF (`\r\n`) ke log untuk memalsukan entri log atau menyembunyikan aktivitas | `FLAG{log_inject_1}` |
| 🟢 Easy | Bypass Audit Trail via Parameter Pollution | Manipulasi parameter sehingga aksi berbahaya tidak terekam dalam log audit | `FLAG{audit_bypass_1}` |
| 🟡 Medium | Log Poisoning untuk LFI Escalation | Poison log file dengan PHP/Python code melalui User-Agent, lalu eksekusi melalui LFI | `FLAG{log_poison_1}` |
| 🟡 Medium | Blind Spot Exploitation (Unmonitored Endpoint) | Temukan dan eksploitasi endpoint yang tidak dimonitor karena tidak ada logging aktif | `FLAG{blind_spot_1}` |
| 🔴 Hard | IDS/WAF Evasion + Attack Obfuscation | Jalankan serangan SQLi/XSS dengan encoding dan fragmentasi untuk menghindari deteksi WAF | `FLAG{waf_evasion_1}` |
| 🔴 Hard | Forensic Anti-Analysis (Log Tampering) | Akses dan modifikasi log setelah kompromisi untuk menghapus jejak serangan | `FLAG{log_tamper_1}` |

---

### 7.10 Modul A10 — Mishandling of Exceptional Conditions ⭐ NEW

**Deskripsi:** Kegagalan dalam menangani kondisi error dan exception yang tidak terduga: uncaught exception yang mengekspos info sensitif, failure mode yang tidak aman, null pointer dereference, dan resource exhaustion.

**Dampak:** DoS, information disclosure, bypass security controls melalui error state.

| Level | Challenge | Deskripsi | Flag |
|---|---|---|---|
| 🟢 Easy | Error Message Information Disclosure | Trigger kondisi error (input malformed, akses resource tidak ada) untuk mendapatkan informasi sensitif dari stack trace | `FLAG{error_info_1}` |
| 🟢 Easy | Null Byte Injection | Gunakan null byte (`%00`) untuk memotong validasi string dan memanipulasi path file atau query | `FLAG{null_byte_1}` |
| 🟡 Medium | Integer Overflow / Underflow | Kirim nilai integer yang sangat besar/kecil untuk trigger overflow yang mempengaruhi logika bisnis | `FLAG{int_overflow_1}` |
| 🟡 Medium | Resource Exhaustion (ReDoS) | Kirim input yang memicu Regex Denial of Service untuk membuat aplikasi tidak responsif | `FLAG{redos_1}` |
| 🔴 Hard | Type Juggling Exploit (PHP loose comparison) | Eksploitasi PHP loose comparison (`==`) dengan magic hashes untuk bypass autentikasi | `FLAG{type_juggle_1}` |
| 🔴 Hard | Crash Recovery State Manipulation | Trigger crash pada saat operasi kritis lalu eksploitasi state recovery yang tidak aman untuk privilege escalation | `FLAG{crash_state_1}` |

---

## 8. Tech Stack

### 8.1 Dashboard & API (Core Platform)

| Layer | Teknologi | Justifikasi |
|---|---|---|
| Frontend | React + Vite + Tailwind CSS | Modern, cepat, ringan — cocok untuk dashboard CTF |
| Backend API | Node.js + Express | Ekosistem luas, mudah dikontribusi komunitas |
| Database | PostgreSQL 15 | Reliable, relational — cocok untuk user/scoring data |
| Auth | JWT + bcrypt | Stateless, aman, standar industri |
| Proxy | Nginx | Routing ke challenge containers, static file serving |
| Orchestration | Docker Compose v3 | Single-command deploy, mudah dikustomisasi |

### 8.2 Challenge Containers (per Modul)

| Modul | Stack Utama | Database | Alasan Pemilihan |
|---|---|---|---|
| A01 | PHP 7.4 + Apache | MySQL | PHP terkenal dengan IDOR & access control issues |
| A02 | PHP 8 + Nginx | File-based | Misconfiguration mudah didemonstrasikan di PHP/Nginx |
| A03 | Node.js + Express | SQLite | Relevan dengan ekosistem npm supply chain |
| A04 | Python Flask | SQLite | Crypto operations mudah didemonstrasikan di Python |
| A05 | PHP + Python Flask | MySQL | Classic SQLi di PHP, SSTI di Jinja2 (Python) |
| A06 | Node.js + React | PostgreSQL | Business logic & API design flaws |
| A07 | PHP + Node.js | MySQL | Auth flows di PHP, JWT di Node.js |
| A08 | Python Flask + Java | Redis | Pickle di Python, Java deserialization |
| A09 | PHP + Node.js | File-based logs | Log injection & poisoning di PHP |
| A10 | PHP + Python | MySQL | Error handling, type juggling di PHP |

---

## 9. Docker Deployment Architecture

### 9.1 Filosofi Deployment

> **"Zero friction setup"** — peserta tidak perlu memahami Docker secara mendalam untuk menjalankan platform ini.

### 9.2 Struktur Repository

```
nawavulner/
├── docker-compose.yml          ← Entry point utama
├── docker-compose.override.yml ← Override untuk development
├── .env.example                ← Template variabel lingkungan
├── README.md
├── dashboard/                  ← Source code frontend & API
│   ├── frontend/
│   └── api/
└── challenges/
    ├── a01-broken-access/      ← Berisi Dockerfile + app + flag.txt
    ├── a02-misconfiguration/
    ├── a03-supply-chain/
    ├── a04-crypto-failures/
    ├── a05-injection/
    ├── a06-insecure-design/
    ├── a07-auth-failures/
    ├── a08-integrity-failures/
    ├── a09-logging-failures/
    └── a10-exceptional-conditions/
```

### 9.3 Cara Deploy (3 Langkah)

```bash
# Langkah 1 — Clone repository
git clone https://github.com/nawavulner/nawavulner.git && cd nawavulner

# Langkah 2 — Setup variabel lingkungan (opsional untuk localhost)
cp .env.example .env

# Langkah 3 — Jalankan platform
docker compose up -d
```

Buka browser → `http://localhost:3000` — platform siap digunakan! 🚀

### 9.4 Spesifikasi Hardware

| Komponen | Minimum | Rekomendasi |
|---|---|---|
| CPU | 2 Core | 4 Core |
| RAM | 4 GB | 8 GB |
| Disk | 20 GB | 40 GB |
| OS | Linux / macOS / Windows (WSL2) | Ubuntu 22.04 LTS |
| Docker | Docker Engine 24+ | Docker Desktop terbaru |
| Network | Localhost only | LAN untuk multi-user training |

---

## 10. Gamifikasi & Sistem Poin

### 10.1 Struktur Poin

| Difficulty | Poin Base | First Blood Bonus | Hint Penalty |
|---|---|---|---|
| 🟢 Easy | 100 poin | +50 poin | Hint 1: 0 / Hint 2: -25 / Hint 3: -50 |
| 🟡 Medium | 250 poin | +100 poin | Hint 1: 0 / Hint 2: -62 / Hint 3: -125 |
| 🔴 Hard | 500 poin | +200 poin | Hint 1: 0 / Hint 2: -125 / Hint 3: -250 |

**Total poin maksimum:** `(100×20) + (250×20) + (500×20) = 17.000 poin`

### 10.2 Badge System

| Badge | Trigger | Deskripsi |
|---|---|---|
| 🥾 First Step | Solve challenge pertama | Selamat datang di dunia offensive security! |
| 💉 SQL Ninja | Solve semua A05 challenges | Menguasai semua teknik Injection |
| 🚫 Access Denied | Solve semua A01 challenges | Ahli dalam Broken Access Control |
| 🧠 Clean Hacker | Solve 5 challenge berturut tanpa hint | Skill murni, tanpa bantuan |
| 🗺️ OWASP Master | Solve minimal 1 challenge dari tiap modul | Menjelajahi semua aspek OWASP |
| 👑 Full Clear | Solve semua 60 challenge | Penyelesai sejati NawaVulner |
| ⚡ Speed Runner | First blood pada 3+ challenge | Yang tercepat di antara yang cepat |

### 10.3 Unlock System (Opsional / Configurable)

```
[Easy 1] ──► [Easy 2] ──► [Medium 1] ──► [Medium 2] ──► [Hard 1] ──► [Hard 2]
                           (unlock setelah       (unlock setelah
                            1 Easy selesai)       1 Medium selesai)
```

Fitur ini dapat dikonfigurasi via environment variable: `CHALLENGE_UNLOCK_MODE=strict|free`

---

## 11. UI/UX Guidelines

### 11.1 Visual Identity

- **Tema:** Dark hacker aesthetic yang profesional
- **Warna utama:** Navy dark `#1A1A2E`, aksen merah `#E94560`, background card `#16213E`
- **Font:** Monospace untuk kode & flag (`JetBrains Mono`), sans-serif untuk UI umum (`Inter`)
- **Animasi:** Subtle — progress bar animated, badge pop-up, flag submit feedback

### 11.2 Halaman Utama (Landing Page)

- Hero section: nama platform, tagline, statistik (total challenge, kategori)
- Section deskripsi singkat tiap kategori OWASP dengan link ke modul
- Tombol CTA: **"Mulai Belajar"** (register) dan **"Lihat Challenge"** (login)

### 11.3 Dashboard Challenge

- Grid 2–4 kolom; tiap card: nama challenge, kategori, difficulty badge, poin, status
- Filter sidebar: per kategori OWASP, per difficulty, status (all/solved/unsolved)
- Search bar untuk cari challenge by nama atau tag

### 11.4 Halaman Challenge Detail

- Deskripsi naratif dengan backstory realistis
- Informasi teknis: kategori OWASP, CWE terkait, poin, difficulty
- Tombol **"Start Lab"** → membuka challenge di tab baru
- Box hint yang bisa di-expand satu per satu dengan konfirmasi sebelum melihat
- Form submit flag dengan feedback langsung
- Tombol **"Writeup"** → ter-greyout sampai challenge solved

---

## 12. Roadmap & Milestones

| Phase | Timeline | Deliverable | Detail |
|---|---|---|---|
| Phase 0 | Minggu 1–2 | Fondasi Infrastruktur | Docker Compose setup, dashboard skeleton, DB schema, auth sistem, proxy konfigurasi |
| Phase 1 | Minggu 3–6 | Challenge A01 + A05 (12 challenge) | Broken Access Control & Injection — dua kategori paling impactful dan familiar |
| Phase 2 | Minggu 7–10 | Challenge A02 + A04 + A07 (18 challenge) | Misconfiguration, Crypto Failures, Auth Failures |
| Phase 3 | Minggu 11–14 | Challenge A06 + A08 + A03 (18 challenge) | Insecure Design, Integrity Failures, Supply Chain |
| Phase 4 | Minggu 15–16 | Challenge A09 + A10 (12 challenge) | Logging Failures, Exceptional Conditions |
| Phase 5 | Minggu 17–18 | Polish & Release MVP | Writeup semua challenge, hint final, QA testing, dokumentasi, GitHub release |

### 12.1 Ide Konten YouTube Paralel

| Phase | Ide Video |
|---|---|
| Phase 1 | "OWASP A01 Explained — Praktek IDOR, JWT Attack, SSRF" |
| Phase 2 | "Security Misconfiguration di Dunia Nyata" |
| Phase 3 | "Supply Chain Attack — Bahaya di Balik `npm install`" |
| Phase 4 | "Java Deserialization RCE — dari Teori ke Exploit" |
| Phase 5 | "NawaVulner Full Walkthrough — Setup & Solve All" |

---

## 13. Risiko & Mitigasi

| Risiko | Tingkat | Mitigasi |
|---|---|---|
| Platform digunakan untuk serangan nyata | 🔴 Tinggi | Disclaimer jelas; container tidak punya akses internet; hanya untuk self-hosted lokal |
| Challenge terlalu mudah / tidak realistis | 🟡 Medium | Review oleh minimal 2 tester dengan background berbeda sebelum rilis tiap phase |
| Scope creep (fitur berkembang di luar v1) | 🟡 Medium | Strict feature freeze untuk v1; semua ide baru masuk backlog v2 |
| Docker Compose terlalu berat untuk hardware minimum | 🟡 Medium | Buat profil `lite` (hanya 2 modul) untuk hardware terbatas |
| Challenge container breakout | 🔴 Tinggi | Semua container berjalan sebagai non-root; `no-new-privileges`; read-only filesystem |
| Writeup/hint leak sebelum waktunya | 🟢 Low | Writeup disimpan terenkripsi di DB; hanya ter-decrypt setelah solve tercatat valid |

### 13.1 Legal & Ethical Disclaimer

> ⚠️ **NawaVulner adalah platform latihan keamanan yang dirancang untuk tujuan edukasi. Semua teknik yang dipraktikkan di sini hanya boleh digunakan pada sistem yang Anda miliki atau telah mendapat izin eksplisit. Penyalahgunaan teknik ini terhadap sistem orang lain adalah ilegal dan tidak etis.**

---

*NawaVulner PRD v1.0 — Dibuat berdasarkan OWASP Top 10:2025 | [owasp.org/Top10/2025](https://owasp.org/Top10/2025/)*
