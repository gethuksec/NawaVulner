import type { UiLang } from "../lib/challengeLocale";

/** Ganti {{key}} dalam string template */
export function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, k: string) => vars[k] ?? "");
}

export type MessageId =
  | "aria.langToggle"
  | "common.loading"
  | "common.back"
  | "common.points"
  | "common.yes"
  | "common.no"
  | "common.loadFailed"
  | "nav.dashboard"
  | "nav.stats"
  | "nav.submissions"
  | "nav.home"
  | "nav.logout"
  | "landing.badge"
  | "landing.heroTitle"
  | "landing.heroBody"
  | "landing.ctaRegister"
  | "landing.ctaChallenges"
  | "landing.login"
  | "landing.startLearning"
  | "auth.loginTitle"
  | "auth.registerTitle"
  | "auth.noAccount"
  | "auth.hasAccount"
  | "auth.registerLink"
  | "auth.loginLink"
  | "auth.username"
  | "auth.password"
  | "auth.email"
  | "auth.passwordMin"
  | "auth.submitLogin"
  | "auth.submitRegister"
  | "auth.processing"
  | "auth.loginFailed"
  | "auth.registerFailed"
  | "dashboard.title"
  | "dashboard.progressTitle"
  | "dashboard.progressSubtitle"
  | "dashboard.challengeListTitle"
  | "dashboard.challengeListSubtitle"
  | "dashboard.filterCategory"
  | "dashboard.filterDifficulty"
  | "dashboard.filterStatus"
  | "dashboard.filterAllCats"
  | "dashboard.filterAllDiff"
  | "dashboard.filterAllStatus"
  | "dashboard.clearFilters"
  | "dashboard.showingCount"
  | "dashboard.withFilters"
  | "dashboard.emptyTitle"
  | "dashboard.emptyBody"
  | "dashboard.emptyClear"
  | "dashboard.statSolved"
  | "dashboard.statSolvedSub"
  | "dashboard.statPoints"
  | "dashboard.statPointsSub"
  | "dashboard.statBadge"
  | "dashboard.statBadgeSub"
  | "dashboard.statRank"
  | "dashboard.statRankSub"
  | "dashboard.moduleDone"
  | "dashboard.statusSolved"
  | "dashboard.statusUnlocked"
  | "dashboard.statusLocked"
  | "dashboard.loadFailed"
  | "dashboard.modulePercent"
  | "dashboard.navAria"
  | "challenge.backToList"
  | "challenge.vulnTitle"
  | "challenge.vulnBlurbId"
  | "challenge.vulnBlurbEn"
  | "challenge.labTitle"
  | "challenge.container"
  | "challenge.containerReady"
  | "challenge.containerNotReady"
  | "challenge.openLab"
  | "challenge.devNote"
  | "challenge.labUnavailable"
  | "challenge.resetLab"
  | "challenge.labResetAck"
  | "challenge.hintsTitle"
  | "challenge.hintLockedHelp"
  | "challenge.hintLoadError403"
  | "challenge.hintLoadError"
  | "challenge.hintLoadErrorGeneric"
  | "challenge.hintLevel"
  | "challenge.hintOpen"
  | "challenge.hintNotOpen"
  | "challenge.hintLoading"
  | "challenge.writeupTitle"
  | "challenge.writeupLoading"
  | "challenge.submitFlag"
  | "challenge.submitSend"
  | "challenge.loadFailed"
  | "challenge.statusPrefix"
  | "challenge.backstory"
  | "challenge.backstoryEn"
  | "challenge.caseSummary"
  | "challenge.caseSummaryEn"
  | "challenge.unlockFail"
  | "challenge.resetFail"
  | "challenge.submitFail"
  | "challenge.flagWrong"
  | "challenge.flagAlready"
  | "challenge.flagCorrect"
  | "challenge.flagPenalty"
  | "challenge.flagFirstBlood"
  | "challenge.flagBadges"
  | "challenge.unlockConfirm1"
  | "challenge.unlockConfirm2"
  | "challenge.unlockConfirm3"
  | "challenge.hintOpened"
  | "submissions.title"
  | "submissions.subtitle"
  | "submissions.colTime"
  | "submissions.colChallenge"
  | "submissions.colCorrect"
  | "submissions.colText"
  | "submissions.empty"
  | "stats.back"
  | "stats.title"
  | "stats.subtitle"
  | "stats.solved"
  | "stats.totalPoints"
  | "stats.badges"
  | "stats.rank"
  | "stats.modulesTitle";

