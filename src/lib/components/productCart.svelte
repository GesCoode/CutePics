<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import cross from "$lib/assets/cross.svg";
  import ConfirmModal from "$lib/components/ConfirmModal.svelte";

  const dispatch = createEventDispatcher();

  export let imageSrc: string;
  export let title: string;
  export let description: string;
  export let price: number;
  export let initialQuantity: number = 1;

  let quantity = initialQuantity;
  let showModal = false;

  const increment = () => {
    quantity += 1;
    dispatch("quantityChanged", quantity);
  };

  const decrement = () => {
    if (quantity > 1) {
      quantity -= 1;
      dispatch("quantityChanged", quantity);
    }
  };

  $: totalPrice = Math.round(price * quantity * 100) / 100;

  const confirmRemove = () => showModal = true;
  const handleConfirm = () => { dispatch("remove"); showModal = false; };
  const handleCancel = () => showModal = false;
</script>

<div class="flex items-start flex-col lg:flex-row self-stretch rounded-[4px] bg-[#fff]">
  <!-- Image -->
  <div class="flex justify-center self-center rounded-[2px] min-h-[180px] w-full lg:w-[200px]">
    <img src={imageSrc} class="h-[180px] lg:h-[200px] object-contain" />
  </div>

  <!-- Content -->
  <div class="flex w-full p-4 flex-col items-start h-full justify-between gap-3">
    <div class="flex flex-col items-start self-stretch">
      <div class="flex justify-between items-start self-stretch">
        <p class="text-[var(--paragraph,#292C2F)] font-['Open_Sans'] text-base font-bold tracking-[-0.304px]">
          {title}
        </p>
        <img src={cross} class="cursor-pointer" on:click={confirmRemove} />
      </div>
      <p class="text-[rgba(41,44,47,0.7)] text-sm font-light tracking-[-0.266px]">
        {description}
      </p>
    </div>

    <div class="flex justify-between items-start self-stretch">
      <div class="flex items-center gap-2">
        <p class="text-[var(--paragraph,#292C2F)] text-sm font-normal tracking-[-0.266px]">
          Aantal
        </p>

        <div class="flex items-center self-stretch">
          <div class="flex items-center border border-gray-300 rounded-md overflow-hidden">
            <button
              class="px-2 font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-30"
              on:click={decrement}
              disabled={quantity === 1}
            >−</button>

            <input
              type="number"
              bind:value={quantity}
              min="1"
              class="w-8 text-center text-sm outline-none no-spinner"
              on:input={() => dispatch("quantityChanged", quantity)}
            />

            <button
              class="px-2 py-1 font-bold text-gray-600 hover:bg-gray-100"
              on:click={increment}
            >+</button>
          </div>
        </div>
      </div>

      <p class="text-[var(--paragraph,#292C2F)] text-base font-bold tracking-[-0.304px]">
        {"€ " + totalPrice.toFixed(2)}
      </p>
    </div>
  </div>
</div>

{#if showModal}
  <ConfirmModal
    message={`Weet je zeker dat je "${title}" wilt verwijderen?`}
    onConfirm={handleConfirm}
    onCancel={handleCancel}
  />
{/if}