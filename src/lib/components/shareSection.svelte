<script lang="ts">
  import { browser } from '$app/environment';
  import { copyToClipboard } from '$lib/utils/exportPalette';
  import { canNativeShare, getSiteShareUrl, shareNative } from '$lib/utils/share';

  const shareTitle = 'HuePrint';
  const shareText =
    'Build beautiful color palettes with HuePrint — pick a base color, explore harmonies, and export for your projects.';

  let shareUrl = $state('');
  let shared = $state(false);
  let feedbackTimeout: ReturnType<typeof setTimeout> | undefined;

  $effect(() => {
    if (browser) shareUrl = getSiteShareUrl();
  });

  async function handleShare() {
    if (!shareUrl) return;

    if (canNativeShare()) {
      const ok = await shareNative(shareUrl, shareTitle, shareText);
      if (ok) showDone();
      return;
    }

    const ok = await copyToClipboard(shareUrl);
    if (ok) showDone();
  }

  function showDone() {
    shared = true;
    clearTimeout(feedbackTimeout);
    feedbackTimeout = setTimeout(() => (shared = false), 2000);
  }
</script>

<button
  type="button"
  class="nav-share"
  class:nav-share--done={shared}
  disabled={!shareUrl}
  title={shared ? 'Link copied!' : 'Share HuePrint'}
  aria-label={shared ? 'Link copied' : 'Share HuePrint'}
  onclick={handleShare}
>
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="18" cy="5" r="2.5" stroke="currentColor" stroke-width="1.75" />
    <circle cx="6" cy="12" r="2.5" stroke="currentColor" stroke-width="1.75" />
    <circle cx="18" cy="19" r="2.5" stroke="currentColor" stroke-width="1.75" />
    <path
      d="M8.25 11.25L15.5 6.75M8.25 12.75L15.5 17.25"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
    />
  </svg>
  <span class="hidden sm:inline">{shared ? 'Copied!' : 'Share'}</span>
</button>

<style>
  .nav-share {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.375rem 0.75rem;
    border: 1px solid var(--chip-border);
    border-radius: 9999px;
    background: var(--chip-bg);
    font-family: var(--font-sans);
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-heading);
    cursor: pointer;
    transition:
      border-color 0.2s,
      color 0.2s;
  }

  .nav-share:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .nav-share:not(:disabled):hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  .nav-share--done {
    border-color: var(--export-option-active-border);
    color: var(--color-accent);
  }
</style>
