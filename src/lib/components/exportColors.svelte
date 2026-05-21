<script lang="ts">
  import type { PaletteCard } from '$lib/utils/mapPaletteToCards';
  import {
    copyToClipboard,
    downloadPalette,
    formatPaletteExport,
    getExportFilename,
    type ExportFormat,
  } from '$lib/utils/exportPalette';

  interface Props {
    class?: string;
    palette?: PaletteCard[];
    harmonyType?: string;
    baseColor?: string;
  }

  let {
    class: className = '',
    palette = [],
    harmonyType = 'Tonal',
    baseColor = '#000000',
  }: Props = $props();

  const formats: { id: ExportFormat; label: string; hint: string }[] = [
    { id: 'css', label: 'CSS', hint: 'Custom properties' },
    { id: 'hex', label: 'HEX', hint: 'Plain color list' },
    { id: 'rgb', label: 'RGB', hint: 'rgb() values' },
    { id: 'json', label: 'JSON', hint: 'Structured object' },
    { id: 'figma', label: 'Figma', hint: 'Design tokens' },
  ];

  const meta = $derived({ harmonyType, baseColor });

  let copiedId: ExportFormat | null = $state(null);
  let downloadedId: ExportFormat | null = $state(null);
  let errorId: ExportFormat | null = $state(null);
  let feedbackTimeout: ReturnType<typeof setTimeout> | undefined;

  function clearFeedback() {
    clearTimeout(feedbackTimeout);
    copiedId = null;
    downloadedId = null;
    errorId = null;
  }

  function showFeedback(kind: 'copy' | 'download' | 'error', id: ExportFormat) {
    clearFeedback();
    if (kind === 'copy') copiedId = id;
    else if (kind === 'download') downloadedId = id;
    else errorId = id;

    feedbackTimeout = setTimeout(clearFeedback, kind === 'error' ? 2500 : 2000);
  }

  async function handleCopy(id: ExportFormat) {
    if (!palette.length) return;

    const text = formatPaletteExport(id, palette, meta);
    const ok = await copyToClipboard(text);
    showFeedback(ok ? 'copy' : 'error', id);
  }

  function handleDownload(id: ExportFormat, event: MouseEvent) {
    event.stopPropagation();
    if (!palette.length) return;

    const ok = downloadPalette(id, palette, meta);
    showFeedback(ok ? 'download' : 'error', id);
  }

  function hintText(format: (typeof formats)[number]): string {
    if (errorId === format.id) return 'Something went wrong — try again';
    if (copiedId === format.id) return 'Copied to clipboard!';
    if (downloadedId === format.id) {
      return `Downloaded ${getExportFilename(format.id, meta)}`;
    }
    return format.hint;
  }
</script>

