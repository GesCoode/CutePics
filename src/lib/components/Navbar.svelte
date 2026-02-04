<script lang="ts">
  import logo from "$lib/assets/logo.png";

  function signIn() {
    console.log("Navbar sign in button pressed");
  }
</script>

<div
  id="wrapper"
  class="flex flex-row py-4 justify-between items-center px-4 bg-primary"
>
  <div id="left">
    <!-- CONTENT TO COME -->
  </div>

  <img
    src={logo}
    alt="logo"
    class="h-25 absolute left-1/2 -translate-x-1/2 translate-y-1/3"
  />

  <div id="button">
    <button
      class="bg-accent text-primary font-sans px-6 py-2 font-light rounded"
      onclick={signIn}
      >Inloggen
    </button>
  </div>
</div>
