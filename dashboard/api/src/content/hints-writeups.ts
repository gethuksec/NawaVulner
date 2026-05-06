/** Konten hint/write-up (bukan DB). Format teks: HTML aman (server-only); placeholder per slug. */

export type HintTexts = { textId: string; textEn: string };

export type SlugHints = Record<1 | 2 | 3, HintTexts>;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const A01_IDOR_HINTS: SlugHints = {
  1: {
    textId:
      "<p>Perhatikan bagaimana portal menentukan <strong>permohonan mana</strong> yang ditampilkan (misalnya lewat path atau query). Uji apakah nomor referensi di URL bisa diganti tanpa autentikasi ulang.</p>",
    textEn:
      "<p>Notice how the portal decides <strong>which application</strong> is shown (e.g. via path or query). Test whether the reference in the URL can be changed without re-authentication.</p>",
  },
  2: {
    textId:
      "<p>Bandingkan ringkasan untuk referensi yang Anda &quot;punya&quot; dengan variasi nomor lain. Cari perbedaan field (termasuk blok catatan internal) yang seharusnya tidak konsisten untuk semua pengunjung.</p>",
    textEn:
      "<p>Compare the summary for a reference you &quot;own&quot; with other reference numbers. Look for differing fields (including internal notes) that should not appear for every visitor.</p>",
  },
  3: {
    textId:
      "<p>Jika menemukan catatan verifikator atau field internal yang memuat pola <code>FLAG{...}</code>, salin ke form submit platform. Endpoint JSON paralel (jika ada) mengikuti logika yang sama.</p>",
    textEn:
      "<p>If you find a verifier note or internal field containing <code>FLAG{...}</code>, copy it into the platform submit form. A parallel JSON endpoint, if present, follows the same logic.</p>",
  },
};

const A01_JWT_HINTS: SlugHints = {
  1: {
    textId:
      "<p>Login akun demo <strong>warga</strong> / <strong>Layanan2024!</strong>. Setelah <code>POST login</code>, browser menyimpan cookie <code>mitabisa_jwt</code> (JWT tiga segmen). Buka DevTools → Network (response headers) atau Application → Cookies untuk melihat nilai token.</p>",
    textEn:
      "<p>Log in with demo <strong>warga</strong> / <strong>Layanan2024!</strong>. After <code>POST login</code>, the browser stores cookie <code>mitabisa_jwt</code> (three-part JWT). Use DevTools → Network (response headers) or Application → Cookies to inspect the token.</p>",
  },
  2: {
    textId:
      "<p>Payload JWT (segmen tengah, base64url) berisi JSON dengan pasangan role=user. Backend lab <strong>tidak memverifikasi tanda tangan</strong>; decode, ubah role menjadi admin, encode ulang base64url, susun lagi tiga segmen JWT, lalu simpan sebagai nilai cookie <code>mitabisa_jwt</code> (atau kirim sebagai Bearer ke endpoint <code>api/me</code>).</p>",
    textEn:
      "<p>The JWT payload (middle segment, base64url) is JSON with role set to user. The lab backend <strong>does not verify signatures</strong>; decode, change role to admin, re-encode base64url, rebuild the three JWT segments, then set cookie <code>mitabisa_jwt</code> (or send as Bearer to <code>api/me</code>).</p>",
  },
  3: {
    textId:
      "<p>Setelah sesi dianggap admin, buka path <code>admin</code> di lab atau halaman <strong>Profil</strong>. Flag juga dapat muncul di respons JSON endpoint <code>api/me</code> jika Anda memanggilnya dengan token yang sama.</p>",
    textEn:
      "<p>Once the session is treated as admin, open the <code>admin</code> path in the lab or <strong>Profil</strong>. The flag may also appear in the <code>api/me</code> JSON response when called with the same token.</p>",
  },
};

const A01_FORCE_BROWSE_HINTS: SlugHints = {
  1: {
    textId:
      "<p>Setelah URL dasar lab (<code>.../lab/a01-force-browse-admin/</code>), coba segmen path umum untuk panel: admin, administrator, admin.php, dashboard, panel, backend, console, internal, manage, operator, cpanel, wp-admin. Bisa manual, ffuf, atau alat serupa.</p>",
    textEn:
      "<p>After the lab base URL (<code>.../lab/a01-force-browse-admin/</code>), try common admin path segments: admin, administrator, admin.php, dashboard, panel, backend, console, internal, manage, operator, cpanel, wp-admin. Try manually, ffuf, or similar.</p>",
  },
  2: {
    textId:
      "<p>Panel internal sering pakai nama folder/file yang tidak ada di menu penjual. Coba variasi dengan tanda hubung atau garis bawah, misalnya admin-panel, admin_console, internal-tools.</p>",
    textEn:
      "<p>Internal panels often use folder names not linked from the seller UI. Try hyphen or underscore variants, e.g. admin-panel, admin_console, internal-tools.</p>",
  },
  3: {
    textId:
      "<p>Di build lab ini konsol pemeliharaan ada di path <code>admin-console</code>. Contoh URL penuh: <code>http://localhost:8080/lab/a01-force-browse-admin/admin-console</code> (sesuaikan host/port Anda). Flag plaintext ada di halaman itu; submit ke platform.</p>",
    textEn:
      "<p>In this lab build the maintenance console is at path <code>admin-console</code>. Example: <code>http://localhost:8080/lab/a01-force-browse-admin/admin-console</code> (adjust host/port). The plaintext flag is on that page; submit it on the platform.</p>",
  },
};

const A01_SSRF_HINTS: SlugHints = {
  1: {
    textId:
      "<p>Sentinel menarik respons dari sudut pandang <strong>server</strong>, bukan browser Anda. Form <strong>Periksa URL</strong> mengharuskan URL <strong>absolut</strong> lengkap dengan skema (<code>https://…</code>); petunjuk nama host yang relevan tersebar di halaman <strong>Peta risiko</strong> dan <strong>SLA</strong> di dalam lab.</p>",
    textEn:
      "<p>Sentinel fetches from the <strong>server</strong> side, not your browser. The <strong>Periksa URL</strong> form requires a full <strong>absolute</strong> URL including the scheme (<code>https://…</code>); host hints are scattered across the lab’s <strong>Risk map</strong> and <strong>SLA</strong> pages.</p>",
  },
  2: {
    textId:
      "<p>Lingkungan cloud sering menyediakan endpoint metadata dengan pola host tertentu. Eksplorasi manual atau wordlist internal umum dipakai SOC untuk menguji perimeter.</p>",
    textEn:
      "<p>Cloud environments often expose metadata endpoints with characteristic host patterns. Manual exploration or common internal wordlists are typical SOC perimeter tests.</p>",
  },
  3: {
    textId:
      "<p>Contoh host metadata tiruan di lab: <code>internal.metadata</code> atau alamat yang mengandung <code>169.254.169.254</code>. Snapshot menggabungkan baris status HTTP palsu dan tubuh JSON; flag berada di field <code>lab-bootstrap</code> pada respons metadata.</p>",
    textEn:
      "<p>Lab metadata hosts include <code>internal.metadata</code> or URLs containing <code>169.254.169.254</code>. The snapshot mixes fake HTTP status lines with a JSON body; the flag is in the <code>lab-bootstrap</code> field in the metadata response.</p>",
  },
};

