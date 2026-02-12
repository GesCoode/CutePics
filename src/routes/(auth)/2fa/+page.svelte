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
  class="flex justify-center items-center h-dvh px-4 md:px-8 xl:px-16"
>
  <img
    src={background}
    alt=""
    aria-hidden="true"
    class="absolute w-screen h-full object-cover -z-1"
  />

  <div id="fieldWrapper" class="w-88">
    <FieldBuilder title="Twee factor authenticatie">
      <InputField
        label="Voer uw eenmalige wachtwoord in:"
        bind:value={code}
        placeholder="Eenmalig wachtwoord"
      ></InputField>

      <div class="flex flex-col gap-4">
        <Button content="Volgende" onClick={handle2fa}></Button>
        <Button content="Cancel" primary={false} onClick={cancel}></Button>
      </div>
    </FieldBuilder>
  </div>
</div>
