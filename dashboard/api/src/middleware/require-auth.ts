import type { RequestHandler } from "express";

export type SessionUser = { id: number; username: string };

declare module "express-session" {
  interface SessionData {
    user?: SessionUser;
  }
}

export const requireAuth: RequestHandler = (req, res, next) => {
  if (!req.session.user) {
    res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Login required" },
    });
    return;
  }
  next();
};
