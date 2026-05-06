import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, ApiError } from "../api";
import { LangSegmentedControl } from "../components/LangSegmentedControl";
import { useI18n } from "../i18n/I18nContext";
import { interpolate, message } from "../i18n/messages";
import { readStoredChallengeLang } from "../lib/challengeLocale";
import type { ChallengeDetail } from "../types";

type DetailResponse = { challenge: ChallengeDetail };

type FlagResponse = {
  correct: boolean;
  alreadySolved?: boolean;
  pointsAwarded?: number;
  hintPenaltyPoints?: number;
  firstBloodBonus?: number;
  isFirstBlood?: boolean;
  newBadges?: { key: string; nameId: string; nameEn: string }[];
};

type HintsResponse = {
  slug: string;
  hints: Array<{
    level: 1 | 2 | 3;
    unlocked: boolean;
    textId?: string;
    textEn?: string;
  }>;
  nextUnlockableLevel: 1 | 2 | 3 | null;
  penaltyNote: string;
  penaltyNoteEn?: string;
};

type WriteupResponse = {
  slug: string;
  lang: "id" | "en";
  html: string;
};

/** Gaya untuk konten HTML hint/write-up (server-only, bukan input pengguna). */
const htmlContentClass =
  "nawa-rich-html text-sm leading-relaxed text-slate-300 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_code]:rounded [&_code]:bg-black/35 [&_code]:px-1.5 [&_code]:py-px [&_code]:text-[0.85em] [&_code]:text-slate-200 [&_h1]:mb-2 [&_h1]:text-lg [&_h1]:font-bold [&_h1]:text-white [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:text-slate-200 [&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-slate-200 [&_figure]:my-3 [&_figcaption]:text-xs [&_figcaption]:text-slate-500 [&_svg]:max-w-full [&_ol]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:my-0.5 [&_a]:text-nawa-accent [&_a]:underline [&_strong]:text-slate-100 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-white/10 [&_pre]:bg-black/40 [&_pre]:p-3 [&_pre]:text-xs";

type LabUrlResponse = {
  slug: string;
  path: string;
  url: string;
  containerReady: boolean;
};

function challengeStatusLabel(
  status: string,
  t: (id: import("../i18n/messages").MessageId, vars?: Record<string, string>) => string
): string {
  if (status === "solved") return t("dashboard.statusSolved");
  if (status === "unlocked") return t("dashboard.statusUnlocked");
  if (status === "locked") return t("dashboard.statusLocked");
  return status;
}

