<script lang="ts">
  import type { PreviewTheme } from '$lib/utils/previewTheme';
  import SimpleButton from './form/SimpleButton.svelte';

  export let theme: PreviewTheme;

  const navItems = ['Home', 'Blog', 'Shop', 'Contact'];
</script>

<div class="flex h-full w-full min-w-0 flex-col gap-3">
  <p class="section-label px-1">Live preview</p>

  <div
    class="preview-frame w-full min-w-0 overflow-hidden rounded-2xl ring-1 ring-heading/10"
    style="background: {theme.background}; --accent: {theme.accent}; box-shadow: var(--shadow-card)"
  >
    <div
      class="flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5"
      style="background: {theme.headerBg}; color: {theme.headerText}"
    >
      <p class="text-lg font-bold tracking-wide sm:text-xl">MYWEBSITE</p>

      <nav class="hidden gap-4 sm:flex sm:gap-5" aria-label="Preview navigation">
        {#each navItems as item}
          <button type="button" class="nav-item text-sm font-light">
            {item}
          </button>
        {/each}
      </nav>
    </div>

    <div
      class="flex flex-col gap-4 p-5 sm:gap-5 sm:p-8 md:p-10"
      style="background: {theme.background}"
    >
      <h3 class="text-2xl font-bold sm:text-3xl md:text-4xl" style="color: {theme.title}">Title</h3>

      <h4 class="text-lg font-semibold sm:text-xl md:text-2xl" style="color: {theme.subtitle}">
        Subtitle
      </h4>

      <p class="max-w-prose text-sm leading-relaxed sm:text-base" style="color: {theme.text}">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ligula libero, congue in
        aliquet id, ullamcorper sit amet dolor.
      </p>

      <div class="flex flex-wrap gap-2 pt-1 sm:gap-3">
        <SimpleButton
          text="Sign Up"
          bgColor={theme.buttonPrimary}
          textColor={theme.buttonPrimaryText}
          rounded={true}
        />
        <SimpleButton
          text="Learn More"
          bgColor={theme.buttonSecondary}
          textColor={theme.buttonSecondaryText}
          rounded={true}
        />
      </div>
    </div>
  </div>
</div>

<style>
  .preview-frame {
    min-height: 280px;
  }

  @media (min-width: 1024px) {
    .preview-frame {
      min-height: 320px;
    }
  }

  .nav-item {
    all: unset;
    cursor: pointer;
    user-select: none;
    color: inherit;
    transition: color 120ms ease;
  }

  .nav-item:hover {
    color: var(--accent);
  }

  .nav-item:active {
    opacity: 0.75;
  }
</style>
