<script>
  import '../app.css'

  import PPane from '$lib/components/PPane.svelte'
  import VPane from '$lib/components/VPane.svelte'
  import SPane from '$lib/components/SPane.svelte'
</script>

<svelte:head>
  <title>LibroBase</title>
</svelte:head>

<PPane>
  <VPane>
    
    <svelte:fragment slot="center">
      <SPane class="bg-gray-50 text-sm">
        <slot />
      </SPane>  
    </svelte:fragment>

  </VPane>
</PPane>