export type ChallengeStatus = "locked" | "unlocked" | "solved";

export type ChallengeListItem = {
  id: number;
  slug: string;
  owaspCategory: string;
  difficulty: string;
  pointsBase: number;
  proxyPath: string;
  sortOrder: number;
  titleId: string;
  titleEn: string;
  status: ChallengeStatus;
};

export type ChallengeDetail = {
  id: number;
  slug: string;
  owaspCategory: string;
  difficulty: string;
  pointsBase: number;
  dockerService: string;
  proxyPath: string;
  titleId: string;
  titleEn: string;
  status: ChallengeStatus;
  /** HTML dari API (server-only) — penjelasan celah sebelum latar */
  vulnerabilityExplainId?: string;
  vulnerabilityExplainEn?: string;
  backstoryId?: string;
  backstoryEn?: string;
  caseSummaryId?: string;
  caseSummaryEn?: string;
};