const A01_CSRF_HINTS: SlugHints = {
  1: {
    textId:
      "<p>Ada endpoint baca-only <code>GET api/roster</code> (JSON) yang mengembalikan antara lain <code>pagerEmail</code> untuk sesi korban. Responsnya memakai CORS permisif. Uji dengan <code>fetch(..., { credentials: 'include' })</code> dari origin lain; bila cookie SameSite memblokir, buka <code>api/roster</code> lewat navigasi tab penuh atau jalankan rantai dari console DevTools pada tab yang sama dengan lab agar kredensial ikut.</p>",
    textEn:
      "<p>A read-only <code>GET api/roster</code> JSON endpoint returns fields such as <code>pagerEmail</code> for the victim session, with permissive CORS. Try credentialed <code>fetch</code> from another origin; if SameSite blocks cookies, open <code>api/roster</code> via a full tab navigation or run the chain from DevTools on the lab tab so credentials attach.</p>",
  },
  2: {
    textId:
      "<p>Langkah sensitif pertama: <code>POST email/change</code> (tanpa token CSRF) dengan body formulir yang memuat <code>email</code> baru dan <code>current</code> yang harus cocok dengan pager saat ini. Ini tidak mengembalikan flag, hanya status menunggu verifikasi.</p>",
    textEn:
      "<p>First sensitive step: <code>POST email/change</code> (no CSRF token) with form fields <code>email</code> and <code>current</code> matching the active pager. It does not return the flag, only a pending-verification status.</p>",
  },
  3: {
    textId:
      "<p>Langkah kedua: <code>POST email/verify</code> dengan JSON <code>{ \"email\", \"pin\" }</code> (PIN enam digit ada di halaman <strong>Log shift</strong> di lab). Respons sukses memuat <code>flag</code>. Rantai penuh: baca roster dari origin asing, picu perubahan, lalu verifikasi, semua dengan CORS terbuka.</p>",
    textEn:
      "<p>Second step: <code>POST email/verify</code> with JSON <code>{ \"email\", \"pin\" }</code> (the six-digit PIN appears on the lab’s <strong>Shift log</strong> page). A successful response includes <code>flag</code>. Full chain: read roster cross-origin, trigger the change, then verify, all with permissive CORS.</p>",
  },
};

const A01_MASS_HINTS: SlugHints = {
  1: {
    textId:
      "<p>Form Helios tidak menampilkan JSON mentah; UI hanya memberi konfirmasi ringan. API <code>POST api/me</code> menggabungkan seluruh JSON ke model karyawan. Gunakan DevTools Network atau proxy: respons sering memuat field model (misalnya <code>isAdmin</code>) walau tidak Anda kirim di permintaan pertama, itu petunjuk untuk replay dengan body diperluas.</p>",
    textEn:
      "<p>The Helios UI does not show raw JSON; it only gives a light confirmation. <code>POST api/me</code> merges the full JSON into the employee model. Use DevTools Network or a proxy: responses often include model fields (for example <code>isAdmin</code>) even when your first request did not send them, which hints at replay with an expanded body.</p>",
  },
  2: {
    textId:
      "<p>Kebijakan tiruan: eskalasi <code>isAdmin: true</code> hanya boleh dipasangkan dengan string <code>department</code> yang persis sama dengan salah satu label organigram resmi. Uji kandidat berikut satu per satu lewat replay JSON (server tidak memberi petunjuk mana yang benar di respons): <ul style=\"margin:.5rem 0 0 1rem\"><li>Platform Engineering</li><li>Divisi Digital Workplace</li><li>Enterprise Applications</li><li>IT Shared Services</li><li>Service Desk &amp; ITSM</li><li>Information Technology Group</li><li>Teknologi Informasi Korporat</li><li>Core Infrastructure</li><li>Cloud Center of Excellence</li><li>Security Operations</li><li>Pusat Layanan Teknologi Informasi</li><li>Data &amp; Analytics Engineering</li><li>Product Engineering</li></ul></p>",
    textEn:
      "<p>Lab policy: <code>isAdmin: true</code> only pairs with an exact <code>department</code> string from the official org chart list below. Replay JSON one candidate at a time (the server does not say which string is correct): <ul style=\"margin:.5rem 0 0 1rem\"><li>Platform Engineering</li><li>Digital Workplace Division</li><li>Enterprise Applications</li><li>IT Shared Services</li><li>Service Desk &amp; ITSM</li><li>Information Technology Group</li><li>Corporate Information Technology</li><li>Core Infrastructure</li><li>Cloud Center of Excellence</li><li>Security Operations</li><li>Pusat Layanan Teknologi Informasi</li><li>Data &amp; Analytics Engineering</li><li>Product Engineering</li></ul></p>",
  },
  3: {
    textId:
      "<p>Setelah kombinasi <code>isAdmin</code> + departemen yang benar diterima, field <code>bonus</code> berisi flag. Submit ke platform.</p>",
    textEn:
      "<p>Once <code>isAdmin</code> plus the correct department is accepted, <code>bonus</code> carries the flag. Submit it on the platform.</p>",
  },
};

const A02_DEFAULT_CREDS_HINTS: SlugHints = {
  1: {
    textId:
      "<p>Vendor sering meninggalkan akun bootstrap di appliance. Periksa <strong>sumber HTML</strong> (view-source) dan komentar tersembunyi sebelum mencoba kombinasi umum.</p>",
    textEn:
      "<p>Vendors often leave bootstrap accounts on appliances. Inspect <strong>HTML source</strong> (view-source) and hidden comments before trying common combinations.</p>",
  },
  2: {
    textId: "<p>Setelah menemukan pasangan user/password, kirim <code>POST /login</code> seperti form asli (urlencoded).</p>",
    textEn: "<p>Once you find the username/password pair, submit <code>POST /login</code> like the native form (urlencoded).</p>",
  },
  3: {
    textId: "<p>Respons sukses login menampilkan flag plaintext untuk submit platform.</p>",
    textEn: "<p>A successful login response shows the plaintext flag to submit on the platform.</p>",
  },
};

