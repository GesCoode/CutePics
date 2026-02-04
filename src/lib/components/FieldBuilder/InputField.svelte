<script lang="ts">
  import mail from "$lib/assets/mail.svg";

  type Props = {
    label: string;
    placeholder?: string;
    type?: string;
    icon?: string;
    value?: any;
  };

  let {
    label,
    icon,
    type = "text",
    placeholder = "Type here...",
    value = $bindable(),
  }: Props = $props();

  // svelte-ignore state_referenced_locally
  // can safely be ignored as the type never changes
  const initialType = type;

  // TODO change icon type
  function toggleVisible() {
    type = type == "text" ? "password" : "text";
  }
</script>

<div id="wrapper" class="w-full flex flex-col gap-1">
  <p class="text-base text-heading">{label}</p>

  <div id="inputWrapper" class="flex border-border border rounded">
    {#if icon}
      <div
        class="w-10 h-9 flex items-center justify-center rounded-l border-r border-border bg-[#E9ECEF]"
      >
        <img src={icon} aria-hidden="true" alt="" class="w-6 h-6 select-none" />
      </div>
    {/if}

    <input
      {placeholder}
      {type}
      class="outline-accent w-full px-3 py-1.5 font-light text-paragraph"
      bind:value
    />

    {#if initialType == "password"}
      <button
        class="w-10 h-9 rounded-r flex items-center justify-center border-l border-border bg-[#E9ECEF]"
        onclick={toggleVisible}
      >
        <img src={mail} aria-hidden="true" alt="" class="w-6 h-6 select-none" />
      </button>
    {/if}
  </div>
</div>
