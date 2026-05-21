<script lang="ts">
  import SelectionElement from '$lib/components/selectionElement.svelte';

  export let selectedOption = 'Complementary';

  const options = [
    'Monochromatic',
    'Analogous',
    'Complementary',
    'Split-Complementary',
    'Triadic',
    'Tonal',
    'Semantic',
  ];
</script>

<div class="glass-panel flex w-full min-w-0 flex-col p-4 sm:p-5">
  <p class="section-label mb-3 sm:mb-4">Palette type</p>

  <div class="flex flex-col gap-1">
    {#each options as option}
      <SelectionElement
        text={option}
        isSelected={selectedOption === option}
        on:select={() => (selectedOption = option)}
      />
    {/each}
  </div>
</div>
