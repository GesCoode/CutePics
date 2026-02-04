<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    title?: string;
    children?: Snippet;
  };

  let { title, children }: Props = $props();
</script>

<div
  id="wrapper"
  class="w-full rounded overflow-hidden border-border border bg-primary"
>
  {#if title}
    <div
      id="title"
      class="text-heading text-lg font-bold font-sans px-4 py-2 bg-bg2 border-b border-border"
    >
      {title}
    </div>
  {/if}

  <div id="children" class="flex flex-col gap-8 px-4 py-6">
    {@render children?.()}
  </div>
</div>
