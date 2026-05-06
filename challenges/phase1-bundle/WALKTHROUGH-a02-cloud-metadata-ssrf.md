# Walkthrough uji: `a02-cloud-metadata-ssrf`

## Ringkas

1. Baca **`runbook/migration`**: banyak baris **tenantKey**; hanya satu kunci yang masih memicu **`POST /api/atlas/session`** sukses (`ok: true`).
2. **`GET /api/atlas/fetch?url=`** dengan URL absolut ke stub metadata (mis. host `169.254.169.254` atau `internal.metadata`); parse body, field **`lab-bootstrap`** berisi flag.

## Hint / write-up

Platform: Hint tier + write-up HTML.
