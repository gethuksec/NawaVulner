import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useI18n } from "../i18n/I18nContext";

export function LoginPage() {
  const { t } = useI18n();
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      nav("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.loginFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-nawa-bg px-4">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-nawa-card p-8 shadow-xl">
        <h1 className="font-mono text-xl font-semibold text-white">{t("auth.loginTitle")}</h1>
        <p className="mt-1 text-sm text-slate-400">
          {t("auth.noAccount")}{" "}
          <Link to="/register" className="text-nawa-accent hover:underline">
            {t("auth.registerLink")}
          </Link>
        </p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-sm text-slate-300" htmlFor="username">
              {t("auth.username")}
            </label>
            <input
              id="username"
              className="mt-1 w-full rounded-md border border-white/10 bg-nawa-bg px-3 py-2 font-mono text-sm text-white outline-none ring-nawa-accent focus:ring-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className="text-sm text-slate-300" htmlFor="password">
              {t("auth.password")}
            </label>
            <input
              id="password"
              type="password"
              className="mt-1 w-full rounded-md border border-white/10 bg-nawa-bg px-3 py-2 font-mono text-sm text-white outline-none ring-nawa-accent focus:ring-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          {error ? <p className="text-sm text-nawa-accent">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-nawa-accent py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {loading ? t("auth.processing") : t("auth.submitLogin")}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-slate-500">
          <Link to="/" className="hover:text-slate-300">
            {t("common.back")}
          </Link>
        </p>
      </div>
    </div>
  );
}
