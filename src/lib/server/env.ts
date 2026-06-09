import { env } from '$env/dynamic/private';

export function requireEnv(name: 'DATABASE_URL' | 'SESSION_SECRET'): string {
  const value = env[name];
  if (!value) {
    throw new Error(`${name} is not set`);
  }
  return value;
}
