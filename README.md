# NawaVulner

Aplikasi **latihan keamanan web self-hosted**: SPA dashboard + API (Node, Postgres) + lab challenge di path `/lab/<slug>/` (satu service bundle Fase 1).

## Deploy

```powershell
docker compose up -d --build
```

Buka **http://localhost:8080** (default). Untuk secret kuat: salin `.env.example` → `.env`, sesuaikan lalu jalankan perintah di atas lagi. Jika ganti port host, set juga `PUBLIC_BASE_URL` agar link “Buka lab” benar.

| Perintah | Gunanya |
|----------|-----------|
| `docker compose ps` | Cek container jalan |
| `docker compose logs -f nawa-api` | Log API |
| `docker compose down` | Stop (data DB tetap) |
| `docker compose down -v` | Stop + hapus volume DB |
| `docker compose restart nawa-proxy` | Setelah ubah `nginx/nawa-proxy.conf` |

Hot-reload API di Compose: `docker-compose.override.example.yml` → `docker-compose.override.yml`.
