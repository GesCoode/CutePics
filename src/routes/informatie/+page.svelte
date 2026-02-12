<script lang="ts">
  import FieldBuilder from "$lib/components/FieldBuilder/FieldBuilder.svelte";
  import Button from "$lib/components/FieldBuilder/Button.svelte";
  import InputField from "$lib/components/FieldBuilder/InputField.svelte";

  let first_name = "";
  let last_name = "";
  let phone = "";
  let email = "";

  let postcode = "";
  let huisnummer = "";
  let toevoeging = "";
  let straat = "";
  let stad = "";

  const CART_STUB = {
    subtotaal: 1895, // SUM in uiteindelijke cart
    discounts: [
      { name: "15% Off korting", value: "-2.84" }, // IDK hoe dit in DirectUs staat om te combineren
      { name: "20% Off korting", value: "-1.15" }, // IDK hoe dit in DirectUs staat om te combineren
    ],
  };

  function handlePayment() {
    console.log(`Handle information: `);
  }
</script>

<div
  id="wrapper"
  class="flex flex-col justify-center py-16 gap-2 px-4 md:px-8 xl:px-16 xl:gap-4"
>
  <h1 class="text-heading font-sans font-medium text-4xl">Bestellen</h1>

  <div class="flex flex-col md:flex-row justify-between gap-16">
    <div id="fieldWrapper" class="w-full md:max-w-100 lg:max-w-none">
      <FieldBuilder title="">
        <div class="flex flex-col gap-3">
          <div class="flex flex-col">
            <p class="font-bold">Persoonlijke Informatie</p>
            <p class="text-sm text-[#66686A]">*Verplichte velden</p>
          </div>

          <div class="flex flex-col gap-3 lg:gap-1 lg:flex-row">
            <div class="flex flex-col w-full">
              <InputField
                label=""
                bind:value={first_name}
                placeholder="Voornaam*"
              />
              <InputField
                label=""
                bind:value={last_name}
                placeholder="Achternaam*"
              />
            </div>

            <div class="flex flex-col w-full">
              <InputField
                label=""
                bind:value={phone}
                placeholder="Telefoonnummer*"
              />
              <InputField
                label=""
                bind:value={email}
                placeholder="Email adres*"
              />
            </div>
          </div>

          <p class="text-sm text-[#66686A] font-light leading-normal">
            Alleen bij vragen over de levering zullen wij contact met u opnemen.
          </p>
        </div>

        <div class="flex flex-col gap-3">
          <div class="flex flex-col">
            <p class="font-bold">Bezorgadres</p>
            <p class="text-sm text-[#66686A]">*Verplichte velden</p>
          </div>

          <div class="flex flex-col gap-1 xl:flex-row">
            <div class="flex flex-col w-full">
              <InputField
                label=""
                bind:value={postcode}
                placeholder="Postcode*"
              />
              <div class="flex gap-1">
                <InputField
                  label=""
                  bind:value={huisnummer}
                  placeholder="Huisnummer*"
                />
                <InputField
                  label=""
                  bind:value={toevoeging}
                  placeholder="Toevoeging"
                />
              </div>
            </div>

            <div class="flex flex-col w-full">
              <InputField label="" bind:value={straat} placeholder="Straat*" />
              <InputField label="" bind:value={stad} placeholder="Stad*" />
            </div>
          </div>
        </div>

        <div class="font-bold">
          <Button content="Controleer en betaal" onClick={handlePayment}
          ></Button>
        </div>
      </FieldBuilder>
    </div>

    <div
      id="subtotalWrapper"
      class="p-4 flex flex-col gap-4 h-fit border-border min-w-100 border rounded bg-primary"
    >
      <div id="subtotal" class="flex flex-col gap-2">
        <div class="flex justify-between">
          <p class="font-bold">Subtotaal</p>
          <p class="font-bold">€ {CART_STUB.subtotaal / 100}</p>
        </div>

        <div class="flex flex-col gap-2">
          {#each CART_STUB.discounts as item, i (item)}
            <div class="flex flex-col">
              <div class="flex justify-between">
                <p class="font-light text-base">{item.name}</p>
                <p class="font-bold text-green">{item.value}</p>
              </div>

              <p
                class="font-light text-sm font-[#66686A] underline"
                onclick={() => console.log("Verwijderen")}
              >
                verwijderen
              </p>
            </div>
          {/each}
        </div>
      </div>

      <div id="bezorgen" class="flex flex-col">
        <div class="flex justify-between">
          <p class="font-bold">Bezorgen</p>
          <p class="font-bold text-green">GRATIS</p>
        </div>
        <p class="text-green text-sm font-light">Binnen 4 dagen in huis!</p>
      </div>

      <hr class="border-[#ABAEB1]" />

      <div id="totaal" class="flex flex-col">
        <div class="flex justify-between">
          <p class="font-bold">
            Totaal <span class="font-light text-sm">Incl. BTW</span>
          </p>
          <p class="font-bold">€ {CART_STUB.subtotaal / 100}</p>
        </div>
        <p class="font-light text-[#66686A] text-sm">
          Je bespaart € 21,00 bij deze bestelling
        </p>
      </div>

      <hr class="border-[#ABAEB1]" />

      <p class="font-bold">Heb je een voucher of kortingscode?</p>
      <div class="flex gap-2">
        <InputField label="" placeholder=""></InputField>

        <button class="bg-accent w-fit px-4 rounded text-white font-medium"
          >Toevoegen</button
        >
      </div>
    </div>
  </div>
</div>
