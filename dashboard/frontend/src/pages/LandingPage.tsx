import { Link } from "react-router-dom";
import { LangSegmentedControl } from "../components/LangSegmentedControl";
import { useI18n } from "../i18n/I18nContext";

export function LandingPage() {
  const { t } = useI18n();

  return (
    <div className="relative min-h-screen overflow-hidden bg-nawa-bg">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
      <div className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-nawa-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <header className="relative border-b border-white/10 bg-nawa-card/50 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <span className="font-mono text-lg font-semibold tracking-tight text-white">NawaVulner</span>
          <div className="flex flex-wrap items-center justify-end gap-3">
            <LangSegmentedControl />
            <Link
              to="/login"
              className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-slate-200 transition hover:border-white/25 hover:bg-white/5"
            >
              {t("landing.login")}
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-nawa-accent px-3 py-1.5 text-sm font-medium text-white shadow-lg shadow-nawa-accent/25 transition hover:opacity-90"
            >
              {t("landing.startLearning")}
            </Link>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-5xl px-4 py-16 md:py-24">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-nawa-card/80 to-nawa-card/40 p-8 shadow-2xl shadow-black/40 backdrop-blur-sm md:p-12">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs font-medium uppercase tracking-wider text-nawa-accent">
            {t("landing.badge")}
          </p>
          <h1 className="mt-6 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl md:leading-tight">
            {t("landing.heroTitle")}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">{t("landing.heroBody")}</p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-lg bg-nawa-accent px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-nawa-accent/30 transition hover:opacity-90"
            >
              {t("landing.ctaRegister")}
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 px-6 py-2.5 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/10"
            >
              {t("landing.ctaChallenges")}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
