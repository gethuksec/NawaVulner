import { and, asc, eq, inArray } from "drizzle-orm";
import { db } from "../db/pool.js";
import { challenges, userChallengeProgress } from "../db/schema.js";

/** Pastikan baris progress ada; mode `free` = semua unlocked; `strict` = locked + buka entry per kategori OWASP + rantai saat solve. */
export async function syncUnlockedChallengesForUser(userId: number): Promise<void> {
  const mode = process.env.CHALLENGE_UNLOCK_MODE ?? "free";

  const allCh = await db
    .select({
      id: challenges.id,
      owaspCategory: challenges.owaspCategory,
      sortOrder: challenges.sortOrder,
    })
    .from(challenges)
    .orderBy(asc(challenges.sortOrder));

  if (allCh.length === 0) return;

  const existingRows = await db
    .select({ challengeId: userChallengeProgress.challengeId, status: userChallengeProgress.status })
    .from(userChallengeProgress)
    .where(eq(userChallengeProgress.userId, userId));

  const have = new Set(existingRows.map((r) => r.challengeId));
  const missing = allCh.filter((c) => !have.has(c.id));

  if (missing.length > 0) {
    const conflictTarget = [userChallengeProgress.userId, userChallengeProgress.challengeId];
    if (mode === "free") {
      await db
        .insert(userChallengeProgress)
        .values(
          missing.map((c) => ({
            userId,
            challengeId: c.id,
            status: "unlocked" as const,
            unlockedAt: new Date(),
          }))
        )
        .onConflictDoNothing({ target: conflictTarget });
    } else {
      await db
        .insert(userChallengeProgress)
        .values(
          missing.map((c) => ({
            userId,
            challengeId: c.id,
            status: "locked" as const,
          }))
        )
        .onConflictDoNothing({ target: conflictTarget });
    }
  }

  if (mode !== "strict") return;

  const byCat = new Map<string, { id: number; sortOrder: number }[]>();
  for (const c of allCh) {
    if (!byCat.has(c.owaspCategory)) byCat.set(c.owaspCategory, []);
    byCat.get(c.owaspCategory)!.push({ id: c.id, sortOrder: c.sortOrder });
  }

  const entryIds: number[] = [];
  for (const arr of byCat.values()) {
    arr.sort((a, b) => a.sortOrder - b.sortOrder);
    if (arr[0]) entryIds.push(arr[0].id);
  }

  if (entryIds.length === 0) return;

  await db
    .update(userChallengeProgress)
    .set({ status: "unlocked", unlockedAt: new Date() })
    .where(
      and(
        eq(userChallengeProgress.userId, userId),
        inArray(userChallengeProgress.challengeId, entryIds),
        eq(userChallengeProgress.status, "locked")
      )
    );
}
