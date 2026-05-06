export function envString(name: string, fallback?: string): string {
  const v = process.env[name];
  if (v !== undefined && v !== "") return v;
  if (fallback !== undefined) return fallback;
  throw new Error(`Missing environment variable: ${name}`);
}

export function envMode(name: string, allowed: string[], fallback: string): string {
  const v = process.env[name] ?? fallback;
  if (!allowed.includes(v)) {
    throw new Error(`Invalid ${name}=${v}. Allowed: ${allowed.join(", ")}`);
  }
  return v;
}
