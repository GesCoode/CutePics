<script>
    import LabeledInput from "$lib/components/form/LabeledInput.svelte";
    import SimpleButton from "$lib/components/form/SimpleButton.svelte";
    import CodesBlock from "$lib/components/soscodes/codes.svelte";
</script>

<div class="flex flex-col gap-8 px-4 md:px-8 lg:px-16 pb-4">
<!-- SOSCodes toevoegen -->
<div class="flex flex-col gap-8">

<div class="flex flex-col gap-4">
  <!-- White box shrink-to-content -->
  <div class="flex justify-center">
    <div class="inline-flex bg-[#fff] flex-col gap-3 px-4 py-8 rounded-[5px]">
      <div class="flex flex-row gap-4">
          <LabeledInput
              id="Nieuwe SOScode"
              label="Nieuwe SOScode"
              placeholder="..."
              tooltipText="Type hier uw nieuwe SOScode"
              showTooltip={true}
          />

          <LabeledInput
              id="Omschrijving"
              label="Omschrijving"
              placeholder="..."
              tooltipText=""
              showTooltip={false}
          />
      </div>
      <!-- Verwerken -->
      <div class="flex flex-col items-center">
          <SimpleButton
              text="Verwerk nieuwe SOScode"
              bgColor="#0C3966"
              textColor="#FFF"
          />
      </div>
    </div>
  </div>
</div>

<!-- SOScodes lijst -->
<div class="flex flex-col h-[600px] w-full gap-3">
    <CodesBlock></CodesBlock>
</div>

</div>
</div>