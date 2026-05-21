<script lang="ts">
  import logo from '$lib/assets/logo.svg';
  import SliderButton from '$lib/components/form/SliderButton.svelte';
  import ShareSection from '$lib/components/shareSection.svelte';
  import { isDark, setDark } from '$lib/stores/theme';
</script>

<header
  class="sticky top-0 z-50 border-b px-4 py-3 backdrop-blur-md transition-colors duration-300 sm:px-8 lg:px-12"
  style="background: var(--nav-bg); border-color: var(--nav-border)"
>
  <div class="mx-auto flex max-w-[1600px] items-center gap-4">
    <img src={logo} alt="" class="h-10 w-auto" aria-hidden="true" />

    <h1 class="flex-1 font-display text-2xl font-light tracking-tight text-heading sm:text-3xl">
      Hue-Do .com
    </h1>

    <div class="flex items-center gap-2">
      <ShareSection />

      <div
        class="flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-sm transition-colors duration-300"
        style="background: var(--chip-bg); border-color: var(--chip-border)"
      >
        <span class="hidden text-sm text-muted sm:inline">Dark mode</span>
        <span class="text-sm font-medium text-heading sm:hidden">Dark</span>
        <SliderButton
          checked={$isDark}
          onChange={setDark}
          ariaLabel="Toggle dark mode"
          trueColor={$isDark ? '#8fb4e8' : '#6b5d48'}
          falseColor={$isDark ? '#4a5568' : '#b8afa3'}
          handleColor="#ffffff"
        />
      </div>
    </div>
  </div>
</header>
