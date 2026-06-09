<script lang="ts">
  import { goto, invalidateAll } from '$app/navigation';
  import AuthCard from '$lib/components/AuthCard.svelte';

  let name = $state('');
  let email = $state('');
  let password = $state('');
  let error = $state('');
  let submitting = $state(false);

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    error = '';
    submitting = true;

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password })
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        error = data.error ?? 'Could not create account.';
        return;
      }

      await invalidateAll();
      goto('/dashboard');
    } catch {
      error = 'Could not create account.';
    } finally {
      submitting = false;
    }
  }
</script>

<svelte:head>
  <title>Register · MemLyra</title>
</svelte:head>

<AuthCard
  title="Create account"
  description="Start building your flashcard library."
  submitLabel={submitting ? 'Creating account…' : 'Create account'}
  alternateText="Already have an account? "
  alternateHref="/login"
  alternateLabel="Log in"
  onsubmit={handleSubmit}
>
  {#if error}
    <p class="library-message library-message-error">{error}</p>
  {/if}

  <label class="block space-y-2">
    <span class="field-label">Account name</span>
    <input
      class="field-input"
      type="text"
      name="name"
      autocomplete="nickname"
      placeholder="How should we greet you?"
      bind:value={name}
      required
      disabled={submitting}
    />
  </label>

  <label class="block space-y-2">
    <span class="field-label">Email</span>
    <input
      class="field-input"
      type="email"
      name="email"
      autocomplete="email"
      placeholder="you@example.com"
      bind:value={email}
      required
      disabled={submitting}
    />
  </label>

  <label class="block space-y-2">
    <span class="field-label">Password</span>
    <input
      class="field-input"
      type="password"
      name="password"
      autocomplete="new-password"
      placeholder="At least 6 characters"
      minlength="6"
      bind:value={password}
      required
      disabled={submitting}
    />
  </label>
</AuthCard>
