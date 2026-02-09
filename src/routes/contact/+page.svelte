<script lang="ts">
  import background from "$lib/assets/background.png";
  import FieldBuilder from "$lib/components/FieldBuilder/FieldBuilder.svelte";
  import Button from "$lib/components/FieldBuilder/Button.svelte";
  import InputField from "$lib/components/FieldBuilder/InputField.svelte";

  let code = "";

  function handle2fa() {
    console.log(`Handle 2FA: ${code}`);
  }

  function cancel() {
    console.log("Cancel");
  }
</script>

<div
  id="wrapper"
  class="flex flex-col gap-4 justify-center h-dvh px-4 md:px-8 xl:px-16"
>
  <h1 class="text-4xl">Contact</h1>

  <div id="fieldWrapper" class="w-full">
    <FieldBuilder title="">
      <div class="flex flex-col md:flex-row justify-between">
        <p class="font-bold">Persoonlijke informatie</p>
        <p class="text-light text-sm">*verplichte velden</p>
      </div>

      <div class="flex flex-col gap-2 md:flex-row md:gap-1">
        <div class="flex flex-col w-full">
          <InputField label="" bind:value={code} placeholder="Voornaam*"
          ></InputField>

          <InputField label="" bind:value={code} placeholder="Achternaam*"
          ></InputField>
        </div>

        <div class="flex flex-col w-full">
          <InputField label="" bind:value={code} placeholder="Telefoonnummer"
          ></InputField>

          <InputField label="" bind:value={code} placeholder="Email adres*"
          ></InputField>
        </div>
      </div>

      <div class="w-full">
        <InputField label="" bind:value={code} placeholder="Bericht"
        ></InputField>
      </div>

      <div class="font-bold">
        <Button content="Verzenden" onClick={cancel}></Button>
      </div>
    </FieldBuilder>
  </div>
</div>
