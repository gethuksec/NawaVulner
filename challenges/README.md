# Challenges

Folder ini akan berisi **satu subdirektori per challenge** (Dockerfile + aplikasi vulnerable + flag), sesuai PRD §9.2.

Bootstrap platform saat ini:

- Metadata 60 challenge sudah di-seed di PostgreSQL lewat API (`dashboard/api/src/seed/challenges-data.ts`).
- **Fase 1 (A01+A02+A05):** image **`challenge-phase1-bundle`** (`./phase1-bundle/`) melayani 18 slug `a01-*`, `a02-*`, dan `a05-*` lewat satu container; Nginx memakai regex + header `X-Nawa-Lab-Slug`. Subfolder [`a01-idor-profil-user/`](./a01-idor-profil-user/) = referensi tema/studi kasus, bukan service Compose aktif.
- Slug **di luar** bundle yang di-deploy pada `/lab/...` mendapat **503** dari Nginx (atau 404 dari app) sampai modul ditambahkan.
- **Pedoman tema & studi kasus:** [`../docs/lab-experience.md`](../docs/lab-experience.md).

`_template` hanya kerangka teknis (Nginx + `/health`). Lab produksi wajib punya narasi & gaya visual sendiri.

## Checklist PR lab baru (X-011)

- [ ] `GET /health` mengembalikan JSON yang layak untuk healthcheck.
- [ ] Port **8080** di dalam container; expose selaras `docker-compose.yml` + proxy.
- [ ] UI & copy **tidak** duplicate default `_template` tanpa penyesuaian (tema / persona / warna beda).
- [ ] `STORY.md` (atau setara) berisi sinopsis studi kasus fiksi ID + EN.
- [ ] Flag & perilaku vulnerable sesuai PRD modul (bila sudah diimplementasi).

Template Dockerfile disarankan mengekspor **`GET /health`** (JSON) untuk orkestrasi.
