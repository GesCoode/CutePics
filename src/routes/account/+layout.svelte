<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import Footer from "$lib/components/Footer.svelte";
  import Navbar from "$lib/components/Navbar.svelte";

  let { children } = $props();
</script>

<div
  id="wrapper"
  class="flex flex-row py-4 justify-between items-center px-4 bg-primary z-10"
>
  <div id="left">
    <!-- CONTENT TO COME -->
     <a class="px-2" href="/account/wachtwoord">wachtwoord</a>
     <a class="px-2" href="/account/betaling">betaling</a>
     <a class="px-2" href="/account/medisch">medisch</a>
     <a class="px-2" href="/account/persoon">persoon</a>
     <a class="px-2" href="/account/soscodes">codes</a>
  </div>

  <div id="button">
  </div>
</div>

<div class="bg-[#E6EBEF]">
  {@render children()}
</div>