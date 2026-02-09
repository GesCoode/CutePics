<script lang="ts">
  import background from "$lib/assets/background.png";

  import Login from "$lib/components/Login.svelte";
</script>

<div
  id="wrapper"
  class="flex justify-center items-center h-dvh px-4 md:px-8 xl:px-16"
>
  <img
    src={background}
    alt=""
    aria-hidden="true"
    class="absolute w-screen h-full object-cover z-1"
  />

  <div class="w-100 z-1">
    <Login></Login>
  </div>
</div>
