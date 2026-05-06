# Template challenge

Salin folder ini sebagai `challenges/<slug>/` dan sesuaikan:

1. **Port internal** konsisten (mis. `8080`) — catat di `docker-compose` + upstream Nginx.
2. **`GET /health`** mengembalikan `200` dan JSON `{"status":"ok"}` (kontrak SDD §11).
3. **Flag** di aplikasi harus cocok dengan hash di tabel `challenges` (seed platform), atau rotasi flag + migrasi hash.

File `Dockerfile` di sini adalah contoh minimal (Nginx memalsukan `/health`). Lab nyata mengganti dengan stack vulnerable sesuai PRD modul.
