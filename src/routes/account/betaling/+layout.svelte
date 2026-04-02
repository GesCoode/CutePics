<script lang="ts">
  import Breadcrumb from "$lib/components/Breadcrumb.svelte";
  import AccountMenu from "$lib/components/AccountMenu.svelte";

  let { children } = $props();
  let activeMenuIndex = 2;
</script>

<!-- Responsive container -->
<div class="px-4 md:px-8 lg:px-16 pt-12 pb-4 flex flex-col md:flex-row items-center md:items-center md:justify-between">
  <!-- Breadcrumb -->
  <Breadcrumb />

  <!-- Account menu -->
  <div class="mt-4 md:mt-0 w-full md:w-auto flex justify-center md:justify-end">
    <AccountMenu activeIndex={activeMenuIndex} class="w-full md:max-w-[450px]" />
  </div>
</div>

<!-- Page content -->
{@render children()}