import { and, count, eq, sum } from "drizzle-orm";
import { db } from "../db/pool.js";
import {
  badges,
  challengeFirstBloods,
  challenges,
  userBadges,
  userChallengeProgress,
} from "../db/schema.js";

type RuleJson = { type: string; min?: number; categories?: number };

async function countSolved(userId: number): Promise<number> {
  const [{ n }] = await db
    .select({ n: count() })
    .from(userChallengeProgress)
    .where(and(eq(userChallengeProgress.userId, userId), eq(userChallengeProgress.status, "solved")));
  return Number(n);
}

async function countDistinctCategoriesSolved(userId: number): Promise<number> {
  const rows = await db
    .select({ cat: challenges.owaspCategory })
    .from(userChallengeProgress)
    .innerJoin(challenges, eq(challenges.id, userChallengeProgress.challengeId))
    .where(and(eq(userChallengeProgress.userId, userId), eq(userChallengeProgress.status, "solved")));
  return new Set(rows.map((r) => r.cat)).size;
}

async function countFirstBloods(userId: number): Promise<number> {
  const [{ n }] = await db
    .select({ n: count() })
    .from(challengeFirstBloods)
    .where(eq(challengeFirstBloods.userId, userId));
  return Number(n);
}

async function ruleSatisfied(userId: number, rule: RuleJson): Promise<boolean> {
  const min = rule.min ?? 1;
  switch (rule.type) {
    case "solve_any":
      return (await countSolved(userId)) >= min;
    case "one_per_category": {
      const need = rule.categories ?? 10;
      return (await countDistinctCategoriesSolved(userId)) >= need;
    }
    case "first_blood":
      return (await countFirstBloods(userId)) >= min;
    default:
      return false;
  }
}

export type NewBadge = { key: string; nameId: string; nameEn: string };

/** Evaluasi semua badge; sisipkan yang baru memenuhi syarat. */
export async function evaluateBadgesForUser(userId: number): Promise<NewBadge[]> {
  const allBadges = await db.select().from(badges);
  const earnedRows = await db.select({ badgeId: userBadges.badgeId }).from(userBadges).where(eq(userBadges.userId, userId));
  const earned = new Set(earnedRows.map((r) => r.badgeId));

  const newly: NewBadge[] = [];
  for (const b of allBadges) {
    if (earned.has(b.id)) continue;
    const rule = b.ruleJson as RuleJson;
    if (!(await ruleSatisfied(userId, rule))) continue;
    await db
      .insert(userBadges)
      .values({ userId, badgeId: b.id })
      .onConflictDoNothing({ target: [userBadges.userId, userBadges.badgeId] });
    newly.push({ key: b.key, nameId: b.nameId, nameEn: b.nameEn });
  }
  return newly;
}

/** Perkiraan ranking berdasarkan jumlah poin base (tanpa penalti hint). */
export async function approxRankByBasePoints(userId: number): Promise<number> {
  const sums = await db
    .select({
      userId: userChallengeProgress.userId,
      pts: sum(challenges.pointsBase),
    })
    .from(userChallengeProgress)
    .innerJoin(challenges, eq(challenges.id, userChallengeProgress.challengeId))
    .where(eq(userChallengeProgress.status, "solved"))
    .groupBy(userChallengeProgress.userId);

  const myPts = Number(sums.find((s) => s.userId === userId)?.pts ?? 0);
  const higher = sums.filter((s) => Number(s.pts ?? 0) > myPts).length;
  return higher + 1;
}
