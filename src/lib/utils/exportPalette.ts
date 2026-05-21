import type { PaletteCard } from '$lib/utils/mapPaletteToCards';
import { hexToRgb, normalizeHex } from '$lib/utils/colorUtils';

export type ExportFormat = 'css' | 'hex' | 'rgb' | 'json' | 'figma';

export type PaletteExportMeta = {
  harmonyType: string;
  baseColor: string;
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function hexToHsl(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function header(meta: PaletteExportMeta): string {
  return `/* HuePrint — ${meta.harmonyType} (base ${normalizeHex(meta.baseColor)}) */`;
}

function exportCss(palette: PaletteCard[], meta: PaletteExportMeta): string {
  const lines = palette.map((c) => {
    const hex = normalizeHex(c.color);
    return `  --color-${slugify(c.name)}: ${hex};`;
  });
  return `${header(meta)}\n:root {\n${lines.join('\n')}\n}`;
}

function exportHex(palette: PaletteCard[], meta: PaletteExportMeta): string {
  const lines = palette.map((c) => {
    const hex = normalizeHex(c.color);
    const label = c.name.padEnd(14, ' ');
    return `${label} ${hex}`;
  });
  return `${header(meta)}\n${lines.join('\n')}`;
}

function exportRgb(palette: PaletteCard[], meta: PaletteExportMeta): string {
  const lines = palette.map((c) => {
    const hex = normalizeHex(c.color);
    const { r, g, b } = hexToRgb(hex);
    const label = c.name.padEnd(14, ' ');
    return `${label} rgb(${r}, ${g}, ${b})`;
  });
  return `${header(meta)}\n${lines.join('\n')}`;
}

function exportJson(palette: PaletteCard[], meta: PaletteExportMeta): string {
  const colors: Record<string, unknown> = {};

  for (const card of palette) {
    const hex = normalizeHex(card.color);
    const { r, g, b } = hexToRgb(hex);
    const hsl = hexToHsl(hex);
    const key = slugify(card.name);

    colors[key] = {
      name: card.name,
      hex,
      rgb: { r, g, b },
      hsl,
      colorName: card.colorName,
      purpose: card.purpose,
    };
  }

  return JSON.stringify(
    {
      name: meta.harmonyType,
      baseColor: normalizeHex(meta.baseColor),
      exportedAt: new Date().toISOString(),
      colors,
    },
    null,
    2,
  );
}

/** Design Tokens format (compatible with Figma Variables plugins). */
function exportFigma(palette: PaletteCard[], meta: PaletteExportMeta): string {
  const tokens: Record<string, { $type: string; $value: string; $description?: string }> =
    {};

  for (const card of palette) {
    const key = slugify(card.name);
    tokens[key] = {
      $type: 'color',
      $value: normalizeHex(card.color),
      $description: card.purpose,
    };
  }

  return JSON.stringify(
    {
      $name: `HuePrint / ${meta.harmonyType}`,
      $description: `Base color ${normalizeHex(meta.baseColor)}`,
      ...tokens,
    },
    null,
    2,
  );
}

export function formatPaletteExport(
  format: ExportFormat,
  palette: PaletteCard[],
  meta: PaletteExportMeta,
): string {
  if (!palette.length) {
    return '/* No colors in palette */';
  }

  switch (format) {
    case 'css':
      return exportCss(palette, meta);
    case 'hex':
      return exportHex(palette, meta);
    case 'rgb':
      return exportRgb(palette, meta);
    case 'json':
      return exportJson(palette, meta);
    case 'figma':
      return exportFigma(palette, meta);
    default:
      return exportHex(palette, meta);
  }
}

export function getExportExtension(format: ExportFormat): string {
  switch (format) {
    case 'css':
      return 'css';
    case 'json':
    case 'figma':
      return 'json';
    case 'hex':
    case 'rgb':
      return 'txt';
    default:
      return 'txt';
  }
}

export function getExportMimeType(format: ExportFormat): string {
  switch (format) {
    case 'css':
      return 'text/css;charset=utf-8';
    case 'json':
    case 'figma':
      return 'application/json;charset=utf-8';
    default:
      return 'text/plain;charset=utf-8';
  }
}

export function getExportFilename(format: ExportFormat, meta: PaletteExportMeta): string {
  const slug = slugify(meta.harmonyType) || 'palette';
  const suffix: Record<ExportFormat, string> = {
    css: '',
    hex: '-hex',
    rgb: '-rgb',
    json: '',
    figma: '-figma',
  };
  const ext = getExportExtension(format);
  return `hueprint-${slug}${suffix[format]}.${ext}`;
}

export function downloadPalette(
  format: ExportFormat,
  palette: PaletteCard[],
  meta: PaletteExportMeta,
): boolean {
  if (typeof document === 'undefined' || !palette.length) return false;

  try {
    const text = formatPaletteExport(format, palette, meta);
    const blob = new Blob([text], { type: getExportMimeType(format) });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = getExportFilename(format, meta);
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch {
    return false;
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* fall through */
    }
  }

  if (typeof document === 'undefined') return false;

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}
