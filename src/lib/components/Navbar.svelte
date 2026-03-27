<script lang="ts">
  import logo from "$lib/assets/logo.png";
  import { slide } from "svelte/transition";
  import CustomButton from "$lib/components/form/CustomButton.svelte";

  let menuOpen = false;

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  function closeMenu() {
    menuOpen = false;
  }

  function signIn() {
    console.log("Navbar sign in button pressed");
  }
</script>

<!-- NAVBAR -->
<div class="relative z-50 flex flex-row py-4 justify-between items-center px-4 bg-primary overflow-visible h-20">

  <!-- LEFT -->
  <div class="flex items-center gap-4">
    <!-- HAMBURGER -->
    <button class="lg:hidden relative w-6 h-6 z-50" on:click={toggleMenu}>
      <span
        class="absolute left-0 top-1 w-full h-0.5 bg-black transition-all duration-300"
        class:rotate-45={menuOpen}
        class:top-3={menuOpen}
      ></span>

      <span
        class="absolute left-0 top-3 w-full h-0.5 bg-black transition-all duration-300"
        class:opacity-0={menuOpen}
      ></span>

      <span
        class="absolute left-0 top-5 w-full h-0.5 bg-black transition-all duration-300"
        class:-rotate-45={menuOpen}
        class:top-3={menuOpen}
      ></span>
    </button>

    <!-- DESKTOP LINKS -->
    <div id="left" class="hidden lg:flex">
      <a class="px-2" href="/account">account</a>
      <a class="px-2" href="/informatie">informatie</a>
      <a class="px-2" href="/producten">producten</a>
      <a class="px-2" href="/contact">contact</a>
    </div>
  </div>

  <!-- LOGO -->
  <a href="/" class="absolute left-1/2 -translate-x-1/2 mt-12">
    <img src={logo} alt="logo" class="h-25" />
  </a>

  <!-- RIGHT (always visible) -->
  <div id="button">
    <CustomButton
      text="Inloggen"
      rounded={true}
      bgColor="#0C3966"
      textColor="#FFFFFF"
      on:click={signIn}
    />
  </div>

</div>

<!-- OVERLAY -->
{#if menuOpen}
  <div
    class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
    on:click|stopPropagation={closeMenu}
  ></div>
{/if}

<!-- SIDE MENU -->
{#if menuOpen}
  <div
    class="fixed top-0 left-0 h-full w-64 bg-primary z-50 flex flex-col p-6 gap-6 shadow-xl"
    in:slide={{ x: -300, duration: 250 }}
    out:slide={{ x: -300, duration: 200 }}
    on:click|stopPropagation
  >
    <!-- Links -->
    <a href="/account" on:click={closeMenu}>account</a>
    <a href="/informatie" on:click={closeMenu}>informatie</a>
    <a href="/producten" on:click={closeMenu}>producten</a>
    <a href="/contact" on:click={closeMenu}>contact</a>

    <!-- Button -->
        <div class="flex w-auto items-start mt-2">
    <CustomButton
      text="Inloggen"
      rounded={true}
      bgColor="#0C3966"
      textColor="#FFFFFF"
      on:click={() => {
        signIn();
        closeMenu();
      }}
      class="mt-4"
    />
  </div>
  </div>
{/if}