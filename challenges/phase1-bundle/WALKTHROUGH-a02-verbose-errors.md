# Walkthrough uji: `a02-verbose-errors`

## Ringkas

1. Buka beranda **LaporHub**; minggu picker acak **1–52** mengembalikan rollup sukses.
2. Respons **500** generik untuk format salah, minggu **≤0**, **>52**, atau string non-pola — **tanpa** flag di body.
3. Picu cabang verbose dengan indeks minggu sangat besar (batas **int32**, mis. `?isoWeek=2025-W2147483647` lewat override); field **`trace`** berisi flag.

## Hint / write-up

Platform: Hint tier + write-up HTML.