const A02_DIRECTORY_HINTS: SlugHints = {
  1: {
    textId:
      "<p>Unduh log build yang ditautkan dari beranda; baca teks mentahnya. Bila URL mengarah ke satu file, coba naik ke <strong>folder induk</strong> dengan memangkas nama file di bilah alamat.</p>",
    textEn:
      "<p>Download the build log linked from the home page; read the raw text. If the URL points at a single file, try moving to the <strong>parent folder</strong> by trimming the filename in the address bar.</p>",
  },
  2: {
    textId:
      "<p>Dari indeks tier-2, buka subfolder <code>manifest/</code>, baca JSON penunjuk, lalu telusuri jalur relatif yang disebutkan menuju area staging.</p>",
    textEn:
      "<p>From the tier-2 index, open <code>manifest/</code>, read the locator JSON, then follow the relative path it mentions into staging.</p>",
  },
  3: {
    textId: "<p>Di rantai <code>staging/_unlisted/</code>, unduh file flag; isinya untuk submit platform.</p>",
    textEn: "<p>Under <code>staging/_unlisted/</code>, download the flag file; its body is what you submit.</p>",
  },
};

const A02_VERBOSE_HINTS: SlugHints = {
  1: {
    textId:
      "<p>Endpoint rollup memakai query <code>isoWeek</code> bentuk <code>YYYY-W&lt;n&gt;</code>. Rentang bisnis normal minggu <strong>1–52</strong>; respons di luar itu sengaja dibuat generik tanpa detail indeks.</p>",
    textEn:
      "<p>The rollup endpoint uses <code>isoWeek</code> shaped like <code>YYYY-W&lt;n&gt;</code>. Normal business weeks are <strong>1–52</strong>; out-of-range cases return intentionally generic errors without per-index detail.</p>",
  },
  2: {
    textId:
      "<p>Pikirkan batas tipe integer pada normalizer minggu (mis. rentang <code>int32</code>) — satu kelas input sangat besar memicu cabang error yang berbeda dari respons generik.</p>",
    textEn:
      "<p>Think about integer limits in the week normalizer (e.g. <code>int32</code> range) — one class of very large inputs hits a different error branch than the generic responses.</p>",
  },
  3: {
    textId:
      "<p>Pada cabang error “verbose”, field <code>trace</code> tidak boleh dibaca pengguna akhir; di lab, token di dalamnya adalah flag.</p>",
    textEn:
      "<p>On the “verbose” error branch, the <code>trace</code> field must not be shown to end users; in the lab, the token inside is the flag.</p>",
  },
};

const A02_HEADERS_HINTS: SlugHints = {
  1: {
    textId:
      "<p>Ikuti <strong>Handbook partner</strong> di lab (<code>docs/partner-handbook</code>) untuk path mount resmi widget: <code>panel/sensor-grid</code>.</p>",
    textEn:
      "<p>Follow the in-lab <strong>partner handbook</strong> (<code>docs/partner-handbook</code>) for the official widget mount path: <code>panel/sensor-grid</code>.</p>",
  },
  2: {
    textId:
      "<p>Muat rute panel di dalam iframe same-origin (mis. halaman pratinjau internal) dan bandingkan dengan membuka URL panel langsung di tab utama — perilaku DOM biasanya beda.</p>",
    textEn:
      "<p>Load the panel route inside a same-origin iframe (e.g. an internal preview page) vs opening the panel URL top-level — DOM behavior usually differs.</p>",
  },
  3: {
    textId:
      "<p>Payload token tersemat tidak ditampilkan sebagai string polos di HTML standalone; dekripsi ringan (XOR) dijalankan hanya saat konteks iframe. Halaman pratinjau same-origin bisa membaca teks hasil iframe.</p>",
    textEn:
      "<p>The embedded token payload is not a plain string in standalone HTML; lightweight XOR runs only in an iframe context. A same-origin preview parent can read the iframe text output.</p>",
  },
};

const A02_CLOUD_META_HINTS: SlugHints = {
  1: {
    textId:
      "<p>Runbook migrasi memuat banyak <code>tenantKey</code> historis; hanya subset yang masih memicu sesi Atlas aktif. Uji konsistensi dengan respons <code>unknown_tenant_key</code> (tanpa petunjuk per-baris).</p>",
    textEn:
      "<p>The migration runbook lists many historical <code>tenantKey</code> values; only a subset still creates an active Atlas session. Mismatches return <code>unknown_tenant_key</code> without per-row hints.</p>",
  },
  2: {
    textId:
      "<p>Setelah cookie sesi terpasang, panggil <code>GET /api/atlas/fetch?url=</code> dengan URL absolut menuju stub metadata (mis. host yang mengandung <code>169.254.169.254</code> atau <code>internal.metadata</code>).</p>",
    textEn:
      "<p>Once the session cookie is set, call <code>GET /api/atlas/fetch?url=</code> with an absolute URL to the lab metadata stub (e.g. hosts containing <code>169.254.169.254</code> or <code>internal.metadata</code>).</p>",
  },
  3: {
    textId:
      "<p>Badan teks snapshot meniru HTTP + JSON; flag tiruan berada di field <code>lab-bootstrap</code> pada objek metadata.</p>",
    textEn:
      "<p>The snapshot body mimics HTTP + JSON; the lab flag sits in the <code>lab-bootstrap</code> field of the metadata object.</p>",
  },
};

