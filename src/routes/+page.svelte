<!-- HOMEPAGE -->

<script lang="ts">
  import background from "$lib/assets/background.png";
  import medical from "$lib/assets/medical.svg";

  import Login from "$lib/components/Login.svelte";
</script>

<div id="wrapper" class="w-full flex flex-col">
  <div
    id="hero"
    class="relative flex flex-col gap-9 px-4 text-center justify-center py-16 bg-linear-to-bl from-black/0 to-black/30 overflow-hidden"
  >
    <div class="absolute w-screen h-full object-cover -m-4">
      <img
        src=#
        alt=""
        aria-hidden="true"
        class="w-screen h-full object-cover"
      />
    </div>

    <h1 class="text-primary text-6xl font-medium font-sans z-1">
      Veiligheid binnen handbereik met SOS tag
    </h1>

    <p class="text-primary z-1">
      Met SOS tag ben je altijd voorbereid op noodsituaties. Scan de QR-code en
      krijg direct toegang tot belangrijke medische informatie
    </p>

    <div id="buttons" class="flex justify-center gap-4 z-1">
      <a
        href="/producten"
        class="rounded px-6 py-2 bg-accent inline-flex justify-center items-center w-auto"
      >
        <span class="text-primary text-lg font-bold font-text leading-7">
          Ontdek
        </span>
      </a>

      <button
        class="rounded px-6 py-2 bg-white/10 backdrop-blur-lg inline-flex justify-center items-center w-auto"
      >
        <span class="text-primary text-lg font-bold font-text leading-7">
          Aanmelden
        </span>
      </button>
    </div>
  </div>

  <div id="sign_in" class="px-4 py-9">
    <Login></Login>
  </div>

  <div id="about" class="px-4 py-16 flex flex-col gap-11">
    <div id="top">
      <!-- -my-2 is to bring the text closer to the heading -->
      <p class="text-accent text-lg font-semibold font-sans -my-2">
        Wat is SOStag
      </p>

      <h2
        class="text-heading text-4xl font-bold font-sans capitalize leading-14"
      >
        Snelle Toegang Tot Uw Medische Informatie
      </h2>

      <p class="">
        Een SOStag is een medisch hulpmiddel dat gedragen wordt als een sieraad.
        Met een SOStag draagt u uw medische gegevens altijd met u mee. Elke
        SOStag bevat een unieke QR-code die een hulpverlener met een smartphone
        kan scannen. Meteen wordt alle belangrijke informatie getoond.
        Belangrijk als elke seconde telt.
      </p>
    </div>

    <div id="highlights" class="flex flex-col gap-4">
      <!-- HIGHLIGHT 1 -->
      <div>
        <div class="flex h-7 items-center gap-2">
          <div>
            <img src={medical} />
          </div>

          <p class="text-heading text-lg font-bold font-sans leading-7">
            Directe toegang
          </p>
        </div>

        <p class="max-w-[28ch]">
          Scan de QR-code en krijg onmiddellijk toegang tot uw medische
          geschiedenis.
        </p>
      </div>

      <!-- HIGHLIGHT 2 -->
      <div>
        <div class="flex h-7 items-center gap-2">
          <div>
            <img src={medical} />
          </div>

          <p class="text-heading text-lg font-bold font-sans leading-7">
            Veiligheid eerst
          </p>
        </div>

        <p class="max-w-[28ch]">
          Zorg ervoor dat hulpverleners snel de juiste informatie hebben.
        </p>
      </div>
    </div>

    <div id="buttons" class="flex gap-5">
      <button
        class="rounded px-6 py-2 bg-accent inline-flex justify-center items-center w-auto"
      >
        <span class="text-primary text-lg font-bold font-sans leading-7">
          Bekijk ons aanbod
        </span>
      </button>

      <button
        class="rounded px-6 py-2 bg-white/10 backdrop-blur-lg inline-flex justify-center items-center w-auto"
      >
        <span class="text-paragraph text-lg font-text leading-7">
          Meer info
        </span>
      </button>
    </div>
  </div>
</div>
