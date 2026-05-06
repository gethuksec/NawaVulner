-- NawaVulner — skema awal PostgreSQL (dijalankan sekali saat volume DB kosong)
-- Lihat sdd/NawaVulner_SDD_v1.0.md §8

CREATE EXTENSION IF NOT EXISTS "citext";

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      CITEXT UNIQUE NOT NULL,
  email         CITEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  locale        TEXT NOT NULL DEFAULT 'id',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS session (
  sid    VARCHAR NOT NULL COLLATE "default" PRIMARY KEY,
  sess   JSON NOT NULL,
  expire TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS IDX_session_expire ON session (expire);

CREATE TABLE IF NOT EXISTS challenges (
  id              SERIAL PRIMARY KEY,
  slug            TEXT UNIQUE NOT NULL,
  owasp_category  TEXT NOT NULL,
  difficulty      TEXT NOT NULL,
  points_base     INTEGER NOT NULL,
  docker_service  TEXT NOT NULL,
  proxy_path      TEXT NOT NULL,
  flag_hash       TEXT NOT NULL,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  title_id        TEXT NOT NULL,
  title_en        TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT challenges_difficulty_chk CHECK (difficulty IN ('easy', 'medium', 'hard')),
  CONSTRAINT challenges_owasp_chk CHECK (owasp_category ~ '^A(0[1-9]|10)$')
);

CREATE TABLE IF NOT EXISTS user_challenge_progress (
  user_id       INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  challenge_id  INTEGER NOT NULL REFERENCES challenges (id) ON DELETE CASCADE,
  status        TEXT NOT NULL DEFAULT 'locked',
  unlocked_at   TIMESTAMPTZ,
  solved_at     TIMESTAMPTZ,
  PRIMARY KEY (user_id, challenge_id),
  CONSTRAINT ucp_status_chk CHECK (status IN ('locked', 'unlocked', 'solved'))
);

CREATE TABLE IF NOT EXISTS flag_submissions (
  id               SERIAL PRIMARY KEY,
  user_id          INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  challenge_id     INTEGER NOT NULL REFERENCES challenges (id) ON DELETE CASCADE,
  submitted_text   TEXT NOT NULL,
  correct          BOOLEAN NOT NULL,
  ip               TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_flag_submissions_user ON flag_submissions (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_flag_submissions_challenge ON flag_submissions (challenge_id, created_at DESC);

CREATE TABLE IF NOT EXISTS hint_unlocks (
  user_id       INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  challenge_id  INTEGER NOT NULL REFERENCES challenges (id) ON DELETE CASCADE,
  level         SMALLINT NOT NULL,
  unlocked_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, challenge_id, level),
  CONSTRAINT hint_level_chk CHECK (level BETWEEN 1 AND 3)
);

CREATE TABLE IF NOT EXISTS badges (
  id        SERIAL PRIMARY KEY,
  key       TEXT UNIQUE NOT NULL,
  name_id   TEXT NOT NULL,
  name_en   TEXT NOT NULL,
  rule_json JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS user_badges (
  user_id   INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  badge_id  INTEGER NOT NULL REFERENCES badges (id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, badge_id)
);

CREATE TABLE IF NOT EXISTS writeups (
  challenge_id INTEGER NOT NULL REFERENCES challenges (id) ON DELETE CASCADE,
  lang         TEXT NOT NULL,
  body_md      TEXT NOT NULL,
  PRIMARY KEY (challenge_id, lang)
);

CREATE TABLE IF NOT EXISTS lab_resets (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  challenge_id  INTEGER NOT NULL REFERENCES challenges (id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_lab_resets_user ON lab_resets (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS challenge_first_bloods (
  challenge_id INTEGER PRIMARY KEY REFERENCES challenges (id) ON DELETE CASCADE,
  user_id        INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  solved_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  bonus_points   INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_challenge_first_bloods_user ON challenge_first_bloods (user_id);
