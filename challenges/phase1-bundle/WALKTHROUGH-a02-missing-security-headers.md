# Walkthrough uji: `a02-missing-security-headers`

## Ringkas

1. Dari beranda EdgeLite, buka **Handbook partner** (`docs/partner-handbook`) — dokumen mitra mencantumkan path mount resmi **`panel/sensor-grid`**.
2. Buat **halaman HTML sendiri** di origin yang sama (atau gunakan alat seperti file lokal + proxy lab) yang memuat **`panel/sensor-grid`** di dalam `<iframe>`, lalu baca teks hasil iframe dari induk (same-origin).
3. **View-source** pada URL panel standalone tidak memuat flag plaintext; dekripsi XOR hanya jalan di konteks iframe.

## Hint / write-up

Platform: Hint tier + write-up HTML.
