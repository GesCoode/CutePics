<script lang="ts">
  import { goto } from "$app/navigation";

  export let image: string;
  export let title: string = "";
  export let description: string = "";
  export let imgHeight: number = 519;
  export let scale: number = 1;
  export let href: string = "/";
  export let alignRight: boolean = false;
</script>

<div 
  class="group relative w-full bg-[#CCE0F5] overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.03] hover:-translate-y-2"
  style={`height: ${imgHeight}px;`}
  on:click={() => goto(href)}
>

  <!-- IMAGE LAYER -->
  <div class="absolute inset-0 overflow-hidden">
    <img 
      src={image} 
      alt={title}
      class={`absolute top-0 transition-transform duration-500 ease-out group-hover:-translate-y-6 ${
        alignRight 
          ? "right-0" 
          : "left-1/2 -translate-x-1/2"
      }`}
      style={`transform: scale(${scale}); transform-origin: ${
        alignRight ? "top right" : "top"
      };`}
    />
  </div>

  <!-- TEXT LAYER -->
  <div class="absolute bottom-0 left-0 w-full p-4 flex flex-col bg-gradient-to-t from-black/20 to-transparent">
    <div class="text-[#212529] font-['Open_Sans'] text-[22px] font-semibold">
      {title}
    </div>
    <div class="text-[#292C2F] font-['Open_Sans'] text-[16px] font-light leading-[150%] tracking-[-0.304px]">
      {description}
    </div>
  </div>

</div>