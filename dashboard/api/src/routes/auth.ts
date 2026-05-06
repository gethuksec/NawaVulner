import { Router } from "express";
import { and, count, eq } from "drizzle-orm";
import { approxRankByBasePoints } from "../lib/badges.js";
import { z } from "zod";
import { db } from "../db/pool.js";
import { userBadges, userChallengeProgress, users } from "../db/schema.js";
import { syncUnlockedChallengesForUser } from "../lib/progress-sync.js";
import { totalAwardedPointsForUser } from "../lib/total-points.js";
import { hashPassword, verifyPassword } from "../lib/password.js";
import { authLimiter } from "../middleware/rate-limit.js";
import { requireAuth } from "../middleware/require-auth.js";

export const authRouter = Router();

const registerSchema = z.object({
  username: z.string().min(2).max(64),
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
});

authRouter.post("/register", authLimiter, async (req, res, next) => {
  try {
    const body = registerSchema.parse(req.body);
    const passwordHash = await hashPassword(body.password);

    const [user] = await db
      .insert(users)
      .values({
        username: body.username,
        email: body.email,
        passwordHash,
        locale: "id",
      })
      .returning({ id: users.id, username: users.username, email: users.email, locale: users.locale });

    if (!user) {
      res.status(500).json({ error: { code: "REGISTER_FAILED", message: "Could not create user" } });
      return;
    }

    await syncUnlockedChallengesForUser(user.id);

    req.session.user = { id: user.id, username: user.username };
    res.status(201).json({ user: { id: user.id, username: user.username, email: user.email, locale: user.locale } });
  } catch (e) {
    if (e instanceof z.ZodError) {
      res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid input", details: e.flatten() } });
      return;
    }
    const err = e as { code?: string };
    if (err.code === "23505") {
      res.status(409).json({ error: { code: "DUPLICATE", message: "Username or email already taken" } });
      return;
    }
    next(e);
  }
});

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

authRouter.post("/login", authLimiter, async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);
    const [row] = await db.select().from(users).where(eq(users.username, body.username)).limit(1);
    if (!row) {
      res.status(401).json({ error: { code: "INVALID_CREDENTIALS", message: "Invalid username or password" } });
      return;
    }
    const ok = await verifyPassword(body.password, row.passwordHash);
    if (!ok) {
      res.status(401).json({ error: { code: "INVALID_CREDENTIALS", message: "Invalid username or password" } });
      return;
    }
    req.session.user = { id: row.id, username: row.username };
    await syncUnlockedChallengesForUser(row.id);
    res.json({ user: { id: row.id, username: row.username, email: row.email, locale: row.locale } });
  } catch (e) {
    if (e instanceof z.ZodError) {
      res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid input", details: e.flatten() } });
      return;
    }
    next(e);
  }
});

authRouter.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("nawa.sid", { path: "/", httpOnly: true, sameSite: "lax" });
    res.status(204).end();
  });
});

authRouter.get("/me", requireAuth, async (req, res, next) => {
  try {
    const uid = req.session.user!.id;
    const [u] = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        locale: users.locale,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, uid))
      .limit(1);

    const [{ solvedCount }] = await db
      .select({ solvedCount: count() })
      .from(userChallengeProgress)
      .where(and(eq(userChallengeProgress.userId, uid), eq(userChallengeProgress.status, "solved")));

    const totalPoints = await totalAwardedPointsForUser(uid);
    const [{ badgeCount }] = await db
      .select({ badgeCount: count() })
      .from(userBadges)
      .where(eq(userBadges.userId, uid));
    const rankApprox = await approxRankByBasePoints(uid);

    res.json({
      user: u,
      stats: {
        solvedCount: Number(solvedCount),
        totalPoints,
        badgeCount: Number(badgeCount),
        rankApprox,
        rankNoteId: "Peringkat memakai jumlah poin base (tanpa penalti hint); presisi penuh = backlog.",
        rankNoteEn: "Rank uses summed base points (ignoring hint penalties); full precision = backlog.",
      },
    });
  } catch (e) {
    next(e);
  }
});
