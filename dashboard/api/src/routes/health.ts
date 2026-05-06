import { Router } from "express";
import { sql } from "drizzle-orm";
import { db } from "../db/pool.js";

export const healthRouter = Router();

healthRouter.get("/health", async (_req, res, next) => {
  try {
    await db.execute(sql`select 1`);
    res.json({ status: "ok", db: true });
  } catch (e) {
    next(e);
  }
});
