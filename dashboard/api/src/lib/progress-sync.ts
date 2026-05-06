import { and, asc, eq, inArray, ne } from "drizzle-orm";
import { db } from "../db/pool.js";
import { challenges, userChallengeProgress } from "../db/schema.js";

const OWASP_CAT = /^A(0[1-9]|10)$/;

function normalizeUnlockMode(raw: string | undefined): "free" | "strict" | "catalog" {
  const m = (raw ?? "free").toLowerCase().trim();
  if (m === "strict" || m === "catalog") return m;
  return "free";
}

/** Kategori OWASP yang boleh dibuka (mode `catalog`). Default A01 + A02. */
export function parseCatalogAllowedCategories(): Set<string> {
  const raw = process.env.CHALLENGE_UNLOCK_CATEGORIES?.trim();
  const parts = (raw ?? "")
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter((s) => OWASP_CAT.test(s));
  if (parts.length > 0) return new Set(parts);
  return new Set(["A01", "A02"]);
}

/**
 * Pastikan baris progress ada.
 * - `free` → semua unlocked
 * - `strict` → locked dulu, lalu buka entry pertama per kategori + rantai solve
 * - `catalog` → hanya challenge di `CHALLENGE_UNLOCK_CATEGORIES` (default A01,A02) yang unlocked; lainnya locked (solved tidak diturunkan)
 */
export async function syncUnlockedChallengesForUser(userId: number): Promise<void> {
  const mode = normalizeUnlockMode(process.env.CHALLENGE_UNLOCK_MODE);

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
    } else if (mode === "catalog") {
      const allowed = parseCatalogAllowedCategories();
      await db
        .insert(userChallengeProgress)
        .values(
          missing.map((c) => {
            const open = allowed.has(c.owaspCategory);
            return {
              userId,
              challengeId: c.id,
              status: open ? ("unlocked" as const) : ("locked" as const),
              unlockedAt: open ? new Date() : null,
            };
          })
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

  if (mode === "catalog") {
    const allowed = parseCatalogAllowedCategories();
    const disallowedIds = allCh.filter((c) => !allowed.has(c.owaspCategory)).map((c) => c.id);
    const allowedIds = allCh.filter((c) => allowed.has(c.owaspCategory)).map((c) => c.id);

    if (disallowedIds.length > 0) {
      await db
        .update(userChallengeProgress)
        .set({ status: "locked", unlockedAt: null })
        .where(
          and(
            eq(userChallengeProgress.userId, userId),
            inArray(userChallengeProgress.challengeId, disallowedIds),
            ne(userChallengeProgress.status, "solved")
          )
        );
    }
    if (allowedIds.length > 0) {
      await db
        .update(userChallengeProgress)
        .set({ status: "unlocked", unlockedAt: new Date() })
        .where(
          and(
            eq(userChallengeProgress.userId, userId),
            inArray(userChallengeProgress.challengeId, allowedIds),
            eq(userChallengeProgress.status, "locked")
          )
        );
    }
    return;
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
