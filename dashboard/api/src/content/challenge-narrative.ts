/** Narasi backstory + ringkasan studi kasus (ID/EN) — Fase 1 A01+A05 kaya; lainnya ringkas. */

import { vulnerabilityExplainHtmlForSlug } from "./challenge-vulnerability-about.js";

export type ChallengeNarrative = {
  /** HTML aman (server-only): penjelasan celah sebelum latar & studi kasus — A01/A02 Fase 1. */
  vulnerabilityExplainId: string;
  vulnerabilityExplainEn: string;
  backstoryId: string;
  backstoryEn: string;
  caseSummaryId: string;
  caseSummaryEn: string;
};

type RichNarrativeBody = Omit<ChallengeNarrative, "vulnerabilityExplainId" | "vulnerabilityExplainEn">;

const RICH: Record<string, RichNarrativeBody> = {
  "a01-idor-profil-user": {
    backstoryId:
      "Portal layanan mandiri Kota Sariwangi (fiksi) menampilkan ringkasan permohonan berdasarkan nomor referensi di URL. Tim IT belum memetakan sesi login ke otorisasi per-objek.",
    backstoryEn:
      "A fictional citizen portal shows application summaries keyed by a reference number in the URL. The team never mapped sessions to per-resource authorization.",
    caseSummaryId:
      "Studi kasus: IDOR pada halaman profil (`profile?id=`) dan API paralel — mengganti nomor pemohon mengekspos catatan internal BKD.",
    caseSummaryEn:
      "Case: IDOR on profile pages (`profile?id=`) and a parallel API — changing applicant numbers exposes internal BKD notes.",
  },
  "a01-force-browse-admin": {
    backstoryId:
      "Panel admin disembunyikan lewat URL 'rahasia' saja tanpa kontrol akses sisi server. Petugas IT mengandalkan keamanan melalui obscurity.",
    backstoryEn:
      "An admin panel is hidden by obscure URLs only, without server-side access control. Security through obscurity.",
    caseSummaryId: "Studi kasus: force browsing / path guessing menuju route admin tanpa autentikasi memadai.",
    caseSummaryEn: "Case: force browsing or path guessing to reach admin routes without proper authentication.",
  },
  "a01-jwt-privilege-escalation": {
    backstoryId:
      "Portal Mitabisa (fiksi) memakai cookie sesi berbentuk JWT. Akun beta lab (hanya di platform ini, tidak di situs lab): username warga, password Layanan2024!",
    backstoryEn:
      "A fictional Mitabisa portal uses a JWT-shaped session cookie. Lab beta account (platform only, not on the lab site): username warga, password Layanan2024!",
    caseSummaryId: "Studi kasus: manipulasi klaim JWT untuk eskalasi privilege.",
    caseSummaryEn: "Case: tampering with JWT claims to escalate privileges.",
  },
  "a01-ssrf-internal-discovery": {
    backstoryId:
      "LautanLink Sentinel (fiksi) adalah konsol GRC/SOC untuk memverifikasi rantai pasokan digital: tim hukum dan keamanan meminta snapshot HTTP mentah dari URL vendor sebelum kontrak ditandatangani. Mesin pratinjau berjalan dari dalam perimeter, bukan dari browser analis.",
    backstoryEn:
      "LautanLink Sentinel (fiction) is a GRC/SOC console for vetting digital supply chains: legal and security teams request raw HTTP snapshots of vendor URLs before contracts are signed. The preview engine runs inside the perimeter, not in the analyst’s browser.",
    caseSummaryId:
      "Studi kasus: Server-Side Request Forgery, server menjadi proxy menuju endpoint yang seharusnya tidak dijangkau dari antarmuka publik.",
    caseSummaryEn:
      "Case: server-side request forgery, the edge becomes a proxy to endpoints that should not be reachable from a public-facing UI.",
  },
  "a01-csrf-cors-chain": {
    backstoryId:
      "NusaOps (fiksi) mengelola roster on-call NusaGrid: satu perubahan email pager salah arah dapat memutus rantai eskalasi insiden. Konsol web masih memakai pola deploy tahun 2010-an yang hidup berdampingan dengan mikrolayanan baru.",
    backstoryEn:
      "NusaOps (fiction) runs the on-call roster for NusaGrid: one misrouted pager email change can break the incident escalation chain. The web console still carries 2010-era deployment patterns alongside newer microservices.",
    caseSummaryId:
      "Studi kasus: perubahan status sensitif tanpa token CSRF, ditambah CORS yang memperbolehkan origin asing membaca respons JSON.",
    caseSummaryEn:
      "Case: sensitive state changes without CSRF protection, combined with CORS that lets foreign origins read JSON responses.",
  },
  "a01-mass-assignment-hpe": {
    backstoryId:
      "Helios People (fiksi) adalah portal self-service karyawan multinasional: satu endpoint JSON memadukan pembaruan profil ringan dengan properti identitas yang seharusnya hanya disentuh HRIS pusat.",
    backstoryEn:
      "Helios People (fiction) is a multinational employee self-service portal: one JSON endpoint merges light profile edits with identity properties that should only be touched by central HRIS.",
    caseSummaryId:
      "Studi kasus: mass assignment, field tambahan pada body API mengubah hak atau data sensitif di luar niat UI.",
    caseSummaryEn:
      "Case: mass assignment, extra JSON fields alter privileges or sensitive data beyond what the UI intends.",
  },
  "a02-default-or-hardcoded-credentials": {
    backstoryId:
      "Appliance KlinikLogin OEM (fiksi) masih memakai bootstrap pabrik; jejak commissioning tersebar di HTML bising vendor.",
    backstoryEn:
      "A fictional KlinikLogin OEM appliance still uses factory bootstrap; commissioning traces hide in noisy vendor HTML.",
    caseSummaryId:
      "Studi kasus: kredensial default/hardcoded atau artefak commissioning memungkinkan akses panel.",
    caseSummaryEn:
      "Case: default/hardcoded credentials or commissioning artifacts grant panel access.",
  },
  "a02-directory-listing": {
    backstoryId:
      "Node CDN ArsipStatis (fiksi) menerbitkan artefak build statis; indeks direktori aktif di rantai subfolder staging yang tidak dipromosikan di UI.",
    backstoryEn:
      "A fictional ArsipStatis CDN publishes static build artifacts; directory indexes are enabled on a chain of staging subfolders not promoted in the UI.",
    caseSummaryId:
      "Studi kasus: listing direktori memperlihatkan shard tersembunyi dan file flag bila penyerang memotong URL atau mengikuti manifest.",
    caseSummaryEn:
      "Case: directory indexes expose hidden shards and flag files when attackers trim URLs or follow manifest breadcrumbs.",
  },
  "a02-verbose-errors": {
    backstoryId:
      "LaporHub (fiksi) menggulung omzet cabang per minggu fiskal; lapisan rollup memunculkan jejak stack tiruan saat string minggu tidak konsisten.",
    backstoryEn:
      "A fictional LaporHub fiscal rollup API emits fake stack traces when ISO week strings are inconsistent.",
    caseSummaryId:
      "Studi kasus: respons error terlalu verbose membocorkan token korelasi (flag) ke klien.",
    caseSummaryEn:
      "Case: overly verbose errors leak correlation tokens (the flag) to clients.",
  },
  "a02-missing-security-headers": {
    backstoryId:
      "EdgeLite (fiksi) menerbitkan panel sensor OEM; mitra mengikuti handbook internal (mount path + halaman QA embed). Respons panel tidak memakai X-Frame-Options.",
    backstoryEn:
      "A fictional EdgeLite OEM sensor panel ships with an internal handbook (mount paths + QA embed page). Panel responses omit X-Frame-Options.",
    caseSummaryId:
      "Studi kasus: tanpa frame guard, konten same-origin di iframe dapat dibaca induk — clickjacking / kebocoran token UI.",
    caseSummaryEn:
      "Case: without frame guards, same-origin iframe content can be read by the parent (clickjacking / UI token leakage).",
  },
  "a02-cloud-metadata-ssrf": {
    backstoryId:
      "VeloraMesh (fiksi) memvalidasi URL absolut dari server Atlas setelah sesi shard; perimeter dapat menjemput stub metadata cloud.",
    backstoryEn:
      "A fictional VeloraMesh stack validates absolute URLs from Atlas after shard session; the perimeter can fetch cloud metadata stubs.",
    caseSummaryId:
      "Studi kasus: rantai SSRF + metadata instance (simulasi) mengungkap bootstrap tiruan.",
    caseSummaryEn:
      "Case: SSRF chain to instance metadata (simulated) exposes a lab bootstrap secret.",
  },
  "a02-debug-endpoint-leak": {
    backstoryId:
      "Tiket HD-4412 (fiksi)\n\nVendor baru hanya mendapat akun engineer untuk melihat pipeline — bukan admin.\n\nKredensial staging (boleh dibagikan di kelas)\nEmail: stager@cargoship.ci\nPassword: CargoDemo#2025\n\nSetelah masuk, jangan langsung menambah field rahasia pada form. Amati dulu apa yang dikirim browser (tab Network atau proxy), lalu ulang permintaan dengan parameter tambahan bila perlu — pola yang umum di skenario mass assignment pada framework populer.",
    backstoryEn:
      "Ticket HD-4412 (fictional)\n\nA new vendor only receives an engineer account to view the pipeline — not admin.\n\nStaging credentials (classroom-safe)\nEmail: stager@cargoship.ci\nPassword: CargoDemo#2025\n\nAfter signing in, do not immediately add sensitive fields in the form. First observe what the browser sends (Network tab or a proxy), then replay the request with extra parameters if needed — a common mass-assignment pattern on popular frameworks.",
    caseSummaryId:
      "Studi kasus: build staging menggabungkan body permintaan terlalu luas; mode debug menampilkan snapshot permintaan yang memuat data sensitif.",
    caseSummaryEn:
      "Case: a staging build merges request bodies too broadly; debug mode renders a request snapshot that includes sensitive data.",
  },
  "a05-sqli-login-bypass": {
    backstoryId:
      "Portal vendor logistik membangun query login dengan interpolasi string dari input form — klasik namun masih ditemukan di dunia nyata.",
    backstoryEn:
      "A logistics vendor portal builds login queries via string interpolation — a classic still seen in the wild.",
    caseSummaryId: "Studi kasus: SQL injection pada form login untuk bypass autentikasi.",
    caseSummaryEn: "Case: SQL injection on a login form to bypass authentication.",
  },
  "a05-reflected-xss": {
    backstoryId:
      "Halaman pencarian tiket mencetak query pengguna ke HTML tanpa escape — celah XSS refleksi.",
    backstoryEn:
      "A ticket search page echoes user queries into HTML without escaping — reflected XSS.",
    caseSummaryId: "Studi kasus: XSS refleksi lewat parameter pencarian.",
    caseSummaryEn: "Case: reflected XSS via search parameters.",
  },
  "a05-sqli-union": {
    backstoryId:
      "Modul laporan ekspor menggabungkan filter sort ke SQL mentah untuk 'fleksibilitas' bisnis.",
    backstoryEn:
      "An export reporting module concatenates sort filters into raw SQL for 'business flexibility'.",
    caseSummaryId: "Studi kasus: UNION-based SQLi untuk mengekstrak baris dari tabel lain.",
    caseSummaryEn: "Case: UNION-based SQLi to extract rows from other tables.",
  },
  "a05-stored-xss-cookie-steal": {
    backstoryId:
      "Forum dukungan produk menyimpan komentar HTML tanpa sanitasi; moderator membuka panel dengan sesi admin.",
    backstoryEn:
      "A product support forum stores HTML comments without sanitization; moderators use an admin panel session.",
    caseSummaryId: "Studi kasus: stored XSS untuk mencuri cookie sesi atau token.",
    caseSummaryEn: "Case: stored XSS to steal session cookies or tokens.",
  },
  "a05-sqli-blind-time": {
    backstoryId:
      "Filter inventori hanya mengembalikan 'ada/tidak ada' tanpa detail error — serangan inferensial masih mungkin.",
    backstoryEn:
      "An inventory filter only returns 'yes/no' without detailed errors — inferential attacks remain possible.",
    caseSummaryId: "Studi kasus: blind SQLi berbasis waktu untuk bit-leaking data.",
    caseSummaryEn: "Case: time-based blind SQLi for bit-leaking data.",
  },
  "a05-ssti-rce": {
    backstoryId:
      "Template email kampanye di-render di server dengan mesin template yang mengeksekusi ekspresi pengguna.",
    backstoryEn:
      "Campaign email templates are rendered server-side with an engine that evaluates user expressions.",
    caseSummaryId: "Studi kasus: SSTI mengarah ke remote code execution.",
    caseSummaryEn: "Case: SSTI leading to remote code execution.",
  },
};

function emptyExplain(): { vulnerabilityExplainId: string; vulnerabilityExplainEn: string } {
  return { vulnerabilityExplainId: "", vulnerabilityExplainEn: "" };
}

export function narrativeForSlug(slug: string, titleId: string, titleEn: string): ChallengeNarrative {
  const explain = vulnerabilityExplainHtmlForSlug(slug);
  const vx = explain ? { vulnerabilityExplainId: explain.id, vulnerabilityExplainEn: explain.en } : emptyExplain();
  const r = RICH[slug];
  if (r) return { ...vx, ...r };
  return {
    ...vx,
    backstoryId: `Latihan platform untuk: ${titleId}. Fokus pada kategori OWASP yang tertera di metadata challenge.`,
    backstoryEn: `Platform drill for: ${titleEn}. Follow the OWASP category shown in challenge metadata.`,
    caseSummaryId: `Ringkasan: skenario fiksi/anonim disesuaikan judul challenge; eksploitasi mengikuti modul PRD.`,
    caseSummaryEn: `Summary: fictional scenario aligned with the challenge title; exploitation follows the PRD module.`,
  };
}