<div class="glass-panel export-panel flex w-full min-w-0 flex-col {className}">
  <header class="export-header">
    <p class="section-label">Export</p>
    <p class="export-subtitle">
      {#if palette.length}
        Copy or download all {palette.length} colors at once.
      {:else}
        Generate a palette first to export.
      {/if}
    </p>
  </header>

  <ul class="export-list" role="list">
    {#each formats as format (format.id)}
      <li class="export-row">
        <button
          type="button"
          class="export-option"
          class:export-option--active={copiedId === format.id}
          class:export-option--success={downloadedId === format.id}
          class:export-option--error={errorId === format.id}
          disabled={!palette.length}
          onclick={() => handleCopy(format.id)}
        >
          <span class="export-option__badge" aria-hidden="true">
            {format.label.slice(0, 1)}
          </span>

          <span class="export-option__text">
            <span class="export-option__label">{format.label}</span>
            <span class="export-option__hint">{hintText(format)}</span>
          </span>

          <span class="export-option__copy-icon" aria-hidden="true">
            {#if copiedId === format.id}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12.5L9.5 17L19 7"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            {:else}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect
                  x="9"
                  y="9"
                  width="11"
                  height="11"
                  rx="1.5"
                  stroke="currentColor"
                  stroke-width="1.75"
                />
                <path
                  d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1"
                  stroke="currentColor"
                  stroke-width="1.75"
                  stroke-linecap="round"
                />
              </svg>
            {/if}
          </span>
        </button>

        <button
          type="button"
          class="export-download"
          disabled={!palette.length}
          title="Download {getExportFilename(format.id, meta)}"
          aria-label="Download {format.label} palette as {getExportFilename(format.id, meta)}"
          onclick={(e) => handleDownload(format.id, e)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 3v10m0 0l3.5-3.5M12 13l-3.5-3.5M5 17h14"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </li>
    {/each}
  </ul>

  <p class="export-footer">
    {#if palette.length}
      Tap a row to copy · use the arrow to download (.css, .json, or .txt)
    {:else}
      Adjust your base color and harmony type to export.
    {/if}
  </p>
</div>

<style>
  .export-panel {
    padding: 1rem 1rem 1.125rem;
  }

  @media (min-width: 640px) {
    .export-panel {
      padding: 1.25rem;
    }
  }

  .export-header {
    margin-bottom: 1rem;
  }

  .export-subtitle {
    margin-top: 0.35rem;
    font-size: 0.8125rem;
    line-height: 1.4;
    color: var(--color-muted);
  }

  .export-list {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .export-row {
    display: flex;
    align-items: stretch;
    gap: 0.375rem;
  }

  .export-option {
    display: flex;
    min-width: 0;
    flex: 1;
    align-items: center;
    gap: 0.75rem;
    padding: 0.625rem 0.75rem;
    border: 1px solid var(--export-option-border);
    border-radius: 0.75rem;
    background: var(--export-option-bg);
    text-align: left;
    cursor: pointer;
    transition:
      background 150ms ease,
      border-color 150ms ease,
      transform 150ms ease,
      box-shadow 150ms ease;
  }

  .export-download {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    border: 1px solid var(--export-option-border);
    border-radius: 0.75rem;
    background: var(--export-option-bg);
    color: var(--color-accent);
    cursor: pointer;
    transition:
      background 150ms ease,
      border-color 150ms ease,
      color 150ms ease,
      transform 150ms ease;
  }

  .export-option:disabled,
  .export-download:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    transform: none;
  }

  .export-option:not(:disabled):hover,
  .export-download:not(:disabled):hover {
    background: var(--export-option-hover-bg);
    border-color: var(--export-option-hover-border);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    transform: translateY(-1px);
  }

  .export-option:not(:disabled):active,
  .export-download:not(:disabled):active {
    transform: translateY(0);
  }

  .export-option--active,
  .export-option--success {
    background: var(--export-option-active-bg);
    border-color: var(--export-option-active-border);
  }

  .export-option--error {
    border-color: var(--color-accent-red);
  }

  .export-option__badge {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 0.5rem;
    background: var(--export-badge-gradient);
    color: var(--export-badge-text);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  .export-option__text {
    display: flex;
    min-width: 0;
    flex: 1;
    flex-direction: column;
    gap: 0.1rem;
  }

  .export-option__label {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--color-heading);
    line-height: 1.2;
  }

  .export-option__hint {
    font-size: 0.75rem;
    color: var(--color-muted);
    line-height: 1.25;
    word-break: break-word;
  }

  .export-option--active .export-option__hint,
  .export-option--success .export-option__hint {
    color: var(--color-green);
  }

  .export-option--error .export-option__hint {
    color: var(--color-accent-red);
  }

  .export-option__copy-icon {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    color: var(--color-accent);
    opacity: 0.85;
  }

  .export-option--active .export-option__copy-icon,
  .export-option--success .export-option__copy-icon {
    color: var(--color-green);
  }

  .export-footer {
    margin-top: 0.875rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--export-divider);
    text-align: center;
    font-size: 0.75rem;
    color: var(--color-muted);
  }
</style>
