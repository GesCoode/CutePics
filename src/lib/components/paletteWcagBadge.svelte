<script lang="ts">
  import type { PaletteCard } from '$lib/utils/mapPaletteToCards';
  import {
    evaluatePaletteWcag,
    wcagLevelColor,
    type WcagPaletteReport,
  } from '$lib/utils/wcagPalette';

  export let palette: PaletteCard[] = [];

  let report: WcagPaletteReport = evaluatePaletteWcag(palette);
  let expanded = false;

  $: report = evaluatePaletteWcag(palette);
  $: accentColor = wcagLevelColor(report.level);
</script>

<div class="palette-wcag">
  <div class="palette-wcag__anchor">
    <button
      type="button"
      class="palette-wcag__trigger"
      style:--wcag-accent={accentColor}
      aria-expanded={expanded}
      aria-label="WCAG contrast rating: {report.level}. Minimum ratio {report.minRatio} to 1. Click for details."
      on:click={() => (expanded = !expanded)}
    >
      <span class="palette-wcag__label">WCAG</span>
      <span class="palette-wcag__level">{report.level}</span>
      <span class="palette-wcag__ratio">{report.minRatio}:1</span>
    </button>

    {#if expanded}
      <div class="palette-wcag__panel" role="region" aria-label="WCAG contrast details">
        <p class="palette-wcag__summary">
          Based on text/background pairs from your palette. Normal text needs <strong>4.5:1</strong> (AA) or
          <strong>7:1</strong> (AAA).
        </p>
        <ul class="palette-wcag__list">
          {#each report.pairs as pair (`${pair.label}-${pair.fg}-${pair.bg}`)}
            <li class:pass-aa={pair.ratio >= 4.5} class:pass-aaa={pair.ratio >= 7}>
              <span class="palette-wcag__pair-label">{pair.label}</span>
              <span class="palette-wcag__pair-ratio">{pair.ratio}:1</span>
              <span class="palette-wcag__swatches" aria-hidden="true">
                <span style:background={pair.fg} title="Foreground"></span>
                <span style:background={pair.bg} title="Background"></span>
              </span>
            </li>
          {/each}
        </ul>
        <p class="palette-wcag__worst">
          Weakest: {report.worstPair.label} ({report.worstPair.ratio}:1)
        </p>
      </div>
    {/if}
  </div>
</div>

<style>
  .palette-wcag {
    display: flex;
    justify-content: flex-end;
    margin-top: 0.75rem;
    width: 100%;
  }

  @media (min-width: 640px) {
    .palette-wcag {
      position: absolute;
      right: 0.75rem;
      bottom: 0.75rem;
      z-index: 2;
      margin-top: 0;
      width: auto;
    }
  }

  .palette-wcag__anchor {
    position: relative;
  }

  .palette-wcag__trigger {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: flex-end;
    gap: 0.35rem 0.5rem;
    padding: 0.4rem 0.65rem;
    border-radius: 9999px;
    border: 1px solid var(--color-border);
    background: var(--color-panel);
    backdrop-filter: blur(12px);
    box-shadow: var(--shadow-panel);
    font-family: var(--font-sans);
    font-size: 0.75rem;
    color: var(--color-heading);
    cursor: pointer;
    transition:
      border-color 0.2s,
      box-shadow 0.2s;
  }

  .palette-wcag__trigger:hover {
    border-color: var(--wcag-accent);
    box-shadow: 0 0 0 1px var(--wcag-accent);
  }

  .palette-wcag__label {
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--color-muted);
  }

  .palette-wcag__level {
    font-weight: 700;
    color: var(--wcag-accent);
  }

  .palette-wcag__ratio {
    font-variant-numeric: tabular-nums;
    color: var(--color-paragraph);
  }

  .palette-wcag__panel {
    position: absolute;
    right: 0;
    bottom: calc(100% + 0.5rem);
    z-index: 10;
    width: min(20rem, calc(100vw - 2.5rem));
    max-height: min(60vh, 26rem);
    overflow: auto;
    padding: 0.75rem;
    border-radius: 0.75rem;
    border: 1px solid var(--color-border);
    background: var(--color-panel);
    backdrop-filter: blur(12px);
    box-shadow: var(--shadow-panel);
    font-size: 0.75rem;
    color: var(--color-paragraph);
  }

  @media (min-width: 640px) {
    .palette-wcag__panel {
      width: 20rem;
    }
  }

  .palette-wcag__summary {
    margin: 0 0 0.5rem;
    line-height: 1.45;
  }

  .palette-wcag__list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .palette-wcag__list li {
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 0.35rem 0.5rem;
    align-items: center;
    padding: 0.35rem 0;
    border-bottom: 1px solid var(--color-border);
  }

  .palette-wcag__list li:last-child {
    border-bottom: none;
  }

  .palette-wcag__pair-label {
    min-width: 0;
    line-height: 1.3;
  }

  .palette-wcag__pair-ratio {
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    color: var(--color-heading);
  }

  .pass-aa .palette-wcag__pair-ratio {
    color: var(--wcag-aa);
  }

  .pass-aaa .palette-wcag__pair-ratio {
    color: var(--wcag-aaa);
  }

  .palette-wcag__swatches {
    display: flex;
    gap: 2px;
  }

  .palette-wcag__swatches span {
    width: 0.875rem;
    height: 0.875rem;
    border-radius: 3px;
    border: 1px solid rgba(0, 0, 0, 0.15);
  }

  .palette-wcag__worst {
    margin: 0.5rem 0 0;
    font-size: 0.6875rem;
    color: var(--color-muted);
  }
</style>
