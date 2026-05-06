import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, ApiError } from "../api";
import { LangSegmentedControl } from "../components/LangSegmentedControl";
import { useI18n } from "../i18n/I18nContext";
import { message } from "../i18n/messages";
import { readStoredChallengeLang } from "../lib/challengeLocale";

type MeResponse = {
  user: { id: number; username: string };
  stats: {
    solvedCount: number;
    totalPoints: number;
    badgeCount: number;
    rankApprox: number;
    rankNoteId?: string;
  };
};

type Module = { owaspCategory: string; total: number; solved: number; percent: number };

type ProgressResponse = { modules: Module[] };

export function StatsPage() {
  const { t } = useI18n();
  const nav = useNavigate();
  const [me, setMe] = useState<MeResponse | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [m, p] = await Promise.all([
          api<MeResponse>("/api/v1/auth/me"),
          api<ProgressResponse>("/api/v1/challenges/progress/modules"),
        ]);
        if (cancelled) return;
        setMe(m);
        setModules(p.modules);
      } catch (e) {
        if (cancelled) return;
        if (e instanceof ApiError && e.status === 401) {
          nav("/login");
          return;
        }
        setError(e instanceof Error ? e.message : message(readStoredChallengeLang(), "common.loadFailed"));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [nav]);

  return (
    <div className="min-h-screen bg-nawa-bg px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link to="/dashboard" className="text-sm text-slate-400 hover:text-white">
            {t("stats.back")}
          </Link>
          <LangSegmentedControl />
        </div>
        {error ? <p className="mt-4 text-sm text-nawa-accent">{error}</p> : null}
        {!me ? (
          <p className="mt-6 text-slate-400">{t("common.loading")}</p>
        ) : (
          <>
            <h1 className="mt-6 text-2xl font-bold text-white">{t("stats.title")}</h1>
            <p className="mt-2 text-slate-400">{t("stats.subtitle")}</p>
            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-nawa-card p-4">
                <dt className="text-xs text-slate-500">{t("stats.solved")}</dt>
                <dd className="text-2xl font-semibold text-white">{me.stats.solvedCount}</dd>
              </div>
              <div className="rounded-lg border border-white/10 bg-nawa-card p-4">
                <dt className="text-xs text-slate-500">{t("stats.totalPoints")}</dt>
                <dd className="text-2xl font-semibold text-nawa-accent">{me.stats.totalPoints}</dd>
              </div>
              <div className="rounded-lg border border-white/10 bg-nawa-card p-4">
                <dt className="text-xs text-slate-500">{t("stats.badges")}</dt>
                <dd className="text-2xl font-semibold text-white">{me.stats.badgeCount}</dd>
              </div>
              <div className="rounded-lg border border-white/10 bg-nawa-card p-4">
                <dt className="text-xs text-slate-500">{t("stats.rank")}</dt>
                <dd className="text-2xl font-semibold text-white">#{me.stats.rankApprox}</dd>
              </div>
            </dl>
            {me.stats.rankNoteId ? <p className="mt-3 text-xs text-slate-500">{me.stats.rankNoteId}</p> : null}

            <h2 className="mt-10 text-lg font-semibold text-white">{t("stats.modulesTitle")}</h2>
            <ul className="mt-4 space-y-3">
              {modules.map((mod) => (
                <li key={mod.owaspCategory} className="rounded-lg border border-white/10 bg-nawa-card p-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-mono text-nawa-accent">{mod.owaspCategory}</span>
                    <span className="text-slate-400">
                      {mod.solved}/{mod.total} ({mod.percent}%)
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded bg-white/10">
                    <div
                      className="h-full bg-nawa-accent transition-all"
                      style={{ width: `${mod.percent}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
