<script lang="ts">
  type Props = {
    content: string;
    onClick?: () => void;
    primary?: boolean;
  };

  let { content, onClick, primary = true }: Props = $props();

  // svelte-ignore state_referenced_locally
  const buttonClasses = primary
    ? "bg-accent text-base text-primary"
    : "bg-primary outline-2 outline-accent -outline-offset-[2px] font-bold text-accent";
</script>

<button
  type="button"
  onclick={onClick}
  class={`rounded px-6 py-2 inline-flex justify-center items-center w-full ${buttonClasses}`}
>
  <span class="text-base font-text">
    {content}
  </span>
</button>
