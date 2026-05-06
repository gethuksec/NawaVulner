import { pool } from "./pool.js";

/**
 * Postgres `docker-entrypoint-initdb.d` hanya dijalankan pada **volume kosong**.
 * Volume lama bisa tidak punya `lab_resets` / `challenge_first_bloods` (ditambah setelah init pertama)
 * → query API gagal. DDL di sini idempoten (`IF NOT EXISTS`).
 */
export async function ensureSchemaPatches(): Promise<void> {
  await pool.query(`
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
  `);
}