const A02_DEBUG_HINTS: SlugHints = {
  1: {
    textId:
      "<p><strong>Tiket HD-4412</strong> (narasi lab): vendor baru mendapat akun <em>engineer</em> untuk pipeline saja, bukan admin. Kredensial staging (boleh dipakai di kelas): <code>stager@cargoship.ci</code> / <code>CargoDemo#2025</code>.</p><p>Buka lab lewat tombol platform; portal hanya menampilkan UI staging biasa. Login lewat form <code>/login</code> (body <code>application/x-www-form-urlencoded</code>) dengan <strong>hanya</strong> <code>email</code> dan <code>password</code> pada percobaan pertama — jika Anda menyisipkan field ekstra di <code>POST /login</code>, server bisa langsung memutus alur dengan respons debug (by design untuk latihan).</p>",
    textEn:
      "<p><strong>Ticket HD-4412</strong> (lab narrative): a new vendor gets an <em>engineer</em> account for the pipeline only, not admin. Staging credentials (classroom-safe): <code>stager@cargoship.ci</code> / <code>CargoDemo#2025</code>.</p><p>Open the lab from the platform button; the UI is a plain staging portal. Sign in via the <code>/login</code> form (<code>application/x-www-form-urlencoded</code>) with <strong>only</strong> <code>email</code> and <code>password</code> on the first attempt — extra fields on <code>POST /login</code> can short-circuit the flow with a debug response (intentional for the drill).</p>",
  },
  2: {
    textId:
      "<p>Setelah sesi cookie terpasang, buka <strong>Network</strong> (Chrome/Firefox) atau riwayat HTTP di Burp Suite / mitmproxy / OWASP ZAP. Kirim form <strong>Perbarui profil</strong> sekali dengan nilai normal; catat URL relatif, method <code>POST</code>, header <code>Content-Type</code>, dan pasangan field yang benar-benar dikirim browser.</p><p>Duplikasikan permintaan itu dari proxy: body yang sama, lalu <em>tambahkan</em> satu field yang dalam aplikasi nyata sering dilarang diisi klien (contoh pola: <code>role</code>, <code>role_id</code>, <code>is_admin</code>, <code>permissions</code>). Ini menguji apakah server meng-merge seluruh body tanpa allowlist — klasik <strong>mass assignment</strong> / over-posting.</p>",
    textEn:
      "<p>Once the session cookie is set, use <strong>Network</strong> (Chrome/Firefox) or HTTP history in Burp/mitmproxy/ZAP. Submit the <strong>profile update</strong> form once with normal values; note the relative URL, <code>POST</code> method, <code>Content-Type</code> header, and the exact field pairs the browser sends.</p><p>Replay from your proxy: same body, then <em>add</em> one field that real apps usually forbid from the client (patterns like <code>role</code>, <code>role_id</code>, <code>is_admin</code>, <code>permissions</code>). That probes whether the server merges the entire body without an allowlist — classic <strong>mass assignment</strong> / over-posting.</p>",
  },
  3: {
    textId:
      "<p>Build staging ini mengembalikan <strong>HTTP 500</strong> dengan halaman debug bergaya Laravel/Whoops yang mem-print snapshot request (sering berupa JSON indent). Bukan stack trace produksi — tapi cukup untuk membocorkan struktur internal.</p><p>Flag latihan disisipkan di struktur tiruan debug; telusuri objek bernama <code>policy_snapshot</code> dan field turunannya yang berbau korelasi/debug — salin nilai string flag ke form submit platform.</p>",
    textEn:
      "<p>This staging build returns <strong>HTTP 500</strong> with a Laravel/Whoops-style debug page that prints a request snapshot (often indented JSON). Not a production stack trace — but enough to leak internal-shaped data.</p><p>The lab flag is embedded in a fake debug structure; inspect the object named <code>policy_snapshot</code> and its nested debug/correlation-style field — copy the flag string into the platform submit form.</p>",
  },
};

export function hintsForSlug(slug: string): SlugHints {
  if (slug === "a01-idor-profil-user") {
    return A01_IDOR_HINTS;
  }
  if (slug === "a01-jwt-privilege-escalation") {
    return A01_JWT_HINTS;
  }
  if (slug === "a01-force-browse-admin") {
    return A01_FORCE_BROWSE_HINTS;
  }
  if (slug === "a01-ssrf-internal-discovery") {
    return A01_SSRF_HINTS;
  }
  if (slug === "a01-csrf-cors-chain") {
    return A01_CSRF_HINTS;
  }
  if (slug === "a01-mass-assignment-hpe") {
    return A01_MASS_HINTS;
  }
  if (slug === "a02-default-or-hardcoded-credentials") {
    return A02_DEFAULT_CREDS_HINTS;
  }
  if (slug === "a02-directory-listing") {
    return A02_DIRECTORY_HINTS;
  }
  if (slug === "a02-verbose-errors") {
    return A02_VERBOSE_HINTS;
  }
  if (slug === "a02-missing-security-headers") {
    return A02_HEADERS_HINTS;
  }
  if (slug === "a02-cloud-metadata-ssrf") {
    return A02_CLOUD_META_HINTS;
  }
  if (slug === "a02-debug-endpoint-leak") {
    return A02_DEBUG_HINTS;
  }
  const safe = escapeHtml(slug);
  const id = (n: number) =>
    `<p>Hint ${n} (MVP): amati permukaan serangan untuk challenge &quot;${safe}&quot;: parameter URL, header, cookie, dan respons API yang berbeda-beda.</p>`;
  const en = (n: number) =>
    `<p>Hint ${n} (MVP): observe the attack surface for &quot;${safe}&quot;: URL parameters, headers, cookies, and differing API responses.</p>`;
  return {
    1: { textId: id(1), textEn: en(1) },
    2: { textId: id(2), textEn: en(2) },
    3: { textId: id(3), textEn: en(3) },
  };
}

const A01_FORCE_BROWSE_WRITEUP_ID = `<article>
<h1>Write-up: a01-force-browse-admin (Force browsing ke panel admin)</h1>
<h2>Ringkas eksploitasi</h2>
<ol>
<li>Buka lab <strong>BengkelSnap Beta</strong> dari dashboard (URL berbentuk <code>/lab/a01-force-browse-admin/</code>).</li>
<li>Navigasi penjual hanya menampilkan Beranda, Pesanan, dan Bantuan. Tidak ada tautan ke panel internal.</li>
<li>Akses langsung path <code>admin-console</code> di bawah base URL lab, contoh: <code>/lab/a01-force-browse-admin/admin-console</code>.</li>
<li>Halaman <strong>Konsol pemeliharaan</strong> menampilkan flag plaintext. Salin ke form submit di platform NawaVulner.</li>
</ol>
<h2>Vektor (OWASP A01: Broken Access Control)</h2>
<p>Endpoint sensitif hanya disembunyikan dari UI, bukan dilindungi dengan <strong>autentikasi dan otorisasi per route</strong>. Akun peran penjual tetap bisa memuat URL admin jika pathnya diketahui atau ditebak (force browsing, path prediktif).</p>
<h2>Mitigasi</h2>
<ul>
<li>Terapkan <strong>RBAC</strong> dan middleware auth pada setiap route, termasuk route yang tidak ada di menu.</li>
<li>Hindari path admin bawaan yang umum; pertimbangkan path acak atau allowlist deploy.</li>
<li>Audit route (OpenAPI, DAST), uji regresi akses silang peran, dan matikan endpoint debug di produksi.</li>
</ul>
</article>`;

