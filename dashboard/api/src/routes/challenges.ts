import { Router } from "express";
import { and, asc, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { narrativeForSlug } from "../content/challenge-narrative.js";
import { hintsForSlug, writeupHtml } from "../content/hints-writeups.js";
import { db } from "../db/pool.js";
import {
  challengeFirstBloods,
  challenges,
  flagSubmissions,
  hintUnlocks,
  labResets,
  userChallengeProgress,
} from "../db/schema.js";
import { evaluateBadgesForUser } from "../lib/badges.js";
import { envString } from "../lib/env.js";
import { syncUnlockedChallengesForUser } from "../lib/progress-sync.js";
import { verifyFlag } from "../lib/password.js";
import { awardPointsForSolve } from "../lib/scoring.js";
import { unlockNextInCategoryAfterSolve } from "../lib/strict-unlock.js";
import { labActionLimiter } from "../middleware/rate-limit.js";
import { requireAuth } from "../middleware/require-auth.js";

export const challengesRouter = Router();

challengesRouter.use(requireAuth);
challengesRouter.use(async (req, _res, next) => {
  try {
    await syncUnlockedChallengesForUser(req.session.user!.id);
    next();
  } catch (e) {
    next(e);
  }
});

challengesRouter.get("/challenges/progress/modules", async (req, res, next) => {
  try {
    const uid = req.session.user!.id;
    const allCh = await db
      .select({ id: challenges.id, cat: challenges.owaspCategory })
      .from(challenges)
      .orderBy(asc(challenges.sortOrder));
    const prog = await db
      .select({ challengeId: userChallengeProgress.challengeId, status: userChallengeProgress.status })
      .from(userChallengeProgress)
      .where(eq(userChallengeProgress.userId, uid));
    const statusBy = new Map(prog.map((p) => [p.challengeId, p.status]));
    const agg = new Map<string, { total: number; solved: number }>();
    for (const c of allCh) {
      if (!agg.has(c.cat)) agg.set(c.cat, { total: 0, solved: 0 });
      const a = agg.get(c.cat)!;
      a.total += 1;
      if (statusBy.get(c.id) === "solved") a.solved += 1;
    }
    const modules = [...agg.entries()].map(([owaspCategory, { total, solved }]) => ({
      owaspCategory,
      total,
      solved,
      percent: total === 0 ? 0 : Math.round((100 * solved) / total),
    }));
    res.json({ modules });
  } catch (e) {
    next(e);
  }
});

challengesRouter.get("/challenges/me/submissions", async (req, res, next) => {
  try {
    const uid = req.session.user!.id;
    const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 50)));
    const rows = await db
      .select({
        id: flagSubmissions.id,
        slug: challenges.slug,
        titleId: challenges.titleId,
        titleEn: challenges.titleEn,
        submittedText: flagSubmissions.submittedText,
        correct: flagSubmissions.correct,
        createdAt: flagSubmissions.createdAt,
      })
      .from(flagSubmissions)
      .innerJoin(challenges, eq(challenges.id, flagSubmissions.challengeId))
      .where(eq(flagSubmissions.userId, uid))
      .orderBy(desc(flagSubmissions.createdAt))
      .limit(limit);
    res.json({ submissions: rows });
  } catch (e) {
    next(e);
  }
});

