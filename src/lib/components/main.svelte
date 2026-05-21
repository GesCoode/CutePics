<script lang="ts">
  import ColorPicker from '$lib/components/colorPicker.svelte';
  import ColorWheel from '$lib/components/colorWheel.svelte';
  import { normalizeHex } from '$lib/utils/colorUtils';
  import { buildPalette } from '$lib/utils/palette';

  export let hexValue: string;
  export let selectedOption: string;

  let selected: 'HEX' | 'RGB' | 'HSL' = 'HEX';

  let recentColors: string[] = [];
  let addColorInput: HTMLInputElement;

  function handleColorCommit(newColor: string) {
    const formatted = normalizeHex(newColor);
    recentColors = [formatted, ...recentColors.filter((c) => c !== formatted)].slice(0, 40);
  }

  function applyRecent(color: string) {
    hexValue = normalizeHex(color).toLowerCase();
    handleColorCommit(hexValue);
  }

  function handleAddPickerChange(e: Event) {
    const newColor = (e.target as HTMLInputElement).value;
    applyRecent(newColor);
  }

  $: paletteColors = buildPalette(hexValue, selectedOption);
</script>

<div class="glass-panel min-w-0 p-4 sm:p-5 lg:p-6">
  <div class="color-picker-layout">
    <div class="wheel-slot">
      <ColorWheel bind:hexValue {paletteColors} onCommit={handleColorCommit} />
    </div>

    <div class="controls-column">
      <div class="controls-section">
        <p class="section-label">Target color</p>
        <div class="target-color-inputs">
          <ColorPicker
            type="HEX"
            bind:selected
            bind:value={hexValue}
            onCommit={handleColorCommit}
          />
          <ColorPicker
            type="RGB"
            bind:selected
            bind:value={hexValue}
            onCommit={handleColorCommit}
          />
          <ColorPicker
            type="HSL"
            bind:selected
            bind:value={hexValue}
            onCommit={handleColorCommit}
          />
        </div>
      </div>

      <div class="controls-section">
        <p class="section-label">Recent colors</p>

        <div class="recent-colors-inner">
          <div class="recent-add-row">
            <div class="relative flex shrink-0 items-center">
              <input
                type="color"
                bind:this={addColorInput}
                on:change={handleAddPickerChange}
                class="absolute h-8 w-8 opacity-0"
              />

              <button
                type="button"
                class="swatch-add flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-heading/20 shadow-sm transition hover:scale-105 hover:border-accent active:scale-95"
                on:click={() => addColorInput?.showPicker?.()}
                aria-label="Add color to recents"
              >
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path
                    d="M6 2V10M2 6H10"
                    stroke="currentColor"
                    class="text-accent"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
            </div>

            {#if recentColors.length === 0}
              <span class="shrink-0 text-sm text-muted">pick a color</span>
            {/if}
          </div>

          {#each recentColors as color (color)}
            <button
              type="button"
              class="h-8 w-8 shrink-0 rounded-lg border border-white/60 shadow-sm ring-1 ring-heading/10 transition hover:scale-105 hover:ring-accent/40 active:scale-95"
              style="background: {color}"
              title={color}
              on:click={() => applyRecent(color)}
            ></button>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .color-picker-layout {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;
  }

  @media (min-width: 1024px) {
    .color-picker-layout {
      flex-direction: row;
      align-items: flex-start;
      gap: 2rem;
    }
  }

  .wheel-slot {
    flex: 0 0 auto;
    width: 100%;
    max-width: 360px;
    aspect-ratio: 1;
    align-self: center;
  }

  @media (min-width: 1024px) {
    .wheel-slot {
      align-self: flex-start;
    }
  }

  .controls-column {
    display: flex;
    min-width: 0;
    flex: 1 1 0%;
    flex-direction: column;
    gap: 1.25rem;
    width: 100%;
  }

  .controls-section {
    display: flex;
    width: 100%;
    min-width: 0;
    flex-direction: column;
    gap: 0.75rem;
  }

  .target-color-inputs {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.75rem;
  }

  @media (max-width: 420px) {
    .target-color-inputs {
      grid-template-columns: 1fr;
    }
  }

  .recent-colors-inner {
    display: flex;
    width: 100%;
    min-width: 0;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
  }

  .recent-add-row {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    gap: 0.5rem;
  }

  .swatch-add {
    background: var(--swatch-add-bg);
  }
</style>
