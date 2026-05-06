# Pengalaman lab per challenge (NawaVulner)

Tujuan: peserta tidak melihat **halaman yang sama** di setiap lab. Tiap challenge punya **konteks narasi** (studi kasus fiksi/anonim, mirip dunia nyata) dan **identitas visual** yang konsisten dengan narasi itu.

## Prinsip

1. **Satu persona / domain per lab** — misalnya portal layanan publik, dashboard e-commerce internal, panel IoT vendor, dsb. Hindari teks generik “Lab pilot / template”.
2. **Warna, tipografi, dan layout** boleh beda antar slug; yang tetap seragam hanya **kontrak teknis** (mis. `GET /health` JSON, port 8080, pola proxy `/lab/<slug>/`).
3. **Fiksi & disclaimer** — gunakan nama instansi/kota fiktif; tambahkan satu kalimat bahwa ini lingkungan latihan jika perlu.
4. **Tidak mengganti OWASP** — narasi mendukung vektor (di sini IDOR profil); jangan mengorbankan celah yang bisa dipraktikkan sesuai PRD.
5. **Bahasa** — halaman lab bisa ID-first dengan ringkasan EN kecil, atau sebaliknya, selaras modul.

## Contoh persona (referensi cepat)

| Persona | Domain | Palet kasar | Cocok untuk |
|---------|--------|-------------|-------------|
| Portal layanan mandiri warga | Pemerintahan daerah fiktif | Hijau petai / krem / biru tua | IDOR dokumen & profil pemohon |
| Panel penjual “merchant beta” | Marketplace B2B | Oranye / ungu gelap | Force browse, path tersembunyi |
| Konsol SOC / GRC perimeter | Rantai pasokan digital fiktif | Cyan gelap / teal | SSRF pratinjau URL |
| Konsol on-call NOC | Infrastruktur grid fiktif | Biru malam / slate | CSRF + CORS pada roster |
| HR self-service enterprise | Multinasional fiktif | Krem / amber serif | Mass assignment API |

Fase 1 bundle: keenam lab **A01** memakai persona berbeda (tanpa panduan langkah di UI lab); rincian di [`challenges/STORIES-phase1.md`](../challenges/STORIES-phase1.md).

## Artefak per slug (disarankan)

- `STORY.md` — sinopsis studi kasus ID + EN (untuk kontributor & seed UI nanti).
- `www/` atau app — aset statis / aplikasi vulnerable; **jangan** copy mentah isi `challenges/_template` tanpa penyesuaian narasi & gaya.

## Review PR (ringkas)

Lihat checklist di [`challenges/README.md`](../challenges/README.md).
