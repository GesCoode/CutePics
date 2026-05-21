<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import selected from '$lib/assets/selected.svg';
  import unselected from '$lib/assets/unselected.svg';

  export let isSelected: boolean = false;
  export let text: string = '';

  const dispatch = createEventDispatcher();

  function handleClick() {
    dispatch('select');
  }
</script>

<button
  type="button"
  class="group flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors
    {isSelected ? 'bg-accent/12' : 'selection-option-idle'}"
  on:click={handleClick}
>
  <img
    src={isSelected ? selected : unselected}
    alt=""
    class="h-5 w-5 shrink-0 transition-transform group-hover:scale-105"
    aria-hidden="true"
  />

  <span
    class="text-[15px] leading-snug transition-colors
      {isSelected ? 'font-medium text-heading' : 'font-light text-paragraph'}"
  >
    {text}
  </span>
</button>

<style>
  .selection-option-idle:hover {
    background: var(--selection-hover);
  }
</style>