challengesRouter.get("/challenges", async (req, res, next) => {
  try {
    const uid = req.session.user!.id;
    const q = z
      .object({
        category: z.string().optional(),
        difficulty: z.enum(["easy", "medium", "hard"]).optional(),
        status: z.enum(["all", "locked", "unlocked", "solved"]).optional().default("all"),
        q: z.string().optional(),
      })
      .parse({
        category: req.query.category as string | undefined,
        difficulty: req.query.difficulty as string | undefined,
        status: req.query.status as string | undefined,
        q: req.query.q as string | undefined,
      });

    const rows = await db
      .select({
        id: challenges.id,
        slug: challenges.slug,
        owaspCategory: challenges.owaspCategory,
        difficulty: challenges.difficulty,
        pointsBase: challenges.pointsBase,
        proxyPath: challenges.proxyPath,
        sortOrder: challenges.sortOrder,
        titleId: challenges.titleId,
        titleEn: challenges.titleEn,
        userStatus: userChallengeProgress.status,
      })
      .from(challenges)
      .leftJoin(
        userChallengeProgress,
        and(eq(userChallengeProgress.challengeId, challenges.id), eq(userChallengeProgress.userId, uid))
      )
      .orderBy(asc(challenges.sortOrder));

    const mapped = rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      owaspCategory: r.owaspCategory,
      difficulty: r.difficulty,
      pointsBase: r.pointsBase,
      proxyPath: r.proxyPath,
      sortOrder: r.sortOrder,
      titleId: r.titleId,
      titleEn: r.titleEn,
      status: (r.userStatus ?? "locked") as "locked" | "unlocked" | "solved",
    }));

    const filtered = mapped.filter((c) => {
      if (q.category && c.owaspCategory !== q.category) return false;
      if (q.difficulty && c.difficulty !== q.difficulty) return false;
      if (q.status && q.status !== "all" && c.status !== q.status) return false;
      if (q.q) {
        const needle = q.q.toLowerCase();
        const hay = `${c.slug} ${c.titleId} ${c.titleEn}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });

    res.json({ challenges: filtered });
  } catch (e) {
    if (e instanceof z.ZodError) {
      res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid query", details: e.flatten() } });
      return;
    }
    next(e);
  }
});

challengesRouter.get("/challenges/:slug/lab-url", async (req, res, next) => {
  try {
    const uid = req.session.user!.id;
    const slug = req.params.slug;
    const [ch] = await db
      .select({
        id: challenges.id,
        slug: challenges.slug,
        proxyPath: challenges.proxyPath,
      })
      .from(challenges)
      .where(eq(challenges.slug, slug))
      .limit(1);

    if (!ch) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Challenge not found" } });
      return;
    }

    const [prog] = await db
      .select({ status: userChallengeProgress.status })
      .from(userChallengeProgress)
      .where(and(eq(userChallengeProgress.userId, uid), eq(userChallengeProgress.challengeId, ch.id)))
      .limit(1);

    const status = prog?.status ?? "locked";
    if (status === "locked") {
      res.status(403).json({ error: { code: "LOCKED", message: "Challenge is locked" } });
      return;
    }

    const defaultDeployed =
      "a01-idor-profil-user,a01-force-browse-admin,a01-jwt-privilege-escalation,a01-ssrf-internal-discovery,a01-csrf-cors-chain,a01-mass-assignment-hpe,a02-default-or-hardcoded-credentials,a02-directory-listing,a02-verbose-errors,a02-missing-security-headers,a02-cloud-metadata-ssrf,a02-debug-endpoint-leak,a05-sqli-login-bypass,a05-reflected-xss,a05-sqli-union,a05-stored-xss-cookie-steal,a05-sqli-blind-time,a05-ssti-rce";
    const deployed = new Set(
      (process.env.LAB_DEPLOYED_SLUGS ?? defaultDeployed).split(",").map((s) => s.trim()).filter(Boolean)
    );
    const base = (process.env.PUBLIC_BASE_URL ?? "").replace(/\/$/, "");
    const path = ch.proxyPath;
    const url = base ? `${base}${path}` : path;

    res.json({
      slug: ch.slug,
      path,
      url,
      containerReady: deployed.has(slug),
    });
  } catch (e) {
    next(e);
  }
});

challengesRouter.get("/challenges/:slug/hints", async (req, res, next) => {
  try {
    const uid = req.session.user!.id;
    const slug = req.params.slug;
    const [ch] = await db.select({ id: challenges.id }).from(challenges).where(eq(challenges.slug, slug)).limit(1);
    if (!ch) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Challenge not found" } });
      return;
    }
    const [prog] = await db
      .select({ status: userChallengeProgress.status })
      .from(userChallengeProgress)
      .where(and(eq(userChallengeProgress.userId, uid), eq(userChallengeProgress.challengeId, ch.id)))
      .limit(1);
    if (!prog || prog.status === "locked") {
      res.status(403).json({ error: { code: "LOCKED", message: "Challenge is locked" } });
      return;
    }

    const unlockedRows = await db
      .select({ level: hintUnlocks.level })
      .from(hintUnlocks)
      .where(and(eq(hintUnlocks.userId, uid), eq(hintUnlocks.challengeId, ch.id)));
    const unlocked = new Set(unlockedRows.map((r) => r.level));
    const pack = hintsForSlug(slug);
    const levels = [1, 2, 3] as const;
    const hints = levels.map((level) => ({
      level,
      unlocked: unlocked.has(level),
      ...(unlocked.has(level) ? { textId: pack[level].textId, textEn: pack[level].textEn } : {}),
    }));
    const nextUnlockableLevel =
      prog.status === "solved"
        ? null
        : ((levels.find((l) => !unlocked.has(l)) ?? null) as 1 | 2 | 3 | null);

    res.json({
      slug,
      hints,
      nextUnlockableLevel,
      penaltyNote:
        "Hint 1 gratis. Hint 2 memotong 25% poin base saat solve; Hint 3 memotong 50% poin base (keduanya stack).",
      penaltyNoteEn:
        "Hint 1 is free. Hint 2 reduces base points by 25% on solve; Hint 3 reduces base points by 50% (they stack).",
    });
  } catch (e) {
    next(e);
  }
});

challengesRouter.post("/challenges/:slug/hints/:level", labActionLimiter, async (req, res, next) => {
  try {
    const uid = req.session.user!.id;
    const slug = req.params.slug;
    const level = z.coerce.number().int().min(1).max(3).parse(req.params.level);

    const [ch] = await db.select({ id: challenges.id }).from(challenges).where(eq(challenges.slug, slug)).limit(1);
    if (!ch) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Challenge not found" } });
      return;
    }
    const [prog] = await db
      .select({ status: userChallengeProgress.status })
      .from(userChallengeProgress)
      .where(and(eq(userChallengeProgress.userId, uid), eq(userChallengeProgress.challengeId, ch.id)))
      .limit(1);
    if (!prog || prog.status === "locked") {
      res.status(403).json({ error: { code: "LOCKED", message: "Challenge is locked" } });
      return;
    }
    if (prog.status === "solved") {
      res.status(409).json({ error: { code: "ALREADY_SOLVED", message: "Challenge already solved" } });
      return;
    }

    if (level > 1) {
      const [prev] = await db
        .select({ level: hintUnlocks.level })
        .from(hintUnlocks)
        .where(
          and(eq(hintUnlocks.userId, uid), eq(hintUnlocks.challengeId, ch.id), eq(hintUnlocks.level, level - 1))
        )
        .limit(1);
      if (!prev) {
        res.status(400).json({ error: { code: "HINT_ORDER", message: `Unlock hint ${level - 1} first` } });
        return;
      }
    }

    await db
      .insert(hintUnlocks)
      .values({ userId: uid, challengeId: ch.id, level })
      .onConflictDoNothing();

    res.status(201).json({
      ok: true,
      level,
      message: "Hint terbuka. Penalti poin diterapkan saat flag benar (lihat penaltyNote di GET hints).",
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid level", details: e.flatten() } });
      return;
    }
    next(e);
  }
});

challengesRouter.get("/challenges/:slug/writeup", async (req, res, next) => {
  try {
    const uid = req.session.user!.id;
    const slug = req.params.slug;
    const lang = z.enum(["id", "en"]).parse((req.query.lang as string | undefined) ?? "id");

    const [ch] = await db.select({ id: challenges.id }).from(challenges).where(eq(challenges.slug, slug)).limit(1);
    if (!ch) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Challenge not found" } });
      return;
    }
    const [prog] = await db
      .select({ status: userChallengeProgress.status })
      .from(userChallengeProgress)
      .where(and(eq(userChallengeProgress.userId, uid), eq(userChallengeProgress.challengeId, ch.id)))
      .limit(1);
    if (!prog || prog.status !== "solved") {
      res.status(403).json({ error: { code: "WRITEUP_LOCKED", message: "Writeup available after solve" } });
      return;
    }

    res.json({ slug, lang, html: writeupHtml(slug, lang) });
  } catch (e) {
    if (e instanceof z.ZodError) {
      res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid lang", details: e.flatten() } });
      return;
    }
    next(e);
  }
});

challengesRouter.get("/challenges/:slug", async (req, res, next) => {
  try {
    const uid = req.session.user!.id;
    const slug = req.params.slug;
    const [row] = await db
      .select({
        id: challenges.id,
        slug: challenges.slug,
        owaspCategory: challenges.owaspCategory,
        difficulty: challenges.difficulty,
        pointsBase: challenges.pointsBase,
        dockerService: challenges.dockerService,
        proxyPath: challenges.proxyPath,
        titleId: challenges.titleId,
        titleEn: challenges.titleEn,
        userStatus: userChallengeProgress.status,
      })
      .from(challenges)
      .leftJoin(
        userChallengeProgress,
        and(eq(userChallengeProgress.challengeId, challenges.id), eq(userChallengeProgress.userId, uid))
      )
      .where(eq(challenges.slug, slug))
      .limit(1);

    if (!row) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Challenge not found" } });
      return;
    }

    const nar = narrativeForSlug(row.slug, row.titleId, row.titleEn);
    res.json({
      challenge: {
        id: row.id,
        slug: row.slug,
        owaspCategory: row.owaspCategory,
        difficulty: row.difficulty,
        pointsBase: row.pointsBase,
        dockerService: row.dockerService,
        proxyPath: row.proxyPath,
        titleId: row.titleId,
        titleEn: row.titleEn,
        status: (row.userStatus ?? "locked") as "locked" | "unlocked" | "solved",
        vulnerabilityExplainId: nar.vulnerabilityExplainId,
        vulnerabilityExplainEn: nar.vulnerabilityExplainEn,
        backstoryId: nar.backstoryId,
        backstoryEn: nar.backstoryEn,
        caseSummaryId: nar.caseSummaryId,
        caseSummaryEn: nar.caseSummaryEn,
      },
    });
  } catch (e) {
    next(e);
  }
});

const flagBody = z.object({
  flag: z.string().min(1).max(512),
});

challengesRouter.post("/challenges/:slug/flags", labActionLimiter, async (req, res, next) => {
  try {
    const uid = req.session.user!.id;
    const slug = req.params.slug;
    const body = flagBody.parse(req.body);
    const pepper = envString("PEPPER_FLAG");
    const ip = req.ip;

    const [ch] = await db.select().from(challenges).where(eq(challenges.slug, slug)).limit(1);
    if (!ch) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Challenge not found" } });
      return;
    }

    const [prog] = await db
      .select()
      .from(userChallengeProgress)
      .where(and(eq(userChallengeProgress.userId, uid), eq(userChallengeProgress.challengeId, ch.id)))
      .limit(1);

    if (!prog || prog.status === "locked") {
      res.status(403).json({ error: { code: "LOCKED", message: "Challenge is locked" } });
      return;
    }
    if (prog.status === "solved") {
      await db.insert(flagSubmissions).values({
        userId: uid,
        challengeId: ch.id,
        submittedText: body.flag,
        correct: true,
        ip,
      });
      res.json({
        correct: true,
        alreadySolved: true,
        pointsAwarded: 0,
        hintPenaltyPoints: 0,
        firstBloodBonus: 0,
        isFirstBlood: false,
        newBadges: [],
      });
      return;
    }

    const correct = await verifyFlag(body.flag, pepper, ch.flagHash);
    await db.insert(flagSubmissions).values({
      userId: uid,
      challengeId: ch.id,
      submittedText: body.flag,
      correct,
      ip,
    });

    if (!correct) {
      res.json({ correct: false, alreadySolved: false, pointsAwarded: 0, newBadges: [] });
      return;
    }

    await db
      .update(userChallengeProgress)
      .set({ status: "solved", solvedAt: new Date() })
      .where(and(eq(userChallengeProgress.userId, uid), eq(userChallengeProgress.challengeId, ch.id)));

    const hintRows = await db
      .select({ level: hintUnlocks.level })
      .from(hintUnlocks)
      .where(and(eq(hintUnlocks.userId, uid), eq(hintUnlocks.challengeId, ch.id)));
    const unlocked = new Set(hintRows.map((h) => h.level));
    let pointsAwarded = awardPointsForSolve(ch.pointsBase, unlocked);
    const hintPenaltyPoints = ch.pointsBase - pointsAwarded;

    let firstBloodBonus = 0;
    let isFirstBlood = false;
    const fbBonus = Number(process.env.FIRST_BLOOD_BONUS_POINTS ?? 50);
    try {
      await db.insert(challengeFirstBloods).values({
        challengeId: ch.id,
        userId: uid,
        bonusPoints: fbBonus,
      });
      isFirstBlood = true;
      firstBloodBonus = fbBonus;
      pointsAwarded += firstBloodBonus;
    } catch (e) {
      const err = e as { code?: string };
      if (err.code !== "23505") throw e;
    }

    await unlockNextInCategoryAfterSolve(uid, ch.id);
    const newBadges = await evaluateBadgesForUser(uid);

    res.json({
      correct: true,
      alreadySolved: false,
      pointsAwarded,
      hintPenaltyPoints,
      firstBloodBonus,
      isFirstBlood,
      newBadges,
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid body", details: e.flatten() } });
      return;
    }
    next(e);
  }
});

/** DEC-003: audit-only; tidak memanggil Docker. Pesan ringkas agar pengguna refresh tab lab. */
challengesRouter.post("/challenges/:slug/lab/reset", labActionLimiter, async (req, res, next) => {
  try {
    const uid = req.session.user!.id;
    const slug = req.params.slug;
    const [ch] = await db.select({ id: challenges.id }).from(challenges).where(eq(challenges.slug, slug)).limit(1);
    if (!ch) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Challenge not found" } });
      return;
    }
    await db.insert(labResets).values({ userId: uid, challengeId: ch.id });
    res.json({
      ok: true,
      message: "Reset dicatat. Segarkan tab lab bila perlu. Riwayat reset tersimpan di server.",
    });
  } catch (e) {
    next(e);
  }
});
