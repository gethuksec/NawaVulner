import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { persistChallengeLang, readStoredChallengeLang, type UiLang } from "../lib/challengeLocale";
import { interpolate, message, type MessageId } from "./messages";

export type I18nContextValue = {
  lang: UiLang;
  setLang: (lang: UiLang) => void;
  t: (id: MessageId, vars?: Record<string, string>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<UiLang>(() => readStoredChallengeLang());

  const setLang = useCallback((next: UiLang) => {
    setLangState(next);
    persistChallengeLang(next);
  }, []);

  const t = useCallback(
    (id: MessageId, vars?: Record<string, string>) => {
      const raw = message(lang, id);
      return vars ? interpolate(raw, vars) : raw;
    },
    [lang]
  );

  const value = useMemo<I18nContextValue>(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
