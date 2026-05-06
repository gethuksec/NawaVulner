import { and, asc, eq, gt } from "drizzle-orm";
import { db } from "../db/pool.js";
import { challenges, userChallengeProgress } from "../db/schema.js";

export async function unlockNextInCategoryAfterSolve(userId: number, solvedChallengeId: number): Promise<void> {
  if ((process.env.CHALLENGE_UNLOCK_MODE ?? "free") !== "strict") return;

  const [solved] = await db
    .select({
      owaspCategory: challenges.owaspCategory,
      sortOrder: challenges.sortOrder,
    })
    .from(challenges)
    .where(eq(challenges.id, solvedChallengeId))
    .limit(1);
  if (!solved) return;

  const [next] = await db
    .select({ id: challenges.id })
    .from(challenges)
    .where(and(eq(challenges.owaspCategory, solved.owaspCategory), gt(challenges.sortOrder, solved.sortOrder)))
    .orderBy(asc(challenges.sortOrder))
    .limit(1);
  if (!next) return;

  const [prog] = await db
    .select({ status: userChallengeProgress.status })
    .from(userChallengeProgress)
    .where(and(eq(userChallengeProgress.userId, userId), eq(userChallengeProgress.challengeId, next.id)))
    .limit(1);

  if (prog?.status === "locked") {
    await db
      .update(userChallengeProgress)
      .set({ status: "unlocked", unlockedAt: new Date() })
      .where(and(eq(userChallengeProgress.userId, userId), eq(userChallengeProgress.challengeId, next.id)));
  }
}
