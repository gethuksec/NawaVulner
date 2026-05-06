/** Penalti hint selaras PRD §6.4: hint 2 = −25% base, hint 3 = −50% base (keduanya stack jika keduanya dipakai). */
export function awardPointsForSolve(pointsBase: number, unlockedLevels: Set<number>): number {
  let p = pointsBase;
  if (unlockedLevels.has(2)) p -= Math.floor(pointsBase * 0.25);
  if (unlockedLevels.has(3)) p -= Math.floor(pointsBase * 0.5);
  return Math.max(0, p);
}
