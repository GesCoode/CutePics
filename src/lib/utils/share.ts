const DEFAULT_TITLE = 'HuePrint';
const DEFAULT_TEXT =
  'Build beautiful color palettes with HuePrint — pick a base color, explore harmonies, and export for your projects.';

export function getSiteShareUrl(): string {
  if (typeof window === 'undefined') return '';
  return window.location.origin + window.location.pathname;
}

export function canNativeShare(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

export async function shareNative(
  url: string,
  title = DEFAULT_TITLE,
  text = DEFAULT_TEXT,
): Promise<boolean> {
  if (!canNativeShare()) return false;

  try {
    await navigator.share({ title, text, url });
    return true;
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return false;
    return false;
  }
}