const A01_FORCE_BROWSE_WRITEUP_EN = `<article>
<h1>Write-up: a01-force-browse-admin (Force browse to admin panel)</h1>
<h2>Exploitation summary</h2>
<ol>
<li>Open the <strong>BengkelSnap Beta</strong> lab from the dashboard (URL shape <code>/lab/a01-force-browse-admin/</code>).</li>
<li>The seller UI only links Home, Orders, and Help. There is no link to the internal panel.</li>
<li>Browse directly to path <code>admin-console</code> under the lab base URL, e.g. <code>/lab/a01-force-browse-admin/admin-console</code>.</li>
<li>The <strong>Maintenance console</strong> page shows the plaintext flag. Copy it into the submit form on the NawaVulner platform.</li>
</ol>
<h2>Vector (OWASP A01: Broken Access Control)</h2>
<p>The sensitive endpoint is omitted from the UI, not protected with <strong>per-route authentication and authorization</strong>. A seller-tier session can still load the admin URL if the path is known or guessed (force browsing, predictable paths).</p>
<h2>Mitigations</h2>
<ul>
<li>Enforce <strong>RBAC</strong> and auth middleware on every route, including routes not linked in the UI.</li>
<li>Avoid default admin paths; consider random paths or deployment allowlists.</li>
<li>Route audits (OpenAPI, DAST), cross-role regression tests, and disable debug endpoints in production.</li>
</ul>
</article>`;

const A01_IDOR_WRITEUP_ID = `<article>
<h1>Write-up: a01-idor-profil-user (IDOR profil pemohon)</h1>
<h2>Ringkas eksploitasi</h2>
<ol>
<li>Buka lab <strong>Portal Sariwangi</strong> dari dashboard.</li>
<li>Buka ringkasan permohonan dari tautan beranda (URL memuat nomor referensi).</li>
<li>Ubah nomor referensi di URL (dan/atau coba endpoint JSON paralel <code>api/profile?id=</code>).</li>
<li>Pada salah satu referensi, blok <strong>catatan verifikator</strong> memuat flag. Salin ke platform.</li>
</ol>
<h2>Vektor (OWASP A01: Broken Access Control)</h2>
<p>Referensi objek (nomor di URL) tidak disilangkan dengan sesi: siapa pun yang mengubah referensi dapat membaca ringkasan permohonan lain termasuk catatan internal (IDOR).</p>
<h2>Mitigasi</h2>
<ul>
<li>Otorisasi per permintaan: id harus milik subjek yang sedang login.</li>
<li>Gunakan identifier acak tidak berurutan, atau token satu kali per sumber daya.</li>
<li>Jangan mengekspos catatan internal di view/API yang sama dengan portal warga.</li>
</ul>
</article>`;

const A01_IDOR_WRITEUP_EN = `<article>
<h1>Write-up: a01-idor-profil-user (IDOR applicant profile)</h1>
<h2>Exploitation summary</h2>
<ol>
<li>Open the <strong>Portal Sariwangi</strong> lab from the dashboard.</li>
<li>Open the application summary from the home link (URL contains a reference number).</li>
<li>Change the reference number in the URL (and/or try the parallel JSON endpoint <code>api/profile?id=</code>).</li>
<li>For one reference, the <strong>verifier note</strong> block contains the flag. Copy it to the platform.</li>
</ol>
<h2>Vector (OWASP A01: Broken Access Control)</h2>
<p>Object references (number in the URL) are not bound to the session: anyone who changes the reference can read another applicant’s summary including internal notes (IDOR).</p>
<h2>Mitigations</h2>
<ul>
<li>Authorize every access: id must belong to the logged-in subject.</li>
<li>Use non-sequential opaque identifiers or scoped tokens.</li>
<li>Do not expose internal notes on the same citizen-facing view/API.</li>
</ul>
</article>`;

const A01_JWT_WRITEUP_ID = `<article>
<h1>Write-up: a01-jwt-privilege-escalation (JWT privilege escalation)</h1>
<h2>Ringkas eksploitasi</h2>
<ol>
<li>Buka lab <strong>Mitabisa SSO</strong> dari dashboard.</li>
<li>Login dengan <strong>warga</strong> / <strong>Layanan2024!</strong>; perhatikan cookie <code>mitabisa_jwt</code> (Network → response / Application).</li>
<li>Decode payload (base64url), ubah <code>role</code> menjadi <code>admin</code>, encode ulang, rebuild JWT; set ulang cookie atau panggil <code>api/me</code> dengan Bearer.</li>
<li>Buka <code>admin</code> atau halaman <strong>Profil</strong> (atau <code>GET api/me</code> dengan token yang sama) untuk membaca flag. Submit ke platform.</li>
</ol>
<h2>Vektor (OWASP A01 / A07 overlap)</h2>
<p>Aplikasi mempercayai klaim <code>role</code> dari token yang dikirim klien tanpa memverifikasi tanda tangan (demo). Penyerang bisa menaikkan hak lewat token yang dimodifikasi.</p>
<h2>Mitigasi</h2>
<ul>
<li>Verifikasi tanda tangan (algoritma, kunci, kid), cek <code>exp</code>, <code>aud</code>, <code>iss</code>.</li>
<li>Simpan token sensitif HttpOnly + Secure bila memungkinkan; tetap verifikasi di server.</li>
<li>Otorisasi server-side: jangan hanya percaya klaim JWT untuk route admin.</li>
</ul>
</article>`;

const A01_JWT_WRITEUP_EN = `<article>
<h1>Write-up: a01-jwt-privilege-escalation (JWT privilege escalation)</h1>
<h2>Exploitation summary</h2>
<ol>
<li>Open the <strong>Mitabisa SSO</strong> lab from the dashboard.</li>
<li>Sign in as <strong>warga</strong> / <strong>Layanan2024!</strong>; inspect cookie <code>mitabisa_jwt</code> (Network response / Application).</li>
<li>Base64url-decode the payload, set <code>role</code> to <code>admin</code>, re-encode, rebuild the JWT; update the cookie or call <code>api/me</code> with Bearer.</li>
<li>Open <code>admin</code> or <strong>Profil</strong> (or <code>GET api/me</code> with the same token) to read the flag. Submit on the platform.</li>
</ol>
<h2>Vector (OWASP A01 / A07 overlap)</h2>
<p>The app trusts the <code>role</code> claim from a client-supplied token without verifying the signature (demo). An attacker can escalate by forging or tampering the token.</p>
<h2>Mitigations</h2>
<ul>
<li>Verify signatures (algorithm, keys, kid), validate <code>exp</code>, <code>aud</code>, <code>iss</code>.</li>
<li>Prefer HttpOnly + Secure cookies where appropriate; still verify server-side.</li>
<li>Enforce server-side authorization; never rely on JWT claims alone for admin routes.</li>
</ul>
</article>`;

