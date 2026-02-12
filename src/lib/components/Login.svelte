<script>
  import Button from "./FieldBuilder/Button.svelte";
  import FieldBuilder from "./FieldBuilder/FieldBuilder.svelte";
  import InputField from "./FieldBuilder/InputField.svelte";
  import mail from "$lib/assets/mail.svg";

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
        icon={mail}
      ></InputField>
    </div>

    <div class="flex flex-col gap-4">
      <Button content="Inloggen" onClick={handleLogin}></Button>
      <Button
        content="Wachtwoord vergeten"
        primary={false}
        onClick={forgotPassword}
      ></Button>
    </div>
  </FieldBuilder>
</div>
