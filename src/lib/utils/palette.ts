import { hexToRgb, normalizeHex, rgbToHsv, hsvToHex } from '$lib/utils/colorUtils';

function getHsv(hex: string) {
  const { r, g, b } = hexToRgb(normalizeHex(hex));
  return rgbToHsv(r, g, b);
}

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export function buildPalette(baseHex: string, mode: string) {
  const base = normalizeHex(baseHex);
  const { h, s, v } = getHsv(base);

  switch (mode) {
    case 'Complementary':
      return [base, hsvToHex(mod(h + 180, 360), s, v)];

    case 'Analogous':
      return Array.from({ length: 5 }, (_, i) =>
        hsvToHex(mod(h + (i - 2) * 25, 360), s, v),
      );

    case 'Triadic':
      return [0, 120, 240].map((o) => hsvToHex(mod(h + o, 360), s, v));

    case 'Split-Complementary':
      return [
        base,
        hsvToHex(mod(h + 150, 360), s, v),
        hsvToHex(mod(h + 210, 360), s, v),
      ];

    case 'Monochromatic':
      return Array.from({ length: 5 }, (_, i) =>
        hsvToHex(h, Math.min(1, s * (0.25 + i * 0.18)), Math.min(1, v * (0.45 + i * 0.12))),
      );

    case 'Tonal':
      return Array.from({ length: 5 }, (_, i) =>
        hsvToHex(h, Math.min(1, s * (0.2 + i * 0.2)), Math.max(0.12, v - i * 0.12)),
      );

    case 'Semantic':
      return Array.from({ length: 4 }, (_, i) =>
        hsvToHex(mod(h + i * 90, 360), Math.max(0.5, s), v),
      );

    default:
      return [base];
  }
}
