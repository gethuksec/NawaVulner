import cors from "cors";
import express from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { ensureSchemaPatches } from "./db/ensure-schema-patches.js";
import { pool } from "./db/pool.js";
import { requestContextMiddleware } from "./middleware/request-context.js";
import { authRouter } from "./routes/auth.js";
import { challengesRouter } from "./routes/challenges.js";
import { healthRouter } from "./routes/health.js";
import { repairRenamedChallengeSlugs, seedIfEmpty } from "./seed/seed-if-empty.js";

const PgSession = connectPgSimple(session);

const app = express();
app.set("trust proxy", 1);
app.use(express.json({ limit: "512kb" }));
app.use(requestContextMiddleware);

const corsOrigins = process.env.CORS_ORIGINS?.split(",")
  .map((s) => s.trim())
  .filter(Boolean);
if (corsOrigins && corsOrigins.length > 0) {
  app.use(
    cors({
      origin: corsOrigins,
      credentials: true,
    })
  );
}

app.use(
  session({
    store: new PgSession({
      pool,
      tableName: "session",
      createTableIfMissing: false,
    }),
    name: "nawa.sid",
    secret: process.env.SESSION_SECRET ?? "dev_only_change_me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use("/api/v1", healthRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1", challengesRouter);

app.use((_req, res) => {
  res.status(404).json({ error: { code: "NOT_FOUND", message: "Not found" } });
});

app.use((err: unknown, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err, { requestId: req.requestId });
  res.status(500).json({ error: { code: "INTERNAL", message: "Internal server error" } });
});

async function main() {
  await ensureSchemaPatches();
  const seeded = await seedIfEmpty();
  console.info("[nawa-api] seedIfEmpty:", seeded);
  const repaired = await repairRenamedChallengeSlugs();
  if (repaired > 0) {
    console.info("[nawa-api] repairRenamedChallengeSlugs: total rows updated", repaired);
  }

  const port = Number(process.env.PORT ?? 3001);
  const host = process.env.LISTEN_HOST ?? "0.0.0.0";
  app.listen(port, host, () => {
    console.info(`[nawa-api] listening on ${host}:${port}`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
