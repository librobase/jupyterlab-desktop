import {
  writable,
  get
} from 'svelte/store'

import path from '$lib/use/path'
import shell from '$lib/use/shell'

// -----------------------------------------------------------------------------
let { subscribe, set, update } = writable({
  resource: '',
  assets: '',
  workspace: '',
  prefix: '',
  
  environment_yaml: '',
  requirements_txt: '',
  jupyter_server_config_py: ''
})

reload()

// -----------------------------------------------------------------------------
async function reload() {
  let store = get({ subscribe })

  store.resource = await path.resolveResource()
  store.assets = await path.resolveResource('assets')
  store.workspace = await path.resolveResource('workspace')
  store.prefix = await path.resolveResource('prefix')

  store.environment_yaml = await path.resolveResource('assets', 'environment.yaml')
  store.requirements_txt = await path.resolveResource('assets', 'requirements.txt')
  store.jupyter_server_config_py = await path.resolveResource('assets', 'jupyter_server_config.py')

  set (store)
}

// -----------------------------------------------------------------------------
async function open(dir) {
  shell.open({ path: dir })
}

// -----------------------------------------------------------------------------
async function openAssets() {
  let store = get({ subscribe })
  open(store.assets)
}

// -----------------------------------------------------------------------------
async function openWorkspace() {
  let store = get({ subscribe })
  open(store.workspace)
}

// -----------------------------------------------------------------------------
async function openPrefix() {
  let store = get({ subscribe })
  open(store.prefix)
}

// -----------------------------------------------------------------------------
export default {
  // store
  subscribe,
  set,
  // functions
  reload,
  open,
  openAssets,
  openWorkspace,
  openPrefix
}
