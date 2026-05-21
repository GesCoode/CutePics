<script lang="ts">
  import ExportColors from '$lib/components/exportColors.svelte';
  import Main from '$lib/components/main.svelte';
  import Preview from '$lib/components/preview.svelte';
  import PaletteWcagBadge from '$lib/components/paletteWcagBadge.svelte';
  import ThemeCard from '$lib/components/themeCard.svelte';
  import Selection from '$lib/components/selection.svelte';

  import { buildPalette } from '$lib/utils/palette';
  import { mapPaletteToCards } from '$lib/utils/mapPaletteToCards';
  import { buildPreviewTheme } from '$lib/utils/previewTheme';

  let selectedOption = 'Tonal';
  let hexValue = '#F0F0F0';

  let lockedMap: Record<string, string> = {};
  let previousOption = selectedOption;

  $: if (selectedOption !== previousOption) {
    lockedMap = {};
    previousOption = selectedOption;
  }

  $: paletteColors = buildPalette(hexValue, selectedOption);

  $: themePalette = mapPaletteToCards(paletteColors, selectedOption).map((card) => {
    return {
      ...card,
      color: lockedMap[card.id] ?? card.color,
    };
  });

  $: previewTheme = buildPreviewTheme(themePalette, hexValue);
</script>

<div class="page-shell">
  <div
    class="fixed inset-0 bg-[url('/src/lib/assets/background.svg')] bg-cover bg-[position:center_0%]"
  ></div>
  <div
    class="page-bg-dark fixed inset-0 bg-[url('/src/lib/assets/backgroundDark.svg')] bg-cover bg-[position:center_0%]"
    aria-hidden="true"
  ></div>
  <div
    class="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:gap-10 lg:px-10 lg:py-10 xl:px-12"
  >
    <section class="flex flex-col gap-4">
      <header class="section-heading">
        <span class="section-heading__index" aria-hidden="true">1</span>
        <div class="section-heading__content">
          <h2 class="section-heading__title">Choose your base color</h2>
          <p class="section-desc">
            Use the color wheel, enter a HEX/RGB/HSL value, or pick from your recent colors.
          </p>
        </div>
      </header>

      <div class="grid grid-cols-1 items-start gap-6 xl:grid-cols-2 xl:gap-10">
        <Main bind:hexValue bind:selectedOption />
        <div class="w-full min-w-0">
          <Preview theme={previewTheme} />
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <header class="section-heading">
        <span class="section-heading__index" aria-hidden="true">2</span>
        <div class="section-heading__content">
          <h2 class="section-heading__title">Build your palette</h2>
          <p class="section-desc">
            Select a harmony type, lock colors you like, and click a swatch to copy its code.
          </p>
        </div>
      </header>

      <div class="flex flex-col gap-6">
        <div class="glass-panel palette-panel relative min-w-0 overflow-visible p-4 pb-14 sm:p-5 sm:pb-16">
          <div class="palette-grid">
            {#each themePalette as colorItem (colorItem.id)}
              <div class="palette-grid__item">
                <ThemeCard
                  item={colorItem}
                  locked={!!lockedMap[colorItem.id]}
                  onToggleLock={(id) => {
                    if (lockedMap[id]) {
                      const { [id]: _, ...rest } = lockedMap;
                      lockedMap = rest;
                    } else {
                      lockedMap = {
                        ...lockedMap,
                        [id]: colorItem.color,
                      };
                    }
                  }}
                />
              </div>
            {/each}
          </div>
          <PaletteWcagBadge palette={themePalette} />
        </div>

        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
          <Selection bind:selectedOption />
          <ExportColors palette={themePalette} harmonyType={selectedOption} baseColor={hexValue} />
        </div>
      </div>
    </section>
  </div>
</div>
