<script lang="ts">
  let { data } = $props();
</script>

<svelte:head>
  <title>{data.status === 'success' ? 'Account activated · MemLyra' : 'Invalid link · MemLyra'}</title>
</svelte:head>

<section class="page-content flex min-h-[calc(100vh-5rem)] items-center justify-center">
  <div class="glass-panel max-w-md space-y-4 p-8 text-center sm:p-10">
    {#if data.status === 'success'}
      <h1 class="font-display text-3xl font-semibold text-heading">Account activated</h1>
      <p class="text-sm leading-relaxed text-muted">
        Your email address has been verified. You can now sign in to MemLyra.
      </p>
      <a class="btn-primary inline-flex" href="/login?verified=1">Go to log in</a>
    {:else}
      <h1 class="font-display text-3xl font-semibold text-heading">Invalid or expired link</h1>
      <p class="text-sm leading-relaxed text-muted">
        This activation link is invalid or has expired. Register again or contact support if you
        need help.
      </p>
      <a class="btn-secondary inline-flex" href="/register">Register</a>
    {/if}
  </div>
</section>
