import { env } from '$env/dynamic/private';

export function requireEnv(
  name: 'DATABASE_URL' | 'SESSION_SECRET' | 'GEMINI_API_KEY' | 'CRON_SECRET'
): string {
  const value = env[name];
  if (!value) {
    throw new Error(`${name} is not set`);
  }
  return value;
}

export function optionalEnv(name: string): string | undefined {
  const value = env[name];
  return value || undefined;
}

export function geminiImageModel(): string {
  return env.GEMINI_IMAGE_MODEL ?? 'imagen-4.0-generate-001';
}

export function geminiFallbackModel(): string {
  return env.GEMINI_FALLBACK_MODEL ?? 'gemini-2.0-flash-preview-image-generation';
}
