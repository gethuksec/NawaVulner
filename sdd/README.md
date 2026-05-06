# NawaVulner — Software Design Document (SDD)

Folder ini berisi **Software Design Document** turunan dari [prd/NawaVulner_PRD_v1.0.md](../prd/NawaVulner_PRD_v1.0.md).

| Dokumen | Isi ringkas |
|---------|-------------|
| [NawaVulner_SDD_v1.0.md](./NawaVulner_SDD_v1.0.md) | SDD lengkap: arsitektur, data, API, keamanan, kontrak challenge, NFR, pengujian, traceability PRD |
| [TASKS.md](./TASKS.md) | **Pelacak implementasi:** checklist ber-ID (DEC, F0–F5, CH-A01–A10), kriteria selesai, gate fase |
| [DECISIONS.md](./DECISIONS.md) | Jawaban Ask (auth, routing lab, stub reset, Drizzle, entry URL) |
| [BOOTSTRAP.md](./BOOTSTRAP.md) | Ringkasan siklus Ask → Eksekusi → Verifikasi → Dokumentasi (sesi awal) |
| [VERIFICATION.md](./VERIFICATION.md) | Checklist verifikasi & status build |
| [QA-FASE1.md](./QA-FASE1.md) | **Uji AFK Fase 1:** lab bundle, flag, first blood, strict, UI baru |
| [P1-LAB-RESET.md](./P1-LAB-RESET.md) | Batasan stub `POST .../lab/reset` + langkah operator |

Versi dokumen ini selaras dengan **PRD v1.0** dan target **MVP v1.0**.

### Melacak progres

1. Buka [TASKS.md](./TASKS.md).
2. Centang `- [x]` per tugas selesai (commit bersama perubahan agar histori jelas).
3. Gunakan **ID task** di pesan commit, misalnya: `F0-B-002: add challenges seed migration`.
