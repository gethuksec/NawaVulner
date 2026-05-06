import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api, ApiError } from "../api";
import { LangSegmentedControl } from "../components/LangSegmentedControl";
import { useI18n } from "../i18n/I18nContext";
import { interpolate, message } from "../i18n/messages";
import { readStoredChallengeLang } from "../lib/challengeLocale";
import type { ChallengeListItem, ChallengeStatus } from "../types";

type MeResponse = {
  user: { id: number; username: string; email: string };
  stats: {
    solvedCount: number;
    totalPoints: number;
    badgeCount?: number;
    rankApprox?: number;
  };
};

type ChallengesResponse = { challenges: ChallengeListItem[] };

type Module = { owaspCategory: string; total: number; solved: number; percent: number };
type ProgressResponse = { modules: Module[] };

function owaspChipClass(cat: string): string {
  const map: Record<string, string> = {
    A01: "border-cyan-400/35 bg-cyan-400/10 text-cyan-200",
    A02: "border-sky-400/35 bg-sky-400/10 text-sky-200",
    A03: "border-indigo-400/35 bg-indigo-400/10 text-indigo-200",
    A04: "border-violet-400/35 bg-violet-400/10 text-violet-200",
    A05: "border-amber-400/35 bg-amber-400/10 text-amber-200",
    A06: "border-rose-400/35 bg-rose-400/10 text-rose-200",
    A07: "border-orange-400/35 bg-orange-400/10 text-orange-200",
    A08: "border-teal-400/35 bg-teal-400/10 text-teal-200",
    A09: "border-emerald-400/35 bg-emerald-400/10 text-emerald-200",
    A10: "border-fuchsia-400/35 bg-fuchsia-400/10 text-fuchsia-200",
  };
  return map[cat] ?? "border-white/15 bg-white/5 text-slate-300";
}

function difficultyChipClass(d: string): string {
  if (d === "easy") return "border-emerald-500/40 bg-emerald-500/10 text-emerald-200";
  if (d === "hard") return "border-nawa-accent/45 bg-nawa-accent/15 text-red-100";
  return "border-amber-400/40 bg-amber-500/10 text-amber-100";
}

function statusLabel(
  s: ChallengeStatus,
  t: (id: import("../i18n/messages").MessageId, vars?: Record<string, string>) => string
): string {
  if (s === "solved") return t("dashboard.statusSolved");
  if (s === "unlocked") return t("dashboard.statusUnlocked");
  return t("dashboard.statusLocked");
}

function statusDotClass(s: ChallengeStatus): string {
  if (s === "solved") return "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]";
  if (s === "unlocked") return "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.45)]";
  return "bg-slate-600";
}

