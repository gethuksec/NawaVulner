import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

/**
 * Menetapkan `req.requestId`, header `X-Request-Id`, dan menambahkan `requestId` ke objek `error`
 * pada body JSON `{ error: { ... } }` (bentuk SDD) bila belum ada.
 */
export function requestContextMiddleware(req: Request, res: Response, next: NextFunction): void {
  const fromHeader = req.headers["x-request-id"];
  const requestId =
    typeof fromHeader === "string" && fromHeader.trim().length > 0 ? fromHeader.trim() : randomUUID();
  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);

  const origJson = res.json.bind(res);
  res.json = function patchJson(body: unknown) {
    if (body && typeof body === "object" && body !== null && "error" in body) {
      const err = (body as { error: Record<string, unknown> }).error;
      if (err && typeof err === "object" && !("requestId" in err)) {
        err.requestId = requestId;
      }
    }
    return origJson(body as never);
  };

  next();
}