const A01_SSRF_WRITEUP_ID = `<article>
<h1>Write-up: a01-ssrf-internal-discovery (SSRF)</h1>
<h2>Ringkas eksploitasi</h2>
<ol>
<li>Buka lab <strong>LautanLink Sentinel</strong> dari dashboard.</li>
<li>Baca petunjuk konteks di <strong>Peta risiko</strong> dan <strong>SLA</strong>, lalu gunakan alur <strong>Periksa URL</strong> / <code>hasil?url=</code> (atau endpoint mentah <code>fetch?url=</code>) dengan URL absolut <code>https://…</code>.</li>
<li>Arahkan permintaan server-side ke host metadata tiruan (<code>internal.metadata</code> atau pola <code>169.254.169.254</code>).</li>
<li>Baca snapshot: baris status HTTP palsu plus JSON; flag ada di field <code>lab-bootstrap</code>. Salin ke platform.</li>
</ol>
<h2>Vektor</h2>
<p>Pratinjau URL tanpa allowlist memaksa backend menjadi proxy; penyerang memetakan jaringan internal atau metadata cloud.</p>
<h2>Mitigasi</h2>
<ul>
<li>Blokir skema/host/port berbahaya; gunakan resolver terkontrol.</li>
<li>Nonaktifkan redirect berantai menuju internal; segmentasi jaringan.</li>
</ul>
</article>`;

const A01_SSRF_WRITEUP_EN = `<article>
<h1>Write-up: a01-ssrf-internal-discovery (SSRF)</h1>
<h2>Exploitation summary</h2>
<ol>
<li>Open the <strong>LautanLink Sentinel</strong> lab from the dashboard.</li>
<li>Read context on the <strong>Risk map</strong> and <strong>SLA</strong> pages, then use <strong>Periksa URL</strong> / <code>hasil?url=</code> (or raw <code>fetch?url=</code>) with a full absolute <code>https://…</code> URL.</li>
<li>Point the server-side fetch at a lab metadata host (<code>internal.metadata</code> or <code>169.254.169.254</code> patterns).</li>
<li>Read the snapshot: fake HTTP status lines plus JSON; the flag is in <code>lab-bootstrap</code>. Copy it to the platform.</li>
</ol>
<h2>Vector</h2>
<p>URL previews without strict allowlists turn the backend into a proxy; attackers map internal networks or cloud metadata.</p>
<h2>Mitigations</h2>
<ul>
<li>Block dangerous schemes/hosts/ports; use controlled resolvers.</li>
<li>Disable hop-by-hop redirects to internal ranges; network segmentation.</li>
</ul>
</article>`;

const A01_CSRF_WRITEUP_ID = `<article>
<h1>Write-up: a01-csrf-cors-chain (CSRF + CORS)</h1>
<h2>Ringkas eksploitasi</h2>
<ol>
<li>Buka <strong>NusaOps</strong> (sesi demo memakai cookie email pager).</li>
<li>Dari origin lain, <code>GET api/roster</code> dengan kredensial untuk membaca <code>pagerEmail</code> (CORS <code>*</code>).</li>
<li><code>POST email/change</code> tanpa token CSRF, kirim <code>email</code> baru dan <code>current</code> yang cocok dengan roster; respons tidak memuat flag.</li>
<li>Baca PIN verifikasi di halaman <strong>Log shift</strong>, lalu <code>POST email/verify</code> dengan JSON <code>email</code> + <code>pin</code>; respons sukses memuat <code>flag</code>. Salin ke platform.</li>
</ol>
<h2>Vektor</h2>
<p>Rantai: aksi sensitif tanpa CSRF + CORS permisif mengungkap isi respons ke situs attacker.</p>
<h2>Mitigasi</h2>
<ul>
<li>Token CSRF sinkron/double-submit; SameSite cookie ketat.</li>
<li>Jangan gunakan <code>*</code> dengan respons sensitif; allowlist origin + tanpa credentials liar.</li>
</ul>
</article>`;

const A01_CSRF_WRITEUP_EN = `<article>
<h1>Write-up: a01-csrf-cors-chain (CSRF + CORS)</h1>
<h2>Exploitation summary</h2>
<ol>
<li>Open <strong>NusaOps</strong> (demo session uses a pager email cookie).</li>
<li>From another origin, credentialed <code>GET api/roster</code> reads <code>pagerEmail</code> (CORS <code>*</code>).</li>
<li>CSRF <code>POST email/change</code> (no anti-CSRF token) with a new <code>email</code> and matching <code>current</code>; the response does not include the flag.</li>
<li>Read the verification PIN on the <strong>Shift log</strong> page, then <code>POST email/verify</code> with JSON <code>email</code> + <code>pin</code>; a success response includes <code>flag</code>. Copy it to the platform.</li>
</ol>
<h2>Vector</h2>
<p>Chain: sensitive state change without CSRF plus permissive CORS exposes response bodies to attacker sites.</p>
<h2>Mitigations</h2>
<ul>
<li>CSRF tokens; strict SameSite cookies.</li>
<li>Avoid <code>*</code> on sensitive responses; origin allowlists and sane credential policies.</li>
</ul>
</article>`;

const A01_MASS_WRITEUP_ID = `<article>
<h1>Write-up: a01-mass-assignment-hpe (Mass assignment)</h1>
<h2>Ringkas eksploitasi</h2>
<ol>
<li>Buka <strong>Helios People</strong> dan form profil.</li>
<li>Intercept <code>POST api/me</code> (JSON); UI tidak menampilkan JSON mentah.</li>
<li>Tambahkan field boolean sensitif (<code>isAdmin: true</code>) dan cocokkan string <code>department</code> dengan unit IT yang sah (salah satu dari daftar petunjuk platform).</li>
<li>Jika kombinasi diterima, field <code>bonus</code> berisi flag; submit ke platform.</li>
</ol>
<h2>Vektor</h2>
<p>Binding massal body JSON ke model tanpa allowlist memungkinkan eskalasi horizontal/privilege.</p>
<h2>Mitigasi</h2>
<ul>
<li>DTO + allowlist field; tolak field tak dikenal.</li>
<li>Field sensitif hanya lewat endpoint admin terpisah dengan RBAC.</li>
</ul>
</article>`;

