export function normalizeHex(hex: string, fallback = '#000000'): string {
  if (!hex) return fallback;
  const raw = hex.replace('#', '').trim();
  if (raw.length === 3) {
    return `#${raw[0]}${raw[0]}${raw[1]}${raw[1]}${raw[2]}${raw[2]}`.toUpperCase();
  }
  if (raw.length === 6 && /^[0-9a-f]{6}$/i.test(raw)) {
    return `#${raw}`.toUpperCase();
  }
  return fallback;
}

export function hexToRgb(hex: string) {
  const clean = normalizeHex(hex).replace('#', '');
  const bigint = parseInt(clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

export function mixHex(hexA: string, hexB: string, weight: number): string {
  const w = Math.min(1, Math.max(0, weight));
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  const r = Math.round(a.r * (1 - w) + b.r * w);
  const g = Math.round(a.g * (1 - w) + b.g * w);
  const bl = Math.round(a.b * (1 - w) + b.b * w);
  return `#${[r, g, bl].map((c) => c.toString(16).padStart(2, '0')).join('')}`.toUpperCase();
}

export function lightenHex(hex: string, amount: number): string {
  return mixHex(hex, '#FFFFFF', amount);
}

export function darkenHex(hex: string, amount: number): string {
  return mixHex(hex, '#000000', amount);
}

export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

export function contrastRatio(hexA: string, hexB: string): number {
  const l1 = relativeLuminance(hexA);
  const l2 = relativeLuminance(hexB);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Returns white or near-black text that contrasts with the background. */
export function pickForeground(
  bg: string,
  light = '#FFFFFF',
  dark = '#1A1A1A',
): string {
  return relativeLuminance(bg) > 0.179 ? dark : light;
}

/**
 * Readable secondary text on a swatch: meets minRatio while staying as soft as possible.
 * Never uses opacity (which blends with the swatch hue).
 */
export function pickSecondaryOn(
  bg: string,
  minRatio = 4.5,
  light = '#FFFFFF',
  dark = '#1A1A1A',
): string {
  const primary = pickForeground(bg, light, dark);
  if (contrastRatio(primary, bg) >= minRatio) return primary;

  const boost = primary === light ? dark : light;
  for (let w = 0.05; w <= 1; w += 0.05) {
    const candidate = mixHex(primary, boost, w);
    if (contrastRatio(candidate, bg) >= minRatio) return normalizeHex(candidate);
  }
  return boost;
}

export function isReadable(fg: string, bg: string, minRatio = 3): boolean {
  return contrastRatio(fg, bg) >= minRatio;
}

export function pickReadableOn(
  bg: string,
  candidates: (string | undefined)[],
  fallback?: string,
): string {
  for (const c of candidates) {
    if (c && isReadable(c, bg)) return normalizeHex(c);
  }
  if (fallback && isReadable(fallback, bg)) return normalizeHex(fallback);
  return pickForeground(bg);
}

export function pickDarkest(colors: string[]): string {
  return colors.reduce((darkest, c) =>
    relativeLuminance(c) < relativeLuminance(darkest) ? c : darkest,
  );
}

export function pickLightest(colors: string[]): string {
  return colors.reduce((lightest, c) =>
    relativeLuminance(c) > relativeLuminance(lightest) ? c : lightest,
  );
}

export function rgbToHsv(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  let h = 0;

  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;

    h *= 60;
    if (h < 0) h += 360;
  }

  return {
    h,
    s: max === 0 ? 0 : d / max,
    v: max,
  };
}

export function hsvToHex(h: number, s: number, v: number) {
  const f = (n: number, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);

  const r = Math.round(f(5) * 255);
  const g = Math.round(f(3) * 255);
  const b = Math.round(f(1) * 255);

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}
