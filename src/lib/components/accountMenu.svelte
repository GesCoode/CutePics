<script lang="ts">
  import AccountMenuBlock from "$lib/components/accountMenuBlock.svelte";

  // The current active page index
  export let activeIndex: number = 0;
</script>

<div class="max-w-[450px] h-[64px] flex items-end justify-center relative overflow-hidden">
  <div class="flex w-full flex-row items-end translate-y-[5px]">
    <AccountMenuBlock text="Medisch" bgColor="#F00" borderColor="#DF0000" target="/account/medisch" index={0} {activeIndex} />
    <AccountMenuBlock text="Persoon" bgColor="#BDBDBD" borderColor="#2DA6C5" target="/account/persoon" index={1} {activeIndex} />
    <AccountMenuBlock text="Betaling" bgColor="#45B652" borderColor="#3EA44A" target="/account/betaling" index={2} {activeIndex} />
    <AccountMenuBlock text="Account" bgColor="#D4C92D" borderColor="#C3B92C" target="/account/wachtwoord" index={3} {activeIndex} />
    <AccountMenuBlock text="SOScodes" bgColor="#181818" borderColor="#242424" target="/account/soscodes" index={4} {activeIndex} />
  </div>

  <!-- Gray line at the bottom -->
  <div class="absolute bottom-0 left-0 w-full h-px bg-gray-300"></div>
</div>