export function ChallengeDetailPage() {
  const { slug } = useParams();
  const nav = useNavigate();
  const { lang, t } = useI18n();
  const [data, setData] = useState<ChallengeDetail | null>(null);
  const [lab, setLab] = useState<LabUrlResponse | null>(null);
  const [flag, setFlag] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hintsPack, setHintsPack] = useState<HintsResponse | null>(null);
  const [hintsError, setHintsError] = useState<string | null>(null);
  const [writeupHtml, setWriteupHtml] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      setError(null);
      setLab(null);
      setHintsPack(null);
      setHintsError(null);
      setWriteupHtml(null);
      try {
        const [detail, labUrl] = await Promise.all([
          api<DetailResponse>(`/api/v1/challenges/${encodeURIComponent(slug)}`),
          api<LabUrlResponse>(`/api/v1/challenges/${encodeURIComponent(slug)}/lab-url`).catch((e) => {
            if (e instanceof ApiError && (e.status === 403 || e.status === 404)) return null;
            throw e;
          }),
        ]);
        if (cancelled) return;
        setData(detail.challenge);
        setLab(labUrl);
      } catch (e) {
        if (cancelled) return;
        if (e instanceof ApiError && e.status === 401) {
          nav("/login");
          return;
        }
        setError(
          e instanceof Error ? e.message : message(readStoredChallengeLang(), "challenge.loadFailed")
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, nav]);

  useEffect(() => {
    if (!slug || !data) {
      setHintsPack(null);
      setHintsError(null);
      return;
    }
    if (data.status === "locked") {
      setHintsPack(null);
      setHintsError(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const h = await api<HintsResponse>(`/api/v1/challenges/${encodeURIComponent(slug)}/hints`);
        if (!cancelled) {
          setHintsPack(h);
          setHintsError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setHintsPack(null);
          const L = readStoredChallengeLang();
          setHintsError(
            e instanceof ApiError
              ? e.status === 403
                ? message(L, "challenge.hintLoadError403")
                : interpolate(message(L, "challenge.hintLoadError"), { status: String(e.status) })
              : message(L, "challenge.hintLoadErrorGeneric")
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, data]);

  useEffect(() => {
    if (!slug || !data || data.status !== "solved") {
      setWriteupHtml(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const w = await api<WriteupResponse>(
          `/api/v1/challenges/${encodeURIComponent(slug)}/writeup?lang=${lang}`
        );
        if (!cancelled) setWriteupHtml(w.html);
      } catch {
        if (!cancelled) setWriteupHtml(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, data, lang]);

  async function submitFlag(e: FormEvent) {
    e.preventDefault();
    if (!slug) return;
    setMsg(null);
    setError(null);
    try {
      const r = await api<FlagResponse>(`/api/v1/challenges/${encodeURIComponent(slug)}/flags`, {
        method: "POST",
        body: JSON.stringify({ flag }),
      });
      if (r.correct) {
        const pen =
          r.hintPenaltyPoints && r.hintPenaltyPoints > 0
            ? t("challenge.flagPenalty", { n: String(r.hintPenaltyPoints) })
            : "";
        const fb =
          r.isFirstBlood && (r.firstBloodBonus ?? 0) > 0
            ? t("challenge.flagFirstBlood", { n: String(r.firstBloodBonus) })
            : "";
        const badgeNames =
          r.newBadges && r.newBadges.length > 0
            ? r.newBadges.map((b) => (lang === "en" ? b.nameEn : b.nameId)).join(", ")
            : "";
        const bd =
          r.newBadges && r.newBadges.length > 0
            ? t("challenge.flagBadges", { names: badgeNames })
            : "";
        setMsg(
          r.alreadySolved
            ? t("challenge.flagAlready")
            : `${t("challenge.flagCorrect", { points: String(r.pointsAwarded ?? 0) })}${pen}${fb}${bd}`
        );
        const [detail, labUrl] = await Promise.all([
          api<DetailResponse>(`/api/v1/challenges/${encodeURIComponent(slug)}`),
          api<LabUrlResponse>(`/api/v1/challenges/${encodeURIComponent(slug)}/lab-url`).catch(() => null),
        ]);
        setData(detail.challenge);
        setLab(labUrl);
      } else {
        setMsg(t("challenge.flagWrong"));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("challenge.submitFail"));
    }
  }

  async function unlockHint(level: 1 | 2 | 3) {
    if (!slug) return;
    const note =
      level === 1
        ? t("challenge.unlockConfirm1")
        : level === 2
          ? t("challenge.unlockConfirm2")
          : t("challenge.unlockConfirm3");
    if (!window.confirm(note)) return;
    setError(null);
    try {
      await api(`/api/v1/challenges/${encodeURIComponent(slug)}/hints/${level}`, { method: "POST" });
      const h = await api<HintsResponse>(`/api/v1/challenges/${encodeURIComponent(slug)}/hints`);
      setHintsPack(h);
      setMsg(t("challenge.hintOpened", { level: String(level) }));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("challenge.unlockFail"));
    }
  }

  async function resetLab() {
    if (!slug) return;
    setError(null);
    try {
      await api<{ ok: boolean; message?: string }>(
        `/api/v1/challenges/${encodeURIComponent(slug)}/lab/reset`,
        { method: "POST" }
      );
      setMsg(t("challenge.labResetAck"));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("challenge.resetFail"));
    }
  }

  const openHref = lab?.url?.startsWith("http") ? lab.url : lab?.path ?? data?.proxyPath;
  const vulnBlurb = lang === "en" ? t("challenge.vulnBlurbEn") : t("challenge.vulnBlurbId");
  const backstoryHeading = lang === "en" ? t("challenge.backstoryEn") : t("challenge.backstory");
  const caseHeading = lang === "en" ? t("challenge.caseSummaryEn") : t("challenge.caseSummary");
  const penaltyLine =
    lang === "en" && hintsPack?.penaltyNoteEn ? hintsPack.penaltyNoteEn : hintsPack?.penaltyNote ?? "";

  if (!slug) return null;

  return (
    <div className="min-h-screen bg-nawa-bg px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link to="/dashboard" className="text-sm text-slate-400 hover:text-white">
            {t("challenge.backToList")}
          </Link>
          <LangSegmentedControl />
        </div>

        {error ? <p className="mt-4 text-sm text-nawa-accent">{error}</p> : null}

        {!data ? (
          <p className="mt-6 text-slate-400">{t("common.loading")}</p>
        ) : (
          <>
            <p className="mt-4 font-mono text-sm text-nawa-accent">{data.owaspCategory}</p>
            <h1 className="mt-2 text-2xl font-bold text-white">
              {lang === "en" ? data.titleEn : data.titleId}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {lang === "en" ? data.titleId : data.titleEn}
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-400">
              <span className="rounded bg-white/5 px-2 py-1 font-mono uppercase">{data.difficulty}</span>
              <span>
                {data.pointsBase} {t("common.points")}
              </span>
              <span className="font-mono">
                {t("challenge.statusPrefix")} {challengeStatusLabel(data.status, t)}
              </span>
            </div>

            {data.vulnerabilityExplainId || data.vulnerabilityExplainEn ? (
              <div className="mt-8 rounded-lg border border-nawa-accent/25 bg-gradient-to-b from-nawa-card to-black/20 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-nawa-accent">
                  {t("challenge.vulnTitle")}
                </p>
                <p className="mt-1 text-xs text-slate-500">{vulnBlurb}</p>
                <div
                  className={`${htmlContentClass} mt-3`}
                  dangerouslySetInnerHTML={{
                    __html:
                      (lang === "en"
                        ? data.vulnerabilityExplainEn || data.vulnerabilityExplainId
                        : data.vulnerabilityExplainId || data.vulnerabilityExplainEn) ?? "",
                  }}
                />
              </div>
            ) : null}

            {data.backstoryId || data.backstoryEn ? (
              <div className="mt-8 space-y-5 rounded-lg border border-white/10 bg-nawa-card p-5 sm:p-6">
                <section>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{backstoryHeading}</p>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-200">
                    {(lang === "en" ? data.backstoryEn : data.backstoryId) ||
                      (lang === "en" ? data.backstoryId : data.backstoryEn)}
                  </p>
                </section>
                <section className="border-t border-white/10 pt-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{caseHeading}</p>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-200">
                    {(lang === "en" ? data.caseSummaryEn : data.caseSummaryId) ||
                      (lang === "en" ? data.caseSummaryId : data.caseSummaryEn)}
                  </p>
                </section>
              </div>
            ) : null}

            <div className="mt-8 rounded-lg border border-white/10 bg-nawa-card p-4">
              <p className="text-sm text-slate-300">{t("challenge.labTitle")}</p>
              <code className="mt-2 block break-all font-mono text-xs text-nawa-accent">{data.proxyPath}</code>
              {lab ? (
                <div className="mt-3 space-y-2 text-xs text-slate-400">
                  <p>
                    {t("challenge.container")}{" "}
                    <span className={lab.containerReady ? "text-emerald-400" : "text-amber-400"}>
                      {lab.containerReady
                        ? t("challenge.containerReady")
                        : t("challenge.containerNotReady")}
                    </span>
                  </p>
                  {openHref ? (
                    <a
                      href={openHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-md bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/15"
                    >
                      {t("challenge.openLab")}
                    </a>
                  ) : null}
                  <p className="text-slate-500">{t("challenge.devNote")}</p>
                </div>
              ) : (
                <p className="mt-3 text-xs text-slate-500">{t("challenge.labUnavailable")}</p>
              )}
              <button
                type="button"
                onClick={() => void resetLab()}
                className="mt-4 rounded-md border border-white/15 px-3 py-1.5 text-sm text-slate-200 hover:bg-white/5"
              >
                {t("challenge.resetLab")}
              </button>
            </div>

            <div className="mt-8 rounded-lg border border-white/10 bg-nawa-card p-4">
              <p className="text-sm font-medium text-white">{t("challenge.hintsTitle")}</p>
              {data.status === "locked" ? (
                <p className="mt-2 text-sm text-slate-400">{t("challenge.hintLockedHelp")}</p>
              ) : hintsError ? (
                <p className="mt-2 text-sm text-nawa-accent">{hintsError}</p>
              ) : hintsPack ? (
                <>
                  {penaltyLine ? <p className="mt-1 text-xs text-slate-500">{penaltyLine}</p> : null}
                  <ul className="mt-4 space-y-3">
                    {hintsPack.hints.map((h) => (
                      <li key={h.level} className="rounded border border-white/10 bg-nawa-bg/40 p-3 text-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-mono text-nawa-accent">
                            {t("challenge.hintLevel", { level: String(h.level) })}
                          </span>
                          {!h.unlocked &&
                          data.status !== "solved" &&
                          hintsPack.nextUnlockableLevel === h.level ? (
                            <button
                              type="button"
                              onClick={() => void unlockHint(h.level)}
                              className="rounded-md bg-amber-500/20 px-2 py-1 text-xs font-medium text-amber-200 hover:bg-amber-500/30"
                            >
                              {t("challenge.hintOpen", { level: String(h.level) })}
                            </button>
                          ) : null}
                        </div>
                        {h.unlocked ? (
                          <div
                            className={`mt-2 ${htmlContentClass}`}
                            dangerouslySetInnerHTML={{
                              __html:
                                (lang === "en" ? h.textEn : h.textId) ||
                                (lang === "en" ? h.textId : h.textEn) ||
                                "",
                            }}
                          />
                        ) : (
                          <p className="mt-2 text-slate-500">{t("challenge.hintNotOpen")}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="mt-2 text-sm text-slate-500">{t("challenge.hintLoading")}</p>
              )}
            </div>

            {data.status === "solved" ? (
              <div className="mt-8 rounded-lg border border-emerald-500/20 bg-nawa-card p-4">
                <p className="text-sm font-medium text-emerald-200">{t("challenge.writeupTitle")}</p>
                {writeupHtml ? (
                  <div
                    className={`mt-3 max-h-[28rem] overflow-auto font-sans ${htmlContentClass}`}
                    dangerouslySetInnerHTML={{ __html: writeupHtml }}
                  />
                ) : (
                  <p className="mt-3 text-xs text-slate-500">{t("challenge.writeupLoading")}</p>
                )}
              </div>
            ) : null}

            <form className="mt-8 space-y-3" onSubmit={submitFlag}>
              <label className="block text-sm text-slate-300" htmlFor="flag">
                {t("challenge.submitFlag")}
              </label>
              <input
                id="flag"
                className="w-full rounded-md border border-white/10 bg-nawa-bg px-3 py-2 font-mono text-sm text-white outline-none ring-nawa-accent focus:ring-2"
                placeholder="FLAG{...}"
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
              />
              <button
                type="submit"
                className="rounded-md bg-nawa-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                {t("challenge.submitSend")}
              </button>
            </form>
            {msg ? <p className="mt-3 font-mono text-sm text-slate-200">{msg}</p> : null}
          </>
        )}
      </div>
    </div>
  );
}
