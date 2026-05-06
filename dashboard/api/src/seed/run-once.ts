import { seedIfEmpty, closePool } from "./seed-if-empty.js";

seedIfEmpty()
  .then((r) => {
    // eslint-disable-next-line no-console
    console.log("Seed result:", r);
  })
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => closePool());
