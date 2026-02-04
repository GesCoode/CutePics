<script lang="ts">
  import mail from "$lib/assets/mail.svg";

  let email = $state("");
  let password = $state("");

  function handleLogin() {
    console.log(email);
    console.log(password);
  }
</script>

<div id="wrapper" class="flex flex-col rounded border border-border bg-primary">
  <div
    id="heading"
    class="self-stretch px-4 py-2 bg-white inline-flex border-b border-border"
  >
    <p class="text-heading text-lg font-bold font-sans leading-7">
      Log in op mijn SOS account
    </p>
  </div>

  <div id="content" class="flex flex-col gap-8 px-4 py-6">
    <div id="fields" class="flex flex-col gap-4">
      <div id="email" class="flex gap-1 flex-col">
        <p class="text-base font-lignt font-text leading-6 text-paragraph">
          E-mailadres:
        </p>

        <div
          id="field"
          class="flex h-9 rounded outline-1 outline-zinc-300 overflow-hidden"
        >
          <div
            class="w-9 h-full flex items-center justify-center bg-[#E9ECEF] border-r border-[#D8D8D8]"
          >
            <img src={mail} aria-hidden="true" alt="" />
          </div>

          <input
            placeholder="Typ uw e-mailadres"
            type="text"
            class="flex-1 h-full px-3 outline-none font-light"
            bind:value={email}
          />
        </div>
      </div>

      <div id="password" class="flex gap-1 flex-col">
        <p class="text-base font-lignt font-text leading-6 text-paragraph">
          Wachtwoord:
        </p>

        <div
          id="field"
          class="flex h-9 rounded border border-[#D8D8D8] overflow-hidden"
        >
          <div
            class="w-9 h-full flex items-center justify-center bg-[#E9ECEF] border-r border-[#D8D8D8]"
          >
            <img src={mail} aria-hidden="true" alt="" />
          </div>

          <input
            placeholder="Typ uw wachtwoord"
            type="password"
            class="flex-1 h-full px-3 outline-none font-light"
            bind:value={password}
          />
        </div>
      </div>
    </div>

    <div id="buttons" class="flex flex-col gap-4">
      <button
        class="rounded px-6 py-2 bg-accent inline-flex justify-center items-center w-auto"
        onclick={handleLogin}
      >
        <span class="text-primary text-base font-light font-text leading-6">
          Inloggen
        </span>
      </button>

      <button
        class="rounded self-stretch py-2 inline-flex flex-col justify-center items-center border-2 border-accent"
      >
        <span class="text-accent text-base font-bold font-text leading-6">
          Wachtwoord vergeten
        </span>
      </button>
    </div>
  </div>
</div>
