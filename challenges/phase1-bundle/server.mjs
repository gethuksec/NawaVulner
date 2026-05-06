/**
 * Bundle lab Fase 1 (A01×6 + A02×6 + A05×6). Nginx mengirim header `X-Nawa-Lab-Slug` dan path tanpa prefix /lab/<slug>/.
 * FLAG harus sinkron dengan dashboard/api/src/seed/challenges-data.ts
 */
import express from "express";

/** XOR + base64url (bukan enkripsi kuat — cukup agar flag tidak literal di view-source HTML). */
function xorB64UrlUtf8(plain, keyStr) {
  const p = Buffer.from(plain, "utf8");
  const k = Buffer.from(keyStr, "utf8");
  const o = Buffer.alloc(p.length);
  for (let i = 0; i < p.length; i++) o[i] = p[i] ^ k[i % k.length];
  return o.toString("base64url");
}

function escapePreText(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Halaman error bergaya Laravel / Whoops — flag hanya di dump “Request” (lab only). */
function laravelMassAssignmentLeakPage(flag, whereLabel, bodyObj) {
  const merged = { ...bodyObj, "policy_snapshot.debug_correlation": flag };
  const dump = escapePreText(JSON.stringify(merged, null, 2));
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><title>Whoops! (simulasi)</title>
<style>
body{margin:0;background:#f5f5f5;font-family:ui-sans-serif,system-ui;color:#333;}
.top{background:#e74c3c;color:#fff;padding:1rem 1.5rem;font-weight:700;font-size:1.05rem}
.wrap{max-width:920px;margin:1.5rem auto;padding:0 1rem}
.card{background:#fff;border:1px solid #ddd;border-radius:6px;padding:1.25rem;margin-bottom:1rem;box-shadow:0 1px 3px rgba(0,0,0,.08)}
h2{margin:0 0 .5rem;font-size:.95rem;color:#c0392b}
pre{background:#2d2d2d;color:#f8f8f2;padding:1rem;border-radius:6px;overflow:auto;font-size:.72rem;line-height:1.45}
.muted{color:#777;font-size:.82rem;line-height:1.55}
.tag{display:inline-block;background:#fdeaea;color:#922;border-radius:4px;padding:.15rem .45rem;font-size:.72rem;margin-right:.35rem}
</style></head><body>
<div class="top">Whoops, something went wrong.</div>
<div class="wrap">
<div class="card"><span class="tag">Illuminate\\Database\\QueryException</span><span class="tag">HTTP 500</span>
<h2>SQLSTATE[42S22]: Column not found: <code>requested_role</code> in field list</h2>
<p class="muted">Terjadi saat menggabungkan input HTTP ke model <code>User</code> tanpa <code>$fillable</code> / <code>$guard</code> yang ketat (${whereLabel}). Query builder mencoba menulis kolom yang tidak ada di skema staging.</p></div>
<div class="card"><h2 style="margin:0 0 .5rem;font-size:.9rem;color:#555">Request (merged input — sensitive)</h2>
<pre>${dump}</pre>
<p class="muted">Di produksi, jangan pernah mengembalikan snapshot request + stack ke klien; log server-side saja.</p></div>
<div class="card"><h2 style="font-size:.85rem;margin:0 0 .5rem">Stack trace (truncated)</h2>
<pre>#0 /var/www/vendor/laravel/framework/src/Illuminate/Database/Connection.php(712): PDOStatement->execute()
#1 /var/www/vendor/laravel/framework/src/Illuminate/Database/Connection.php(672): … binding merge …
#2 /var/www/app/Http/Controllers/ProfileController.php(88): User::updateOrCreate(Array)
#3 … AccessPolicy::assertRoleTransition() — <span style="color:#e67e22">rejected: engineer → admin via mass-assigned field</span></pre></div>
</div></body></html>`;
}

const CARGOSHIP_LAB_EMAIL = "stager@cargoship.ci";
const CARGOSHIP_LAB_PASSWORD = "CargoDemo#2025";

const FLAGS = {
  "a01-idor-profil-user": "FLAG{idor_basic_1}",
  "a01-force-browse-admin": "FLAG{force_browse_1}",
  "a01-jwt-privilege-escalation": "FLAG{jwt_privesc_1}",
  "a01-ssrf-internal-discovery": "FLAG{ssrf_internal_1}",
  "a01-csrf-cors-chain": "FLAG{csrf_cors_chain_1}",
  "a01-mass-assignment-hpe": "FLAG{mass_assign_1}",
  "a02-default-or-hardcoded-credentials": "FLAG{default_cred_1}",
  "a02-directory-listing": "FLAG{dir_listing_1}",
  "a02-verbose-errors": "FLAG{verbose_error_1}",
  "a02-missing-security-headers": "FLAG{missing_headers_1}",
  "a02-cloud-metadata-ssrf": "FLAG{cloud_meta_1}",
  "a02-debug-endpoint-leak": "FLAG{debug_endpoint_1}",
  "a05-sqli-login-bypass": "FLAG{sqli_login_1}",
  "a05-reflected-xss": "FLAG{xss_reflect_1}",
  "a05-sqli-union": "FLAG{sqli_union_1}",
  "a05-stored-xss-cookie-steal": "FLAG{xss_stored_1}",
  "a05-sqli-blind-time": "FLAG{sqli_blind_1}",
  "a05-ssti-rce": "FLAG{ssti_rce_1}",
};

const TITLES = {
  "a01-idor-profil-user": "Portal Sariwangi: IDOR profil",
  "a01-force-browse-admin": "BengkelSnap Beta: force browsing",
  "a01-jwt-privilege-escalation": "Mitabisa SSO: JWT privilege",
  "a01-ssrf-internal-discovery": "LautanLink Sentinel: pratinjau URL",
  "a01-csrf-cors-chain": "NusaOps: konsol on-call",
  "a01-mass-assignment-hpe": "Helios People: profil karyawan",
  "a02-default-or-hardcoded-credentials": "KlinikLogin OEM: portal commissioning",
  "a02-directory-listing": "ArsipStatis: listing terbuka",
  "a02-verbose-errors": "LaporHub: error verbose",
  "a02-missing-security-headers": "EdgeLite: header keamanan",
  "a02-cloud-metadata-ssrf": "VeloraMesh: SSRF ke metadata",
  "a02-debug-endpoint-leak": "CargoShip CI: bocor env staging",
  "a05-sqli-login-bypass": "Login vendor",
  "a05-reflected-xss": "Pencarian tiket",
  "a05-sqli-union": "Laporan stok",
  "a05-stored-xss-cookie-steal": "Forum dukungan",
  "a05-sqli-blind-time": "Filter inventori",
  "a05-ssti-rce": "Template kampanye",
};

function parseCookie(req, name) {
  const raw = req.get("cookie") || "";
  for (const part of raw.split(";")) {
    const i = part.indexOf("=");
    if (i === -1) continue;
    if (part.slice(0, i).trim() !== name) continue;
    try {
      return decodeURIComponent(part.slice(i + 1).trim());
    } catch {
      return part.slice(i + 1).trim();
    }
  }
  return "";
}

function jwtPayloadFromToken(raw) {
  if (!raw || typeof raw !== "string") return {};
  try {
    const mid = raw.split(".")[1];
    if (!mid) return {};
    return JSON.parse(Buffer.from(mid, "base64url").toString("utf8"));
  } catch {
    return {};
  }
}

/** Lab only: signature tidak diverifikasi. */
function buildUnsignedJwt(payload) {
  const h = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const p = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${h}.${p}.unsigned_lab_demo`;
}

/** 5 pemohon demo; catatan internal (simulasi BKD) hanya boleh terlihat untuk subjek sendiri di app nyata. */
function idorUsers(flag) {
  return {
    1: {
      name: "Srismiati Dewi",
      nik: "3273****9012",
      layanan: "KK — perubahan data alamat",
      status: "Selesai diproses",
      alamat: "Kel. Karanganyar, Kec. Astanaanyar",
      internal: null,
    },
    2: {
      name: "Agung Wicaksono",
      nik: "3216****4451",
      layanan: "Akta kelahiran — legalisir",
      status: "Menunggu berkas fisik",
      alamat: "Kel. Cihampelas, Kec. Coblong",
      internal: null,
    },
    3: {
      name: "Maya Kusuma",
      nik: "3374****2218",
      layanan: "Surat keterangan domisili UMKM",
      status: "Verifikasi lapangan",
      alamat: "Kel. Manyar, Kec. Sukolilo",
      internal: null,
    },
    4: {
      name: "Hartono Wibowo",
      nik: "3603****7780",
      layanan: "Izin gangguan (IMB kecil)",
      status: "Draft revisi",
      alamat: "Kel. Kebon Jeruk, Kec. Kebon Jeruk",
      internal: `IDOR flag: ${flag}`,
    },
    5: {
      name: "Citra Anggraini",
      nik: "3171****6634",
      layanan: "KIA — anak pertama",
      status: "Antrian foto",
      alamat: "Kel. Menteng, Kec. Menteng",
      internal: null,
    },
  };
}

/** Hanya referensi 1–5 ada di basis demo; di luar itu 404 seperti produksi tanpa record. */
function parseIdorId(q) {
  if (q === undefined || q === null || String(q).trim() === "") return 1;
  const n = Number.parseInt(String(q), 10);
  if (Number.isNaN(n) || n < 1 || n > 5) return null;
  return n;
}

const app = express();
app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const comments = [];

app.get("/health", (_req, res) => {
  res.type("application/json").send(JSON.stringify({ status: "ok", app: "phase1-bundle" }));
});

app.use((req, res, next) => {
  const slug = (req.get("x-nawa-lab-slug") || "").trim().toLowerCase();
  if (!slug) {
    res.status(400).type("text/plain").send("Missing X-Nawa-Lab-Slug (proxy misconfigured)");
    return;
  }
  if (!FLAGS[slug]) {
    res
      .status(404)
      .type("text/plain")
      .send(
        `Slug not in phase-1 bundle (received: "${slug}"). ` +
          "If this slug exists in git, rebuild and restart: docker compose build challenge-phase1-bundle --no-cache && docker compose up -d challenge-phase1-bundle nawa-proxy"
      );
    return;
  }
  req.nawaSlug = slug;
  next();
});

/** A01 force browse: portal penjual (tanpa flag); admin hanya di /admin-console. Tautan relatif agar tetap di bawah /lab/slug/. */
function htmlA01ForceBrowseLanding() {
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>BengkelSnap Beta: panel penjual</title>
<style>
:root{--bg:#160d1f;--card:#251830;--accent:#f97316;--muted:#a78bfa;--text:#f4f4f5;}
*{box-sizing:border-box}body{margin:0;font-family:ui-sans-serif,system-ui;background:linear-gradient(165deg,var(--bg) 0%,#1a0a14 100%);color:var(--text);min-height:100vh;}
header{padding:1rem 1.5rem;border-bottom:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:space-between;flex-wrap:gap;}
.logo{font-weight:800;letter-spacing:-.03em;color:var(--accent);}nav a{color:var(--muted);text-decoration:none;margin-left:1.25rem;font-size:.9rem;}
nav a:hover{color:#fff}main{max-width:52rem;margin:2rem auto;padding:0 1.25rem;}
.card{background:var(--card);border-radius:12px;padding:1.5rem;border:1px solid rgba(249,115,22,.2);box-shadow:0 12px 40px rgba(0,0,0,.35);}
h1{font-size:1.35rem;margin:0 0 .5rem}p.lead{color:#d4d4d8;line-height:1.55;font-size:.95rem;}
ul{margin:1rem 0 0;padding-left:1.1rem;color:#c4b5fd;font-size:.88rem;}footer{margin-top:2.5rem;font-size:.75rem;color:#71717a;}
</style></head><body>
<header><span class="logo">BengkelSnap</span><nav><a href="./">Beranda</a><a href="pesanan">Pesanan</a><a href="bantuan">Bantuan</a></nav></header>
<main><div class="card">
<h1>Selamat datang, penjual beta</h1>
<p class="lead">BengkelSnap sedang uji coba katalog suku cadang motor untuk mitra bengkel. Menu di atas hanya untuk alur penjual, <strong>tidak semua route ada di navigasi</strong>, pola yang sering muncul di aplikasi nyata.</p>
<ul><li>Sinkronisasi stok dari gudang pusat</li><li>Notifikasi WhatsApp (coming soon)</li><li>Invoice PDF</li></ul>
</div><footer>BengkelSnap Beta · lab NawaVulner</footer></main></body></html>`;
}

function htmlA01ForceBrowsePesanan() {
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Pesanan: BengkelSnap</title>
<style>
:root{--bg:#160d1f;--card:#251830;--accent:#f97316;--muted:#a78bfa;--text:#f4f4f5;}
body{margin:0;font-family:ui-sans-serif,system-ui;background:linear-gradient(165deg,var(--bg) 0%,#1a0a14 100%);color:var(--text);min-height:100vh;}
header{padding:1rem 1.5rem;border-bottom:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:space-between;flex-wrap:gap;}
.logo{font-weight:800;color:var(--accent);}nav a{color:var(--muted);text-decoration:none;margin-left:1.25rem;font-size:.9rem;}nav a:hover{color:#fff}
main{max-width:52rem;margin:2rem auto;padding:0 1.25rem;}
.card{background:var(--card);border-radius:12px;padding:1.5rem;border:1px solid rgba(249,115,22,.2);}
h1{font-size:1.25rem;margin:0 0 .75rem}table{width:100%;border-collapse:collapse;font-size:.86rem;}th,td{padding:.55rem .65rem;text-align:left;border-bottom:1px solid rgba(255,255,255,.1);}th{color:#f97316;}
.badge{display:inline-block;padding:.12rem .45rem;border-radius:4px;font-size:.72rem;background:rgba(34,197,94,.2);color:#86efac;}
footer{margin:2rem 1.25rem;font-size:.75rem;color:#71717a;}
</style></head><body>
<header><span class="logo">BengkelSnap</span><nav><a href="./">Beranda</a><a href="pesanan">Pesanan</a><a href="bantuan">Bantuan</a></nav></header>
<main><div class="card">
<h1>Pesanan mitra</h1>
<p style="color:#cbd5e1;font-size:.9rem;line-height:1.5">Ringkasan pesanan suku cadang ke gudang pusat. Data di bawah contoh beta, sinkron setiap 15 menit.</p>
<table>
<thead><tr><th>No. pesanan</th><th>Part</th><th>Qty</th><th>Status</th></tr></thead>
<tbody>
<tr><td>BS-2025-0142</td><td>Filter oli Jupiter MX</td><td>24</td><td><span class="badge">Dikirim</span></td></tr>
<tr><td>BS-2025-0141</td><td>Kampas rem depan NMAX</td><td>8</td><td><span class="badge">Dikirim</span></td></tr>
<tr><td>BS-2025-0138</td><td>Rantai keteng Vixion</td><td>12</td><td>Menunggu picking</td></tr>
<tr><td>BS-2025-0135</td><td>Busi iridium Beat</td><td>40</td><td>Draft</td></tr>
</tbody>
</table>
<p style="margin-top:1rem;color:#94a3b8;font-size:.8rem">Butuh retur? Hubungi account manager wilayah lewat menu Bantuan.</p>
</div></main>
<footer>BengkelSnap Beta · lab NawaVulner</footer>
</body></html>`;
}

function htmlA01ForceBrowseBantuan() {
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Bantuan: BengkelSnap</title>
<style>
:root{--bg:#160d1f;--card:#251830;--accent:#f97316;--muted:#a78bfa;--text:#f4f4f5;}
body{margin:0;font-family:ui-sans-serif,system-ui;background:linear-gradient(165deg,var(--bg) 0%,#1a0a14 100%);color:var(--text);min-height:100vh;}
header{padding:1rem 1.5rem;border-bottom:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:space-between;flex-wrap:gap;}
.logo{font-weight:800;color:var(--accent);}nav a{color:var(--muted);text-decoration:none;margin-left:1.25rem;font-size:.9rem;}nav a:hover{color:#fff}
main{max-width:52rem;margin:2rem auto;padding:0 1.25rem;}
.card{background:var(--card);border-radius:12px;padding:1.5rem;border:1px solid rgba(249,115,22,.2);}
h1{font-size:1.25rem;margin:0 0 1rem}h2{font-size:.95rem;color:#f97316;margin:1.25rem 0 .5rem}p,li{color:#cbd5e1;font-size:.88rem;line-height:1.55;}
ul{padding-left:1.1rem;}
footer{margin:2rem 1.25rem;font-size:.75rem;color:#71717a;}
</style></head><body>
<header><span class="logo">BengkelSnap</span><nav><a href="./">Beranda</a><a href="pesanan">Pesanan</a><a href="bantuan">Bantuan</a></nav></header>
<main><div class="card">
<h1>Pusat bantuan penjual</h1>
<h2>Jam operasional</h2>
<p>Senin sampai Jumat 08.00–17.00 WIB. Tiket di luar jam akan dijawab hari kerja berikutnya.</p>
<h2>Sinkron stok</h2>
<ul>
<li>Stok gudang pusat diperbarui otomatis setelah status pesanan <strong>Dikirim</strong>.</li>
<li>Jika angka tidak berubah setelah 30 menit, segarkan halaman lalu cek nomor pesanan di menu Pesanan.</li>
</ul>
<h2>Retur dan garansi</h2>
<p>Retur part cacat produksi: lampirkan foto unboxing dan nomor pesanan. SLA verifikasi 2 hari kerja.</p>
<h2>Paket langganan</h2>
<p>Upgrade ke paket Pro untuk limit order lebih besar dan prioritas picking. Hubungi sales melalui email yang tertera di kontrak mitra (tidak ditampilkan di lab beta).</p>
</div></main>
<footer>BengkelSnap Beta · lab NawaVulner</footer>
</body></html>`;
}

function htmlA01ForceBrowseAdmin(flag) {
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Admin: BengkelSnap</title>
<style>
body{margin:0;font-family:ui-monospace,monospace;background:#0c0c0f;color:#e4e4e7;min-height:100vh;padding:1.5rem;}
.banner{background:linear-gradient(90deg,#dc2626,#7c2d12);padding:.6rem 1rem;border-radius:6px;font-size:.75rem;margin-bottom:1.5rem;}
h1{font-size:1.1rem;color:#f87171;margin:0}pre{background:#18181b;padding:1rem;border-radius:8px;border:1px solid #27272a;overflow:auto;}
a{color:#38bdf8}
</style></head><body>
<div class="banner">Zona admin internal: tidak seharusnya terpapar ke penjual tier beta.</div>
<h1>Konsol pemeliharaan</h1>
<p style="color:#a1a1aa;font-size:.85rem">Token migrasi DB dan override harga: jangan bagikan.</p>
<p>Flag platform (submit ke NawaVulner):</p>
<pre><code>${flag}</code></pre>
<p><a href="./">← kembali ke portal</a> · <a href="health">health (JSON)</a></p>
</body></html>`;
}

function htmlA01ForceBrowse404() {
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><title>404: BengkelSnap</title>
<style>body{font-family:system-ui;background:#160d1f;color:#e7e5e4;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:1rem;}
.box{max-width:24rem;text-align:center}h1{color:#f97316;font-size:1.1rem}a{color:#a78bfa}</style></head><body><div class="box">
<h1>Halaman tidak ditemukan</h1>
<p style="color:#a1a1aa;font-size:.9rem">Route ini belum ada di build beta. Coba kembali ke <a href="./">beranda</a>.</p>
</div></body></html>`;
}

/** Portal Sariwangi: tema hijau layanan publik; tanpa copy bimbingan di UI (arah instruktur / platform). */
function htmlA01IdorLanding() {
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Portal Sariwangi: layanan mandiri</title>
<style>
:root{--bg:#0c1f18;--card:#134032;--accent:#34d399;--muted:#6ee7b7;--text:#ecfdf5;}
*{box-sizing:border-box}body{margin:0;font-family:ui-sans-serif,system-ui;background:linear-gradient(160deg,#042f1a 0%,var(--bg) 45%);color:var(--text);min-height:100vh;}
header{padding:1rem 1.5rem;border-bottom:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:space-between;flex-wrap:gap;}
.brand{font-weight:800;font-size:1.05rem;color:var(--accent);letter-spacing:-.02em;}nav a{color:var(--muted);text-decoration:none;margin-left:1.1rem;font-size:.88rem;}nav a:hover{color:#fff}
main{max-width:48rem;margin:2rem auto;padding:0 1.25rem;}
.card{background:rgba(19,64,50,.85);border-radius:12px;padding:1.35rem 1.4rem;border:1px solid rgba(52,211,153,.25);}
h1{font-size:1.2rem;margin:0 0 .65rem;color:#a7f3d0}p.lead{font-size:.88rem;line-height:1.6;color:#d1fae5;margin:0 0 .75rem}
a.cta{display:inline-block;margin-top:.25rem;padding:.55rem 1rem;border-radius:8px;background:var(--accent);color:#064e3b;font-weight:700;text-decoration:none;font-size:.88rem}
a.cta:hover{filter:brightness(1.05)}
footer{margin:2rem 1.25rem;font-size:.72rem;color:#6b9089;}
</style></head><body>
<header><span class="brand">Portal Sariwangi</span><nav><a href="./">Beranda</a><a href="layanan">Layanan</a><a href="status">Antrian</a><a href="profile?id=1">Status permohonan</a></nav></header>
<main>
<div class="card">
<h1>Selamat datang</h1>
<p class="lead">Portal layanan mandiri Kota Sariwangi. Ajukan dan lacak permohonan administrasi kependudukan secara daring.</p>
<p class="lead">Jam operasional loket: Senin–Jumat 08.00–15.00. Pengumuman pemeliharaan sistem akan ditampilkan di halaman Antrian.</p>
<a class="cta" href="profile?id=1">Lihat ringkasan permohonan</a>
</div>
</main>
<footer>Portal Sariwangi · lab NawaVulner</footer>
</body></html>`;
}

function htmlA01IdorProfilePage(id, flag) {
  const u = idorUsers(flag)[id];
  if (!u) return htmlA01Idor404();
  const internalBlock = u.internal
    ? `<div style="margin-top:1rem;padding:.85rem 1rem;border-radius:10px;background:rgba(15,23,42,.5);border:1px solid rgba(148,163,184,.25)">
<p style="margin:0;font-size:.72rem;text-transform:uppercase;letter-spacing:.05em;color:#94a3b8">Catatan verifikator</p>
<p style="margin:.45rem 0 0;font-size:.88rem;color:#e2e8f0;white-space:pre-wrap">${u.internal.replace(/</g, "&lt;")}</p></div>`
    : "";
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Ringkasan permohonan — Portal Sariwangi</title>
<style>
:root{--bg:#0c1f18;--card:#134032;--accent:#34d399;--muted:#6ee7b7;--text:#ecfdf5;}
*{box-sizing:border-box}body{margin:0;font-family:ui-sans-serif,system-ui;background:linear-gradient(160deg,#042f1a 0%,var(--bg) 45%);color:var(--text);min-height:100vh;}
header{padding:1rem 1.5rem;border-bottom:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:space-between;flex-wrap:gap;}
.brand{font-weight:800;font-size:1.05rem;color:var(--accent);}nav a{color:var(--muted);text-decoration:none;margin-left:1rem;font-size:.88rem;}nav a:hover{color:#fff}
main{max-width:44rem;margin:2rem auto;padding:0 1.25rem;}
.card{background:rgba(19,64,50,.9);border-radius:14px;padding:1.35rem;border:1px solid rgba(52,211,153,.28);}
h1{font-size:1.15rem;margin:0 0 .25rem;color:#a7f3d0}.sub{font-size:.78rem;color:#6ee7b7;margin:0 0 1rem}
dl{display:grid;grid-template-columns:9rem 1fr;gap:.45rem .75rem;font-size:.86rem;margin:0}dt{color:#86efac;opacity:.9}dd{margin:0;color:#ecfdf5}
footer{margin:2rem 1.25rem;font-size:.72rem;color:#6b9089;}
</style></head><body>
<header><span class="brand">Portal Sariwangi</span><nav><a href="./">Beranda</a><a href="layanan">Layanan</a><a href="status">Antrian</a></nav></header>
<main><div class="card">
<h1>${u.name}</h1>
<p class="sub">Nomor referensi: <strong>${id}</strong> · NIK: ${u.nik}</p>
<dl>
<dt>Status</dt><dd>${u.status}</dd>
<dt>Layanan</dt><dd>${u.layanan}</dd>
<dt>Alamat</dt><dd>${u.alamat}</dd>
</dl>
${internalBlock}
</div></main>
<footer>Portal Sariwangi · lab NawaVulner</footer>
</body></html>`;
}

function htmlA01IdorLayanan() {
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><title>Layanan: Portal Sariwangi</title>
<style>body{margin:0;font-family:system-ui;background:#0c1f18;color:#ecfdf5;padding:2rem;max-width:40rem;margin:0 auto}a{color:#34d399}</style></head><body>
<header style="margin-bottom:1.5rem"><a href="./">← Beranda</a></header>
<h1>Daftar layanan</h1>
<ul style="line-height:1.7;color:#d1fae5"><li>KK: cetak dan perubahan data</li><li>AKTA kelahiran</li><li>Surat keterangan domisili</li><li>Izin usaha mikro (UMKM)</li></ul>
<p style="font-size:.85rem;color:#86efac">Pengajuan baru diproses sesuai antrian loket.</p>
</body></html>`;
}

function htmlA01IdorStatus() {
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><title>Antrian: Portal Sariwangi</title>
<style>body{margin:0;font-family:system-ui;background:#0c1f18;color:#ecfdf5;padding:2rem;max-width:40rem;margin:0 auto}a{color:#34d399}</style></head><body>
<header style="margin-bottom:1.5rem"><a href="./">← Beranda</a></header>
<h1>Antrian hari ini</h1>
<p style="color:#d1fae5">Estimasi: 12 antrian sebelum nomor Anda (contoh statik).</p>
<p style="font-size:.85rem;color:#6ee7b7">Pembaruan otomatis belum aktif di lab beta.</p>
</body></html>`;
}

function htmlA01Idor404() {
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><title>404: Portal Sariwangi</title>
<style>body{font-family:system-ui;background:#0c1f18;color:#ecfdf5;min-height:100vh;display:flex;align-items:center;justify-content:center}a{color:#34d399}</style></head><body><div style="text-align:center;max-width:22rem">
<h1 style="color:#f87171;font-size:1rem">Tidak ditemukan</h1>
<p style="color:#a7f3d0;font-size:.88rem"><a href="./">Kembali ke beranda</a></p></div></body></html>`;
}

function htmlA01JwtLogin() {
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Mitabisa SSO — masuk</title>
<style>
:root{--bg:#0f172a;--card:#1e293b;--accent:#818cf8;--text:#e2e8f0;}
body{margin:0;font-family:ui-sans-serif,system-ui;background:radial-gradient(120% 80% at 10% 0%,#312e81 0%,var(--bg) 55%);color:var(--text);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:1.25rem;}
.card{max-width:22rem;width:100%;background:var(--card);border-radius:14px;padding:1.5rem;border:1px solid rgba(129,140,248,.3);}
h1{font-size:1.15rem;margin:0 0 .5rem;color:#c7d2fe}label{display:block;font-size:.75rem;color:#94a3b8;margin:.65rem 0 .25rem}
input{width:100%;box-sizing:border-box;padding:.55rem .65rem;border-radius:8px;border:1px solid #334155;background:#020617;color:#e2e8f0;font-size:.88rem}
button{margin-top:1rem;width:100%;padding:.65rem;border-radius:8px;border:none;background:#6366f1;color:#fff;font-weight:700;cursor:pointer;font-size:.9rem}
code{font-size:.68rem;background:#020617;padding:.1rem .3rem;border-radius:4px}
</style></head><body><div class="card">
<h1>Masuk ke layanan Mitabisa</h1>
<form method="POST" action="login">
<label for="u">Username</label><input id="u" name="username" autocomplete="username" required/>
<label for="p">Password</label><input id="p" name="password" type="password" autocomplete="current-password" required/>
<button type="submit">Masuk</button>
</form>
</div></body></html>`;
}

function htmlA01JwtAppShell(active, role, name) {
  const isAdmin = role === "admin";
  const adminClass = isAdmin ? "" : "opacity-55";
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Mitabisa — aplikasi</title>
<style>
:root{--bg:#0f172a;--card:#1e293b;--accent:#818cf8;--text:#e2e8f0;}
body{margin:0;font-family:ui-sans-serif,system-ui;background:radial-gradient(120% 80% at 10% 0%,#312e81 0%,var(--bg) 55%);color:var(--text);min-height:100vh;}
header{padding:1rem 1.5rem;border-bottom:1px solid rgba(255,255,255,.08);display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.75rem;}
.logo{font-weight:800;color:var(--accent);}nav a{margin-left:.9rem;font-size:.86rem;text-decoration:none;color:#94a3b8}nav a:hover{color:#fff}
nav a.on{color:#c7d2fe;font-weight:600}
main{max-width:46rem;margin:2rem auto;padding:0 1.25rem;}
.card{background:var(--card);border-radius:12px;padding:1.35rem;border:1px solid rgba(129,140,248,.22);}
p.lead{font-size:.86rem;color:#cbd5e1;line-height:1.55;margin:.5rem 0}
footer{margin:2rem;font-size:.72rem;color:#64748b;}
</style></head><body>
<header><span class="logo">Mitabisa</span><nav>
<a href="profil" class="${active === "profil" ? "on" : ""}">Profil</a>
<a href="admin" class="${active === "admin" ? "on" : ""} ${adminClass}">Admin</a>
<a href="logout">Keluar</a>
</nav></header>
<main><div class="card">
<p class="lead">Halo, <strong>${name.replace(/</g, "&lt;")}</strong>.</p>
</div></main>
<footer>Mitabisa · lab NawaVulner</footer>
</body></html>`;
}

function htmlA01JwtProfil(role, name, flag) {
  const isAdmin = role === "admin";
  const secret = isAdmin
    ? `<p style="margin-top:1rem;padding:.85rem 1rem;border-radius:10px;background:#022c22;border:1px solid #34d399;font-size:.85rem;color:#a7f3d0"><strong>Rahasia operasional:</strong> ${flag}</p>`
    : `<p style="margin-top:1rem;font-size:.82rem;color:#94a3b8">Tidak ada informasi tambahan untuk ditampilkan.</p>`;
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Profil — Mitabisa</title>
<style>
body{margin:0;font-family:ui-sans-serif,system-ui;background:#0f172a;color:#e2e8f0;min-height:100vh;}
header{padding:1rem 1.5rem;border-bottom:1px solid rgba(255,255,255,.08);}nav a{margin-right:1rem;color:#818cf8;text-decoration:none;font-size:.86rem}
main{max-width:42rem;margin:2rem auto;padding:0 1.25rem;}
.card{background:#1e293b;border-radius:12px;padding:1.35rem;border:1px solid rgba(129,140,248,.2);}
h1{font-size:1.1rem;margin:0 0 .5rem;color:#c7d2fe}
</style></head><body>
<header><nav><a href="app">← Dasbor</a><a href="admin">Admin</a><a href="logout">Keluar</a></nav></header>
<main><div class="card"><h1>Profil akun</h1>
<p style="font-size:.86rem;color:#cbd5e1">Nama: <strong>${name.replace(/</g, "&lt;")}</strong></p>
${secret}
</div></main></body></html>`;
}

function htmlA01JwtAdminDenied() {
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><title>Akses ditolak — Mitabisa</title>
<style>body{margin:0;font-family:system-ui;background:#1e1b2e;color:#e2e8f0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:1.5rem;text-align:center}
a{color:#a5b4fc}.box{max-width:24rem;border:1px solid rgba(248,113,113,.35);border-radius:12px;padding:1.5rem;background:#0f172a}
h1{font-size:1rem;color:#fca5a5;margin:0 0 .5rem}p{font-size:.86rem;color:#cbd5e1;line-height:1.55}</style></head><body><div class="box">
<h1>403 — Akses ditolak</h1>
<p style="font-size:.86rem;color:#cbd5e1">Anda tidak memiliki izin untuk halaman ini.</p>
<p><a href="app">Kembali ke dasbor</a> · <a href="profil">Profil</a></p>
</div></body></html>`;
}

function htmlA01JwtAdminOk(flag) {
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><title>Admin — Mitabisa</title>
<style>body{margin:0;font-family:ui-sans-serif,system-ui;background:#0f172a;color:#e2e8f0;min-height:100vh;}
header{padding:1rem 1.5rem;border-bottom:1px solid rgba(255,255,255,.08);}nav a{margin-right:1rem;color:#818cf8;text-decoration:none;font-size:.86rem}
main{max-width:44rem;margin:2rem auto;padding:0 1.25rem;}
.card{background:#1e293b;border-radius:12px;padding:1.35rem;border:1px solid rgba(52,211,153,.25);}
h1{font-size:1.1rem;color:#86efac;margin:0 0 .5rem}
pre{background:#020617;padding:1rem;border-radius:8px;font-size:.85rem;color:#a7f3d0;overflow:auto}
</style></head><body>
<header><nav><a href="app">← Dasbor</a><a href="profil">Profil</a><a href="logout">Keluar</a></nav></header>
<main><div class="card"><h1>Panel ringkas admin</h1>
<p style="font-size:.86rem;color:#cbd5e1">Token operasional:</p>
<pre>${flag.replace(/</g, "&lt;")}</pre>
</div></main></body></html>`;
}

function htmlA01Jwt404() {
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><title>404: Mitabisa</title>
<style>body{font-family:system-ui;background:#0f172a;color:#e2e8f0;min-height:100vh;display:flex;align-items:center;justify-content:center}a{color:#818cf8}</style></head><body><div style="text-align:center">
<p>Route tidak ada.</p><p><a href="./">Kembali ke login</a></p></div></body></html>`;
}

function escapeHtmlLab(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function htmlDirIndexPage(title, rows) {
  const body = rows
    .map(
      (r) =>
        `<tr><td><a href="${escapeHtmlLab(r.href)}">${escapeHtmlLab(r.name)}</a></td><td class="sz">${escapeHtmlLab(r.size)}</td></tr>`
    )
    .join("");
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><title>${escapeHtmlLab(title)}</title>
<style>body{font-family:ui-monospace,Consolas,monospace;background:#0b1020;color:#e2e8f0;margin:0;padding:1.25rem 1.5rem}
h1{font-size:1rem;font-weight:600;color:#94a3b8;letter-spacing:.04em;text-transform:uppercase}
table{border-collapse:collapse;width:100%;max-width:48rem;margin-top:.75rem}
td{padding:.4rem .5rem;border-bottom:1px solid rgba(148,163,184,.15)}a{color:#38bdf8;text-decoration:none}a:hover{text-decoration:underline}.sz{color:#64748b;text-align:right;width:7rem}</style></head><body>
<h1>${escapeHtmlLab(title)}</h1>
<table>${body}</table>
</body></html>`;
}

function buildOemVendorNoiseHtml() {
  let s = "";
  for (let i = 0; i < 72; i++) {
    s += `\n<!-- vendor:bundle:v3:${i}:${(0x2000 + i).toString(16)}:signed=off -->`;
  }
  s +=
    "\n<!-- OEM HT-9921 WAN cutover: staging bootstrap admin / LabBootstrap!77 (vendor KB-OEM-17, revoke after go-live) -->\n";
  for (let i = 0; i < 36; i++) {
    s += `<span class="hx" aria-hidden="true" id="hx-${i}">${(50000 + i * 13).toString(36)}</span>`;
  }
  return s;
}

function ssrfSimulatedBody(urlStr, flag) {
  const u = String(urlStr || "");
  if (u.includes("169.254.169.254") || u.includes("internal.metadata")) {
    const metaObj = {
      "ami-id": "ami-0ab1c2d3e4f50607",
      hostname: "sentinel-edge-prd-07.internal",
      "instance-type": "t3.medium",
      "local-ipv4": "10.53.44.18",
      mac: "06:7a:cc:11:22:33",
      iam: { info: "/latest/meta-data/iam/info" },
      "lab-bootstrap": flag,
    };
    const bodyJson = JSON.stringify(metaObj, null, 2);
    const hdr = [
      "HTTP/1.1 200 OK",
      "Date: Wed, 06 May 2026 07:22:11 GMT",
      "Content-Type: application/octet-stream; charset=utf-8",
      `Content-Length: ${Buffer.byteLength(bodyJson, "utf8")}`,
      "Server: imds-sim/2.1",
      "X-Request-Id: req-7f3a91c0b2e4",
      "X-Amz-Instance-Id: i-0f4c2a18aa77e903b",
      "X-Amz-Placement-Region: ap-southeast-3",
      "X-Imds-Version: 2",
      "Cache-Control: no-store, no-cache",
    ].join("\n");
    return `${hdr}\n\n${bodyJson}`;
  }
  return "HTTP/1.1 200 OK\nContent-Type: text/plain; charset=utf-8\nX-Edge-Tier: public\nX-Cache: MISS\n\n(respons ujung jaringan disimulasikan, resource publik.)";
}

function htmlA01SsrfShell(title, inner) {
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${title}</title>
<style>
:root{--bg:#071018;--card:#0c2230;--line:#164e63;--accent:#22d3ee;--muted:#67e8f9;--text:#ecfeff;}
*{box-sizing:border-box}body{margin:0;font-family:ui-sans-serif,system-ui;background:radial-gradient(100% 80% at 0% 0%,#134e4a 0%,var(--bg) 55%);color:var(--text);min-height:100vh;}
header{padding:1rem 1.5rem;border-bottom:1px solid rgba(34,211,238,.15);display:flex;align-items:center;justify-content:space-between;flex-wrap:gap;}
.brand{font-weight:800;font-size:1.05rem;letter-spacing:-.02em;background:linear-gradient(90deg,#22d3ee,#a5f3fc);-webkit-background-clip:text;background-clip:text;color:transparent;}
nav a{color:var(--muted);text-decoration:none;margin-left:1rem;font-size:.86rem;}nav a:hover{color:#fff}
main{max-width:52rem;margin:2rem auto;padding:0 1.25rem;}
.card{background:var(--card);border-radius:14px;padding:1.4rem;border:1px solid var(--line);box-shadow:0 20px 50px rgba(0,0,0,.4);}
footer{margin:2.5rem 1.25rem;font-size:.72rem;color:#5eead4;opacity:.65;}
</style></head><body>
<header><span class="brand">LautanLink Sentinel</span><nav><a href="./">Beranda</a><a href="periksa">Periksa URL</a><a href="risiko">Peta risiko</a><a href="sla">SLA</a></nav></header>
<main><div class="card">${inner}</div></main>
<footer>LautanLink · divisi keamanan perimeter · lab NawaVulner</footer>
</body></html>`;
}

function htmlA01SsrfLanding() {
  const inner = `<h1 style="margin:0 0 .6rem;font-size:1.25rem;color:#a5f3fc">Perimeter unggun untuk tim GRC & SOC</h1>
<p style="margin:0;line-height:1.65;color:#ccfbf1;font-size:.9rem">Sentinel mengambil snapshot respons HTTP dari URL yang Anda masukkan, dipakai untuk validasi vendor, phishing take-down, dan bukti audit rantai pasokan. Integrasi SIEM: <strong>42</strong> sumber aktif minggu ini.</p>
<p style="margin:1rem 0 0;font-size:.82rem;color:#99f6e4">Antrian pemindaian prioritas: <strong>1.284</strong> URL · latensi rata-rata <strong>840 ms</strong> · wilayah Asia-Tenggara.</p>
<p style="margin:1.25rem 0 0"><a href="periksa" style="display:inline-block;padding:.55rem 1.1rem;border-radius:10px;background:linear-gradient(90deg,#0891b2,#22d3ee);color:#042f2e;font-weight:700;text-decoration:none;font-size:.88rem">Buka antrian periksa</a></p>`;
  return htmlA01SsrfShell("LautanLink Sentinel", inner);
}

function htmlA01SsrfPeriksa() {
  const inner = `<h1 style="margin:0 0 .5rem;font-size:1.15rem;color:#a5f3fc">Antrian periksa URL</h1>
<p style="margin:0 0 1rem;font-size:.86rem;color:#99f6e4;line-height:1.55">Masukkan target absolut dengan skema (contoh <code>https://host/jalur</code>). Sistem menarik respons dari sudut pandang <strong>server perimeter</strong>, bukan browser Anda. Petunjuk konteks vendor dan SLA ada di halaman <a href="risiko" style="color:#22d3ee">Peta risiko</a> dan <a href="sla" style="color:#22d3ee">SLA</a>.</p>
<form method="GET" action="hasil" style="margin-top:.5rem">
<label style="display:block;font-size:.72rem;color:#5eead4;text-transform:uppercase;letter-spacing:.08em;margin-bottom:.35rem">Target URL</label>
<input name="url" type="url" required placeholder="https://contoh.co.id/halaman" style="width:100%;max-width:100%;padding:.65rem .75rem;border-radius:10px;border:1px solid #155e75;background:#020617;color:#ecfeff;font-size:.85rem"/>
<button type="submit" style="margin-top:.85rem;padding:.55rem 1.2rem;border-radius:10px;border:none;background:#22d3ee;color:#042f2e;font-weight:700;cursor:pointer;font-size:.88rem">Ambil snapshot</button>
</form>`;
  return htmlA01SsrfShell("Periksa URL · Sentinel", inner);
}

function htmlA01SsrfHasil(rawUrl, body) {
  const safeUrl = escapeHtmlLab(rawUrl);
  const safeBody = escapeHtmlLab(body);
  const inner = `<h1 style="margin:0 0 .5rem;font-size:1.1rem;color:#a5f3fc">Snapshot respons</h1>
<p style="margin:0 0 .75rem;font-size:.78rem;color:#5eead4">Target: <code style="color:#cffafe">${safeUrl}</code></p>
<pre style="margin:0;padding:1rem;border-radius:10px;background:#020617;border:1px solid #164e63;font-size:.76rem;line-height:1.45;color:#e0f2fe;white-space:pre-wrap;word-break:break-word;max-height:22rem;overflow:auto">${safeBody}</pre>
<p style="margin:.75rem 0 0;font-size:.72rem;color:#5eead4">Catatan GRC: salinan ini meniru baris status HTTP di atas tubuh respons (bukan header browser Anda).</p>
<p style="margin:1rem 0 0;font-size:.78rem;color:#99f6e4"><a href="periksa" style="color:#22d3ee">Periksa URL lain</a> · <a href="./" style="color:#22d3ee">Beranda</a></p>`;
  return htmlA01SsrfShell("Hasil snapshot", inner);
}

function htmlA01SsrfRisiko() {
  const inner = `<h1 style="margin:0 0 .5rem;font-size:1.1rem;color:#a5f3fc">Peta risiko vendor</h1>
<p style="margin:0;line-height:1.6;color:#ccfbf1;font-size:.88rem">Kategori dominan minggu ini: redirect berantai, halaman parkir domain, dan endpoint API tanpa TLS pin. Tim hukum meminta jejak respons mentah, Sentinel menyediakan salinan byte-per-byte dari sisi server.</p>
<p style="margin:1rem 0 0;line-height:1.6;color:#99f6e4;font-size:.82rem">Registri vendor tier-3 masih menyimpan stub host internal lama, misalnya nama seperti <strong>internal.metadata</strong>, untuk kontrak yang ditandatangani sebelum migrasi ke cloud. Pratinjau perimeter memakai URL absolut <code>https://…</code> mengikuti entri katalog itu.</p>`;
  return htmlA01SsrfShell("Peta risiko", inner);
}

function htmlA01SsrfSla() {
  const inner = `<h1 style="margin:0 0 .5rem;font-size:1.1rem;color:#a5f3fc">SLA &amp; eskalasi</h1>
<p style="margin:0;line-height:1.6;color:#ccfbf1;font-size:.88rem">Target pemindaian prioritas-1: &lt; 15 menit. Tiket otomatis ke ServiceNow jika respons mengandung indikator malware atau reputasi ASN buruk.</p>
<p style="margin:1rem 0 0;line-height:1.6;color:#99f6e4;font-size:.82rem">Runbook jaringan legacy (lampiran A) masih merujuk path metadata instance pada rentang link-local <strong>169.254.169.254</strong> untuk verifikasi identitas workload saat insiden perimeter. Operator memasukkan URL lengkap ke antrian periksa, bukan nama host saja.</p>`;
  return htmlA01SsrfShell("SLA", inner);
}

function htmlA01Ssrf404() {
  return htmlA01SsrfShell(
    "Tidak ditemukan",
    `<p style="margin:0;color:#fecdd3">Alamat tidak dikenali di perimeter ini.</p><p style="margin:.75rem 0 0"><a href="./" style="color:#22d3ee">Beranda</a></p>`
  );
}

function htmlNusaopsLayout(title, email, inner) {
  const safeEmail = escapeHtmlLab(email);
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${title}</title>
<style>
:root{--bg:#0c1424;--card:#151e32;--accent:#38bdf8;--muted:#94a3b8;--text:#f1f5f9;}
*{box-sizing:border-box}body{margin:0;font-family:ui-sans-serif,system-ui;background:linear-gradient(165deg,#020617 0%,var(--bg) 100%);color:var(--text);min-height:100vh;}
header{padding:1rem 1.5rem;border-bottom:1px solid rgba(148,163,184,.12);display:flex;align-items:center;justify-content:space-between;flex-wrap:gap;}
.brand{font-weight:800;color:var(--accent);letter-spacing:-.02em;}nav a{color:var(--muted);text-decoration:none;margin-left:1rem;font-size:.86rem;}nav a:hover{color:#fff}
.badge{font-size:.68rem;padding:.2rem .5rem;border-radius:6px;background:rgba(56,189,248,.15);color:#7dd3fc}
main{max-width:46rem;margin:2rem auto;padding:0 1.25rem;}
.card{background:var(--card);border-radius:14px;padding:1.35rem;border:1px solid rgba(56,189,248,.18);}
footer{margin:2rem;font-size:.72rem;color:#64748b;}
</style></head><body>
<header><span class="brand">NusaOps</span><span class="badge">on-call roster</span><nav><a href="./">Ringkasan</a><a href="konfigurasi">Notifikasi</a><a href="log">Log shift</a></nav></header>
<main><div class="card">
<p style="margin:0 0 .75rem;font-size:.78rem;color:#94a3b8">Email pager aktif: <strong style="color:#e2e8f0">${safeEmail}</strong></p>
${inner}
</div></main>
<footer>NusaOps · NusaGrid (fiksi) · lab NawaVulner</footer>
</body></html>`;
}

function htmlNusaopsHome(email) {
  const inner = `<h1 style="margin:0 0 .5rem;font-size:1.15rem">Shift malam, wilayah Jakarta</h1>
<p style="margin:0;line-height:1.6;color:#cbd5e1;font-size:.88rem">Tiga insiden minor menunggu klasifikasi. Eskalasi otomatis ke grup WhatsApp divisi jika SLA respons &gt; 8 menit.</p>
<p style="margin:1rem 0 0;font-size:.82rem;color:#64748b">Integrasi email pager memakai endpoint internal legacy, perilaku umum pada konsol operasi yang masih hidup di produksi.</p>`;
  return htmlNusaopsLayout("NusaOps · ringkasan", email, inner);
}

function htmlNusaopsKonfigurasi(email) {
  const inner = `<h1 style="margin:0 0 .5rem;font-size:1.1rem">Notifikasi pager</h1>
<p style="margin:0 0 1rem;font-size:.85rem;color:#94a3b8;line-height:1.55">Ubah alamat tujuan alert kritikal. Alur memakai dua langkah: permintaan perubahan, lalu verifikasi dengan kode dari <a href="log" style="color:#38bdf8">Log shift</a>.</p>
<form method="POST" action="email/change" style="max-width:22rem">
<input type="hidden" name="current" value="${escapeHtmlLab(email)}"/>
<label style="display:block;font-size:.72rem;color:#64748b;margin-bottom:.3rem">Alamat email baru</label>
<input type="email" name="email" value="${escapeHtmlLab(email)}" required style="width:100%;padding:.55rem .65rem;border-radius:8px;border:1px solid #334155;background:#0f172a;color:#f8fafc;font-size:.88rem"/>
<button type="submit" style="margin-top:1rem;padding:.55rem 1rem;border-radius:8px;border:none;background:#0ea5e9;color:#fff;font-weight:600;cursor:pointer">Simpan</button>
</form>`;
  return htmlNusaopsLayout("NusaOps · notifikasi", email, inner);
}

function htmlNusaopsLog(email) {
  const inner = `<h1 style="margin:0 0 .5rem;font-size:1.1rem">Log shift</h1>
<ul style="margin:0;padding-left:1.1rem;color:#cbd5e1;font-size:.85rem;line-height:1.7">
<li>02:14 · heartbeat API status.ok</li>
<li>02:09 · throttle vendor API (429)</li>
<li>02:06 · gate verifikasi: setelah POST ke <code>email/change</code>, selesaikan dengan <code>POST email/verify</code> (JSON <code>email</code> + <code>pin</code>). PIN shift ini: <strong>881902</strong>.</li>
<li>01:51 · manual ack oleh operator</li>
</ul>`;
  return htmlNusaopsLayout("NusaOps · log", email, inner);
}

function htmlNusaops404() {
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><title>404</title>
<style>body{margin:0;font-family:system-ui;background:#0c1424;color:#e2e8f0;min-height:100vh;display:flex;align-items:center;justify-content:center}a{color:#38bdf8}</style></head><body><div style="text-align:center">
<p>Halaman tidak ada.</p><p><a href="./">Ringkasan</a></p></div></body></html>`;
}

function htmlHeliosLayout(title, inner) {
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${title}</title>
<style>
:root{--bg:#faf7f2;--card:#fff;--accent:#b45309;--ink:#1c1917;--line:#e7e5e4;}
*{box-sizing:border-box}body{margin:0;font-family:ui-serif,Georgia,serif;background:var(--bg);color:var(--ink);min-height:100vh;}
header{padding:1.1rem 1.5rem;background:#fff;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;}
.logo{font-weight:700;font-size:1.1rem;color:var(--accent);letter-spacing:.02em;}nav a{color:#57534e;text-decoration:none;margin-left:1rem;font-size:.82rem;font-family:ui-sans-serif,system-ui;}nav a:hover{color:#0c0a09}
main{max-width:40rem;margin:2rem auto;padding:0 1.25rem;}
.card{background:var(--card);border-radius:12px;padding:1.5rem;border:1px solid var(--line);box-shadow:0 8px 30px rgba(28,25,23,.06);}
label{display:block;font-size:.72rem;text-transform:uppercase;letter-spacing:.06em;color:#78716c;margin:.75rem 0 .25rem;font-family:ui-sans-serif,system-ui;}
input{width:100%;padding:.55rem .65rem;border-radius:8px;border:1px solid #d6d3d1;font-size:.9rem;font-family:ui-sans-serif,system-ui;}
button{margin-top:1.25rem;padding:.55rem 1.2rem;border-radius:8px;border:none;background:var(--accent);color:#fff;font-weight:600;cursor:pointer;font-family:ui-sans-serif,system-ui;font-size:.88rem}
.note{margin-top:1.25rem;font-size:.78rem;color:#78716c;line-height:1.5;font-family:ui-sans-serif,system-ui;}
footer{margin:2.5rem 1.25rem;font-size:.72rem;color:#a8a29e;font-family:ui-sans-serif,system-ui;}
</style></head><body>
<header><span class="logo">Helios People</span><nav><a href="./">Profil</a><a href="cuti">Cuti</a><a href="payslip">Slip gaji</a></nav></header>
<main><div class="card">${inner}</div></main>
<footer>Helios People · modul self-service karyawan · lab NawaVulner</footer>
</body></html>`;
}

function htmlHeliosProfil() {
  const inner = `<h1 style="margin:0 0 .35rem;font-size:1.2rem;font-family:ui-sans-serif,system-ui">Anda: <span style="color:#b45309">Raka Wijaya</span></h1>
<p style="margin:0 0 1rem;font-size:.85rem;color:#57534e;font-family:ui-sans-serif,system-ui;line-height:1.55">Divisi Teknik · grade L3 · mulai bergabung 2019. Pembaruan profil disinkronkan ke SAP SuccessFactors tiruan setiap 15 menit.</p>
<form id="f">
<label>Nama tampilan</label><input name="displayName" value="Raka Wijaya"/>
<label>Departemen</label><input name="department" value="Platform Engineering"/>
<label>Telepon kantor</label><input name="phone" value="+62-21-5550102"/>
<button type="submit">Simpan perubahan</button>
</form>
<p id="save-status" style="display:none;margin-top:1rem;font-size:.78rem;color:#57534e;font-family:ui-sans-serif,system-ui;">Antrean integrasi menerima payload. Audit detail respons lewat alat inspeksi jaringan, bukan dialog browser.</p>
<p class="note">Perubahan akan tercermin di direktori internal setelah sinkronisasi batch berikutnya.</p>
<script>document.getElementById("f").addEventListener("submit",function(e){e.preventDefault();var fd=new FormData(e.target);var o={};fd.forEach(function(v,k){o[k]=v;});fetch("api/me",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}).then(function(r){return r.json();}).then(function(j){if(j.policyRejectReason==="department_mismatch"){alert(j.policyMessage||"Departemen tidak sesuai kebijakan untuk peran admin.");return;}var el=document.getElementById("save-status");if(el){el.style.display="block";}}).catch(function(){});});</script>`;
  return htmlHeliosLayout("Helios People · profil", inner);
}

function htmlHeliosCuti() {
  const inner = `<h1 style="margin:0 0 .5rem;font-size:1.1rem;font-family:ui-sans-serif,system-ui">Cuti tahunan</h1>
<p style="margin:0;font-size:.86rem;color:#57534e;font-family:ui-sans-serif,system-ui;line-height:1.6">Sisa kuota: <strong>9</strong> hari kerja. Pengajuan baru akan memotong saldo setelah persetujuan atasan langsung.</p>`;
  return htmlHeliosLayout("Helios People · cuti", inner);
}

function htmlHeliosPayslip() {
  const inner = `<h1 style="margin:0 0 .5rem;font-size:1.1rem;font-family:ui-sans-serif,system-ui">Slip gaji</h1>
<p style="margin:0;font-size:.86rem;color:#57534e;font-family:ui-sans-serif,system-ui">Periode Maret tersedia. Unduhan PDF dinonaktifkan di lingkungan lab.</p>`;
  return htmlHeliosLayout("Helios People · slip gaji", inner);
}

function htmlHelios404() {
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><title>404</title>
<style>body{margin:0;font-family:system-ui;background:#faf7f2;color:#44403c;min-height:100vh;display:flex;align-items:center;justify-content:center}a{color:#b45309}</style></head><body><div style="text-align:center"><p>Halaman tidak ditemukan.</p><p><a href="./">Profil</a></p></div></body></html>`;
}

function land(slug, hint) {
  const title = TITLES[slug] || slug;
  const flag = FLAGS[slug];
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${title}</title>
<style>body{font-family:system-ui;margin:1.5rem;background:#0f172a;color:#e2e8f0}a{color:#38bdf8}code{background:#1e293b;padding:.1rem .3rem;border-radius:4px}</style></head><body>
<h1>${title}</h1><p>${hint}</p><p>Flag platform (submit ke NawaVulner): <code>${flag}</code></p><p><a href="health">health</a> (JSON global)</p></body></html>`;
}

app.all("*", (req, res) => {
  const slug = req.nawaSlug;
  const flag = FLAGS[slug];
  const p = req.path || "/";

  if (req.method === "GET" && (p === "/" || p === "") && slug === "a05-sqli-login-bypass") {
    res.type("html").send(`<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><title>Login vendor</title></head><body style="font-family:system-ui;background:#111;color:#eee;padding:1.5rem">
<h1>Login vendor (latihan SQLi)</h1>
<form method="POST" action="/login"><label>Username<br/><input name="username" style="width:20rem"/></label><p><label>Password<br/><input type="password" name="password"/></label></p><button type="submit">Login</button></form>
<p>Flag (submit ke platform): <code>${flag}</code></p></body></html>`);
    return;
  }

  if (slug === "a01-idor-profil-user") {
    if (req.method === "GET" && (p === "/" || p === "")) {
      res.type("html").send(htmlA01IdorLanding());
      return;
    }
    if (req.method === "GET" && (p === "/profile" || p.startsWith("/profile"))) {
      const id = parseIdorId(req.query.id);
      if (id === null) {
        res.status(404).type("html").send(htmlA01Idor404());
        return;
      }
      res.type("html").send(htmlA01IdorProfilePage(id, flag));
      return;
    }
    if (req.method === "GET" && p === "/layanan") {
      res.type("html").send(htmlA01IdorLayanan());
      return;
    }
    if (req.method === "GET" && p === "/status") {
      res.type("html").send(htmlA01IdorStatus());
      return;
    }
    if (p.startsWith("/api/profile")) {
      const id = parseIdorId(req.query.id);
      if (id === null) {
        res.status(404).json({ error: "not_found" });
        return;
      }
      const u = idorUsers(flag)[id];
      if (!u) {
        res.status(404).json({ error: "not_found" });
        return;
      }
      const base = { id, name: u.name, nik: u.nik, layanan: u.layanan, status: u.status, alamat: u.alamat };
      if (u.internal) {
        res.json({ ...base, internalNote: u.internal });
        return;
      }
      res.json({ ...base, note: "Tampilan publik: tanpa catatan internal." });
      return;
    }
    res.status(404).type("html").send(htmlA01Idor404());
    return;
  }

  if (slug === "a01-force-browse-admin") {
    if (req.method === "GET" && (p === "/" || p === "")) {
      res.type("html").send(htmlA01ForceBrowseLanding());
      return;
    }
    if (req.method === "GET" && p === "/pesanan") {
      res.type("html").send(htmlA01ForceBrowsePesanan());
      return;
    }
    if (req.method === "GET" && p === "/bantuan") {
      res.type("html").send(htmlA01ForceBrowseBantuan());
      return;
    }
    if (p === "/admin-console" || p.startsWith("/admin-console")) {
      res.type("html").send(htmlA01ForceBrowseAdmin(flag));
      return;
    }
    res.status(404).type("html").send(htmlA01ForceBrowse404());
    return;
  }

  if (slug === "a01-jwt-privilege-escalation") {
    const cookieName = "mitabisa_jwt";
    const readSession = () => {
      const raw = parseCookie(req, cookieName);
      return jwtPayloadFromToken(raw);
    };

    if (req.method === "GET" && (p === "/" || p === "")) {
      const raw = parseCookie(req, cookieName);
      if (raw && jwtPayloadFromToken(raw).sub) {
        res.redirect(302, "app");
        return;
      }
      res.type("html").send(htmlA01JwtLogin());
      return;
    }

    if (req.method === "POST" && (p === "/login" || p === "/login/")) {
      const u = String(req.body?.username ?? "").trim();
      const pw = String(req.body?.password ?? "");
      if (u === "warga" && pw === "Layanan2024!") {
        const token = buildUnsignedJwt({ sub: "warga", role: "user", name: "Budi Lestari" });
        res.cookie(cookieName, token, {
          path: "/",
          httpOnly: false,
          sameSite: "lax",
          maxAge: 3600000,
        });
        res.redirect(302, "app");
        return;
      }
      res.status(401).type("html").send(`<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><title>Gagal masuk</title></head>
<body style="font-family:system-ui;background:#0f172a;color:#e2e8f0;padding:2rem;text-align:center">
<p>Username atau password salah.</p>
<p><a href="./" style="color:#818cf8">Coba lagi</a></p>
</body></html>`);
      return;
    }

    if (req.method === "GET" && (p === "/logout" || p === "/logout/")) {
      res.clearCookie(cookieName, { path: "/" });
      res.redirect(302, "./");
      return;
    }

    if (req.method === "GET" && (p === "/app" || p === "/app/")) {
      if (!parseCookie(req, cookieName)) {
        res.redirect(302, "./");
        return;
      }
      const pl = readSession();
      res.type("html").send(htmlA01JwtAppShell("home", pl.role || "user", pl.name || "Pengguna"));
      return;
    }

    if (req.method === "GET" && (p === "/profil" || p === "/profil/")) {
      if (!parseCookie(req, cookieName)) {
        res.redirect(302, "./");
        return;
      }
      const pl = readSession();
      res.type("html").send(htmlA01JwtProfil(pl.role || "user", pl.name || "Pengguna", flag));
      return;
    }

    if (req.method === "GET" && (p === "/admin" || p === "/admin/")) {
      if (!parseCookie(req, cookieName)) {
        res.redirect(302, "./");
        return;
      }
      const pl = readSession();
      if (pl.role !== "admin") {
        res.status(403).type("html").send(htmlA01JwtAdminDenied());
        return;
      }
      res.type("html").send(htmlA01JwtAdminOk(flag));
      return;
    }

    if (p.startsWith("/api/me")) {
      const bearer = req.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
      const fromCookie = parseCookie(req, cookieName);
      const raw = bearer || fromCookie;
      const pl = jwtPayloadFromToken(raw);
      const role = pl.role || "user";
      res.json({ role, secret: role === "admin" ? flag : "none" });
      return;
    }

    res.status(404).type("html").send(htmlA01Jwt404());
    return;
  }

  if (slug === "a01-ssrf-internal-discovery") {
    if (req.method === "GET" && (p === "/" || p === "")) {
      res.type("html").send(htmlA01SsrfLanding());
      return;
    }
    if (req.method === "GET" && (p === "/periksa" || p === "/periksa/")) {
      res.type("html").send(htmlA01SsrfPeriksa());
      return;
    }
    if (req.method === "GET" && (p === "/hasil" || p.startsWith("/hasil"))) {
      const url = String(req.query.url || "");
      if (!url.trim()) {
        res.redirect(302, "periksa");
        return;
      }
      const body = ssrfSimulatedBody(url, flag);
      res.type("html").send(htmlA01SsrfHasil(url, body));
      return;
    }
    if (req.method === "GET" && (p === "/risiko" || p === "/risiko/")) {
      res.type("html").send(htmlA01SsrfRisiko());
      return;
    }
    if (req.method === "GET" && (p === "/sla" || p === "/sla/")) {
      res.type("html").send(htmlA01SsrfSla());
      return;
    }
    if (req.method === "GET" && p.startsWith("/fetch")) {
      const u = String(req.query.url || "");
      res.type("text/plain").send(ssrfSimulatedBody(u, flag));
      return;
    }
    res.status(404).type("html").send(htmlA01Ssrf404());
    return;
  }

  if (slug === "a01-csrf-cors-chain") {
    const emailCookie = "nusaops_email";
    const pendingCookie = "nusaops_pending";
    const VERIFY_PIN = "881902";

    const nusaopsCors = (res) => {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.set("Access-Control-Allow-Headers", "Content-Type");
    };

    if (req.method === "GET" && (p === "/" || p === "")) {
      const existing = parseCookie(req, emailCookie);
      if (!existing) {
        res.cookie(emailCookie, "oncall@nusa.id", {
          path: "/",
          httpOnly: false,
          sameSite: "lax",
          maxAge: 7200000,
        });
      }
      const em = existing || "oncall@nusa.id";
      res.type("html").send(htmlNusaopsHome(em));
      return;
    }
    if (req.method === "GET" && (p === "/konfigurasi" || p === "/konfigurasi/")) {
      const em = parseCookie(req, emailCookie) || "oncall@nusa.id";
      res.type("html").send(htmlNusaopsKonfigurasi(em));
      return;
    }
    if (req.method === "GET" && (p === "/log" || p === "/log/")) {
      const em = parseCookie(req, emailCookie) || "oncall@nusa.id";
      res.type("html").send(htmlNusaopsLog(em));
      return;
    }
    if (p === "/api/roster" || p === "/api/roster/") {
      nusaopsCors(res);
      if (req.method === "OPTIONS") {
        res.status(204).end();
        return;
      }
      if (req.method === "GET") {
        const em = parseCookie(req, emailCookie) || "oncall@nusa.id";
        res.json({
          pagerEmail: em,
          rosterVersion: "2026.05.06-14",
          shift: "jakarta-night",
          onCallSince: "2026-05-06T18:00:00+07:00",
        });
        return;
      }
      res.status(405).json({ ok: false, error: "method_not_allowed" });
      return;
    }
    if (p.startsWith("/email/change")) {
      nusaopsCors(res);
      if (req.method === "OPTIONS") {
        res.status(204).end();
        return;
      }
      if (req.method === "GET") {
        res.status(405).json({ ok: false, error: "method_not_allowed", detail: "Gunakan POST dengan email dan current." });
        return;
      }
      if (req.method !== "POST") {
        res.status(405).json({ ok: false, error: "method_not_allowed" });
        return;
      }
      const email = String(req.body?.email ?? req.query.email ?? "").trim();
      const current = String(req.body?.current ?? req.query.current ?? "").trim();
      const sessionEmail = (parseCookie(req, emailCookie) || "oncall@nusa.id").trim();
      if (!email) {
        res.status(400).json({ ok: false, error: "email_required" });
        return;
      }
      if (current !== sessionEmail) {
        res.status(400).json({ ok: false, error: "current_mismatch" });
        return;
      }
      res.cookie(pendingCookie, encodeURIComponent(email), {
        path: "/",
        httpOnly: false,
        sameSite: "lax",
        maxAge: 7200000,
      });
      res.json({
        ok: true,
        status: "pending_verify",
        message: "Tunggu kode verifikasi dari log shift, lalu panggil endpoint verifikasi.",
      });
      return;
    }
    if (p.startsWith("/email/verify")) {
      nusaopsCors(res);
      if (req.method === "OPTIONS") {
        res.status(204).end();
        return;
      }
      if (req.method !== "POST") {
        res.status(405).json({ ok: false, error: "method_not_allowed" });
        return;
      }
      const body = req.body && typeof req.body === "object" ? req.body : {};
      const email = String(body.email ?? "").trim();
      const pin = String(body.pin ?? "").trim();
      const pendingRaw = parseCookie(req, pendingCookie);
      let pendingDecoded = "";
      try {
        pendingDecoded = pendingRaw ? decodeURIComponent(pendingRaw) : "";
      } catch {
        pendingDecoded = pendingRaw || "";
      }
      if (!pendingDecoded || pendingDecoded !== email) {
        res.status(400).json({ ok: false, error: "no_pending_change" });
        return;
      }
      if (pin !== VERIFY_PIN) {
        res.status(400).json({ ok: false, error: "invalid_pin" });
        return;
      }
      res.cookie(emailCookie, email, {
        path: "/",
        httpOnly: false,
        sameSite: "lax",
        maxAge: 7200000,
      });
      res.clearCookie(pendingCookie, { path: "/" });
      res.json({ ok: true, flag });
      return;
    }
    res.status(404).type("html").send(htmlNusaops404());
    return;
  }

  if (slug === "a01-mass-assignment-hpe") {
    if (req.method === "GET" && (p === "/" || p === "")) {
      res.type("html").send(htmlHeliosProfil());
      return;
    }
    if (req.method === "GET" && (p === "/cuti" || p === "/cuti/")) {
      res.type("html").send(htmlHeliosCuti());
      return;
    }
    if (req.method === "GET" && (p === "/payslip" || p === "/payslip/")) {
      res.type("html").send(htmlHeliosPayslip());
      return;
    }
    if (p.startsWith("/api/me") && req.method === "POST") {
      const body = req.body && typeof req.body === "object" ? req.body : {};
      const displayName = String(body.displayName ?? "Raka Wijaya");
      const department = String(body.department ?? "Platform Engineering");
      const wantsAdmin =
        body.isAdmin === true ||
        body.isAdmin === 1 ||
        String(body.isAdmin ?? "")
          .trim()
          .toLowerCase() === "true" ||
        String(body.isAdmin ?? "").trim() === "1";
      const heliosItAdminDept = "Pusat Layanan Teknologi Informasi";
      let isAdmin = false;
      let bonus = null;
      let policyRejectReason = null;
      let policyMessage = null;
      if (wantsAdmin) {
        if (department.trim() === heliosItAdminDept) {
          isAdmin = true;
          bonus = flag;
        } else {
          isAdmin = false;
          bonus = null;
          policyRejectReason = "department_mismatch";
          policyMessage =
            "Peran admin ditolak: nilai departemen tidak cocok dengan unit IT yang berwenang menurut kebijakan tiruan. Sesuaikan string departemen (persis, termasuk huruf besar/kecil), lalu kirim ulang permintaan. Detail respons tetap ada di tab Network atau proxy.";
        }
      }
      const payload = {
        employeeId: "HX-44192",
        displayName,
        department,
        isAdmin,
        bonus,
      };
      if (policyRejectReason) {
        payload.policyRejectReason = policyRejectReason;
        payload.policyMessage = policyMessage;
      }
      res.json(payload);
      return;
    }
    res.status(404).type("html").send(htmlHelios404());
    return;
  }

  if (slug === "a02-default-or-hardcoded-credentials") {
    if (req.method === "GET" && (p === "/" || p === "")) {
      const err = req.query.err ? '<p class="err">Login ditolak.</p>' : "";
      const noise = buildOemVendorNoiseHtml();
      res.type("html").send(`<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>KlinikLogin · OEM portal</title>
<style>
:root{--bg:#070b14;--card:#0f172a;--line:#1e293b;--accent:#38bdf8;--muted:#94a3b8;--text:#f1f5f9;}
*{box-sizing:border-box}body{margin:0;font-family:ui-sans-serif,system-ui;background:radial-gradient(120% 80% at 10% 0%,#0c4a6e 0%,var(--bg) 55%);color:var(--text);min-height:100vh;}
header{padding:1rem 1.5rem;border-bottom:1px solid rgba(56,189,248,.12);display:flex;align-items:center;justify-content:space-between;flex-wrap:gap;}
.brand{font-weight:800;letter-spacing:-.03em;background:linear-gradient(90deg,#7dd3fc,#38bdf8);-webkit-background-clip:text;background-clip:text;color:transparent;}
nav a{color:var(--muted);text-decoration:none;margin-left:1rem;font-size:.85rem;}nav a:hover{color:#fff}
main{max-width:52rem;margin:0 auto;padding:2rem 1.25rem 4rem;display:grid;gap:1.5rem;grid-template-columns:1fr;}
@media(min-width:900px){main{grid-template-columns:1.1fr .9fr;align-items:start}}
.card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:1.35rem;box-shadow:0 24px 60px rgba(0,0,0,.45);}
.card h2{margin:0 0 .5rem;font-size:1.05rem}p{margin:.4rem 0;line-height:1.55;color:#cbd5e1;font-size:.9rem}
.err{color:#fecaca;margin-bottom:.75rem}.hint{color:var(--muted);font-size:.82rem}
label{display:block;font-size:.72rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:.25rem}
input{width:100%;padding:.6rem .75rem;border-radius:10px;border:1px solid #334155;background:#020617;color:var(--text);font-size:.9rem}
button{margin-top:1rem;padding:.6rem 1.2rem;border-radius:10px;border:none;background:linear-gradient(90deg,#0284c7,#38bdf8);color:#042f2e;font-weight:700;cursor:pointer;font-size:.88rem}
.side{font-size:.75rem;color:#64748b;line-height:1.5}.hx{display:none}
ul.changelog{margin:.35rem 0 0;padding-left:1.1rem;color:#94a3b8;font-size:.8rem;line-height:1.45}
</style></head><body>
<header><span class="brand">KlinikLogin OEM</span><nav><a href="./">Portal</a><a href="#changelog">Changelog</a><a href="#compliance">Compliance</a></nav></header>
<main>
<section class="card"><h2>Masuk commissioning</h2>${err}<p class="hint">Portal staging perangkat edge. Gunakan kredensial dari paket commissioning vendor (bukan akun klinik produksi).</p>
<form method="POST" action="login"><label>User</label><input name="username" autocomplete="username"/><label style="margin-top:.75rem">Password</label><input type="password" name="password" autocomplete="current-password"/><button type="submit">Masuk staging</button></form>
<p class="side">Build 3.4.2 · signed manifest vendor #VEND-884C · TLS profile <code>edge-modern</code></p></section>
<section class="card" id="changelog"><h2>Changelog ringkas</h2><ul class="changelog"><li>3.4.2 — patch antrian HL7, hardening cookie.</li><li>3.4.1 — widget status perangkat.</li><li>3.4.0 — baseline OEM HT-9921.</li></ul>
<p class="side">Catatan rilis lengkap tersedia di paket offline (USB vendor), tidak di-host di portal.</p></section>
<section class="card" id="compliance"><h2>Compliance &amp; noise bundle</h2><p class="side">Segmen berikut berisi artefak build otomatis (boleh diabaikan operator).</p><div style="max-height:14rem;overflow:auto;border:1px solid var(--line);border-radius:10px;padding:.75rem;background:#020617;font-size:.68rem;color:#475569;line-height:1.35">${noise}</div></section>
</main></body></html>`);
      return;
    }
    if (req.method === "POST" && (p === "/login" || p === "/login/")) {
      const u = String(req.body?.username ?? "").trim();
      const pw = String(req.body?.password ?? "");
      if (u === "admin" && pw === "LabBootstrap!77") {
        const safe = escapeHtmlLab(flag);
        res.type("html").send(`<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><title>Sesi staging</title>
<style>body{margin:0;font-family:system-ui;background:#0f172a;color:#e2e8f0;min-height:100vh;display:flex;align-items:center;justify-content:center}pre{background:#1e293b;padding:1.25rem;border-radius:12px;border:1px solid #334155;max-width:36rem}a{color:#38bdf8}</style></head><body><div>
<h1 style="margin:0 0 .5rem">Sesi staging aktif</h1><p style="color:#94a3b8">Token recovery (flag platform):</p><pre>${safe}</pre><p><a href="./">Kembali</a></p></div></body></html>`);
        return;
      }
      res.redirect(302, "./?err=1");
      return;
    }
    res.status(404).type("html").send("<p>404</p>");
    return;
  }

  if (slug === "a02-directory-listing") {
    if (req.method === "GET" && (p === "/" || p === "")) {
      res.type("html").send(`<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>ArsipStatis · edge CDN</title>
<style>
:root{--bg:#0c0a09;--card:#1c1917;--accent:#f97316;--muted:#a8a29e;--text:#fafaf9;}
body{margin:0;font-family:ui-sans-serif,system-ui;background:linear-gradient(165deg,#292524 0%,var(--bg) 45%);color:var(--text);min-height:100vh;}
header{padding:1.25rem 1.5rem;border-bottom:1px solid rgba(249,115,22,.2);display:flex;justify-content:space-between;align-items:center;flex-wrap:gap;}
.logo{font-weight:800;color:var(--accent);letter-spacing:-.02em}main{max-width:48rem;margin:2rem auto;padding:0 1.25rem}
.card{background:var(--card);border-radius:14px;padding:1.35rem;border:1px solid rgba(255,255,255,.06);box-shadow:0 20px 50px rgba(0,0,0,.45);}
p{line-height:1.6;color:var(--muted)}a{color:#fdba74;font-weight:600;text-decoration:none}a:hover{text-decoration:underline}
.badge{display:inline-block;font-size:.68rem;padding:.2rem .5rem;border-radius:6px;background:rgba(249,115,22,.15);color:#fed7aa;margin-bottom:.75rem}
</style></head><body>
<header><span class="logo">ArsipStatis</span><span style="color:#78716c;font-size:.8rem">edge · build tier-2</span></header>
<main><div class="card"><span class="badge">Rilis 884c</span><h1 style="margin:.25rem 0 1rem;font-size:1.35rem">Catatan rilis CDN</h1>
<p>Log build otomatis dipublikasikan sebagai artefak statis. Bila unduhan tampak aneh, coba tinjau isi file log mentah (bukan pratinjau browser saja).</p>
<p><a href="cdn/artifacts/tier2/build-884c.log">Unduh build-884c.log</a> (teks mentah pipeline)</p></div></main></body></html>`);
      return;
    }
    if (req.method === "GET" && (p === "/cdn/artifacts/tier2/build-884c.log" || p === "/cdn/artifacts/tier2/build-884c.log/")) {
      res.type("text/plain").send(
        "[884c] layer digest ok\n[884c] sbom attach ok\n[884c] WARN: directory index disabled for leaf objects; operators browse parent path to compare manifest digests\n[884c] hint: strip this filename from the URL bar to open the parent folder index\n"
      );
      return;
    }
    if (req.method === "GET" && (p === "/cdn/artifacts/tier2" || p === "/cdn/artifacts/tier2/")) {
      res.type("html").send(
        htmlDirIndexPage("Index of /cdn/artifacts/tier2/", [
          { name: "../", href: "../", size: "-" },
          { name: "build-884c.log", href: "build-884c.log", size: "4.1 kB" },
          { name: "manifest/", href: "manifest/", size: "-" },
          { name: "staging/", href: "staging/", size: "-" },
        ])
      );
      return;
    }
    if (req.method === "GET" && (p === "/cdn/artifacts/tier2/manifest" || p === "/cdn/artifacts/tier2/manifest/")) {
      res.type("html").send(
        htmlDirIndexPage("Index of /cdn/artifacts/tier2/manifest/", [
          { name: "../", href: "../", size: "-" },
          { name: "vault-locator.json", href: "vault-locator.json", size: "312 B" },
          { name: "checksums.txt", href: "checksums.txt", size: "2.0 kB" },
        ])
      );
      return;
    }
    if (req.method === "GET" && (p === "/cdn/artifacts/tier2/manifest/vault-locator.json" || p === "/cdn/artifacts/tier2/manifest/vault-locator.json/")) {
      res.type("application/json").send(
        JSON.stringify({ note: "internal mirror", relative_unlisted: "../staging/_unlisted/", hint: "open that folder index" })
      );
      return;
    }
    if (req.method === "GET" && (p === "/cdn/artifacts/tier2/manifest/checksums.txt" || p === "/cdn/artifacts/tier2/manifest/checksums.txt/")) {
      res.type("text/plain").send("sha256 884c…ab12  layer-root\nsha256 221c…9ef1  sbom.json\n");
      return;
    }
    if (req.method === "GET" && (p === "/cdn/artifacts/tier2/staging" || p === "/cdn/artifacts/tier2/staging/")) {
      res.type("html").send(
        htmlDirIndexPage("Index of /cdn/artifacts/tier2/staging/", [
          { name: "../", href: "../", size: "-" },
          { name: "_unlisted/", href: "_unlisted/", size: "-" },
          { name: "README_STAGING.txt", href: "README_STAGING.txt", size: "180 B" },
        ])
      );
      return;
    }
    if (req.method === "GET" && (p === "/cdn/artifacts/tier2/staging/README_STAGING.txt" || p === "/cdn/artifacts/tier2/staging/README_STAGING.txt/")) {
      res.type("text/plain").send("staging tree is volatile; unlisted shards may rotate hourly\n");
      return;
    }
    if (req.method === "GET" && (p === "/cdn/artifacts/tier2/staging/_unlisted" || p === "/cdn/artifacts/tier2/staging/_unlisted/")) {
      res.type("html").send(
        htmlDirIndexPage("Index of /cdn/artifacts/tier2/staging/_unlisted/", [
          { name: "../", href: "../", size: "-" },
          { name: "SECRETS.flag", href: "SECRETS.flag", size: "64 B" },
          { name: "scrap.log", href: "scrap.log", size: "512 B" },
        ])
      );
      return;
    }
    if (req.method === "GET" && (p === "/cdn/artifacts/tier2/staging/_unlisted/SECRETS.flag" || p === "/cdn/artifacts/tier2/staging/_unlisted/SECRETS.flag/")) {
      res.type("text/plain").send(`${flag}\n`);
      return;
    }
    if (req.method === "GET" && (p === "/cdn/artifacts/tier2/staging/_unlisted/scrap.log" || p === "/cdn/artifacts/tier2/staging/_unlisted/scrap.log/")) {
      res.type("text/plain").send("rotated keys moved to cold vault (noise)\n");
      return;
    }
    res.status(404).type("html").send("<p>404</p>");
    return;
  }

  if (slug === "a02-verbose-errors") {
    const defaultWk = 1 + Math.floor(Math.random() * 52);
    const defaultWeekStr = `2025-W${String(defaultWk).padStart(2, "0")}`;
    if (req.method === "GET" && (p === "/" || p === "")) {
      res.type("html").send(`<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>LaporHub · rollup fiskal</title>
<style>
:root{--bg:#f8fafc;--ink:#0f172a;--line:#e2e8f0;--accent:#0ea5e9;}
body{margin:0;font-family:ui-sans-serif,system-ui;background:var(--bg);color:var(--ink);min-height:100vh;}
header{padding:1.25rem 1.5rem;border-bottom:1px solid var(--line);background:#fff;}
h1{margin:0;font-size:1.2rem;letter-spacing:-.02em}main{max-width:40rem;margin:2rem auto;padding:0 1.25rem}
.card{background:#fff;border:1px solid var(--line);border-radius:14px;padding:1.35rem;box-shadow:0 12px 40px rgba(15,23,42,.06);}
label{display:block;font-size:.72rem;font-weight:600;color:#64748b;margin:.75rem 0 .25rem;text-transform:uppercase;letter-spacing:.06em}
input[type="week"],input[type="text"]{width:100%;padding:.55rem .65rem;border-radius:10px;border:1px solid #cbd5e1;font-size:.95rem}
button{margin-top:1rem;padding:.55rem 1.15rem;border-radius:10px;border:none;background:linear-gradient(90deg,#0284c7,var(--accent));color:#fff;font-weight:700;cursor:pointer;font-size:.88rem}
.out{margin-top:1rem;font-size:.8rem;color:#64748b;line-height:1.5}#result{margin-top:1rem;padding:1rem;border-radius:10px;background:#0f172a;color:#e2e8f0;font-family:ui-monospace,monospace;font-size:.78rem;white-space:pre-wrap;display:none}
</style></head><body>
<header><h1>LaporHub</h1><p style="margin:.35rem 0 0;font-size:.85rem;color:#64748b">Konsol ringkasan omzet cabang (demo internal)</p></header>
<main><div class="card"><h2 style="margin:0 0 .5rem;font-size:1rem">Ambil rollup mingguan</h2>
<p class="out">Jendela ISO mingguan <strong>1–52</strong> per tahun buku. Parameter <code>isoWeek</code> harus pola <code>YYYY-W&lt;n&gt;</code> (minggu angka bulat). Nilai di luar rentang yang didukung memicu respons generik; layanan tidak mengembalikan pesan spesifik per indeks.</p>
<label for="wk">Minggu (picker)</label><input type="week" id="wk" value="${defaultWeekStr}"/>
<label for="ov">Override kode jendela (opsional)</label><input type="text" id="ov" placeholder="contoh format 2025-W01 — hanya untuk uji integrasi" autocomplete="off"/>
<button type="button" id="go">Tarik rollup</button><div id="result"></div></div></main>
<script>(function(){function isoFromWeekInput(v){if(!v)return"";var p=v.split("-W");if(p.length!==2)return v;return p[0]+"-W"+String(p[1]).padStart(2,"0");}
document.getElementById("go").addEventListener("click",function(){var ov=document.getElementById("ov").value.trim();var iso=ov||isoFromWeekInput(document.getElementById("wk").value);var q=iso?"?isoWeek="+encodeURIComponent(iso):"";fetch("api/fiscal/rollup"+q).then(function(r){return r.text().then(function(t){var el=document.getElementById("result");el.style.display="block";try{el.textContent=JSON.stringify(JSON.parse(t),null,2);}catch(e){el.textContent=t;}});});});})();</script>
</body></html>`);
      return;
    }
    if (req.method === "GET" && p.startsWith("/api/fiscal/rollup")) {
      const vague = () => {
        res.status(500).json({
          error: "ROLLUP_UNAVAILABLE",
          detail: "fiscal_week_constraint",
          trace: "at FiscalWeekNormalizer.normalize (rollup stack redacted)",
        });
      };
      const isoWeek = String(req.query.isoWeek ?? "").trim();
      if (!isoWeek) {
        res.status(400).json({ error: "bad_request" });
        return;
      }
      const m = /^(\d{4})-W(\d+)$/.exec(isoWeek);
      if (!m) {
        vague();
        return;
      }
      let wBig;
      try {
        wBig = BigInt(m[2]);
      } catch {
        vague();
        return;
      }
      const y = Number(m[1]);
      if (!Number.isFinite(y)) {
        vague();
        return;
      }
      if (wBig <= 0n) {
        vague();
        return;
      }
      if (wBig >= 1n && wBig <= 52n) {
        res.json({ ok: true, isoWeek, revenueIdr: 1_842_000_000, branches: 14 });
        return;
      }
      if (wBig > 52n && wBig < 2147483647n) {
        vague();
        return;
      }
      if (wBig >= 2147483647n) {
        res.status(500).json({
          error: "FISCAL_WEEK_PARSE",
          detail: `IsoWeekParser.reject (${JSON.stringify(isoWeek)})`,
          trace: `at isoWeekToFiscalWindow (/svc/laporhub/fiscal/rollup.js:118)\n at async RollupController.fetch (/svc/laporhub/controllers/RollupController.js:44)\n incidentCorrelation=${flag}`,
        });
        return;
      }
      vague();
      return;
    }
    res.status(404).type("html").send("<p>404</p>");
    return;
  }

  if (slug === "a02-missing-security-headers") {
    const dropFrameOpts = (res) => {
      res.removeHeader("X-Frame-Options");
    };
    const sensorEnc = xorB64UrlUtf8(flag, "edgelite-sensor-embed-v1");
    if (req.method === "GET" && (p === "/" || p === "")) {
      dropFrameOpts(res);
      res.type("html").send(`<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>EdgeLite · partner control</title>
<style>
body{margin:0;font-family:ui-sans-serif,system-ui;background:#0b1120;color:#e2e8f0;}
header{padding:1.25rem 1.5rem;border-bottom:1px solid rgba(148,163,184,.15);display:flex;justify-content:space-between;align-items:center;flex-wrap:gap;}
.logo{font-weight:800;letter-spacing:-.03em;color:#38bdf8}nav a{color:#94a3b8;text-decoration:none;margin-left:1rem;font-size:.86rem}nav a:hover{color:#fff}
main{max-width:46rem;margin:2rem auto;padding:0 1.25rem}
.card{background:#111827;border:1px solid rgba(56,189,248,.15);border-radius:14px;padding:1.35rem}
p{line-height:1.6;color:#cbd5e1;font-size:.9rem}a{color:#7dd3fc;font-weight:600}
</style></head><body>
<header><span class="logo">EdgeLite</span><nav><a href="./">Beranda</a></nav></header>
<main><div class="card"><h1 style="margin:0 0 .5rem;font-size:1.15rem">Panel OEM partner</h1>
<p>EdgeLite menerbitkan panel sensor untuk partner tanpa paket mobile mandiri. Dokumentasi OEM menjelaskan kebijakan <strong>same-origin embed</strong>; widget tidak dimaksudkan untuk dibuka langsung sebagai halaman penuh.</p>
<p style="color:#94a3b8;font-size:.86rem">Uji embed dilakukan lewat portal partner (bingkai same-origin). <strong>Skenario penemuan:</strong> tim keamanan mitra meminta <em>peta mount widget</em> resmi — tersedia di <a href="docs/partner-handbook">Handbook partner (HTML)</a>.</p></div></main></body></html>`);
      return;
    }
    if (req.method === "GET" && (p === "/docs/partner-handbook" || p === "/docs/partner-handbook/")) {
      dropFrameOpts(res);
      res.type("html").send(`<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>EdgeLite · handbook mitra</title>
<style>
body{margin:0;font-family:ui-sans-serif,system-ui;background:#0f172a;color:#e2e8f0;line-height:1.65;padding:2rem}
a{color:#7dd3fc}code{background:#020617;padding:.12rem .4rem;border-radius:6px;font-size:.88em}
h1{margin-top:0;font-size:1.35rem}h2{margin-top:1.75rem;font-size:1.05rem;color:#38bdf8}
.toc{border:1px solid #334155;border-radius:12px;padding:1rem 1.25rem;background:#111827;max-width:42rem}
ul{margin:.5rem 0 0;padding-left:1.2rem}
.note{font-size:.85rem;color:#94a3b8;margin-top:2rem}
</style></head><body>
<p><a href="./">← Beranda konsol</a></p>
<h1>Handbook OEM — embed &amp; perimeter</h1>
<p>Dokumen ini ditujukan <strong>mitra berkontrak</strong> (bukan publikasi web). Versi ringkas untuk rilis OEM 4.2.</p>
<div class="toc"><strong>Isi</strong>
<ul>
<li><a href="#mount">Mount widget sensor</a></li>
<li><a href="#guards">Catatan frame guard</a></li>
</ul></div>
<h2 id="mount">Mount widget sensor</h2>
<p>Widget <strong>sensor grid</strong> di-host pada path relatif konsol:</p>
<p><code>panel/sensor-grid</code></p>
<p>Portal mitra meng-embed route tersebut di dalam <code>&lt;iframe&gt;</code> same-origin. Jangan mengarahkan end-user membuka URL tersebut sebagai tab penuh — layout tidak didukung.</p>
<h2 id="guards">Catatan frame guard</h2>
<p>Beberapa build QA sengaja <strong>melemahkan</strong> header frame untuk memudahkan otomasi mitra. Produksi wajib mengaktifkan <code>X-Frame-Options</code> atau CSP <code>frame-ancestors</code>.</p>
<p class="note">Latihan keamanan: bandingkan perilaku saat route panel dibuka sebagai tab penuh versus dimuat di dalam <code>&lt;iframe&gt;</code> same-origin (mis. halaman uji internal mitra Anda sendiri).</p>
</body></html>`);
      return;
    }
    if (req.method === "GET" && (p === "/partners/integrations" || p === "/partners/integrations/")) {
      dropFrameOpts(res);
      res.type("html").send(`<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><title>EdgeLite · integrasi</title>
<style>body{margin:0;font-family:system-ui;background:#0f172a;color:#e2e8f0;padding:2rem;line-height:1.65}a{color:#38bdf8}</style></head><body>
<h1>Integrasi partner</h1><p>Widget resmi hanya didistribusikan ke portal mitra terdaftar. Konfigurasi embed tidak dipublikasikan di halaman ini.</p>
<p style="color:#94a3b8;font-size:.88rem">Tim hardening memantau perilaku embed pada rilis OEM terbaru.</p></body></html>`);
      return;
    }
    if (req.method === "GET" && (p === "/panel/sensor-grid" || p === "/panel/sensor-grid/")) {
      dropFrameOpts(res);
      res.type("html").send(`<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><title>Sensor grid</title><style>body{margin:0;font-family:system-ui;background:#022c22;color:#ecfdf5;min-height:100vh}</style></head><body>
<script>(function(){var ENC="${sensorEnc}";var KEY="edgelite-sensor-embed-v1";
function b64urlToBytes(s){s=s.replace(/-/g,"+").replace(/_/g,"/");while(s.length%4)s+="=";var bin=atob(s),u=new Uint8Array(bin.length);for(var i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return u;}
function xorDec(u,k){var kb=new TextEncoder().encode(k),o=new Uint8Array(u.length);for(var i=0;i<u.length;i++)o[i]=u[i]^kb[i%kb.length];return new TextDecoder().decode(o);}
if(window.self!==window.top){var plain=xorDec(b64urlToBytes(ENC),KEY);document.body.innerHTML='<div style="padding:2rem"><h1 style="margin:0 0 .5rem">Sesi tersemat</h1><p style="opacity:.9">Token partner:</p><pre id="_vp" style="background:#052e16;padding:1rem;border-radius:10px;overflow:auto"></pre></div>';document.getElementById("_vp").textContent=plain;}
else{document.body.innerHTML='<div style="padding:2rem"><h1>Sensor grid</h1><p>Standalone. Route ini didesain untuk di-embed portal partner; payload tersemat tidak ditampilkan di konteks top-level.</p></div>';}})();</script></body></html>`);
      return;
    }
    if (req.method === "GET" && (p === "/qa/partner-shell" || p === "/qa/partner-shell/")) {
      dropFrameOpts(res);
      res.type("html").send(`<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><title>QA partner shell</title>
<style>body{margin:0;font-family:system-ui;background:#020617;color:#e2e8f0;padding:1.5rem}iframe{width:100%;height:260px;border:1px solid #334155;border-radius:12px;background:#0f172a}pre{margin-top:1rem;padding:1rem;border-radius:12px;background:#0f172a;border:1px solid #334155;font-size:.8rem;white-space:pre-wrap;color:#cbd5e1}</style></head><body>
<h1 style="margin-top:0">QA · embed same-origin</h1><p style="color:#94a3b8;font-size:.9rem">Pratinjau perilaku widget saat dimuat di dalam bingkai oleh portal tiruan.</p>
<iframe id="f" src="../panel/sensor-grid"></iframe><pre id="out">Memuat…</pre>
<script>var f=document.getElementById("f");f.onload=function(){try{var t=f.contentDocument.body.innerText.trim();document.getElementById("out").textContent=t||"(iframe kosong)";}catch(e){document.getElementById("out").textContent="Tidak bisa membaca iframe (cross-origin).";}};</script>
</body></html>`);
      return;
    }
    res.status(404).type("html").send("<p>404</p>");
    return;
  }

  if (slug === "a02-cloud-metadata-ssrf") {
    if (req.method === "POST" && (p === "/api/atlas/session" || p === "/api/atlas/session/")) {
      const body = req.body && typeof req.body === "object" ? req.body : {};
      const tk = String(body.tenantKey ?? "");
      if (tk === "velora-edge-sea3") {
        res.cookie("vm_atlas", "1", { path: "/", httpOnly: false, sameSite: "lax", maxAge: 7200000 });
        res.json({ ok: true, shard: "sea-3" });
        return;
      }
      res.status(400).json({ ok: false, error: "unknown_tenant_key" });
      return;
    }
    if (req.method === "GET" && p.startsWith("/api/atlas/fetch")) {
      if (!parseCookie(req, "vm_atlas")) {
        res.status(401).json({ error: "atlas_session_required", hint: "POST /api/atlas/session with tenantKey from runbook" });
        return;
      }
      const url = String(req.query.url || "");
      res.type("text/plain").send(ssrfSimulatedBody(url, flag));
      return;
    }
    if (req.method === "GET" && (p === "/" || p === "")) {
      res.type("html").send(`<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>VeloraMesh · perimeter</title>
<style>
:root{--bg:#031525;--card:#082f49;--line:#0c4a6e;--accent:#22d3ee;--text:#ecfeff;}
body{margin:0;font-family:ui-sans-serif,system-ui;background:radial-gradient(90% 70% at 0% 0%,#164e63 0%,var(--bg) 55%);color:var(--text);min-height:100vh;}
header{padding:1rem 1.5rem;border-bottom:1px solid rgba(34,211,238,.12);display:flex;align-items:center;justify-content:space-between;flex-wrap:gap;}
.brand{font-weight:800;letter-spacing:-.03em;color:var(--accent)}nav a{color:#a5f3fc;text-decoration:none;margin-left:1rem;font-size:.85rem}nav a:hover{color:#fff}
main{max-width:52rem;margin:2rem auto;padding:0 1.25rem}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:1.35rem;margin-bottom:1.25rem;box-shadow:0 20px 50px rgba(0,0,0,.35);}
h1{margin:0 0 .5rem;font-size:1.2rem}p{line-height:1.65;color:#cffafe;font-size:.9rem}
label{display:block;font-size:.72rem;color:#99f6e4;margin:.75rem 0 .25rem;text-transform:uppercase;letter-spacing:.08em}
input{width:100%;padding:.55rem .65rem;border-radius:10px;border:1px solid #155e75;background:#020617;color:#ecfeff;font-size:.85rem}
button{margin-top:.75rem;padding:.5rem 1rem;border-radius:10px;border:none;background:linear-gradient(90deg,#0891b2,#22d3ee);color:#042f2e;font-weight:700;cursor:pointer;font-size:.85rem}
pre{margin:0;padding:1rem;border-radius:10px;background:#020617;border:1px solid #164e63;font-size:.76rem;white-space:pre-wrap;max-height:18rem;overflow:auto}
</style></head><body>
<header><span class="brand">VeloraMesh</span><nav><a href="./">Beranda</a><a href="runbook/migration">Runbook</a><a href="policy/vendor-edge">Kebijakan</a><a href="hub/perimeter">Antrian</a></nav></header>
<main>
<div class="card"><h1>Perimeter snapshot</h1><p>Antrean memvalidasi URL absolut dari sudut <strong>server Atlas</strong>. Sebelum memanggil fetch, shard edge harus terdaftar di sesi API (lihat runbook migrasi vendor tier-3).</p></div>
<div class="card"><h2 style="margin:0 0 .5rem;font-size:1rem">Daftarkan shard (sekali per browser)</h2>
<label>tenantKey (JSON)</label><input id="tk" type="text" placeholder="dari runbook registri shard"/>
<button type="button" id="reg">POST /api/atlas/session</button><pre id="rs"></pre></div>
<div class="card"><h2 style="margin:0 0 .5rem;font-size:1rem">Ambil snapshot</h2>
<label>URL target absolut</label><input id="u" type="url" placeholder="https://…"/>
<button type="button" id="go">GET /api/atlas/fetch</button><pre id="out"></pre></div></main>
<script>(function(){document.getElementById("reg").onclick=function(){fetch("api/atlas/session",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({tenantKey:document.getElementById("tk").value.trim()})}).then(function(r){return r.text()}).then(function(t){document.getElementById("rs").textContent=t;});};document.getElementById("go").onclick=function(){var u=document.getElementById("u").value.trim();if(!u)return;fetch("api/atlas/fetch?url="+encodeURIComponent(u)).then(function(r){return r.text()}).then(function(t){document.getElementById("out").textContent=t;});};})();</script>
</body></html>`);
      return;
    }
    if (req.method === "GET" && (p === "/runbook/migration" || p === "/runbook/migration/")) {
      const rows = [
        ["AP-1", "velora-ap-north1"],
        ["AP-2", "velora-ap-sg2-staging"],
        ["EU-0", "velora-eu-decom-legacy"],
        ["EU-1", "velora-edge-fr1"],
        ["EU-2", "velora-eu-nl2-beta"],
        ["US-0", "velora-us-east0-internal"],
        ["US-1", "velora-edge-use1"],
        ["US-2", "velora-usw2-partner-demo"],
        ["SEA-1", "velora-sea1-reserved"],
        ["SEA-2", "velora-edge-sea2"],
        ["SEA-3", "velora-edge-sea3"],
        ["SEA-4", "velora-sea4-sandbox"],
        ["LATAM-1", "velora-latam-br1"],
        ["MEA-1", "velora-mea-ae1"],
        ["OCE-1", "velora-oce-syd1"],
        ["GOV-1", "velora-gov-usfed1"],
        ["GOV-2", "velora-gov-stub-disabled"],
        ["CN-EDGE", "velora-cn-edge-placeholder"],
        ["MIG-2019", "velora-migration-archive-key"],
        ["VENDOR-X", "velora-vendor-x-contract-void"],
      ];
      const tbody = rows
        .map(
          ([sh, tk]) =>
            `<tr><td>${sh}</td><td><code>${tk}</code></td><td style="color:#99f6e4">rotasi Q4; verifikasi SOC sebelum fetch</td></tr>`
        )
        .join("");
      res.type("html").send(`<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><title>VeloraMesh · runbook</title>
<style>body{margin:0;font-family:system-ui;background:#082f49;color:#ecfeff;padding:2rem;line-height:1.65}code{background:#020617;padding:.15rem .35rem;border-radius:6px}a{color:#67e8f9}table{border-collapse:collapse;margin-top:1rem;font-size:.82rem;width:100%}th,td{border:1px solid #155e75;padding:.4rem .55rem;text-align:left}th{background:#0c4a6e}</style></head><body>
<h1>Runbook migrasi vendor (lampiran B–E)</h1>
<p>Registri tier-3 memetakan shard edge ke <strong>tenantKey</strong> bootstrap Atlas. Banyak entri historis / vendor tidak lagi memicu sesi aktif setelah rotasi kunci 2022–2025.</p>
<p>Stub host <code>internal.metadata</code> pada kontrak pra-cloud digantikan URL <code>https://…</code> absolut. Lampiran C mencatat link-local <code>169.254.169.254</code> untuk bootstrap instance (uji SOC terbatas).</p>
<p><strong>Sebelum</strong> <code>GET /api/atlas/fetch</code>, panggil <code>POST /api/atlas/session</code> dengan JSON <code>{"tenantKey":"…"}</code> menggunakan kunci shard yang masih terdaftar di registri produksi.</p>
<h2 style="margin-top:1.5rem;font-size:1rem">Cuplikan registri produksi (partial)</h2>
<table><thead><tr><th>Shard</th><th>tenantKey</th><th>Catatan</th></tr></thead><tbody>${tbody}</tbody></table>
<p style="margin-top:1rem;color:#a5f3fc;font-size:.85rem">Baris yang tidak valid mengembalikan <code>unknown_tenant_key</code> — tidak ada sinyal per-baris di respons API.</p>
<p>Kembali ke <a href="../hub/perimeter">antrian perimeter</a> atau <a href="../">beranda</a>.</p></body></html>`);
      return;
    }
    if (req.method === "GET" && (p === "/policy/vendor-edge" || p === "/policy/vendor-edge/")) {
      res.type("html").send(`<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><title>VeloraMesh · kebijakan</title>
<style>body{margin:0;font-family:system-ui;background:#042f2e;color:#ccfbf1;padding:2rem;line-height:1.65}a{color:#5eead4}</style></head><body>
<h1>Kebijakan vendor edge</h1><p>Snapshot perimeter tidak boleh mengikuti redirect berantai menuju jaringan kampus pelanggan. Host metadata tiruan internal tetap dalam daftar uji SOC.</p>
<p><a href="../hub/perimeter">Buka antrian</a></p></body></html>`);
      return;
    }
    if (req.method === "GET" && (p === "/hub/perimeter" || p === "/hub/perimeter/")) {
      res.redirect(302, "../");
      return;
    }
    res.status(404).type("html").send("<p>404</p>");
    return;
  }

  if (slug === "a02-debug-endpoint-leak") {
    const cargoCookie = "cargoship_sess";
    const readObj = (req) =>
      req.body && typeof req.body === "object" && !Array.isArray(req.body) ? { ...req.body } : {};

    if (req.method === "GET" && (p === "/" || p === "")) {
      res.type("html").send(`<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>CargoShip CI · portal staging</title>
<style>
body{margin:0;font-family:ui-sans-serif,system-ui;background:#09090b;color:#fafafa;}
header{padding:1.25rem 1.5rem;border-bottom:1px solid #27272a;display:flex;justify-content:space-between;align-items:center;}
.logo{font-weight:800;color:#a78bfa}main{max-width:46rem;margin:2rem auto;padding:0 1.25rem;display:grid;gap:1.25rem}
.card{background:#18181b;border:1px solid #27272a;border-radius:14px;padding:1.35rem}a{color:#c4b5fd;font-weight:600}
.muted{color:#a1a1aa;line-height:1.6;font-size:.9rem}
h1{margin:0 0 .5rem;font-size:1.15rem}.kbd{font-family:ui-monospace,monospace;background:#27272a;padding:.1rem .4rem;border-radius:6px;font-size:.85em}
.btn{display:inline-block;margin-top:1rem;padding:.55rem 1.2rem;border-radius:10px;background:#7c3aed;color:#fff;text-decoration:none;font-weight:700;font-size:.9rem}
</style></head><body>
<header><span class="logo">CargoShip CI</span><span style="color:#71717a;font-size:.8rem">staging · portal internal</span></header>
<main>
<div class="card"><h1>Portal staging</h1>
<p class="muted">CargoShip CI — lingkungan staging untuk mitra. Gunakan akun yang diberikan tim integrasi Anda.</p>
<a class="btn" href="login">Masuk</a></div>
</main></body></html>`);
      return;
    }
    if (req.method === "GET" && (p === "/login" || p === "/login/")) {
      res.type("html").send(`<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>CargoShip CI · masuk</title>
<style>
body{margin:0;font-family:ui-sans-serif,system-ui;background:#09090b;color:#fafafa;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:1.5rem}
.card{max-width:22rem;width:100%;background:#18181b;border:1px solid #27272a;border-radius:16px;padding:1.75rem}
h1{margin:0 0 .25rem;font-size:1.2rem}p{color:#a1a1aa;font-size:.85rem;line-height:1.5;margin:0 0 1rem}
label{display:block;font-size:.72rem;color:#71717a;margin:.75rem 0 .25rem;text-transform:uppercase;letter-spacing:.06em}
input{width:100%;box-sizing:border-box;padding:.6rem .75rem;border-radius:10px;border:1px solid #3f3f46;background:#09090b;color:#fafafa;font-size:.9rem}
button{margin-top:1.25rem;width:100%;padding:.65rem;border-radius:10px;border:none;background:#7c3aed;color:#fff;font-weight:700;cursor:pointer;font-size:.9rem}
.err{color:#f87171;font-size:.85rem;margin-top:.75rem}a{color:#c4b5fd;font-size:.85rem}
</style></head><body>
<div class="card"><h1>Masuk</h1><p>Akun staging vendor.</p>
<form method="POST" action="login">
<label for="em">Email</label><input id="em" name="email" type="email" autocomplete="username" value="${CARGOSHIP_LAB_EMAIL}" required/>
<label for="pw">Password</label><input id="pw" name="password" type="password" autocomplete="current-password" required/>
<button type="submit">Login</button></form>
<p style="margin-top:1rem"><a href="./">← Beranda</a></p></div></body></html>`);
      return;
    }
    if (req.method === "POST" && (p === "/login" || p === "/login/")) {
      const b = readObj(req);
      const email = String(b.email ?? "").trim();
      const password = String(b.password ?? "");
      const extraKeys = Object.keys(b).filter(
        (k) => !["email", "password"].includes(k) && b[k] !== undefined && String(b[k]).trim() !== ""
      );
      const credOk = email === CARGOSHIP_LAB_EMAIL && password === CARGOSHIP_LAB_PASSWORD;
      if (!credOk) {
        res.status(401).type("html").send(`<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><title>Gagal masuk</title>
<body style="font-family:system-ui;background:#111;color:#fca5a5;padding:2rem"><p>Kredensial tidak cocok.</p><p><a style="color:#93c5fd" href="login">Coba lagi</a></p></body></html>`);
        return;
      }
      if (extraKeys.length > 0) {
        res.status(500).type("html").send(laravelMassAssignmentLeakPage(flag, "Auth\\LoginController@store (merge input)", b));
        return;
      }
      res.cookie(cargoCookie, "user", { path: "/", httpOnly: false, sameSite: "lax", maxAge: 7200000 });
      res.redirect(302, "dashboard");
      return;
    }
    if (req.method === "GET" && (p === "/logout" || p === "/logout/")) {
      res.clearCookie(cargoCookie, { path: "/" });
      res.redirect(302, "login");
      return;
    }
    if (req.method === "GET" && (p === "/dashboard" || p === "/dashboard/")) {
      if (parseCookie(req, cargoCookie) !== "user") {
        res.redirect(302, "login");
        return;
      }
      res.type("html").send(`<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>CargoShip CI · dashboard</title>
<style>
body{margin:0;font-family:ui-sans-serif,system-ui;background:#09090b;color:#fafafa;}
header{padding:1rem 1.5rem;border-bottom:1px solid #27272a;display:flex;justify-content:space-between;align-items:center}
.logo{font-weight:800;color:#a78bfa}main{max-width:44rem;margin:2rem auto;padding:0 1.25rem}
.card{background:#18181b;border:1px solid #27272a;border-radius:14px;padding:1.35rem;margin-bottom:1rem}
.muted{color:#a1a1aa;font-size:.88rem;line-height:1.6}code{background:#27272a;padding:.1rem .35rem;border-radius:6px;font-size:.85em}
label{display:block;font-size:.72rem;color:#71717a;margin:.5rem 0 .2rem}
input{width:100%;box-sizing:border-box;padding:.55rem .7rem;border-radius:10px;border:1px solid #3f3f46;background:#09090b;color:#fafafa}
button{margin-top:.9rem;padding:.55rem 1.1rem;border-radius:10px;border:none;background:#7c3aed;color:#fff;font-weight:700;cursor:pointer}
a{color:#c4b5fd}
</style></head><body>
<header><span class="logo">CargoShip CI</span><a href="logout">Keluar</a></header>
<main>
<div class="card"><h1 style="margin:0;font-size:1.1rem">Dashboard</h1>
<p class="muted">Sesi vendor · akses pipeline terbatas.</p></div>
<div class="card"><h2 style="margin:0 0 .5rem;font-size:1rem">Profil</h2>
<p class="muted">Perbarui nama tampilan.</p>
<form method="POST" action="api/profile" id="pf">
<label for="dn">display_name</label><input id="dn" name="display_name" value="Engineer Staging" />
<button type="submit">Simpan</button></form></div>
</main></body></html>`);
      return;
    }
    if (req.method === "POST" && (p === "/api/profile" || p === "/api/profile/")) {
      if (parseCookie(req, cargoCookie) !== "user") {
        res.status(401).type("text/plain").send("unauthenticated\n");
        return;
      }
      const b = readObj(req);
      const suspicious = Object.keys(b).filter(
        (k) => k !== "display_name" && b[k] !== undefined && String(b[k]).trim() !== ""
      );
      if (suspicious.length > 0) {
        res.status(500).type("html").send(laravelMassAssignmentLeakPage(flag, "ProfileController@update (merge input)", b));
        return;
      }
      res.type("json").send(JSON.stringify({ ok: true, saved: { display_name: String(b.display_name ?? "") } }));
      return;
    }
    res.status(404).type("html").send("<p>404</p>");
    return;
  }

  if (slug === "a05-sqli-login-bypass" && p.startsWith("/login") && req.method === "POST") {
    const u = String(req.body?.username || "");
    if (u.includes("OR") && u.includes("1=1")) {
      res.json({ ok: true, flag });
      return;
    }
    res.json({ ok: false });
    return;
  }

  if (slug === "a05-reflected-xss" && p.startsWith("/search")) {
    const q = String(req.query.q || "");
    res.type("html").send(`<p>Hasil: ${q}</p><p>Hint: coba payload reflected.</p>`);
    return;
  }

  if (slug === "a05-sqli-union" && p.startsWith("/item")) {
    const id = String(req.query.id || "1");
    if (id.includes("UNION") || id.includes("union")) {
      res.type("text").send(`leaked\t${flag}`);
      return;
    }
    res.type("text").send("one row");
    return;
  }

  if (slug === "a05-stored-xss-cookie-steal" && p.startsWith("/comments") && req.method === "POST") {
    comments.push(String(req.body?.text || ""));
    res.json({ ok: true });
    return;
  }
  if (slug === "a05-stored-xss-cookie-steal" && p.startsWith("/comments") && req.method === "GET") {
    res.type("html").send(`<ul>${comments.map((c) => `<li>${c}</li>`).join("")}</ul>`);
    return;
  }

  if (slug === "a05-sqli-blind-time" && p.startsWith("/check")) {
    const id = String(req.query.id || "");
    if (/sleep\s*\(/i.test(id) || /pg_sleep/i.test(id)) {
      const delay = 1200;
      const t = Date.now();
      while (Date.now() - t < delay) {
        /* spin for demo */
      }
      res.json({ exists: true });
      return;
    }
    res.json({ exists: false });
    return;
  }

  if (slug === "a05-ssti-rce" && p.startsWith("/render")) {
    const t = String(req.query.t || "");
    if (t.includes("{{")) {
      res.type("text").send(`rendered: ${t}\n${flag}`);
      return;
    }
    res.type("text").send("template ok");
    return;
  }

  const hints = {
    "a01-idor-profil-user": "Petunjuk di halaman challenge (Hint). Di lab: halaman profile?id=1..5 atau API api/profile?id=.",
    "a01-force-browse-admin": "Petunjuk: halaman challenge NawaVulner, blok Hint (unlock). Flag hanya di halaman admin-console di lab.",
    "a01-jwt-privilege-escalation": "Petunjuk di halaman challenge (Hint). Di lab: login, sesi cookie, panel admin.",
    "a01-ssrf-internal-discovery": "Petunjuk di platform (Hint). Lab: Sentinel, perimeter pratinjau URL.",
    "a01-csrf-cors-chain": "Petunjuk di platform (Hint). Lab: NusaOps, konsol on-call.",
    "a01-mass-assignment-hpe": "Petunjuk di platform (Hint). Lab: Helios People, self-service profil.",
    "a02-default-or-hardcoded-credentials": "Petunjuk platform. Lab: KlinikLogin OEM, sumber HTML bising + POST login.",
    "a02-directory-listing": "Petunjuk platform. Lab: ArsipStatis, log build → naik ke parent path → manifest → staging.",
    "a02-verbose-errors":
      "Petunjuk platform. Lab: LaporHub, GET api/fiscal/rollup — rentang minggu ISO 1–52; respons verbose hanya pada kasus batas integer tertentu.",
    "a02-missing-security-headers":
      "Petunjuk platform. Lab: EdgeLite, payload tersemat (same-origin iframe) — bukan string literal di HTML standalone.",
    "a02-cloud-metadata-ssrf":
      "Petunjuk platform. Lab: VeloraMesh, runbook berisi banyak tenantKey; sesi Atlas + GET api/atlas/fetch ke metadata tiruan.",
    "a02-debug-endpoint-leak":
      "Petunjuk di halaman challenge (Hint). Lab: portal staging CargoShip CI — alur normal login lalu pembaruan profil.",
    "a05-sqli-login-bypass": "POST /login (x-www-form-urlencoded) username dengan OR 1=1",
    "a05-reflected-xss": "GET /search?q=…",
    "a05-sqli-union": "GET /item?id=… UNION…",
    "a05-stored-xss-cookie-steal": "POST /comments then GET /comments",
    "a05-sqli-blind-time": "GET /check?id=… time delay",
    "a05-ssti-rce": "GET /render?t={{…}}",
  };
  res.type("html").send(land(slug, hints[slug] || "Eksploitasi sesuai judul modul."));
});

const port = Number(process.env.PORT || 8080);
app.listen(port, "0.0.0.0", () => {
  console.info("[phase1-bundle] listening", port);
});
