import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, ApiError } from "../api";
import { LangSegmentedControl } from "../components/LangSegmentedControl";
import { useI18n } from "../i18n/I18nContext";
import { message } from "../i18n/messages";
import { readStoredChallengeLang } from "../lib/challengeLocale";

type Row = {
  id: number;
  slug: string;
  titleId: string;
  titleEn: string;
  submittedText: string;
  correct: boolean;
  createdAt: string;
};

type Resp = { submissions: Row[] };

export function SubmissionsPage() {
  const { lang, t } = useI18n();
  const nav = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await api<Resp>("/api/v1/challenges/me/submissions?limit=80");
        if (!cancelled) setRows(r.submissions);
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
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link to="/dashboard" className="text-sm text-slate-400 hover:text-white">
            {t("stats.back")}
          </Link>
          <LangSegmentedControl />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-white">{t("submissions.title")}</h1>
        <p className="mt-2 text-sm text-slate-500">{t("submissions.subtitle")}</p>
        {error ? <p className="mt-4 text-sm text-nawa-accent">{error}</p> : null}
        <div className="mt-6 overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full min-w-[32rem] text-left text-sm text-slate-300">
            <thead className="border-b border-white/10 bg-nawa-card/80 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">{t("submissions.colTime")}</th>
                <th className="px-3 py-2">{t("submissions.colChallenge")}</th>
                <th className="px-3 py-2">{t("submissions.colCorrect")}</th>
                <th className="px-3 py-2">{t("submissions.colText")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="whitespace-nowrap px-3 py-2 font-mono text-xs text-slate-500">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                  <td className="px-3 py-2">
                    <Link className="text-nawa-accent hover:underline" to={`/challenges/${encodeURIComponent(r.slug)}`}>
                      {lang === "en" ? r.titleEn : r.titleId}
                    </Link>
                  </td>
                  <td className="px-3 py-2">{r.correct ? t("common.yes") : t("common.no")}</td>
                  <td className="max-w-xs truncate px-3 py-2 font-mono text-xs">{r.submittedText}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && !error ? <p className="mt-4 text-sm text-slate-500">{t("submissions.empty")}</p> : null}
      </div>
    </div>
  );
}
