<script lang="ts">
  import { tick } from 'svelte';
  import { normalizeHex } from '$lib/utils/colorUtils';

  export let type: 'HEX' | 'RGB' | 'HSL';
  export let value: string;
  export let selected: 'HEX' | 'RGB' | 'HSL' | null;
  export let onCommit: (val: string) => void;

  let colorInput: HTMLInputElement;
  let textInput: HTMLInputElement;
  let localText = '';
  let isError = false;
  let isEditing = false;

  $: isSelected = selected === type;
  $: safeHex = normalizeHex(value);
  $: if (!isError && !isEditing) {
    localText = formatValue(safeHex, type);
  }

  $: if (colorInput && !isEditing) {
    colorInput.value = safeHex.toLowerCase();
  }

  function formatValue(hex: string, format: string) {
    if (!hex) return '';
    if (format === 'HEX') return hex.toUpperCase();
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    if (format === 'RGB') return `${r}, ${g}, ${b}`;
    const { h, s, l } = hexToHsl(r, g, b);
    return `${h}°, ${s}%, ${l}%`;
  }

  function hexToHsl(r: number, g: number, b: number) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h = Math.round(h * 60);
    }
    return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  function hslToHex(h: number, s: number, l: number) {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
  }

  function parseHexInput(raw: string): string | null {
    const cleaned = raw.trim().replace(/^#/, '');
    if (!/^[a-f\d]*$/i.test(cleaned)) return null;
    if (cleaned.length === 3) {
      return `#${cleaned[0]}${cleaned[0]}${cleaned[1]}${cleaned[1]}${cleaned[2]}${cleaned[2]}`.toUpperCase();
    }
    if (cleaned.length === 6) {
      return `#${cleaned}`.toUpperCase();
    }
    return null;
  }

  function validateAndCommit() {
    isEditing = false;
    const raw = localText.trim();
    let hexResult: string | null = null;

    if (type === 'HEX') {
      hexResult = parseHexInput(raw);
      if (!hexResult && /^#?[a-f\d]{0,6}$/i.test(raw)) {
        localText = formatValue(safeHex, type);
        return;
      }
    } else {
      const numbers = raw.match(/\d+(\.\d+)?/g)?.map(Number) ?? [];
      if (type === 'RGB' && numbers.length === 3) {
        if (numbers.every((n) => n >= 0 && n <= 255)) {
          hexResult =
            '#' +
            numbers
              .map((x) => Math.round(x).toString(16).padStart(2, '0'))
              .join('')
              .toUpperCase();
        }
      } else if (type === 'HSL' && numbers.length === 3) {
        if (numbers[0] <= 360 && numbers[1] <= 100 && numbers[2] <= 100) {
          hexResult = hslToHex(numbers[0], numbers[1], numbers[2]);
        }
      } else if (numbers.length > 0 && numbers.length < 3) {
        localText = formatValue(safeHex, type);
        return;
      }
    }

    if (hexResult) {
      value = hexResult.toLowerCase();
      onCommit(value);
      isError = false;
      localText = formatValue(hexResult, type);
    } else if (!raw) {
      localText = formatValue(safeHex, type);
    } else {
      triggerError();
    }
  }

  function triggerError() {
    isError = true;
    localText = 'Invalid';
    setTimeout(() => {
      isError = false;
      localText = formatValue(safeHex, type);
    }, 1200);
  }

  function handleTextFocus() {
    isEditing = true;
    isError = false;
  }

  function handleTextKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      validateAndCommit();
    } else if (e.key === 'Escape') {
      isEditing = false;
      localText = formatValue(safeHex, type);
      textInput?.blur();
    }
  }

  async function handleButtonClick() {
    selected = type;
    if (!isSelected) {
      colorInput?.click();
      await tick();
    }
    textInput?.focus();
    textInput?.select();
  }

  function handleNativeColorChange(e: Event) {
    const hex = (e.currentTarget as HTMLInputElement).value;
    value = hex;
    onCommit(hex);
    isEditing = false;
    localText = formatValue(normalizeHex(hex), type);
  }
</script>

<div class="relative flex w-full flex-col items-stretch gap-1.5">
  <input
    type="color"
    bind:this={colorInput}
    class="pointer-events-none absolute top-full left-1/2 mt-6 h-0 w-0 -translate-x-1/2 opacity-0"
    on:change={handleNativeColorChange}
  />

  <button
    type="button"
    class="flex w-full cursor-pointer justify-center rounded-full border px-3 py-2.5 text-sm font-medium transition-all duration-200
      {isError
      ? 'border-accent-red bg-accent-red text-white'
      : isSelected
        ? 'border-accent bg-accent text-white shadow-md'
        : 'picker-inactive border shadow-sm hover:border-accent/40 hover:shadow'}"
    on:click={handleButtonClick}
  >
    {#if isSelected && !isError}
      <input
        bind:this={textInput}
        bind:value={localText}
        on:focus={handleTextFocus}
        on:click|stopPropagation
        on:blur={validateAndCommit}
        on:keydown={handleTextKeydown}
        class="w-full min-w-0 border-none bg-transparent text-center text-sm font-medium text-inherit outline-none"
        autocomplete="off"
        spellcheck="false"
      />
    {:else}
      <span class="truncate px-1">{localText}</span>
    {/if}
  </button>

  <span class="text-center text-xs font-medium uppercase tracking-wide text-muted">{type}</span>
</div>

<style>
  .picker-inactive {
    color: var(--color-heading);
    background: var(--picker-inactive-bg);
    border-color: var(--picker-inactive-border);
  }
</style>
