import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema.js";

const { Pool } = pg;

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required environment variable: ${name}`);
  return v;
}

export const pool = new Pool({
  connectionString: requireEnv("DATABASE_URL"),
  max: 10,
});

export const db = drizzle(pool, { schema });
