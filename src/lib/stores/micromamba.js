import {
  writable,
  get
} from 'svelte/store'

import shell from '$lib/use/shell'

import directory from '$lib/stores/directory'

// -----------------------------------------------------------------------------
let { subscribe, set, update } = writable({
  busy: false
})

// -----------------------------------------------------------------------------
function busy(b) {
  let store = get({ subscribe })
  store.busy = b
  set(store)
}

// -----------------------------------------------------------------------------
async function createEnvironment({
  onStdout = msg => {},
  onStderr = msg => {},
  onError  = msg => {}
}) {

  busy(true)

  let output = await shell.execute({
    sidecar: 'bin/micromamba',
    args: [
      '--yes',
      'create',
      '--prefix', get(directory).prefix,
      '--file', get(directory).environment_yaml
    ],
    onStdout: msg => onStdout(msg),
    onStderr: msg => onStderr(msg),
    onError : msg => onError(msg)
  })

  busy(false)

  return output
}

// -----------------------------------------------------------------------------
async function updateEnvironment({
  onStdout = msg => {},
  onStderr = msg => {},
  onError  = msg => {}
}) {

  busy(true)

  let output = await shell.execute({
    sidecar: 'bin/micromamba',
    args: [
      '--yes',
      'update',
      '--prefix', get(directory).prefix,
      '--file', get(directory).environment_yaml
    ],
    onStdout: msg => onStdout(msg),
    onStderr: msg => onStderr(msg),
    onError : msg => onError(msg)
  })

  busy(false)

  return output
}

// -----------------------------------------------------------------------------
export default {
  // store
  subscribe,
  set,
  // functions
  createEnvironment,
  updateEnvironment
}
