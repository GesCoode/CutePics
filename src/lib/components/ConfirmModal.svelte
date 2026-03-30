<script lang="ts">
  export let message: string;
  export let onConfirm: () => void;
  export let onCancel: () => void;
</script>

<div class="fixed inset-0 flex justify-center items-center z-50">
  <!-- Blurred semi-transparent background -->
  <div 
    class="absolute inset-0 bg-white/30 backdrop-blur-sm"
    on:click={onCancel}
  ></div>

  <!-- Modal content -->
  <div class="relative bg-white rounded-md p-6 w-80 shadow-lg flex flex-col gap-4 z-10">
    <p class="text-gray-800 text-center">{message}</p>
    <div class="flex justify-between gap-4">
      <button 
        class="flex-1 py-2 bg-gray-200 rounded hover:bg-gray-300 font-semibold"
        on:click={onCancel}
      >
        Annuleer
      </button>
      <button 
        class="flex-1 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold"
        on:click={onConfirm}
      >
        Verwijder
      </button>
    </div>
  </div>
</div>