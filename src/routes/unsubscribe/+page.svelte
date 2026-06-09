<script lang="ts">
  import { APP_NAME } from '$lib/app';

  let { data } = $props();
</script>

<svelte:head>
  <title>Unsubscribe · {APP_NAME}</title>
</svelte:head>

<section class="page-content signup-page">
  <div class="signup-flow">
    <div class="signup-panel glass-panel glass-panel-accent signup-panel--narrow signup-panel--done">
      {#if data.status === 'success'}
        <div class="signup-done__celebrate" aria-hidden="true">
          <span>👋</span>
          <span>💔</span>
          <span>👋</span>
        </div>
        <h1 class="signup-title font-display">Unsubscribed</h1>
        <p class="signup-lead">You won't receive any more cute pics. We'll miss you!</p>
      {:else}
        <h1 class="signup-title font-display">Invalid link</h1>
        <p class="signup-lead">This unsubscribe link is invalid or already used.</p>
      {/if}
      <a class="btn-primary signup-panel__action" href="/">Back to {APP_NAME}</a>
    </div>
  </div>
</section>
