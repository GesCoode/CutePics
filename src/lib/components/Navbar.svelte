<script lang="ts">
  import logo from "$lib/assets/logo.png";

  function signIn() {
    console.log("Navbar sign in button pressed");
  }
</script>

<div
  id="wrapper"
  class="flex flex-row py-4 justify-between items-center px-4 bg-primary overflow-visible h-20"
>
  <div id="left">
    <!-- CONTENT TO COME -->
  </div>

  <a href="/" class="mt-12 justify-self-center self-center">
    <img src={logo} alt="logo" class="h-25" />
  </a>

  <div id="button">
    <button
      class="bg-accent text-primary font-sans px-6 py-2 font-light rounded"
      onclick={signIn}
      >Inloggen
    </button>
  </div>
</div>
