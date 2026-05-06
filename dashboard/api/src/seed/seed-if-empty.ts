import { eq, sql } from "drizzle-orm";
import { db, pool } from "../db/pool.js";
import { badges, challenges } from "../db/schema.js";
import { hashFlag } from "../lib/password.js";
import { envString } from "../lib/env.js";
import { EXPECTED_CHALLENGE_COUNT, type SeedChallenge, SEED_CHALLENGES } from "./challenges-data.js";

if (SEED_CHALLENGES.length !== EXPECTED_CHALLENGE_COUNT) {
  throw new Error(`Seed mismatch: expected ${EXPECTED_CHALLENGE_COUNT}, got ${SEED_CHALLENGES.length}`);
}

const BADGE_SEED = [
  {
    key: "first_step",
    nameId: "Langkah Pertama",
    nameEn: "First Step",
    ruleJson: { type: "solve_any", min: 1 },
  },
  {
    key: "owasp_master",
    nameId: "OWASP Master",
    nameEn: "OWASP Master",
    ruleJson: { type: "one_per_category", categories: 10 },
  },
  {
    key: "first_blood",
    nameId: "First Blood",
    nameEn: "First Blood",
    ruleJson: { type: "first_blood", min: 1 },
  },
] as const;

async function buildChallengeRow(c: SeedChallenge, idx: number, pepper: string) {
  return {
    slug: c.slug,
    owaspCategory: c.owaspCategory,
    difficulty: c.difficulty,
    pointsBase: c.pointsBase,
    dockerService: `challenge-${c.slug}`,
    proxyPath: `/lab/${c.slug}/`,
    flagHash: await hashFlag(c.flagPlain, pepper),
    sortOrder: idx + 1,
    titleId: c.titleId,
    titleEn: c.titleEn,
  };
}

/**
 * Slug lama di volume DB yang sudah pernah di-seed (sebelum rename di challenges-data).
 * Tanpa ini, proxy_path mengarah ke `/lab/<slug>/` yang tidak ada di phase1-bundle `FLAGS`.
 */
const CHALLENGE_SLUG_RENAMES: { from: string; to: string }[] = [
  { from: "a02-default-credentials", to: "a02-default-or-hardcoded-credentials" },
];

/** Idempotent: aman dipanggil setiap boot. */
export async function repairRenamedChallengeSlugs(): Promise<number> {
  let updated = 0;
  for (const { from, to } of CHALLENGE_SLUG_RENAMES) {
    const [alreadyTo] = await db.select({ id: challenges.id }).from(challenges).where(eq(challenges.slug, to)).limit(1);
    if (alreadyTo) continue;

    const r = await db
      .update(challenges)
      .set({
        slug: to,
        proxyPath: `/lab/${to}/`,
        dockerService: `challenge-${to}`,
      })
      .where(eq(challenges.slug, from));
    const n = Number(r.rowCount ?? 0);
    if (n > 0) {
      updated += n;
      console.info(`[nawa-api] repairRenamedChallengeSlugs: ${from} -> ${to} (${n} row)`);
    }
  }
  return updated;
}

export async function seedIfEmpty(): Promise<{ challengesSeeded: number; badgesSeeded: number }> {
  const pepper = envString("PEPPER_FLAG");

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(challenges);

  let challengesSeeded = 0;
  if (count === 0) {
    // Jangan hash 60 flag sekaligus — memicu puncak CPU/RAM di container kecil → proses bisa mati → Nginx 502.
    const CONCURRENCY = 4;
    const rows: Awaited<ReturnType<typeof buildChallengeRow>>[] = [];
    for (let i = 0; i < SEED_CHALLENGES.length; i += CONCURRENCY) {
      const chunk = SEED_CHALLENGES.slice(i, i + CONCURRENCY);
      const part = await Promise.all(
        chunk.map((c, j) => buildChallengeRow(c, i + j, pepper))
      );
      rows.push(...part);
    }
    await db.insert(challenges).values(rows);
    challengesSeeded = rows.length;
  }

  let badgesSeeded = 0;
  for (const b of BADGE_SEED) {
    const [ex] = await db.select({ id: badges.id }).from(badges).where(eq(badges.key, b.key)).limit(1);
    if (ex) continue;
    await db.insert(badges).values({
      key: b.key,
      nameId: b.nameId,
      nameEn: b.nameEn,
      ruleJson: b.ruleJson,
    });
    badgesSeeded += 1;
  }

  return { challengesSeeded, badgesSeeded };
}

export async function closePool(): Promise<void> {
  await pool.end();
}
