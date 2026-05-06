# Walkthrough uji: `a01-force-browse-admin` (Force browsing ke panel admin)

Lingkungan: stack Docker, akses lewat proxy `http://localhost:8080` (atau `PUBLIC_BASE_URL` Anda). Lab dibuka dari dashboard challenge (tautan **Buka lab**) sehingga URL berbentuk:

`http://<host>:<port>/lab/a01-force-browse-admin/`

Flag yang disubmit ke platform: `FLAG{force_browse_1}` (harus sama dengan seed di `dashboard/api/src/seed/challenges-data.ts`).

---

## Tujuan latihan

Menemukan **endpoint atau path yang tidak ditampilkan di navigasi** penjual, lalu membukanya langsung lewat URL (force browsing / predictable path).

---

## Langkah uji (happy path)

1. **Login** ke NawaVulner, buka dashboard, pilih challenge **Force browsing ke panel admin** (`a01-force-browse-admin`).
2. Klik **Buka lab (tab baru)**. Pastikan URL mengandung `/lab/a01-force-browse-admin/` (bisa dengan atau tanpa slash akhir; proxy akan mengarahkan ke bentuk dengan slash).
3. Di halaman **BengkelSnap Beta**, cek navigasi **Beranda**, **Pesanan**, **Bantuan**: klik masing-masing harus **tetap di bawah path lab**, tidak meloncat ke beranda platform (`/`).
4. Di tab **halaman challenge** platform (`/challenges/a01-force-browse-admin`), buka blok **Hint**: unlock **Hint 1**, lalu 2, lalu 3 (ada penalti poin sesuai aturan). Isi hint diisi dari API (`dashboard/api/src/content/hints-writeups.ts`). Hint 3 menyebut path pasti build ini: `admin-console`.
5. Di bilah alamat **tab lab**, tambahkan segmen path **`admin-console`** setelah base lab, contoh:  
   `http://localhost:8080/lab/a01-force-browse-admin/admin-console`
6. Halaman **Konsol pemeliharaan** harus menampilkan flag plaintext. Salin flag, kembali ke tab dashboard challenge, **submit flag** di platform.
7. Pastikan status challenge menjadi **solved** dan poin bertambah sesuai aturan (hint penalty jika hint platform pernah dibuka, dll.).

---

## Negatif / regresi cepat

| # | Aksi | Yang diharapkan |
|---|------|------------------|
| N1 | Buka `.../lab/a01-force-browse-admin/` saja | Tidak ada flag di HTML beranda. |
| N2 | Buka path sembarang, mis. `.../foo-bar` | Halaman 404 lab, tanpa flag. |
| N3 | Submit flag salah di platform | Pesan salah, progress tidak solved. |

---

## Reset lab (tombol di halaman detail challenge)

1. Di halaman detail challenge, klik **Reset lab**.
2. Respons API: pesan bahwa reset dicatat; **segarkan tab lab** bila UI perlu dimuat ulang.
3. Verifikasi opsional di DB: baris baru di tabel `lab_resets` untuk pasangan user + challenge (audit).

Perilaku ini **audit + instruksi refresh** sesuai keputusan MVP (tanpa restart kontainer otomatis). Detail arsitektur: `sdd/DECISIONS.md` (Q3).

---

## Troubleshooting

- **Klik Beranda di lab malah ke dashboard NawaVulner:** pastikan image `challenge-phase1-bundle` terbaru (tautan relatif `./`, `pesanan`, `bantuan`).
- **404 dari proxy:** pastikan slug termasuk `LAB_DEPLOYED_SLUGS` dan Nginx memakai blok lokasi A01/A05 (bukan 503 generik).
- **502 ke lab:** cek `docker compose ps` dan log `nawa-proxy` / `challenge-phase1-bundle`.

---

*Dokumen ini untuk QA berulang dan onboarding tester.*
