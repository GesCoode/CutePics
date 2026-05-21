import { lightenHex, normalizeHex } from '$lib/utils/colorUtils';

export type PaletteCard = {
  id: string;
  name: string;
  color: string;
  colorName: string;
  purpose: string;
};

type ColorItem = PaletteCard;

function makeId(mode: string, name: string, index: number) {
  return `${mode}-${name}-${index}`;
}

export function mapPaletteToCards(colors: string[], mode: string): ColorItem[] {
  const normalized = colors.map((c) => normalizeHex(c));

  switch (mode) {
    case 'Complementary':
      return [
        {
          id: makeId(mode, 'background', 0),
          name: 'Background',
          color: lightenHex(normalized[0], 0.82),
          colorName: 'Tint',
          purpose: 'Page background',
        },
        {
          id: makeId(mode, 'primary', 1),
          name: 'Primary',
          color: normalized[0],
          colorName: 'Base',
          purpose: 'Brand & header',
        },
        {
          id: makeId(mode, 'accent', 2),
          name: 'Accent',
          color: normalized[1],
          colorName: 'Complement',
          purpose: 'Call-to-actions',
        },
      ];

    case 'Analogous': {
      const labels = ['Background', 'Primary', 'Secondary', 'Accent', 'Highlight'];
      return normalized.map((c, i) => ({
        id: makeId(mode, `analog-${i}`, i),
        name: labels[i] ?? `Color ${i + 1}`,
        color: i === 0 ? lightenHex(c, 0.8) : c,
        colorName: `Analog ${i + 1}`,
        purpose: i === 0 ? 'Soft background' : 'Harmonious UI usage',
      }));
    }

    case 'Triadic':
      return [
        {
          id: makeId(mode, 'background', 0),
          name: 'Background',
          color: lightenHex(normalized[0], 0.85),
          colorName: 'Tint',
          purpose: 'Page background',
        },
        {
          id: makeId(mode, 'primary', 1),
          name: 'Primary',
          color: normalized[0],
          colorName: 'Triad 1',
          purpose: 'Brand & header',
        },
        {
          id: makeId(mode, 'secondary', 2),
          name: 'Secondary',
          color: normalized[1],
          colorName: 'Triad 2',
          purpose: 'Supporting UI',
        },
        {
          id: makeId(mode, 'accent', 3),
          name: 'Accent',
          color: normalized[2],
          colorName: 'Triad 3',
          purpose: 'Highlights & CTAs',
        },
      ];

    case 'Split-Complementary':
      return [
        {
          id: makeId(mode, 'background', 0),
          name: 'Background',
          color: lightenHex(normalized[0], 0.82),
          colorName: 'Tint',
          purpose: 'Page background',
        },
        {
          id: makeId(mode, 'primary', 1),
          name: 'Primary',
          color: normalized[0],
          colorName: 'Base',
          purpose: 'Brand & header',
        },
        {
          id: makeId(mode, 'accent-1', 2),
          name: 'Accent 1',
          color: normalized[1],
          colorName: 'Split 1',
          purpose: 'Variation accent',
        },
        {
          id: makeId(mode, 'accent-2', 3),
          name: 'Accent 2',
          color: normalized[2],
          colorName: 'Split 2',
          purpose: 'Variation accent',
        },
      ];

    case 'Monochromatic':
      return normalized.map((c, i) => ({
        id: makeId(mode, `mono-${i}`, i),
        name:
          ['Background', 'Surface', 'Border', 'Text Primary', 'Text Secondary'][i] ?? `Shade ${i + 1}`,
        color: c,
        colorName: `Shade ${i + 1}`,
        purpose: 'Same hue variations',
      }));

    case 'Tonal':
      return normalized.map((c, i) => ({
        id: makeId(mode, `tone-${i}`, i),
        name: ['Background', 'Surface', 'Muted', 'Strong', 'Text'][i] ?? `Tone ${i + 1}`,
        color: c,
        colorName: `Tone ${i + 1}`,
        purpose: 'Tone variation',
      }));

    case 'Semantic':
      return [
        {
          id: makeId(mode, 'background', 0),
          name: 'Background',
          color: lightenHex(normalized[0], 0.9),
          colorName: 'Canvas',
          purpose: 'Neutral page background',
        },
        {
          id: makeId(mode, 'success', 1),
          name: 'Success',
          color: normalized[0],
          colorName: 'Success',
          purpose: 'Positive feedback',
        },
        {
          id: makeId(mode, 'warning', 2),
          name: 'Warning',
          color: normalized[1],
          colorName: 'Warning',
          purpose: 'Caution states',
        },
        {
          id: makeId(mode, 'error', 3),
          name: 'Error',
          color: normalized[2],
          colorName: 'Error',
          purpose: 'Errors',
        },
        {
          id: makeId(mode, 'info', 4),
          name: 'Info',
          color: normalized[3],
          colorName: 'Info',
          purpose: 'Information',
        },
      ];

    default:
      return [
        {
          id: makeId(mode, 'primary', 0),
          name: 'Primary',
          color: normalizeHex(colors[0] ?? '#888888'),
          colorName: 'Base',
          purpose: 'Main color',
        },
      ];
  }
}
