import { useI18n } from "../i18n/I18nContext";

type Props = {
  className?: string;
};

export function LangSegmentedControl({ className = "" }: Props) {
  const { lang, setLang, t } = useI18n();

  return (
    <div
      className={`inline-flex shrink-0 rounded-lg border border-white/15 bg-black/35 p-0.5 text-xs shadow-sm ${className}`}
      role="group"
      aria-label={t("aria.langToggle")}
    >
      <button
        type="button"
        onClick={() => setLang("id")}
        className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
          lang === "id" ? "bg-white/15 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
        }`}
        aria-pressed={lang === "id"}
      >
        ID
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
          lang === "en" ? "bg-white/15 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
        }`}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
    </div>
  );
}
