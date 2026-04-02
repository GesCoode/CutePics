<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import Footer from "$lib/components/Footer.svelte";
  import Navbar from "$lib/components/Navbar.svelte";

  let { children } = $props();
</script>

<div class="bg-[#E6EBEF]">
  {@render children()}
</div>