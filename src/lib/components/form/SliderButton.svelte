<script lang="ts">
  export let checked: boolean = false;
  export let onChange: (value: boolean) => void = () => {};
  export let ariaLabel: string = 'Toggle slider';

  // colors
  export let handleColor: string = '#FFFFFF';
  export let trueColor: string = '#3d6b52';
  export let falseColor: string = '#D1D5DB';

  function toggle() {
    checked = !checked;
    onChange(checked);
  }
</script>

<button
  type="button"
  class="flex h-6 w-12 items-center rounded-full p-1 transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
  on:click={toggle}
  aria-pressed={checked}
  aria-label={ariaLabel}
  style="background-color: {checked ? trueColor : falseColor}"
>
  <div
    class="w-4 h-4 rounded-full shadow-md transform transition-all duration-300 ease-in-out"
    style="background-color: {handleColor}"
    class:translate-x-0={!checked}
    class:translate-x-6={checked}
  ></div>
</button>
