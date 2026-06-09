import { env } from '$env/dynamic/private';

export function getAppOrigin(url: URL): string {
  return env.ORIGIN?.replace(/\/$/, '') ?? url.origin;
}
