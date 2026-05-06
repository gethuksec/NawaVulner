-- Jalankan manual pada DB yang sudah ada (volume lama), atau tambahkan ke pipeline migrate:
-- psql $DATABASE_URL -f dashboard/api/db/init-fase1.sql

CREATE TABLE IF NOT EXISTS challenge_first_bloods (
  challenge_id INTEGER PRIMARY KEY REFERENCES challenges (id) ON DELETE CASCADE,
  user_id        INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  solved_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  bonus_points   INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_challenge_first_bloods_user ON challenge_first_bloods (user_id);
