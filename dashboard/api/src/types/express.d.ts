import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    /** UUID atau nilai dari header `X-Request-Id` (jika valid). */
    requestId: string;
  }
}

export {};
