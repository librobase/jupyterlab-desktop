<script>
  import { onMount } from 'svelte'
  import micromamba from '$lib/stores/micromamba'
  import python from '$lib/stores/python'
  import directory from '$lib/stores/directory'
  import jupyter from '$lib/stores/jupyter'

  import VPane from '$lib/components/VPane.svelte'
  import SPane from '$lib/components/SPane.svelte'



  let stdout = ''
  let stderr = ''
  let errmsg = ''

  // ---------------------------------------------------------------------------
  onMount(async () => {
    
  })
  
  // ---------------------------------------------------------------------------
  async function createEnvironment() {
    stdout = ''
    stderr = ''
    let output = await micromamba.createEnvironment({
      onStdout: msg => {
        stdout += msg
      },
      onStderr: msg => {
        stderr += msg
      },
      onError: msg => {
        errmsg += msg
      }
    })
  }

  // ---------------------------------------------------------------------------
  async function updateEnvironment() {
    stdout = ''
    stderr = ''
    let output = await micromamba.updateEnvironment({
      onStdout: msg => {
        stdout += msg
      },
      onStderr: msg => {
        stderr += msg
      },
      onError: msg => {
        errmsg += msg
      }
    })
  }

  // ---------------------------------------------------------------------------
  async function installRequirements() {
    stdout = ''
    stderr = ''
    let output = await python.installRequirements({
      onStdout: msg => {
        stdout += msg
      },
      onStderr: msg => {
        stderr += msg
      },
      onError: msg => {
        errmsg += msg
      }
    })
  }

  // ---------------------------------------------------------------------------
  async function runJupyterLab() {
    stdout = ''
    stderr = ''
    let output = await python.runJupyterLabNoBrowser({
      onStdout: msg => {
        stdout += msg
      },
      onStderr: msg => {
        stderr += msg
      },
      onError: msg => {
        errmsg += msg
      }
    })
  }



  async function runJupyterServer() {
    stdout = ''
    stderr = ''
    let output = await python.runJupyterServer({
      onStdout: msg => {
        stdout += msg
      },
      onStderr: msg => {
        stderr += msg
      },
      onError: msg => {
        errmsg += msg
      }
    })
  }


  


  async function openPrefix() {
    stdout = ''
    stderr = ''
    let output = await directory.openPrefix()
  }


  async function openWorkspace() {
    stdout = ''
    stderr = ''
    let output = await directory.openWorkspace()
  }


  async function openAssets() {
    stdout = ''
    stderr = ''
    let output = await directory.openAssets()
  }

  


  async function connectjupyterServer() {
    await jupyter.connectJupyterServer()
  }

  async function connectjupyterLab() {
    await jupyter.connectJupyterLab()
  }


  async function runPyCode() {
    let output = await jupyter.execute({
      session: 'test',
      code: 'print("hellooooooo")',
      onStream: msg => {
        console.log(msg)
        //pystdout += msg
      }
    })
  }
</script>

<!--/////////////////////////////////////////////////////////////////////////-->

<VPane>

  <svelte:fragment slot="top">
    <SPane class="p-3 bg-gray-100">
      <button on:click={createEnvironment}>
        Create Conda Environment
        {#if $micromamba.busy}
          <div class="spinner" />
        {/if}
      </button>
      <button on:click={updateEnvironment}>
        Update Conda Environment
        {#if $micromamba.busy}
          <div class="spinner" />
        {/if}
      </button>
      <button on:click={installRequirements}>
        Install Requirements
        {#if $python.busy}
          <div class="spinner" />
        {/if}
      </button>
      <button on:click={runJupyterLab}>
        Run JupyterLab
        {#if $python.busy}
          <div class="spinner" />
        {/if}
      </button>
      <a href="/lab">Open JupyterLab</a>
    </SPane>
  </svelte:fragment>

  <hr>

  <svelte:fragment slot="center">
    <SPane class="p-3">
      <pre class="text-gray-500">{stdout}</pre>
      <hr>
      <pre class="text-red-500">{stderr}</pre>
    </SPane>
  </svelte:fragment>

</VPane>