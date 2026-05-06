import bcrypt from "bcryptjs";

const ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function hashFlag(plain: string, pepper: string): Promise<string> {
  return bcrypt.hash(`${pepper}:${plain}`, ROUNDS);
}

export async function verifyFlag(plain: string, pepper: string, hash: string): Promise<boolean> {
  return bcrypt.compare(`${pepper}:${plain}`, hash);
}
