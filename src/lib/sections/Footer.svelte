<script lang="ts">
  import logoNaked from '$lib/assets/logoNaked.svg';
</script>

<footer
  class="relative z-10 px-4 py-10 transition-colors duration-300 sm:px-8 lg:px-12"
  style="background: var(--footer-bg)"
>
  <div class="mx-auto flex max-w-[1600px] items-start gap-4">
    <img src={logoNaked} alt="" class="h-10 mt-1 w-auto shrink-0" aria-hidden="true" />

    <div class="flex flex-col gap-0">
      <p class="text-sm text-white/85 sm:text-base">For suggestions, questions and inquiries</p>
      <a
        href="mailto:contact@gesmoo.com"
        class="text-base font-medium text-white transition-colors hover:text-[#a8e6cf]"
      >
        contact@gesmoo.com
      </a>
    </div>
  </div>
</footer>
