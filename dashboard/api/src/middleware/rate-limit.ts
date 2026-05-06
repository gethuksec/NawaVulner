import rateLimit from "express-rate-limit";

/** Login / register — cegah brute force & spam akun. */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_AUTH_MAX ?? 40),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: "RATE_LIMIT", message: "Too many attempts, try again later" } },
});

/** Submit flag & reset lab — cegah tebakan massal. */
export const labActionLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: Number(process.env.RATE_LIMIT_LAB_MAX ?? 60),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: "RATE_LIMIT", message: "Too many requests, slow down" } },
});