const A01_MASS_WRITEUP_EN = `<article>
<h1>Write-up: a01-mass-assignment-hpe (Mass assignment)</h1>
<h2>Exploitation summary</h2>
<ol>
<li>Open <strong>Helios People</strong> and the profile form.</li>
<li>Intercept <code>POST api/me</code> (JSON); the UI does not show raw JSON.</li>
<li>Add <code>isAdmin: true</code> and align <code>department</code> with the approved IT unit string (one of the platform hint list).</li>
<li>When accepted, <code>bonus</code> contains the flag; submit on the platform.</li>
</ol>
<h2>Vector</h2>
<p>Mass-binding JSON bodies to models without allowlists enables horizontal or privilege escalation.</p>
<h2>Mitigations</h2>
<ul>
<li>DTOs + field allowlists; reject unknown fields.</li>
<li>Sensitive fields only via separate admin endpoints with RBAC.</li>
</ul>
</article>`;

const A02_DEFAULT_WRITEUP_ID = `<article>
<h1>Write-up: a02-default-or-hardcoded-credentials</h1>
<h2>Ringkas eksploitasi</h2>
<ol><li>Buka lab <strong>KlinikLogin OEM</strong>, periksa sumber HTML (komentar commissioning di antara noise vendor).</li><li>Gunakan pasangan <code>admin</code> / <code>LabBootstrap!77</code> pada form <code>POST /login</code>.</li><li>Salin flag dari halaman sukses ke platform.</li></ol>
<h2>Mitigasi</h2><ul><li>Rotasi wajib saat instalasi; nonaktifkan akun bootstrap.</li><li>Jangan menaruh kredensial di komentar HTML atau PDF bawaan.</li></ul>
</article>`;
const A02_DEFAULT_WRITEUP_EN = `<article>
<h1>Write-up: a02-default-or-hardcoded-credentials</h1>
<h2>Exploitation summary</h2>
<ol><li>Open the <strong>KlinikLogin OEM</strong> lab; view HTML source (commissioning comment among vendor noise).</li><li>Submit <code>admin</code> / <code>LabBootstrap!77</code> to <code>POST /login</code>.</li><li>Copy the flag from the success page to the platform.</li></ol>
<h2>Mitigations</h2><ul><li>Mandatory first-boot rotation; disable bootstrap accounts.</li><li>Never ship credentials in HTML comments.</li></ul>
</article>`;

const A02_DIR_WRITEUP_ID = `<article>
<h1>Write-up: a02-directory-listing</h1>
<h2>Ringkas eksploitasi</h2>
<ol><li>Dari beranda unduh <code>cdn/artifacts/tier2/build-884c.log</code>; baca petunjuk tentang memangkas nama file untuk membuka indeks parent.</li><li>Buka indeks <code>cdn/artifacts/tier2/</code>, lanjut ke <code>manifest/</code>, baca <code>vault-locator.json</code>, ikuti folder <code>staging/_unlisted/</code>.</li><li>Unduh <code>SECRETS.flag</code>; isinya flag platform.</li></ol>
<h2>Mitigasi</h2><ul><li>Matikan autoindex; gunakan signed URL atau auth.</li></ul>
</article>`;
const A02_DIR_WRITEUP_EN = `<article>
<h1>Write-up: a02-directory-listing</h1>
<h2>Exploitation summary</h2>
<ol><li>From the home page download <code>cdn/artifacts/tier2/build-884c.log</code>; read the hint about trimming the filename to open the parent index.</li><li>Open <code>cdn/artifacts/tier2/</code>, continue to <code>manifest/</code>, read <code>vault-locator.json</code>, follow into <code>staging/_unlisted/</code>.</li><li>Download <code>SECRETS.flag</code>; its body is the platform flag.</li></ol>
<h2>Mitigations</h2><ul><li>Disable autoindex; use auth or signed URLs.</li></ul>
</article>`;

const A02_VERBOSE_WRITEUP_ID = `<article>
<h1>Write-up: a02-verbose-errors</h1>
<h2>Ringkas eksploitasi</h2>
<ol><li>Buka konsol LaporHub; minggu ISO <code>1–52</code> mengembalikan rollup sukses; nilai di luar itu memicu error generik tanpa flag.</li><li>Trigger cabang error verbose dengan indeks minggu sangat besar (batas <code>int32</code>) pada pola <code>YYYY-W&lt;n&gt;</code>.</li><li>Baca JSON 500; field <code>trace</code> berisi token korelasi tiruan (flag).</li></ol>
<h2>Mitigasi</h2><ul><li>Respons error generik; validasi rentang; hindari gabung stack trace ke klien.</li></ul>
</article>`;
const A02_VERBOSE_WRITEUP_EN = `<article>
<h1>Write-up: a02-verbose-errors</h1>
<h2>Exploitation summary</h2>
<ol><li>Open the LaporHub console; ISO weeks <code>1–52</code> return a successful rollup; other out-of-range values return generic errors without the flag.</li><li>Trigger the verbose error branch with a very large week index (near <code>int32</code> limits) using <code>YYYY-W&lt;n&gt;</code>.</li><li>Read the 500 JSON; the <code>trace</code> field embeds a lab correlation token (the flag).</li></ol>
<h2>Mitigations</h2><ul><li>Generic client errors; strict range validation; never ship stack traces to browsers.</li></ul>
</article>`;

const A02_HEADERS_WRITEUP_ID = `<article>
<h1>Write-up: a02-missing-security-headers</h1>
<h2>Ringkas eksploitasi</h2>
<ol><li>Buka <code>docs/partner-handbook</code> di lab untuk path mount <code>panel/sensor-grid</code>.</li><li>Muat route itu di <code>&lt;iframe&gt;</code> same-origin (halaman uji Anda); skrip mendekripsi payload XOR; tanpa frame guard, induk dapat membaca teks iframe.</li><li>View-source halaman panel standalone tidak memuat flag plaintext.</li></ol>
<h2>Mitigasi</h2><ul><li><code>X-Frame-Options</code> / CSP <code>frame-ancestors</code>; jangan mengirim rahasia ke klien meski “terenkripsi ringan”.</li></ul>
</article>`;
const A02_HEADERS_WRITEUP_EN = `<article>
<h1>Write-up: a02-missing-security-headers</h1>
<h2>Exploitation summary</h2>
<ol><li>Open the in-lab <code>docs/partner-handbook</code> for the mount path <code>panel/sensor-grid</code>.</li><li>Load that route in a same-origin <code>&lt;iframe&gt;</code> (your own test page); JS XOR-decrypts the payload; without a frame guard, the parent can read iframe text.</li><li>View-source on standalone panel HTML does not contain a plaintext flag.</li></ol>
<h2>Mitigations</h2><ul><li><code>X-Frame-Options</code> / CSP <code>frame-ancestors</code>; never ship secrets to browsers even if “lightly obfuscated”.</li></ul>
</article>`;

