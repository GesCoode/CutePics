import {
  contrastRatio,
  normalizeHex,
  pickForeground,
  pickDarkest,
  pickLightest,
} from '$lib/utils/colorUtils';
import type { PaletteCard } from '$lib/utils/mapPaletteToCards';

export type WcagLevel = 'AAA' | 'AA' | 'AA Large' | 'Fail';

export type WcagContrastPair = {
  fg: string;
  bg: string;
  label: string;
  ratio: number;
};

export type WcagPaletteReport = {
  level: WcagLevel;
  minRatio: number;
  worstPair: WcagContrastPair;
  pairs: WcagContrastPair[];
};

const AA_NORMAL = 4.5;
const AAA_NORMAL = 7;
const AA_LARGE = 3;

function byName(cards: PaletteCard[], ...names: string[]): PaletteCard | undefined {
  for (const name of names) {
    const match = cards.find((c) => c.name.toLowerCase() === name.toLowerCase());
    if (match) return match;
  }
  return undefined;
}

function isBackgroundRole(name: string): boolean {
  return /background|surface|canvas|tint/i.test(name) && !/text/i.test(name);
}

function isTextRole(name: string): boolean {
  return /text|strong/i.test(name);
}

function buildPairs(cards: PaletteCard[]): Omit<WcagContrastPair, 'ratio'>[] {
  const normalized = cards.map((c) => ({ ...c, color: normalizeHex(c.color) }));
  const pairs: Omit<WcagContrastPair, 'ratio'>[] = [];
  const seen = new Set<string>();

  const add = (fg: string, bg: string, label: string) => {
    const key = `${normalizeHex(fg)}|${normalizeHex(bg)}`;
    if (seen.has(key)) return;
    seen.add(key);
    pairs.push({ fg: normalizeHex(fg), bg: normalizeHex(bg), label });
  };

  const backgrounds = normalized.filter((c) => isBackgroundRole(c.name));
  const textColors = normalized.filter((c) => isTextRole(c.name));

  let backgroundCards = backgrounds;
  if (backgroundCards.length === 0) {
    const named = byName(normalized, 'Background', 'Surface');
    if (named) {
      backgroundCards = [named];
    } else if (normalized.length > 0) {
      backgroundCards = [
        {
          ...normalized[0],
          name: 'Lightest swatch',
          color: pickLightest(normalized.map((c) => c.color)),
        },
      ];
    }
  }

  const bgList: { color: string; name: string }[] = backgroundCards.map((c) => ({
    color: c.color,
    name: c.name,
  }));

  if (bgList.length === 0 && normalized.length > 0) {
    const light = pickLightest(normalized.map((c) => c.color));
    bgList.push({ color: light, name: 'Lightest swatch' });
  }

  const textList =
    textColors.length > 0
      ? textColors
      : [{ color: pickDarkest(normalized.map((c) => c.color)), name: 'Darkest swatch' }];

  for (const bg of bgList) {
    for (const text of textList) {
      add(text.color, bg.color, `${text.name} on ${bg.name}`);
    }
    add(pickForeground(bg.color), bg.color, `Auto contrast on ${bg.name}`);
  }

  const bgColor = bgList[0]?.color;
  if (bgColor) {
    const primary = byName(normalized, 'Primary');
    const accent = byName(normalized, 'Accent', 'Accent 1', 'Highlight');
    const secondary = byName(normalized, 'Secondary');

    if (primary) add(pickForeground(primary.color), primary.color, 'Text on Primary');
    if (primary) add(primary.color, bgColor, `Primary on ${bgList[0].name}`);
    if (secondary) add(secondary.color, bgColor, `Secondary on ${bgList[0].name}`);
    if (accent) add(pickForeground(accent.color), accent.color, 'Text on Accent');
    if (accent) add(accent.color, bgColor, `Accent on ${bgList[0].name}`);
  }

  for (const card of normalized) {
    if (/success|warning|error|info/i.test(card.name)) {
      add(pickForeground(card.color), card.color, `Text on ${card.name}`);
    }
  }

  return pairs;
}

function levelFromRatios(ratios: number[]): WcagLevel {
  if (ratios.length === 0) return 'Fail';
  if (ratios.every((r) => r >= AAA_NORMAL)) return 'AAA';
  if (ratios.every((r) => r >= AA_NORMAL)) return 'AA';
  if (ratios.every((r) => r >= AA_LARGE)) return 'AA Large';
  return 'Fail';
}

/** Scores palette swatches for WCAG 2.x contrast (normal text thresholds). */
export function evaluatePaletteWcag(cards: PaletteCard[]): WcagPaletteReport {
  if (cards.length === 0) {
    return {
      level: 'Fail',
      minRatio: 0,
      worstPair: { fg: '#000000', bg: '#FFFFFF', label: 'No colors', ratio: 0 },
      pairs: [],
    };
  }

  const rawPairs = buildPairs(cards);
  const pairs: WcagContrastPair[] = rawPairs.map((p) => ({
    ...p,
    ratio: Math.round(contrastRatio(p.fg, p.bg) * 100) / 100,
  }));

  const ratios = pairs.map((p) => p.ratio);
  const minRatio = ratios.length ? Math.min(...ratios) : 0;
  const worstPair = pairs.reduce((worst, p) => (p.ratio < worst.ratio ? p : worst), pairs[0]);

  return {
    level: levelFromRatios(ratios),
    minRatio,
    worstPair,
    pairs,
  };
}

export function wcagLevelColor(level: WcagLevel): string {
  switch (level) {
    case 'AAA':
      return 'var(--wcag-aaa)';
    case 'AA':
      return 'var(--wcag-aa)';
    case 'AA Large':
      return 'var(--wcag-aa-large)';
    default:
      return 'var(--wcag-fail)';
  }
}
