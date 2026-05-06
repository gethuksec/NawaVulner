# Walkthrough uji: `a02-debug-endpoint-leak`

## Alur mengajar (manusiawi)

1. **Konteks** — Baca **Latar** di halaman challenge platform (tiket HD-4412 + kredensial staging). Lab web sengaja minimal seperti portal staging nyata.
2. **Login normal** — `GET login` → form → `POST login` dengan **hanya** `email` + `password` → cookie sesi → redirect **`dashboard`**.
3. **Mass assignment** — Amati `POST api/profile` di Network/proxy; ulang permintaan dengan field tambahan (over-posting).
4. **Debug bocor** — Respons **Whoops** (simulasi) memuat dump request JSON; flag di **`policy_snapshot.debug_correlation`**.

## Variasi untuk kelas

- `POST /login` dengan kredensial benar **plus** field ekstra di body juga memicu halaman debug (merge input di auth).

## Hint / write-up

Platform: Hint tier + write-up HTML.
