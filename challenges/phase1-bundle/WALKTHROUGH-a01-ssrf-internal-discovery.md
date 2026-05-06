# Walkthrough uji: `a01-ssrf-internal-discovery` (SSRF)

## Ringkas

1. Buka lab **LautanLink Sentinel** dari platform.
2. Baca konteks di **Peta risiko** dan **SLA** untuk menyusun URL absolut `https://…` yang mengarah ke host metadata tiruan lab.
3. **Periksa URL** (atau `fetch?url=`) dan baca snapshot: baris status palsu plus JSON; flag di field `lab-bootstrap`.
4. Submit ke platform.

## Hint / write-up

Platform: blok Hint & write-up HTML setelah unlock / solve.
