<script>
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'

  import sessionStorage from '$lib/use/sessionStorage'

  // ---------------------------------------------------------------------------
  onMount(async () => {
    let port = sessionStorage.get('jupyterLab.port')
    let token = sessionStorage.get('jupyterLab.token')

    console.log(port)
    console.log(token)

    goto(`http://localhost:${port}/lab?token=${token}`)
  })
</script>