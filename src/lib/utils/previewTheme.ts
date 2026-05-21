import {
  darkenHex,
  isReadable,
  lightenHex,
  normalizeHex,
  pickDarkest,
  pickForeground,
  pickLightest,
  pickReadableOn,
  relativeLuminance,
} from '$lib/utils/colorUtils';

export type PaletteCard = {
  id: string;
  name: string;
  color: string;
  colorName: string;
  purpose: string;
};

export type PreviewTheme = {
  headerBg: string;
  headerText: string;
  background: string;
  title: string;
  subtitle: string;
  text: string;
  accent: string;
  buttonPrimary: string;
  buttonPrimaryText: string;
  buttonSecondary: string;
  buttonSecondaryText: string;
};

function byName(cards: PaletteCard[], ...names: string[]): string | undefined {
  for (const name of names) {
    const match = cards.find((c) => c.name.toLowerCase() === name.toLowerCase());
    if (match) return normalizeHex(match.color);
  }
  return undefined;
}

function distinct(...colors: (string | undefined)[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const c of colors) {
    if (!c) continue;
    const n = normalizeHex(c);
    if (!seen.has(n)) {
      seen.add(n);
      out.push(n);
    }
  }
  return out;
}

function ensureDistinct(preferred: string, avoid: string, fallback: string): string {
  if (normalizeHex(preferred) !== normalizeHex(avoid)) return normalizeHex(preferred);
  return normalizeHex(fallback);
}

/**
 * Maps palette swatches to a mock-site theme with readable contrast.
 */
export function buildPreviewTheme(cards: PaletteCard[], baseHex: string): PreviewTheme {
  const base = normalizeHex(baseHex);
  const allColors = cards.map((c) => normalizeHex(c.color));
  const lightest = allColors.length ? pickLightest(allColors) : lightenHex(base, 0.82);
  const darkest = allColors.length ? pickDarkest(allColors) : darkenHex(base, 0.55);

  let background =
    byName(cards, 'Background', 'Surface', 'Base') ??
    (relativeLuminance(lightest) > 0.7 ? lightest : lightenHex(base, 0.88));

  let headerBg =
    byName(cards, 'Primary', 'Strong', 'Accent', 'Highlight') ??
    allColors.find((c) => relativeLuminance(c) < 0.65 && c !== background) ??
    base;

  headerBg = ensureDistinct(headerBg, background, darkenHex(base, 0.15));

  let accent =
    byName(cards, 'Accent', 'Accent 1', 'Accent 2', 'Highlight', 'Secondary') ??
    allColors.find((c) => c !== headerBg && c !== background) ??
    headerBg;

  let title = ensureDistinct(
    byName(cards, 'Accent', 'Primary', 'Strong') ?? headerBg,
    background,
    headerBg,
  );

  let subtitle = ensureDistinct(
    byName(cards, 'Secondary', 'Muted', 'Surface') ?? darkenHex(background, 0.35),
    background,
    darkenHex(title, 0.2),
  );

  if (!isReadable(subtitle, background, 2.5)) {
    subtitle =
      relativeLuminance(background) > 0.5 ? darkenHex(background, 0.55) : lightenHex(background, 0.45);
  }

  let text = pickReadableOn(
    background,
    distinct(
      byName(cards, 'Text Primary', 'Text', 'Text Secondary'),
      darkest,
      darkenHex(background, 0.6),
    ),
    relativeLuminance(background) > 0.5 ? '#1A2E24' : '#E8F2EC',
  );

  // Nav hover accent must read on the header
  if (!isReadable(accent, headerBg, 2)) {
    accent = relativeLuminance(headerBg) > 0.5 ? darkenHex(headerBg, 0.35) : lightenHex(headerBg, 0.45);
  }

  const headerText = pickForeground(headerBg);

  const buttonPrimary = headerBg;
  const buttonPrimaryText = pickForeground(buttonPrimary);
  const buttonSecondary = ensureDistinct(accent, buttonPrimary, subtitle);
  const buttonSecondaryText = pickForeground(buttonSecondary);

  return {
    headerBg,
    headerText,
    background,
    title,
    subtitle,
    text,
    accent,
    buttonPrimary,
    buttonPrimaryText,
    buttonSecondary,
    buttonSecondaryText,
  };
}