const M: Record<UiLang, Record<MessageId, string>> = {
  id: {
    "aria.langToggle": "Bahasa konten (ID / EN)",
    "common.loading": "Memuat…",
    "common.back": "← Kembali",
    "common.points": "poin",
    "common.yes": "ya",
    "common.no": "tidak",
    "common.loadFailed": "Gagal memuat",
    "nav.dashboard": "Dashboard",
    "nav.stats": "Statistik",
    "nav.submissions": "Riwayat flag",
    "nav.home": "Beranda",
    "nav.logout": "Keluar",
    "landing.badge": "OWASP Top 10:2025",
    "landing.heroTitle":
      "Pembelajaran keamanan aplikasi web mengacu pada kerangka OWASP Top 10:2025.",
    "landing.heroBody":
      "Aplikasi ini dikembangkan oleh GethukSecurity × NawaSiber. Setelah masuk, Anda dapat menjelajahi modul challenge, mengerjakan lab, dan mengirim flag untuk verifikasi.",
    "landing.ctaRegister": "Daftar",
    "landing.ctaChallenges": "Lihat challenge",
    "landing.login": "Masuk",
    "landing.startLearning": "Mulai belajar",
    "auth.loginTitle": "Masuk",
    "auth.registerTitle": "Daftar",
    "auth.noAccount": "Belum punya akun?",
    "auth.hasAccount": "Sudah punya akun?",
    "auth.registerLink": "Daftar",
    "auth.loginLink": "Masuk",
    "auth.username": "Username",
    "auth.password": "Password",
    "auth.email": "Email",
    "auth.passwordMin": "Password (min. 8)",
    "auth.submitLogin": "Masuk",
    "auth.submitRegister": "Buat akun",
    "auth.processing": "Memproses…",
    "auth.loginFailed": "Login gagal",
    "auth.registerFailed": "Registrasi gagal",
    "dashboard.title": "Dashboard",
    "dashboard.progressTitle": "Progres modul OWASP",
    "dashboard.progressSubtitle":
      "Ringkasan penyelesaian per kategori. Lanjutkan dari challenge yang masih terbuka atau terkunci.",
    "dashboard.challengeListTitle": "Daftar challenge",
    "dashboard.challengeListSubtitle":
      "Saring berdasarkan kategori OWASP, tingkat kesulitan, atau status progres Anda.",
    "dashboard.filterCategory": "Kategori OWASP",
    "dashboard.filterDifficulty": "Tingkat kesulitan",
    "dashboard.filterStatus": "Status challenge",
    "dashboard.filterAllCats": "Semua kategori",
    "dashboard.filterAllDiff": "Semua tingkat",
    "dashboard.filterAllStatus": "Semua status",
    "dashboard.clearFilters": "Hapus semua filter",
    "dashboard.showingCount": "Menampilkan",
    "dashboard.withFilters": "sesuai filter",
    "dashboard.emptyTitle": "Tidak ada challenge untuk filter ini",
    "dashboard.emptyBody": "Coba ubah filter atau hapus semua filter di atas.",
    "dashboard.emptyClear": "Hapus filter",
    "dashboard.statSolved": "Challenge selesai",
    "dashboard.statSolvedSub": "dari daftar aktif",
    "dashboard.statPoints": "Total poin",
    "dashboard.statPointsSub": "kumulatif platform",
    "dashboard.statBadge": "Badge",
    "dashboard.statBadgeSub": "pencapaian",
    "dashboard.statRank": "Perkiraan rank",
    "dashboard.statRankSub": "perkiraan global",
    "dashboard.moduleDone": "selesai",
    "dashboard.statusSolved": "Selesai",
    "dashboard.statusUnlocked": "Terbuka",
    "dashboard.statusLocked": "Terkunci",
    "dashboard.loadFailed": "Gagal memuat data",
    "dashboard.modulePercent": "{{pct}}% selesai",
    "dashboard.navAria": "Navigasi dashboard",
    "challenge.backToList": "← Kembali ke daftar",
    "challenge.vulnTitle": "Apa celah ini?",
    "challenge.vulnBlurbId": "Ringkas untuk pemula; referensi ke materi umum (bukan mengikat).",
    "challenge.vulnBlurbEn": "Short intro for beginners; external links are examples only.",
    "challenge.labTitle": "Lab",
    "challenge.container": "Container:",
    "challenge.containerReady": "siap",
    "challenge.containerNotReady": "belum di LAB_DEPLOYED / compose",
    "challenge.openLab": "Buka lab (tab baru)",
    "challenge.devNote":
      "Dev: jalankan stack Docker di :8080 atau set PUBLIC_BASE_URL di API agar URL absolut benar.",
    "challenge.labUnavailable": "Lab URL tidak tersedia (challenge terkunci atau error).",
    "challenge.resetLab": "Reset lab",
    "challenge.labResetAck":
      "Reset dicatat. Segarkan tab lab bila perlu. Riwayat reset tersimpan di server.",
    "challenge.hintsTitle": "Hint",
    "challenge.hintLockedHelp":
      "Challenge masih terkunci (mode progres ketat atau belum memenuhi syarat). Buka challenge entry di kategori OWASP-nya, atau set CHALLENGE_UNLOCK_MODE=free di lingkungan dev agar semua challenge terbuka. Setelah terbuka, hint bertingkat bisa di-unlock di sini.",
    "challenge.hintLoadError403": "Hint tidak tersedia (challenge terkunci).",
    "challenge.hintLoadError": "Gagal memuat hint ({{status}}).",
    "challenge.hintLoadErrorGeneric": "Gagal memuat hint.",
    "challenge.hintLevel": "Hint {{level}}",
    "challenge.hintOpen": "Buka hint {{level}}",
    "challenge.hintNotOpen": "Belum dibuka.",
    "challenge.hintLoading": "Memuat hint…",
    "challenge.writeupTitle": "Write-up (setelah solve)",
    "challenge.writeupLoading": "Memuat write-up…",
    "challenge.submitFlag": "Kirim flag",
    "challenge.submitSend": "Kirim",
    "challenge.loadFailed": "Gagal memuat",
    "challenge.statusPrefix": "status:",
    "challenge.backstory": "Latar (backstory)",
    "challenge.backstoryEn": "Backstory",
    "challenge.caseSummary": "Studi kasus",
    "challenge.caseSummaryEn": "Case summary",
    "challenge.unlockFail": "Unlock hint gagal",
    "challenge.resetFail": "Reset gagal",
    "challenge.submitFail": "Submit gagal",
    "challenge.flagWrong": "Flag salah.",
    "challenge.flagAlready": "Sudah pernah solved.",
    "challenge.flagCorrect": "Benar! +{{points}} poin.",
    "challenge.flagPenalty": " (penalti hint: −{{n}})",
    "challenge.flagFirstBlood": " First blood +{{n}}.",
    "challenge.flagBadges": " Badge baru: {{names}}.",
    "challenge.unlockConfirm1": "Buka hint 1? (gratis)",
    "challenge.unlockConfirm2": "Buka hint 2? Saat flag benar, poin base dikurangi 25%.",
    "challenge.unlockConfirm3":
      "Buka hint 3? Saat flag benar, poin base dikurangi 50% (stack dengan hint 2).",
    "challenge.hintOpened": "Hint {{level}} terbuka.",
    "submissions.title": "Riwayat submit flag",
    "submissions.subtitle": "Terbaru di atas.",
    "submissions.colTime": "Waktu",
    "submissions.colChallenge": "Challenge",
    "submissions.colCorrect": "Benar",
    "submissions.colText": "Teks",
    "submissions.empty": "Belum ada submission.",
    "stats.back": "← Kembali ke dashboard",
    "stats.title": "Statistik",
    "stats.subtitle": "Ringkasan akun Anda.",
    "stats.solved": "Diselesaikan",
    "stats.totalPoints": "Total poin (hint + first blood)",
    "stats.badges": "Badge",
    "stats.rank": "Peringkat (perkiraan)",
    "stats.modulesTitle": "Progres per modul OWASP",
  },
  en: {
    "aria.langToggle": "Content language (ID / EN)",
    "common.loading": "Loading…",
    "common.back": "← Back",
    "common.points": "points",
    "common.yes": "yes",
    "common.no": "no",
    "common.loadFailed": "Failed to load",
    "nav.dashboard": "Dashboard",
    "nav.stats": "Statistics",
    "nav.submissions": "Flag history",
    "nav.home": "Home",
    "nav.logout": "Log out",
    "landing.badge": "OWASP Top 10:2025",
    "landing.heroTitle": "Web application security learning aligned with the OWASP Top 10:2025 framework.",
    "landing.heroBody":
      "Built by GethukSecurity × NawaSiber. After signing in, explore challenge modules, work in labs, and submit flags for verification.",
    "landing.ctaRegister": "Register",
    "landing.ctaChallenges": "View challenges",
    "landing.login": "Log in",
    "landing.startLearning": "Start learning",
    "auth.loginTitle": "Log in",
    "auth.registerTitle": "Register",
    "auth.noAccount": "No account yet?",
    "auth.hasAccount": "Already have an account?",
    "auth.registerLink": "Register",
    "auth.loginLink": "Log in",
    "auth.username": "Username",
    "auth.password": "Password",
    "auth.email": "Email",
    "auth.passwordMin": "Password (min. 8)",
    "auth.submitLogin": "Log in",
    "auth.submitRegister": "Create account",
    "auth.processing": "Working…",
    "auth.loginFailed": "Login failed",
    "auth.registerFailed": "Registration failed",
    "dashboard.title": "Dashboard",
    "dashboard.progressTitle": "OWASP module progress",
    "dashboard.progressSubtitle":
      "Completion summary per category. Continue from challenges that are open or locked.",
    "dashboard.challengeListTitle": "Challenge list",
    "dashboard.challengeListSubtitle": "Filter by OWASP category, difficulty, or your progress status.",
    "dashboard.filterCategory": "OWASP category",
    "dashboard.filterDifficulty": "Difficulty",
    "dashboard.filterStatus": "Challenge status",
    "dashboard.filterAllCats": "All categories",
    "dashboard.filterAllDiff": "All levels",
    "dashboard.filterAllStatus": "All statuses",
    "dashboard.clearFilters": "Clear all filters",
    "dashboard.showingCount": "Showing",
    "dashboard.withFilters": "matching filters",
    "dashboard.emptyTitle": "No challenges for this filter",
    "dashboard.emptyBody": "Try changing filters or clear them above.",
    "dashboard.emptyClear": "Clear filters",
    "dashboard.statSolved": "Challenges solved",
    "dashboard.statSolvedSub": "from active list",
    "dashboard.statPoints": "Total points",
    "dashboard.statPointsSub": "platform cumulative",
    "dashboard.statBadge": "Badges",
    "dashboard.statBadgeSub": "achievements",
    "dashboard.statRank": "Approx. rank",
    "dashboard.statRankSub": "global estimate",
    "dashboard.moduleDone": "done",
    "dashboard.statusSolved": "Solved",
    "dashboard.statusUnlocked": "Unlocked",
    "dashboard.statusLocked": "Locked",
    "dashboard.loadFailed": "Failed to load data",
    "dashboard.modulePercent": "{{pct}}% done",
    "dashboard.navAria": "Dashboard navigation",
    "challenge.backToList": "← Back to list",
    "challenge.vulnTitle": "What is this vulnerability?",
    "challenge.vulnBlurbId":
      "Short beginner-friendly summary; references are general material only (non-binding).",
    "challenge.vulnBlurbEn": "Short intro for beginners; external links are examples only.",
    "challenge.labTitle": "Lab",
    "challenge.container": "Container:",
    "challenge.containerReady": "ready",
    "challenge.containerNotReady": "not in LAB_DEPLOYED / compose",
    "challenge.openLab": "Open lab (new tab)",
    "challenge.devNote":
      "Dev: run Docker stack on :8080 or set PUBLIC_BASE_URL on the API for correct absolute URLs.",
    "challenge.labUnavailable": "Lab URL unavailable (challenge locked or error).",
    "challenge.resetLab": "Reset lab",
    "challenge.labResetAck":
      "Reset recorded. Refresh the lab tab if needed. Reset history is stored on the server.",
    "challenge.hintsTitle": "Hints",
    "challenge.hintLockedHelp":
      "This challenge is still locked (strict progress or prerequisites). Open it from its OWASP category, or set CHALLENGE_UNLOCK_MODE=free in dev to unlock all. Tiered hints can be unlocked here once open.",
    "challenge.hintLoadError403": "Hints unavailable (challenge locked).",
    "challenge.hintLoadError": "Failed to load hints ({{status}}).",
    "challenge.hintLoadErrorGeneric": "Failed to load hints.",
    "challenge.hintLevel": "Hint {{level}}",
    "challenge.hintOpen": "Unlock hint {{level}}",
    "challenge.hintNotOpen": "Not unlocked yet.",
    "challenge.hintLoading": "Loading hints…",
    "challenge.writeupTitle": "Write-up (after solve)",
    "challenge.writeupLoading": "Loading write-up…",
    "challenge.submitFlag": "Submit flag",
    "challenge.submitSend": "Submit",
    "challenge.loadFailed": "Failed to load",
    "challenge.statusPrefix": "status:",
    "challenge.backstory": "Backstory",
    "challenge.backstoryEn": "Backstory",
    "challenge.caseSummary": "Case summary",
    "challenge.caseSummaryEn": "Case summary",
    "challenge.unlockFail": "Failed to unlock hint",
    "challenge.resetFail": "Reset failed",
    "challenge.submitFail": "Submit failed",
    "challenge.flagWrong": "Incorrect flag.",
    "challenge.flagAlready": "Already solved.",
    "challenge.flagCorrect": "Correct! +{{points}} points.",
    "challenge.flagPenalty": " (hint penalty: −{{n}})",
    "challenge.flagFirstBlood": " First blood +{{n}}.",
    "challenge.flagBadges": " New badges: {{names}}.",
    "challenge.unlockConfirm1": "Unlock hint 1? (free)",
    "challenge.unlockConfirm2": "Unlock hint 2? On correct flag, base points are reduced by 25%.",
    "challenge.unlockConfirm3":
      "Unlock hint 3? On correct flag, base points are reduced by 50% (stacks with hint 2).",
    "challenge.hintOpened": "Hint {{level}} unlocked.",
    "submissions.title": "Flag submission history",
    "submissions.subtitle": "Newest first.",
    "submissions.colTime": "Time",
    "submissions.colChallenge": "Challenge",
    "submissions.colCorrect": "Correct",
    "submissions.colText": "Text",
    "submissions.empty": "No submissions yet.",
    "stats.back": "← Dashboard",
    "stats.title": "Statistics",
    "stats.subtitle": "Your account summary.",
    "stats.solved": "Solved",
    "stats.totalPoints": "Total points (hints + first blood)",
    "stats.badges": "Badges",
    "stats.rank": "Rank (estimate)",
    "stats.modulesTitle": "Progress per OWASP module",
  },
};

export function message(lang: UiLang, id: MessageId): string {
  return M[lang][id] ?? M.id[id] ?? id;
}
