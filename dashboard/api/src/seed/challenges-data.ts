/**
 * Metadata + flag plaintext HANYA dipakai saat seed DB (server-side).
 * Jangan log atau kirim ke klien.
 */
export type Difficulty = "easy" | "medium" | "hard";

export type SeedChallenge = {
  slug: string;
  owaspCategory: string;
  difficulty: Difficulty;
  pointsBase: number;
  titleId: string;
  titleEn: string;
  flagPlain: string;
};

const pts = { easy: 100, medium: 250, hard: 500 } as const;

function row(
  slug: string,
  cat: string,
  d: Difficulty,
  titleId: string,
  titleEn: string,
  flagPlain: string
): SeedChallenge {
  return {
    slug,
    owaspCategory: cat,
    difficulty: d,
    pointsBase: pts[d],
    titleId,
    titleEn,
    flagPlain,
  };
}

/** A02 kesulitan diselaraskan dengan kedalaman lab: E, M, M, M, H, H (directory & headers lebih dalam dari “easy” murni). */
export const SEED_CHALLENGES: SeedChallenge[] = [
  // A01
  row("a01-idor-profil-user", "A01", "easy", "IDOR — profil user lain", "IDOR — other user profile", "FLAG{idor_basic_1}"),
  row("a01-force-browse-admin", "A01", "easy", "Force browsing ke panel admin", "Force browse admin panel", "FLAG{force_browse_1}"),
  row("a01-jwt-privilege-escalation", "A01", "medium", "JWT privilege escalation", "JWT privilege escalation", "FLAG{jwt_privesc_1}"),
  row("a01-ssrf-internal-discovery", "A01", "medium", "SSRF — discovery layanan internal", "SSRF — internal service discovery", "FLAG{ssrf_internal_1}"),
  row("a01-csrf-cors-chain", "A01", "hard", "Rantai CSRF + CORS bypass", "CSRF + CORS bypass chain", "FLAG{csrf_cors_chain_1}"),
  row("a01-mass-assignment-hpe", "A01", "hard", "Mass assignment + horizontal priv esc", "Mass assignment + horizontal priv esc", "FLAG{mass_assign_1}"),
  // A02
  row(
    "a02-default-or-hardcoded-credentials",
    "A02",
    "easy",
    "Default atau kredensial hardcoded",
    "Default or hardcoded credentials",
    "FLAG{default_cred_1}"
  ),
  row("a02-directory-listing", "A02", "medium", "Directory listing terbuka (rantai path)", "Exposed directory listing (path chain)", "FLAG{dir_listing_1}"),
  row("a02-verbose-errors", "A02", "medium", "Verbose error exploitation", "Verbose error exploitation", "FLAG{verbose_error_1}"),
  row("a02-missing-security-headers", "A02", "medium", "Missing security headers", "Missing security headers", "FLAG{missing_headers_1}"),
  row("a02-cloud-metadata-ssrf", "A02", "hard", "Cloud metadata exfiltration", "Cloud metadata exfiltration", "FLAG{cloud_meta_1}"),
  row("a02-debug-endpoint-leak", "A02", "hard", "Debug endpoint + env leak", "Debug endpoint + env leak", "FLAG{debug_endpoint_1}"),
  // A03
  row("a03-outdated-library-cve", "A03", "easy", "Outdated library CVE lookup", "Outdated library CVE lookup", "FLAG{outdated_lib_1}"),
  row("a03-package-manifest-exposure", "A03", "easy", "Eksposur package manifest", "Package manifest exposure", "FLAG{pkg_manifest_1}"),
  row("a03-known-cve-log4shell-style", "A03", "medium", "Eksploitasi CVE (Log4Shell-style)", "Known CVE exploitation (Log4Shell-style)", "FLAG{cve_exploit_1}"),
  row("a03-dependency-confusion", "A03", "medium", "Dependency confusion", "Dependency confusion attack", "FLAG{dep_confusion_1}"),
  row("a03-typosquatting-rce", "A03", "hard", "Typosquatting package RCE", "Typosquatting package RCE", "FLAG{typosquat_rce_1}"),
  row("a03-sri-bypass-cdn", "A03", "hard", "SRI bypass + malicious CDN", "SRI bypass + malicious CDN injection", "FLAG{sri_bypass_1}"),
  // A04
  row("a04-md5-password-crack", "A04", "easy", "Crack hash password MD5", "MD5 password hash cracking", "FLAG{md5_crack_1}"),
  row("a04-hardcoded-secret", "A04", "easy", "Secret key hardcoded", "Hardcoded secret key", "FLAG{hardcoded_secret_1}"),
  row("a04-weak-jwt-secret-brute", "A04", "medium", "Brute-force secret JWT lemah", "Weak JWT secret brute force", "FLAG{jwt_brute_1}"),
  row("a04-insecure-cookie-flags", "A04", "medium", "Cookie tidak Secure/HttpOnly", "Insecure cookie (no Secure/HttpOnly)", "FLAG{insecure_cookie_1}"),
  row("a04-cbc-padding-oracle", "A04", "hard", "CBC padding oracle", "CBC padding oracle attack", "FLAG{padding_oracle_1}"),
  row("a04-ecb-block-manipulation", "A04", "hard", "Manipulasi blok AES-ECB", "ECB mode block manipulation", "FLAG{ecb_manip_1}"),
  // A05
  row("a05-sqli-login-bypass", "A05", "easy", "SQLi bypass login klasik", "Classic SQL injection login bypass", "FLAG{sqli_login_1}"),
  row("a05-reflected-xss", "A05", "easy", "Reflected XSS", "Reflected XSS", "FLAG{xss_reflect_1}"),
  row("a05-sqli-union", "A05", "medium", "Union-based SQLi", "Union-based SQL injection", "FLAG{sqli_union_1}"),
  row("a05-stored-xss-cookie-steal", "A05", "medium", "Stored XSS + pencurian cookie", "Stored XSS + cookie stealing", "FLAG{xss_stored_1}"),
  row("a05-sqli-blind-time", "A05", "hard", "Blind SQLi time-based", "Blind SQLi (time-based)", "FLAG{sqli_blind_1}"),
  row("a05-ssti-rce", "A05", "hard", "SSTI hingga RCE", "Server-side template injection (SSTI) RCE", "FLAG{ssti_rce_1}"),
  // A06
  row("a06-username-enumeration", "A06", "easy", "Enumerasi username", "Username enumeration", "FLAG{user_enum_1}"),
  row("a06-insecure-password-reset", "A06", "easy", "Alur reset password tidak aman", "Insecure password reset flow", "FLAG{pw_reset_1}"),
  row("a06-business-logic-negative-price", "A06", "medium", "Bypass logika bisnis (harga negatif)", "Business logic bypass (negative price)", "FLAG{biz_logic_1}"),
  row("a06-race-double-spend", "A06", "medium", "Race condition double spend", "Race condition — double spend", "FLAG{race_cond_1}"),
  row("a06-multistep-auth-bypass", "A06", "hard", "Bypass auth multi-langkah", "Multi-step auth bypass", "FLAG{auth_bypass_multi_1}"),
  row("a06-account-takeover-chain", "A06", "hard", "Rantai account takeover", "Account takeover chain", "FLAG{ato_chain_1}"),
  // A07
  row("a07-credential-stuffing", "A07", "easy", "Credential stuffing", "Credential stuffing with wordlist", "FLAG{cred_stuff_1}"),
  row("a07-session-not-expire", "A07", "easy", "Session tidak expire setelah logout", "Session token does not expire", "FLAG{session_expire_1}"),
  row("a07-otp-brute-no-ratelimit", "A07", "medium", "Brute force OTP tanpa rate limit", "Brute force OTP (no rate limit)", "FLAG{otp_brute_1}"),
  row("a07-session-fixation", "A07", "medium", "Session fixation", "Session fixation attack", "FLAG{session_fix_1}"),
  row("a07-jwt-alg-confusion", "A07", "hard", "JWT algorithm confusion", "JWT algorithm confusion (RS256→HS256)", "FLAG{jwt_alg_conf_1}"),
  row("a07-oauth-implicit-token-theft", "A07", "hard", "Pencurian token OAuth2 implicit", "OAuth2 implicit flow token theft", "FLAG{oauth_token_theft_1}"),
  // A08
  row("a08-deserial-cookie", "A08", "easy", "Deserialisasi tidak aman (cookie)", "Insecure deserialization — cookie", "FLAG{deserial_cookie_1}"),
  row("a08-unsigned-software-update", "A08", "easy", "Update software tanpa tanda tangan", "Unsigned software update", "FLAG{unsigned_update_1}"),
  row("a08-python-pickle-rce", "A08", "medium", "Python pickle RCE", "Python pickle RCE", "FLAG{pickle_rce_1}"),
  row("a08-xxe-file-read", "A08", "medium", "XXE file read / SSRF", "XML External Entity (XXE)", "FLAG{xxe_file_read_1}"),
  row("a08-java-deserial-rce", "A08", "hard", "Java deserialization RCE", "Java deserialization RCE", "FLAG{java_deserial_1}"),
  row("a08-cicd-pipeline-inject", "A08", "hard", "Injeksi pipeline CI/CD", "CI/CD pipeline injection", "FLAG{cicd_inject_1}"),
  // A09
  row("a09-log-injection-crlf", "A09", "easy", "Log injection (CRLF)", "Log injection (CRLF)", "FLAG{log_inject_1}"),
  row("a09-audit-bypass-parameter-pollution", "A09", "easy", "Bypass audit trail (parameter pollution)", "Bypass audit trail via parameter pollution", "FLAG{audit_bypass_1}"),
  row("a09-log-poisoning-lfi", "A09", "medium", "Log poisoning → LFI", "Log poisoning for LFI escalation", "FLAG{log_poison_1}"),
  row("a09-blind-spot-unmonitored", "A09", "medium", "Endpoint tidak termonitor", "Blind spot — unmonitored endpoint", "FLAG{blind_spot_1}"),
  row("a09-waf-evasion-obfuscation", "A09", "hard", "Evasi WAF / obfuscation", "WAF evasion + attack obfuscation", "FLAG{waf_evasion_1}"),
  row("a09-log-tampering-forensic", "A09", "hard", "Log tampering / anti-forensik", "Forensic anti-analysis (log tampering)", "FLAG{log_tamper_1}"),
  // A10
  row("a10-error-info-disclosure", "A10", "easy", "Information disclosure lewat error", "Error message information disclosure", "FLAG{error_info_1}"),
  row("a10-null-byte-injection", "A10", "easy", "Null byte injection", "Null byte injection", "FLAG{null_byte_1}"),
  row("a10-integer-overflow", "A10", "medium", "Integer overflow / underflow", "Integer overflow / underflow", "FLAG{int_overflow_1}"),
  row("a10-redos", "A10", "medium", "ReDoS resource exhaustion", "Resource exhaustion (ReDoS)", "FLAG{redos_1}"),
  row("a10-php-type-juggling", "A10", "hard", "Type juggling PHP", "PHP type juggling exploit", "FLAG{type_juggle_1}"),
  row("a10-crash-recovery-state", "A10", "hard", "Manipulasi state recovery setelah crash", "Crash recovery state manipulation", "FLAG{crash_state_1}"),
];

/** Jumlah challenge MVP (PRD): harus sama dengan panjang `SEED_CHALLENGES`. */
export const EXPECTED_CHALLENGE_COUNT = 60;
