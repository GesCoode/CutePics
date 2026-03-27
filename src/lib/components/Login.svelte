<script lang="ts">
  import CustomButton from "$lib/components/form/CustomButton.svelte";
  import FieldBuilder from "./FieldBuilder/FieldBuilder.svelte";
  import InputField from "./FieldBuilder/InputField.svelte";
  import mail from "$lib/assets/mail.svg";
  import key from "$lib/assets/key.svg";

  let email = "";
  let password = "";

  function handleLogin() {
    console.log(email);
    console.log(password);
  }

  function forgotPassword() {
    console.log("Wachtwoord vergeten");
  }
</script>

<div id="fieldWrapper">
  <FieldBuilder title="Login op mijn SOS account">
    <div class="flex flex-col gap-4">
      <InputField
        label="E-mailadres:"
        bind:value={email}
        placeholder="Typ uw e-mailadres"
        icon={mail}
      ></InputField>

      <InputField
        label="Wachtwoord:"
        bind:value={password}
        type="password"
        placeholder="Typ uw wachtwoord"
        icon={key}
      ></InputField>
    </div>

    <div class="flex flex-col gap-4">
      <!-- Login button -->
      <CustomButton
        text="Inloggen"
        rounded={true}
        bgColor="#0C3966"
        textColor="#FFFFFF"
        on:click={handleLogin}
      />

      <!-- Forgot password button -->
      <CustomButton
        text="Wachtwoord vergeten"
        rounded={true}
        bgColor="rgba(255, 255, 255, 0.1)"
        textColor="#0C3966"
        outlineColor="#0C3966"
        outlineWidth={1}
        class="backdrop-blur-lg"
        on:click={forgotPassword}
      />
    </div>
  </FieldBuilder>
</div>