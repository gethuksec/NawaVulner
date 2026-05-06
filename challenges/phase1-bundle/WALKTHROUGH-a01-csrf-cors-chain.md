# Walkthrough uji: `a01-csrf-cors-chain` (CSRF + CORS)

## Ringkas

1. Buka lab **NusaOps**; pastikan sesi cookie email pager terpasang (kunjungan beranda).
2. Dari origin lain, `GET api/roster` dengan kredensial baca `pagerEmail` (periksa header CORS).
3. `POST email/change` dengan `email` baru dan `current` yang cocok dengan roster; respons tidak memuat flag.
4. Buka **Log shift** di lab untuk PIN verifikasi, lalu `POST email/verify` (JSON `email` + `pin`) lintas origin; respons sukses berisi `flag`.
5. Submit ke platform.

## Hint / write-up

Platform: Hint & write-up HTML.
