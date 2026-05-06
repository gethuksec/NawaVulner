import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  locale: text("locale").notNull().default("id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  owaspCategory: text("owasp_category").notNull(),
  difficulty: text("difficulty").notNull(),
  pointsBase: integer("points_base").notNull(),
  dockerService: text("docker_service").notNull(),
  proxyPath: text("proxy_path").notNull(),
  flagHash: text("flag_hash").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  titleId: text("title_id").notNull(),
  titleEn: text("title_en").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const userChallengeProgress = pgTable(
  "user_challenge_progress",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    challengeId: integer("challenge_id")
      .notNull()
      .references(() => challenges.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("locked"),
    unlockedAt: timestamp("unlocked_at", { withTimezone: true }),
    solvedAt: timestamp("solved_at", { withTimezone: true }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.challengeId] }),
  })
);

export const flagSubmissions = pgTable("flag_submissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  challengeId: integer("challenge_id")
    .notNull()
    .references(() => challenges.id, { onDelete: "cascade" }),
  submittedText: text("submitted_text").notNull(),
  correct: boolean("correct").notNull(),
  ip: text("ip"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const hintUnlocks = pgTable(
  "hint_unlocks",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    challengeId: integer("challenge_id")
      .notNull()
      .references(() => challenges.id, { onDelete: "cascade" }),
    level: integer("level").notNull(),
    unlockedAt: timestamp("unlocked_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.challengeId, t.level] }),
  })
);

export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  nameId: text("name_id").notNull(),
  nameEn: text("name_en").notNull(),
  ruleJson: jsonb("rule_json")
    .notNull()
    .default(sql`'{}'::jsonb`),
});

export const userBadges = pgTable(
  "user_badges",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    badgeId: integer("badge_id")
      .notNull()
      .references(() => badges.id, { onDelete: "cascade" }),
    earnedAt: timestamp("earned_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.badgeId] }),
  })
);

export const writeups = pgTable(
  "writeups",
  {
    challengeId: integer("challenge_id")
      .notNull()
      .references(() => challenges.id, { onDelete: "cascade" }),
    lang: text("lang").notNull(),
    bodyMd: text("body_md").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.challengeId, t.lang] }),
  })
);

export const labResets = pgTable("lab_resets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  challengeId: integer("challenge_id")
    .notNull()
    .references(() => challenges.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Satu baris per challenge: siapa first blood + bonus yang diberikan. */
export const challengeFirstBloods = pgTable("challenge_first_bloods", {
  challengeId: integer("challenge_id")
    .primaryKey()
    .references(() => challenges.id, { onDelete: "cascade" }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  solvedAt: timestamp("solved_at", { withTimezone: true }).notNull().defaultNow(),
  bonusPoints: integer("bonus_points").notNull().default(0),
});
