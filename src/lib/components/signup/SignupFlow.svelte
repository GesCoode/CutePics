<script lang="ts">
  import { APP_NAME, APP_TAGLINE } from '$lib/app';
  import { PICTURE_CATEGORIES, getCategoryById } from '$lib/categories';

  type Step = 'intro' | 'categories' | 'email' | 'done';

  const PROGRESS = [
    { emoji: '👋', label: 'Hello' },
    { emoji: '💝', label: 'Pick cute' },
    { emoji: '💌', label: 'Your email' }
  ] as const;

  let step = $state<Step>('intro');
  let selectedIds = $state<string[]>([]);
  let email = $state('');
  let emailError = $state('');
  let submitting = $state(false);

  const stepIndex = $derived(
    step === 'intro' ? 0 : step === 'categories' ? 1 : step === 'email' ? 2 : 2
  );

  const selectedCategories = $derived(
    selectedIds
      .map((id) => getCategoryById(id))
      .filter((category): category is NonNullable<typeof category> => category !== undefined)
  );

  function toggleCategory(id: string) {
    if (selectedIds.includes(id)) {
      selectedIds = selectedIds.filter((item) => item !== id);
      return;
    }

    selectedIds = [...selectedIds, id];
  }

  function goToCategories() {
    step = 'categories';
  }

  function goToEmail() {
    if (selectedIds.length === 0) return;
    step = 'email';
  }

  function goBack() {
    if (step === 'categories') {
      step = 'intro';
      return;
    }

    if (step === 'email') {
      step = 'categories';
    }
  }

  async function handleEmailSubmit(event: SubmitEvent) {
    event.preventDefault();
    emailError = '';

    const trimmed = email.trim();
    if (!trimmed) {
      emailError = 'Please enter your email address.';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      emailError = 'Please enter a valid email address.';
      return;
    }

    submitting = true;

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, categories: selectedIds })
      });

      const data = (await response.json()) as { error?: string; email?: string };

      if (!response.ok) {
        emailError = data.error ?? 'Could not sign up. Try again.';
        return;
      }

      email = data.email ?? trimmed;
      step = 'done';
    } catch {
      emailError = 'Could not sign up. Try again.';
    } finally {
      submitting = false;
    }
  }

  function startOver() {
    step = 'intro';
    selectedIds = [];
    email = '';
    emailError = '';
    submitting = false;
  }
</script>

<section class="page-content signup-page">
  <div class="signup-flow">
    {#if step !== 'done'}
      <div class="signup-progress" aria-label="Progress">
        {#each PROGRESS as item, index}
          {#if index > 0}
            <div
              class="signup-progress__line"
              class:signup-progress__line-active={stepIndex >= index}
            ></div>
          {/if}
          <div
            class="signup-progress__step"
            class:signup-progress__step-active={stepIndex === index}
            class:signup-progress__step-done={stepIndex > index}
            title={item.label}
          >
            {item.emoji}
          </div>
        {/each}
      </div>
    {/if}

    {#if step === 'intro'}
      <div class="signup-panel glass-panel glass-panel-accent">
        <div class="signup-hero">
          <div class="signup-hero__mascot">
            📸
            <span class="signup-hero__sparkle">✨</span>
          </div>
        </div>

        <p class="signup-eyebrow">✿ {APP_NAME} ✿</p>
        <h1 class="signup-title font-display">{APP_TAGLINE}</h1>
        <p class="signup-lead">
          Make your selection and receive cute pics every. single. day. (Yes that is a threat)
        </p>

        <button class="btn-primary signup-panel__action" type="button" onclick={goToCategories}>
          Let's go! →
        </button>
      </div>
    {:else if step === 'categories'}
      <div class="signup-panel glass-panel">
        <p class="signup-eyebrow">Step 1 of 2</p>
        <h2 class="signup-title font-display">What makes you go aww?</h2>
        <p class="signup-lead">
          Tap everything you'd love to see in your inbox. The more you pick, the cuter it gets!
        </p>

        <div class="category-grid" role="group" aria-label="Picture categories">
          {#each PICTURE_CATEGORIES as category}
            {@const selected = selectedIds.includes(category.id)}
            <button
              type="button"
              class="category-card"
              class:category-card-selected={selected}
              aria-pressed={selected}
              onclick={() => toggleCategory(category.id)}
            >
              <span class="category-card__emoji" aria-hidden="true">{category.emoji}</span>
              <span class="category-card__label">{category.label}</span>
              <span class="category-card__desc">{category.description}</span>
              {#if selected}
                <span class="category-card__check" aria-hidden="true">♥</span>
              {/if}
            </button>
          {/each}
        </div>

        <div class="signup-actions">
          <button class="btn-secondary" type="button" onclick={goBack}>← Back</button>
          <button
            class="btn-primary"
            type="button"
            disabled={selectedIds.length === 0}
            onclick={goToEmail}
          >
            Continue with {selectedIds.length} pick{selectedIds.length === 1 ? '' : 's'} →
          </button>
        </div>
      </div>
    {:else if step === 'email'}
      <div class="signup-panel glass-panel glass-panel-accent signup-panel--narrow">
        <p class="signup-eyebrow">Step 2 of 2</p>
        <h2 class="signup-title font-display">Where should we send the cute?</h2>
        <p class="signup-lead">Drop your email below and your daily dose of adorable is on its way!</p>

        <div class="signup-summary">
          <p class="signup-summary__label">Your cute picks</p>
          <ul class="signup-summary__chips">
            {#each selectedCategories as category}
              <li class="signup-chip">
                <span aria-hidden="true">{category.emoji}</span>
                {category.label}
              </li>
            {/each}
          </ul>
        </div>

        <form class="signup-email-form" onsubmit={handleEmailSubmit}>
          <label class="signup-field">
            <span class="field-label">Your email</span>
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

          {#if emailError}
            <p class="signup-message-error">{emailError}</p>
          {/if}

          <div class="signup-actions">
            <button class="btn-secondary" type="button" onclick={goBack} disabled={submitting}>
              ← Back
            </button>
            <button class="btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Generating your first pic…' : 'Sign me up! 💕'}
            </button>
          </div>
        </form>
      </div>
    {:else}
      <div class="signup-panel glass-panel glass-panel-accent signup-panel--narrow signup-panel--done">
        <div class="signup-done__celebrate" aria-hidden="true">
          <span>🎀</span>
          <span>✨</span>
          <span>🎀</span>
        </div>
        <h2 class="signup-title font-display">Yay, you're in!</h2>
        <p class="signup-lead">
          Check <strong class="text-heading">{email}</strong> — your first cute pic is on its way.
          More arrive every day at 18:00.
        </p>

        <div class="signup-summary">
          <p class="signup-summary__label">You'll receive</p>
          <ul class="signup-summary__chips">
            {#each selectedCategories as category}
              <li class="signup-chip">
                <span aria-hidden="true">{category.emoji}</span>
                {category.label}
              </li>
            {/each}
          </ul>
        </div>

        <button class="btn-secondary signup-panel__action" type="button" onclick={startOver}>
          Start over
        </button>
      </div>
    {/if}
  </div>
</section>
