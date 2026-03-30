<script lang="ts">
  import CustomButton from "$lib/components/form/CustomButton.svelte";
  import ProductEntry from "$lib/components/ProductEntry.svelte";
  import ProductCart from "$lib/components/ProductCart.svelte";
  import update from "$lib/assets/update.svg";

  // Products array
  let products = [
    {
      id: 1,
      title: "Armband RVS kruislock",
      description: "Armband van RVS met ikruislock schakels.",
      price: 19.99,
      image: update,
      quantity: 1
    },
    {
      id: 2,
      title: "Armband RVS kruislock",
      description: "Armband van RVS met ikruislock schakels",
      price: 45.50,
      image: update,
      quantity: 1
    },
    {
      id: 3,
      title: "Armband RVS kruislock",
      description: "Armband van RVS met ikruislock schakels",
      price: 22.30,
      image: update,
      quantity: 1
    },
    {
      id: 4,
      title: "Armband RVS kruislock",
      description: "Armband van RVS met ikruislock schakels",
      price: 35.75,
      image: update,
      quantity: 1
    },
  ];

  const shippingCosts = 4.99;
  const shippingThreshold = 90.0;

  // Compute subtotal
  $: fullPrice = products.reduce(
    (sum, p) => sum + (p.price * (p.quantity ?? 1)),
    0
  );

  // Compute shipping display
  $: shippingDisplay =
    fullPrice >= shippingThreshold
      ? "GRATIS"
      : `€ ${shippingCosts.toFixed(2)}`;
</script>

<div class="flex flex-col gap-10 px-8 xl:px-16 py-4">
<p class="flex-1 flex-shrink-0 text-[var(--heading,#212529)] font-spline text-[37px] font-medium leading-normal tracking-[-0.703px] capitalize">
  Winkelmand
</p>

<div class="flex flex-col md:flex-row w-full min-h-screen gap-8 xl:gap-24">
<!-- Product Carts -->
  <div class="flex flex-col gap-4 flex-1">
    {#each products as product (product.id)}
      <ProductCart
        imageSrc={product.image}
        title={product.title}
        description={product.description ?? ""}
        price={product.price}
        initialQuantity={product.quantity ?? 1}
        on:remove={() => products = products.filter(p => p.id !== product.id)}
        on:quantityChanged={(e) => {
          products = products.map(p =>
            p.id === product.id ? { ...p, quantity: e.detail } : p
          );
        }}
      />
    {/each}
</div>

  <div class="md:hidden w-full h-px bg-gray-300"></div>
  
  <!-- Sidebar -->
  <div class="flex p-2 h-full w-full md:max-w-[333px] flex-col items-start gap-4 bg-[#FFF] rounded-[2px]">
    
    <!-- Subtotal -->
    <div class="flex flex-col items-start gap-2 self-stretch">
      <div class="flex flex-row items-start gap-2 self-stretch">
        <div class="flex flex-col justify-center items-start flex-1">
          <p style="margin:0; font-weight:700; font-size:16px; color:var(--paragraph,#292C2F);">
            Subtotaal
          </p>
        </div>
        <p style="margin:0; font-size:14px; color:var(--heading,#212529);">
          {"€ " + fullPrice.toFixed(2)}
        </p>
      </div>

      {#each products as product (product.id)}
        <ProductEntry 
          title={product.title} 
          price={(product.price * (product.quantity ?? 1)).toFixed(2)}
          description={product.description ?? ""}
          quantity={product.quantity ?? 1}
        />
      {/each}
    </div>

    <!-- Shipping -->
    <div class="flex flex-col w-full">
      <div class="flex flex-row items-start w-full">
        <div class="flex flex-1">
          <p style="margin:0; font-weight:700; font-size:16px;">
            Bezorgen
          </p>
        </div>
        <p style="margin:0; font-weight:700; color:var(--success,#0C6639);">
          {shippingDisplay}
        </p>
      </div>

      <div class="flex flex-row gap-1 items-center">
        <img src={update} />
        <p style="margin:0; font-size:14px; color:var(--success,#0C6639);">
          Binnen 4 dagen in huis
        </p>
      </div>

      {#if fullPrice < shippingThreshold}
        <p style="margin:0; font-size:14px; color:var(--success,#0C6639);">
          {"Voeg nog € " + (shippingThreshold - fullPrice).toFixed(2) + " toe voor gratis bezorging!"}
        </p>
      {/if}
    </div>

    <!-- Divider -->
    <div style="background:#ABAEB1; width:100%; height:0.5px;"></div>

    <!-- Total -->
    <div class="flex flex-row justify-between items-baseline w-full">
      <div class="flex gap-1 items-baseline">
        <p style="margin:0; font-weight:700; font-size:16px;">
          Totaal
        </p>
        <p style="margin:0; font-size:14px; color:#66686A;">
          Incl. BTW
        </p>
      </div>

      <p style="margin:0; font-weight:700; font-size:16px;">
        {(fullPrice + (shippingDisplay !== "GRATIS" ? shippingCosts : 0)).toFixed(2)}
      </p>
    </div>

    <!-- Divider -->
    <div style="background:#ABAEB1; width:100%; height:0.5px;"></div>

    <!-- Button -->
    <div class="flex w-full py-2">
      <CustomButton
        text="Veilig bestellen"
        rounded={true}
        bgColor="#0C3966"
        textColor="#FFFFFF"
        on:click={() => (window.location.href = "/producten")}
      />
    </div>
  </div>
</div>
</div>