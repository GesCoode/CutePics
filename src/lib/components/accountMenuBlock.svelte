<script lang="ts">
  import { goto } from '$app/navigation';

  export let text: string = "Default";
  export let bgColor: string = "#F00";
  export let borderColor: string = "#DF0000";
  export let target: string = "/";
  export let index: number = 0;
  export let activeIndex: number = 0; // parent tells us which one is active

  const collapsedHeight = 37;
  const expandedHeight = 69;

  function handleMouseEnter(e: MouseEvent) {
    // Only animate if NOT active
    if (index === activeIndex) return;
    const delta = expandedHeight - collapsedHeight;
    const block = e.currentTarget as HTMLElement;
    block.style.height = `${expandedHeight}px`;
    const content = block.querySelector('.block-content') as HTMLElement;
    if (content) content.style.transform = `translateY(-${delta}px)`;
  }

  function handleMouseLeave(e: MouseEvent) {
    if (index === activeIndex) return;
    const block = e.currentTarget as HTMLElement;
    block.style.height = `${collapsedHeight}px`;
    const content = block.querySelector('.block-content') as HTMLElement;
    if (content) content.style.transform = 'translateY(0px)';
  }

  function handleClick() {
    goto(target);
  }

  // For active state, set initial height and transform
  $: initialHeight = index === activeIndex ? expandedHeight : collapsedHeight;
  $: initialTransform = index === activeIndex ? `translateY(-${expandedHeight - collapsedHeight}px)` : 'translateY(0px)';
</script>

<div
  class="flex w-[90px] flex-col items-center justify-end rounded-[5px] border overflow-hidden cursor-pointer"
  style="height: {initialHeight}px; background-color: {bgColor}; border-color: {borderColor}; transition: height 0.3s ease"
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
  on:click={handleClick}
>
  <div class="block-content flex flex-col items-center gap-2 transition-transform duration-300" style="transform: {initialTransform}">
    <!-- Dot -->
    <svg xmlns="http://www.w3.org/2000/svg" class="w-[6px] h-[6px] flex-shrink-0 translate-y-[2px]" viewBox="0 0 6 6" fill="none">
    <circle cx="3" cy="3" r="3" fill="#B1BCC5"/>
    <mask id="mask0_839_559" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="6" height="6">
        <circle cx="3" cy="3" r="3" fill="#B1BCC5"/>
    </mask>
    <g mask="url(#mask0_839_559)">
        <circle cx="2" cy="4" r="3" fill="#E6EBEF"/>
    </g>
    </svg>

    <!-- Text -->
    <div class="text-white text-center font-heebo text-[14px] font-normal translate-y-[-5px]">
      {text}
    </div>
  </div>
</div>