<script>
  export let text = "Why is the earth round and not a paralellipipidum?";
  export let content = "Answer goes here...";

  let open = false;

  function toggle() {
    open = !open;
  }
</script>

<div
  class="flex flex-col self-stretch border border-[#DBDBDB] bg-white rounded-[5px] cursor-pointer"
  on:click={toggle}
>
  <div class="flex items-start gap-2 min-h-[48px]">
    <div class="flex justify-end items-start gap-2 flex-[1_0_0] px-3 h-full">
      
      <div class="flex items-center gap-1 flex-[1_0_0] h-full">
        <div class="flex-[1_0_0] text-[#8F8F8F] font-[Heebo] text-[14px] font-normal">
          {text}
        </div>
      </div>

      <div class="flex justify-end items-center gap-1 self-stretch">
        <div class="flex flex-col justify-center w-4 h-[21px] text-[#8F8F8F] text-center font-[Heebo] text-[28px] font-normal capitalize">
          {open ? "−" : "+"}
        </div>
      </div>

    </div>
  </div>

  {#if open}
    <div class="px-3 pb-3 text-[#8F8F8F] font-[Heebo] text-[14px]">
      {content}
    </div>
  {/if}
</div>