<script lang="ts">
  export let item: {
    id: string;
    name: string;
    color: string;
    colorName: string;
    purpose: string;
  };

  export let locked = false;
  export let onToggleLock: (id: string) => void;

  import unlockedIcon from '$lib/assets/unlocked.svg';
  import lockedIcon from '$lib/assets/locked.svg';
  import { pickForeground, pickSecondaryOn, relativeLuminance } from '$lib/utils/colorUtils';

  let showToast = false;
  let toastTimeout: ReturnType<typeof setTimeout>;

  let animateLock = false;

  function triggerLockAnimation() {
    animateLock = false;

    requestAnimationFrame(() => {
      animateLock = true;

      setTimeout(() => {
        animateLock = false;
      }, 420);
    });
  }

  function toggleLock(event: MouseEvent) {
    event.stopPropagation();
    triggerLockAnimation();
    onToggleLock(item.id);
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(item.color.toUpperCase());

      clearTimeout(toastTimeout);
      showToast = true;

      toastTimeout = setTimeout(() => {
        showToast = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  }

  $: textColor = pickForeground(item.color);
  $: secondaryColor = pickSecondaryOn(item.color);
  $: purposeColor = pickSecondaryOn(item.color, 4.5);
  $: onLightSwatch = relativeLuminance(item.color) > 0.179;
  $: secondaryIsDark = relativeLuminance(secondaryColor) < 0.45;
  $: purposeIsDark = relativeLuminance(purposeColor) < 0.45;
</script>

<div class="theme-card group relative h-full">
  {#if showToast}
    <div
      class="absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-heading px-3 py-1 text-xs font-medium text-white shadow-lg"
    >
      Copied!
    </div>
  {/if}

  <div
    role="button"
    tabindex="0"
    on:click={copyToClipboard}
    on:keydown={(e) => e.key === 'Enter' && copyToClipboard()}
    class="theme-card-shell flex h-full min-h-[var(--palette-card-min-height)] w-full cursor-pointer flex-col rounded-2xl p-px transition-all duration-200
      shadow-[var(--shadow-card)]
      hover:-translate-y-1 hover:shadow-[0_12px_28px_-8px_rgba(0,0,0,0.25)]
      active:scale-[0.98]
      {locked ? 'ring-2 ring-heading/30 ring-offset-2 ring-offset-transparent' : ''}"
  >
    <div
      class="flex h-full w-full flex-col gap-2 rounded-[15px] p-4 transition-colors"
      style:background={item.color}
      style:color={textColor}
    >
      <div class="flex items-start gap-2">
        <div class="flex-1 text-sm font-bold uppercase tracking-wide">
          {item.name}
        </div>

        <button
          type="button"
          on:click={toggleLock}
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition hover:bg-black/10"
          aria-label={locked ? 'Unlock color' : 'Lock color'}
        >
          <img
            src={locked ? lockedIcon : unlockedIcon}
            alt=""
            class="h-4 w-4"
            class:lock-animation={animateLock}
            style:filter={onLightSwatch ? 'invert(1)' : 'none'}
          />
        </button>
      </div>

      <div class="font-mono text-lg font-bold tracking-tight sm:text-xl">
        {item.color.toUpperCase()}
      </div>

      <div
        class="theme-card-muted text-xs sm:text-sm"
        class:has-dark-text={secondaryIsDark}
        style:color={secondaryColor}
      >
        {item.colorName}
      </div>

      <p
        class="theme-card-muted theme-card-purpose mt-auto text-xs font-medium leading-snug sm:text-sm"
        class:has-dark-text={purposeIsDark}
        style:color={purposeColor}
      >
        {item.purpose}
      </p>
    </div>
  </div>
</div>

<style>
  .theme-card-shell {
    background: linear-gradient(
      180deg,
      var(--card-border-from, rgba(255, 255, 255, 0.5)),
      var(--card-border-to, rgba(255, 255, 255, 0.2))
    );
  }

  .theme-card-muted {
    text-shadow: none;
  }

  .theme-card-muted.has-dark-text {
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.85);
  }

  .lock-animation {
    animation: lockPop 420ms cubic-bezier(0.34, 1.56, 0.64, 1);
    transform-origin: center;
  }

  @keyframes lockPop {
    0% {
      transform: scale(0.6) rotate(-25deg);
      opacity: 0.6;
    }

    40% {
      transform: scale(1.25) rotate(18deg);
    }

    70% {
      transform: scale(0.95) rotate(-8deg);
    }

    100% {
      transform: scale(1) rotate(0deg);
      opacity: 1;
    }
  }
</style>
