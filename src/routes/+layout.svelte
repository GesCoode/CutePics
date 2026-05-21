<script lang="ts">
  import './layout.css';
  import favicon from '$lib/assets/favicon.svg';
  import Footer from '$lib/sections/Footer.svelte';
  import Navbar from '$lib/sections/Navbar.svelte';
  import { initTheme } from '$lib/stores/theme';

  let { children } = $props();

  if (typeof window !== 'undefined') initTheme();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<Navbar />

<div class="flex min-h-screen flex-col">
  <main class="flex-1">
    {@render children()}
  </main>

  <Footer />
</div>
