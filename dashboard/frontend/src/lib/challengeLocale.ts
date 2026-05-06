/** Bahasa UI untuk challenge (daftar + detail): disimpan di localStorage agar konsisten antar halaman. */

export type UiLang = "id" | "en";

export const CHALLENGE_LANG_KEY = "nawa-challenge-lang";

export function readStoredChallengeLang(): UiLang {
  try {
    const v = localStorage.getItem(CHALLENGE_LANG_KEY);
    if (v === "en" || v === "id") return v;
  } catch {
    /* ignore */
  }
  return "id";
}

export function persistChallengeLang(lang: UiLang) {
  try {
    localStorage.setItem(CHALLENGE_LANG_KEY, lang);
  } catch {
    /* ignore */
  }
}
