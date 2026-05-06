# Walkthrough uji: `a01-jwt-privilege-escalation` (JWT privilege escalation)

## Ringkas

1. Login platform, baca **Latar** untuk kredensial beta; **Buka lab**.
2. Login di lab; buka **Admin** → 403.
3. Inspect cookie **`mitabisa_jwt`**; decode payload base64url; ubah `role` ke `admin`; encode ulang; set cookie (atau panggil `GET .../api/me` dengan `Authorization: Bearer` token hasil edit).
4. Buka **Admin** atau **Profil**; salin flag ke platform.

## Hint

Di halaman challenge platform: blok **Hint** (setelah tidak terkunci).

## Catatan

Lab sengaja **tidak** memverifikasi tanda tangan JWT. Di produksi verifikasi wajib (write-up setelah solve).
