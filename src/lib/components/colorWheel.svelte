<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { hexToRgb, rgbToHsv, hsvToHex } from '$lib/utils/colorUtils';

  export let hexValue = '#F0F0F0';
  export let onCommit: (c: string) => void;
  export let paletteColors: string[] = [];

  let indicator = { x: 0, y: 0 };
  let currentColor = hexValue;

  let wheelEl: HTMLDivElement;
  let radius = 0;

  let isDragging = false;
  let lastColor = hexValue;

  let mounted = false;

  function updateRadius() {
    if (!wheelEl) return;

    requestAnimationFrame(() => {
      radius = wheelEl.clientWidth / 2;
      updateIndicator(hexValue);
    });
  }

  function updateIndicator(hex: string) {
    if (!radius) return;

    currentColor = hex;

    const { r, g, b } = hexToRgb(hex);
    const { h, s } = rgbToHsv(r, g, b);

    const rad = (h * Math.PI) / 180;
    const dist = s * radius;

    indicator = {
      x: radius + Math.cos(rad) * dist,
      y: radius - Math.sin(rad) * dist,
    };
  }

  function pickColor(clientX: number, clientY: number) {
    if (!wheelEl) return;

    const rect = wheelEl.getBoundingClientRect();
    const r = rect.width / 2;

    const x = clientX - rect.left - r;
    const y = clientY - rect.top - r;

    const dist = Math.sqrt(x * x + y * y);

    if (dist > r) return;

    let angle = Math.atan2(-y, x) * (180 / Math.PI);
    if (angle < 0) angle += 360;

    const hex = hsvToHex(angle, dist / r, 0.95);

    hexValue = hex;
    lastColor = hex;

    updateIndicator(hex);
  }

  function handleMouseDown(e: MouseEvent) {
    isDragging = true;
    pickColor(e.clientX, e.clientY);
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isDragging) return;
    pickColor(e.clientX, e.clientY);
  }

  function handleMouseUp() {
    if (!isDragging) return;
    isDragging = false;
    onCommit(lastColor);
  }

  function onResize() {
    if (!browser) return;
    updateRadius();
  }

  onMount(() => {
    mounted = true;

    updateRadius();

    if (!browser) return;

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  });

  onDestroy(() => {
    if (!browser) return;

    window.removeEventListener('resize', onResize);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  });

  $: if (mounted && radius > 0) {
    updateIndicator(hexValue);
  }
</script>

<div
  bind:this={wheelEl}
  class="color-wheel relative h-full w-full shrink-0 cursor-crosshair"
  role="application"
  aria-label="Color wheel"
  on:mousedown={handleMouseDown}
>
  <!-- COLOR WHEEL -->
  <div
    class="h-full w-full cursor-crosshair rounded-full shadow-inner ring-1 ring-heading/10"
    style="
      background: conic-gradient(from 90deg, red, magenta, blue, aqua, lime, yellow, red);
      -webkit-mask-image: radial-gradient(circle, transparent 0%, black 1%);
      mask-image: radial-gradient(circle, transparent 0%, black 0%);
    "
  ></div>

  <!-- PALETTE MARKERS -->
  {#each paletteColors as color}
    {@const { r, g, b } = hexToRgb(color)}
    {@const { h } = rgbToHsv(r, g, b)}
    {@const rad = (h * Math.PI) / 180}
    {@const rDist = radius * 0.9}

    <div
      class="absolute w-[32px] h-[32px] rounded-full border border-white border-[4px]"
      style="
        left: {radius + Math.cos(rad) * rDist}px;
        top: {radius - Math.sin(rad) * rDist}px;
        transform: translate(-50%, -50%);
        background: {color};
      "
    ></div>
  {/each}

  <!-- INDICATOR -->
  <div
    class="absolute w-[54px] h-[54px] rounded-full border-4 border-white pointer-events-none"
    style="
      left: {indicator.x}px;
      top: {indicator.y}px;
      transform: translate(-50%, -50%);
      background: {currentColor};
      box-shadow: 0 0 10px rgba(0,0,0,0.3);
    "
  ></div>
</div>
