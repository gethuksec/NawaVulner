import { and, eq, sql } from "drizzle-orm";
import { db } from "../db/pool.js";
import { challengeFirstBloods, challenges, hintUnlocks, userChallengeProgress } from "../db/schema.js";
import { awardPointsForSolve } from "./scoring.js";

export async function totalAwardedPointsForUser(userId: number): Promise<number> {
  const solved = await db
    .select({
      challengeId: challenges.id,
      pointsBase: challenges.pointsBase,
    })
    .from(userChallengeProgress)
    .innerJoin(challenges, eq(challenges.id, userChallengeProgress.challengeId))
    .where(and(eq(userChallengeProgress.userId, userId), eq(userChallengeProgress.status, "solved")));

  if (solved.length === 0) return 0;

  const hints = await db
    .select({
      challengeId: hintUnlocks.challengeId,
      level: hintUnlocks.level,
    })
    .from(hintUnlocks)
    .where(eq(hintUnlocks.userId, userId));

  const byChallenge = new Map<number, Set<number>>();
  for (const h of hints) {
    if (!byChallenge.has(h.challengeId)) byChallenge.set(h.challengeId, new Set());
    byChallenge.get(h.challengeId)!.add(h.level);
  }

  let total = 0;
  for (const row of solved) {
    const levels = byChallenge.get(row.challengeId) ?? new Set<number>();
    total += awardPointsForSolve(row.pointsBase, levels);
  }

  const [{ fb }] = await db
    .select({ fb: sql<number>`coalesce(sum(${challengeFirstBloods.bonusPoints})::int, 0)` })
    .from(challengeFirstBloods)
    .where(eq(challengeFirstBloods.userId, userId));
  total += Number(fb ?? 0);

  return total;
}