export function DashboardPage() {
  const { lang, t } = useI18n();
  const nav = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const cat = searchParams.get("category") ?? "";
  const diff = searchParams.get("difficulty") ?? "";
  const status = searchParams.get("status") ?? "";

  const [me, setMe] = useState<MeResponse | null>(null);
  const [challenges, setChallenges] = useState<ChallengeListItem[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isLoading = !error && me === null;
  const hasActiveFilters = Boolean(cat || diff || status);

  function setFilter(key: "category" | "difficulty" | "status", value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  }

  function clearFilters() {
    setSearchParams({}, { replace: true });
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const m = await api<MeResponse>("/api/v1/auth/me");
        if (cancelled) return;
        setMe(m);
        const qs = new URLSearchParams();
        if (cat) qs.set("category", cat);
        if (diff) qs.set("difficulty", diff);
        if (status) qs.set("status", status);
        const path = `/api/v1/challenges${qs.toString() ? `?${qs}` : ""}`;
        const [c, p] = await Promise.all([
          api<ChallengesResponse>(path),
          api<ProgressResponse>("/api/v1/challenges/progress/modules"),
        ]);
        if (cancelled) return;
        setChallenges(c.challenges);
        setModules(p.modules);
      } catch (e) {
        if (cancelled) return;
        if (e instanceof ApiError && e.status === 401) {
          nav("/login");
          return;
        }
        setError(e instanceof Error ? e.message : message(readStoredChallengeLang(), "dashboard.loadFailed"));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [nav, cat, diff, status]);

  const title = useMemo(
    () => (ui: "id" | "en") => (c: ChallengeListItem) => (ui === "id" ? c.titleId : c.titleEn),
    []
  );

  async function logout() {
    await fetch("/api/v1/auth/logout", { method: "POST", credentials: "include" });
    nav("/");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-nawa-bg">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.06]"
        aria-hidden
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
        }}
      />
      <div className="pointer-events-none fixed -right-24 top-40 h-80 w-80 rounded-full bg-nawa-accent/15 blur-3xl" aria-hidden />
      <div className="pointer-events-none fixed bottom-20 left-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" aria-hidden />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-nawa-bg/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/"
              className="font-mono text-sm font-semibold tracking-tight text-white transition hover:text-nawa-accent"
            >
              NawaVulner
            </Link>
            <span className="hidden h-4 w-px bg-white/15 sm:block" aria-hidden />
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{t("dashboard.title")}</p>
              {isLoading ? (
                <div className="mt-1 h-6 w-40 animate-pulse rounded bg-white/10" />
              ) : (
                <p className="text-lg font-semibold tracking-tight text-white">{me?.user.username}</p>
              )}
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-2" aria-label={t("dashboard.navAria")}>
            <LangSegmentedControl />
            <Link
              to="/stats"
              className="rounded-lg border border-white/12 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:border-white/25 hover:bg-white/10"
            >
              {t("nav.stats")}
            </Link>
            <Link
              to="/submissions"
              className="rounded-lg border border-white/12 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:border-white/25 hover:bg-white/10"
            >
              {t("nav.submissions")}
            </Link>
            <Link
              to="/"
              className="rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:text-white"
            >
              {t("nav.home")}
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="rounded-lg border border-nawa-accent/35 bg-nawa-accent/10 px-3 py-2 text-sm font-medium text-red-100 transition hover:bg-nawa-accent/20"
            >
              {t("nav.logout")}
            </button>
          </nav>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 py-8 md:py-10" aria-busy={isLoading}>
        {/* Stat strip */}
        <section className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[88px] animate-pulse rounded-xl border border-white/10 bg-nawa-card/40"
                />
              ))
            : (
                [
                  {
                    label: t("dashboard.statSolved"),
                    value: String(me?.stats.solvedCount ?? 0),
                    sub: t("dashboard.statSolvedSub"),
                  },
                  {
                    label: t("dashboard.statPoints"),
                    value: String(me?.stats.totalPoints ?? 0),
                    sub: t("dashboard.statPointsSub"),
                  },
                  {
                    label: t("dashboard.statBadge"),
                    value: me?.stats.badgeCount != null ? String(me.stats.badgeCount) : "—",
                    sub: t("dashboard.statBadgeSub"),
                  },
                  {
                    label: t("dashboard.statRank"),
                    value: me?.stats.rankApprox != null ? `#${me.stats.rankApprox}` : "—",
                    sub: t("dashboard.statRankSub"),
                  },
                ] as const
              ).map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-white/10 bg-gradient-to-br from-nawa-card/90 to-nawa-card/50 p-4 shadow-lg shadow-black/20"
                >
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{s.label}</p>
                  <p className="mt-1 font-mono text-2xl font-semibold text-white">{s.value}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{s.sub}</p>
                </div>
              ))}
        </section>

        {/* Progress */}
        <section className="mb-10 rounded-2xl border border-white/10 bg-nawa-card/35 p-5 shadow-xl shadow-black/25 backdrop-blur-sm md:p-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">{t("dashboard.progressTitle")}</h2>
              <p className="mt-1 max-w-xl text-sm text-slate-400">{t("dashboard.progressSubtitle")}</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-20 animate-pulse rounded-xl border border-white/10 bg-nawa-bg/40" />
                ))
              : modules.map((mod) => (
                  <div
                    key={mod.owaspCategory}
                    className="rounded-xl border border-white/10 bg-nawa-bg/50 p-3 transition hover:border-white/20"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`rounded-md border px-2 py-0.5 font-mono text-[11px] font-semibold ${owaspChipClass(mod.owaspCategory)}`}>
                        {mod.owaspCategory}
                      </span>
                      <span className="font-mono text-xs text-slate-400">
                        {mod.solved}/{mod.total}
                      </span>
                    </div>
                    <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                        style={{ width: `${mod.percent}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-right text-[11px] text-slate-500">
                      {interpolate(t("dashboard.modulePercent"), { pct: String(Math.round(mod.percent)) })}
                    </p>
                  </div>
                ))}
          </div>
        </section>

        {/* Filters */}
        <section className="rounded-2xl border border-white/10 bg-nawa-card/30 p-5 backdrop-blur-sm md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">{t("dashboard.challengeListTitle")}</h2>
              <p className="mt-1 text-sm text-slate-400">{t("dashboard.challengeListSubtitle")}</p>
            </div>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="shrink-0 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:border-nawa-accent/40 hover:bg-nawa-accent/10 hover:text-white"
              >
                {t("dashboard.clearFilters")}
              </button>
            ) : null}
          </div>
          <div className="mt-5 flex flex-wrap gap-5 md:gap-8">
            <div className="min-w-[140px] flex-1 sm:max-w-[200px]">
              <label className="mb-1.5 block text-xs font-medium text-slate-400" htmlFor="cat">
                {t("dashboard.filterCategory")}
              </label>
              <select
                id="cat"
                className="w-full cursor-pointer rounded-lg border border-white/12 bg-nawa-bg/80 px-3 py-2.5 text-sm text-white shadow-inner shadow-black/20 outline-none ring-nawa-accent/40 transition focus:border-nawa-accent/50 focus:ring-2"
                value={cat}
                onChange={(e) => setFilter("category", e.target.value)}
              >
                <option value="">{t("dashboard.filterAllCats")}</option>
                {["A01", "A02", "A03", "A04", "A05", "A06", "A07", "A08", "A09", "A10"].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-[140px] flex-1 sm:max-w-[200px]">
              <label className="mb-1.5 block text-xs font-medium text-slate-400" htmlFor="diff">
                {t("dashboard.filterDifficulty")}
              </label>
              <select
                id="diff"
                className="w-full cursor-pointer rounded-lg border border-white/12 bg-nawa-bg/80 px-3 py-2.5 text-sm text-white outline-none ring-nawa-accent/40 transition focus:border-nawa-accent/50 focus:ring-2"
                value={diff}
                onChange={(e) => setFilter("difficulty", e.target.value)}
              >
                <option value="">{t("dashboard.filterAllDiff")}</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="min-w-[140px] flex-1 sm:max-w-[200px]">
              <label className="mb-1.5 block text-xs font-medium text-slate-400" htmlFor="st">
                {t("dashboard.filterStatus")}
              </label>
              <select
                id="st"
                className="w-full cursor-pointer rounded-lg border border-white/12 bg-nawa-bg/80 px-3 py-2.5 text-sm text-white outline-none ring-nawa-accent/40 transition focus:border-nawa-accent/50 focus:ring-2"
                value={status}
                onChange={(e) => setFilter("status", e.target.value)}
              >
                <option value="">{t("dashboard.filterAllStatus")}</option>
                <option value="locked">{t("dashboard.statusLocked")}</option>
                <option value="unlocked">{t("dashboard.statusUnlocked")}</option>
                <option value="solved">{t("dashboard.statusSolved")}</option>
              </select>
            </div>
          </div>
          {!isLoading ? (
            <p className="mt-4 text-sm text-slate-500">
              {t("dashboard.showingCount")}{" "}
              <span className="font-mono text-slate-300">{challenges.length}</span> challenge
              {hasActiveFilters ? ` ${t("dashboard.withFilters")}` : ""}.
            </p>
          ) : null}
        </section>

        {error ? (
          <div
            className="mt-6 rounded-xl border border-nawa-accent/40 bg-nawa-accent/10 px-4 py-3 text-sm text-red-100"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        {/* Challenge grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[168px] animate-pulse rounded-2xl border border-white/10 bg-nawa-card/30"
                />
              ))
            : challenges.map((c) => (
                <Link
                  key={c.slug}
                  to={`/challenges/${c.slug}`}
                  className="group relative flex flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-nawa-card/90 to-nawa-card/50 p-5 shadow-lg shadow-black/20 outline-none ring-offset-2 ring-offset-nawa-bg transition duration-200 hover:-translate-y-0.5 hover:border-nawa-accent/35 hover:shadow-xl hover:shadow-nawa-accent/10 focus-visible:ring-2 focus-visible:ring-nawa-accent"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`inline-flex shrink-0 rounded-md border px-2 py-0.5 font-mono text-[11px] font-semibold ${owaspChipClass(c.owaspCategory)}`}
                    >
                      {c.owaspCategory}
                    </span>
                    <span
                      className={`shrink-0 rounded-md border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide ${difficultyChipClass(c.difficulty)}`}
                    >
                      {c.difficulty}
                    </span>
                  </div>
                  <h3 className="mt-3 line-clamp-2 text-base font-semibold leading-snug text-white group-hover:text-nawa-accent">
                    {title(lang)(c)}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-400">
                    {lang === "en" ? c.titleId : c.titleEn}
                  </p>
                  <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                    <span className="font-mono text-xs text-slate-400">
                      <span className="text-slate-200">{c.pointsBase}</span> {t("common.points")}
                    </span>
                    <span className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
                      <span className={`h-1.5 w-1.5 rounded-full ${statusDotClass(c.status)}`} aria-hidden />
                      <span className={c.status === "solved" ? "text-emerald-300" : c.status === "unlocked" ? "text-amber-200" : "text-slate-500"}>
                        {statusLabel(c.status, t)}
                      </span>
                    </span>
                  </div>
                  <span
                    className="pointer-events-none absolute right-3 top-3 text-slate-600 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                    aria-hidden
                  >
                    →
                  </span>
                </Link>
              ))}
        </div>

        {!isLoading && challenges.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-white/15 bg-nawa-card/20 px-6 py-12 text-center">
            <p className="text-base font-medium text-slate-300">{t("dashboard.emptyTitle")}</p>
            <p className="mt-2 text-sm text-slate-500">{t("dashboard.emptyBody")}</p>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-lg bg-nawa-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {t("dashboard.emptyClear")}
              </button>
            ) : null}
          </div>
        ) : null}
      </main>
    </div>
  );
}