const A02_CLOUD_WRITEUP_ID = `<article>
<h1>Write-up: a02-cloud-metadata-ssrf</h1>
<h2>Ringkas eksploitasi</h2>
<ol><li>Baca runbook migrasi: banyak <code>tenantKey</code> noise; identifikasi kunci shard yang masih valid (respons <code>ok</code> dari <code>POST /api/atlas/session</code>).</li><li><code>GET /api/atlas/fetch?url=</code> ke URL absolut stub metadata; parse badan, field <code>lab-bootstrap</code> berisi flag.</li></ol>
<h2>Mitigasi</h2><ul><li>Allowlist host/port; blok rentang metadata; IMDSv2; rotasi kunci tenant.</li></ul>
</article>`;
const A02_CLOUD_WRITEUP_EN = `<article>
<h1>Write-up: a02-cloud-metadata-ssrf</h1>
<h2>Exploitation summary</h2>
<ol><li>Read the migration runbook: many noisy <code>tenantKey</code> rows; find the shard key that still returns <code>ok</code> from <code>POST /api/atlas/session</code>.</li><li><code>GET /api/atlas/fetch?url=</code> to an absolute metadata stub URL; parse the body, field <code>lab-bootstrap</code> holds the flag.</li></ol>
<h2>Mitigations</h2><ul><li>Host/port allowlists; block metadata ranges; IMDSv2; rotate tenant keys.</li></ul>
</article>`;

const A02_DEBUG_WRITEUP_ID = `<article>
<h1>Write-up: a02-debug-endpoint-leak</h1>
<h2>Ringkas eksploitasi</h2>
<ol><li>Baca <strong>Latar</strong> di halaman challenge (tiket HD-4412 + kredensial staging).</li><li>Login lewat <code>POST /login</code> dengan body hanya <code>email</code> + <code>password</code> agar cookie sesi terpasang.</li><li>Di dashboard, amati <code>POST api/profile</code> di Network/proxy; ulang permintaan dengan field tambahan (mass assignment).</li><li>Respons Whoops menampilkan dump request; flag pada <code>policy_snapshot.debug_correlation</code> (nilai string).</li></ol>
<h2>Mitigasi</h2><ul><li><code>$fillable</code> / <code>$guarded</code> (atau DTO eksplisit); matikan <code>APP_DEBUG</code> di lingkungan yang bisa dijangkau pengguna; jangan mengembalikan snapshot permintaan lengkap ke browser.</li></ul>
</article>`;
const A02_DEBUG_WRITEUP_EN = `<article>
<h1>Write-up: a02-debug-endpoint-leak</h1>
<h2>Exploitation summary</h2>
<ol><li>Read the challenge page <strong>backstory</strong> (HD-4412 ticket + staging credentials).</li><li>Log in via <code>POST /login</code> with a body containing only <code>email</code> + <code>password</code> so the session cookie is set.</li><li>On the dashboard, observe <code>POST api/profile</code> in Network/your proxy; replay with extra fields (mass assignment).</li><li>The Whoops response prints a request dump; the flag is at <code>policy_snapshot.debug_correlation</code> (string value).</li></ol>
<h2>Mitigations</h2><ul><li>Use <code>$fillable</code> / <code>$guarded</code> (or explicit DTOs); disable <code>APP_DEBUG</code> for user-reachable environments; never return full request snapshots to browsers.</li></ul>
</article>`;

export function writeupHtml(slug: string, lang: "id" | "en"): string {
  if (slug === "a01-force-browse-admin") {
    return lang === "id" ? A01_FORCE_BROWSE_WRITEUP_ID : A01_FORCE_BROWSE_WRITEUP_EN;
  }
  if (slug === "a01-idor-profil-user") {
    return lang === "id" ? A01_IDOR_WRITEUP_ID : A01_IDOR_WRITEUP_EN;
  }
  if (slug === "a01-jwt-privilege-escalation") {
    return lang === "id" ? A01_JWT_WRITEUP_ID : A01_JWT_WRITEUP_EN;
  }
  if (slug === "a01-ssrf-internal-discovery") {
    return lang === "id" ? A01_SSRF_WRITEUP_ID : A01_SSRF_WRITEUP_EN;
  }
  if (slug === "a01-csrf-cors-chain") {
    return lang === "id" ? A01_CSRF_WRITEUP_ID : A01_CSRF_WRITEUP_EN;
  }
  if (slug === "a01-mass-assignment-hpe") {
    return lang === "id" ? A01_MASS_WRITEUP_ID : A01_MASS_WRITEUP_EN;
  }
  if (slug === "a02-default-or-hardcoded-credentials") {
    return lang === "id" ? A02_DEFAULT_WRITEUP_ID : A02_DEFAULT_WRITEUP_EN;
  }
  if (slug === "a02-directory-listing") {
    return lang === "id" ? A02_DIR_WRITEUP_ID : A02_DIR_WRITEUP_EN;
  }
  if (slug === "a02-verbose-errors") {
    return lang === "id" ? A02_VERBOSE_WRITEUP_ID : A02_VERBOSE_WRITEUP_EN;
  }
  if (slug === "a02-missing-security-headers") {
    return lang === "id" ? A02_HEADERS_WRITEUP_ID : A02_HEADERS_WRITEUP_EN;
  }
  if (slug === "a02-cloud-metadata-ssrf") {
    return lang === "id" ? A02_CLOUD_WRITEUP_ID : A02_CLOUD_WRITEUP_EN;
  }
  if (slug === "a02-debug-endpoint-leak") {
    return lang === "id" ? A02_DEBUG_WRITEUP_ID : A02_DEBUG_WRITEUP_EN;
  }
  const safe = escapeHtml(slug);
  if (lang === "id") {
    return `<article>
<h1>Write-up: ${safe}</h1>
<p><em>MVP: placeholder.</em> Ringkas: identifikasi vektor, buktikan eksploitasi, lalu terapkan mitigasi (validasi input, least privilege, hardening).</p>
<p>Lihat PRD modul terkait untuk daftar teknik resmi OWASP Top 10:2025.</p>
</article>`;
  }
  return `<article>
<h1>Write-up: ${safe}</h1>
<p><em>MVP: placeholder.</em> Summarize: identify the vector, prove exploitation, then apply mitigations (input validation, least privilege, hardening).</p>
<p>See the PRD module for OWASP Top 10:2025-aligned techniques.</p>
</article>`;
}
