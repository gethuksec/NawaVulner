/**
 * Verifikasi cepat hash/verify flag (bcrypt + pepper) — dijalankan oleh `npm run test`.
 */
import assert from "node:assert/strict";
import { hashFlag, verifyFlag } from "../lib/password.js";

async function main(): Promise<void> {
  const pepper = "unit-test-pepper";
  const plain = "FLAG{verify_ok}";
  const hash = await hashFlag(plain, pepper);
  assert.equal(await verifyFlag(plain, pepper, hash), true);
  assert.equal(await verifyFlag("FLAG{wrong}", pepper, hash), false);
  assert.equal(await verifyFlag(plain, "wrong-pepper", hash), false);
  console.log("[test] flag verify OK");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
