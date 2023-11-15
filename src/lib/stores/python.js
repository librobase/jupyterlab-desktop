import {
  writable,
  get
} from 'svelte/store'

import shell from '$lib/use/shell'
import os from '$lib/use/os'
import sessionStorage from '$lib/use/sessionStorage'
import uuid from '$lib/use/uuid'

import directory from '$lib/stores/directory'

// -----------------------------------------------------------------------------
let pythonCmdName = ''

let { subscribe, set, update } = writable({
  busy: false,
  
  jupyterServerPort: '',
  jupyterServerToken: '',

  jupyterLabPort: '',
  jupyterLabToken: '',
})

reload()

// -----------------------------------------------------------------------------
function busy(b) {
  let store = get({ subscribe })
  store.busy = b
  set(store)
}

// -----------------------------------------------------------------------------
async function reload() {
  let osType = await os.type()

  if (osType === 'Darwin')
    pythonCmdName = 'python-macos'
  else if (osType === 'Windows_NT')
    pythonCmdName = 'python-win'
  else
    pythonCmdName = 'python-macos'
}

// -----------------------------------------------------------------------------
async function installRequirements({
  onStdout = msg => {},
  onStderr = msg => {},
  onError  = msg => {}
}) {

  busy(true)

  let output = await shell.execute({
    cmd: pythonCmdName,
    args: [
      '-m',
      'pip',
      'install',
      '-r', get(directory).requirements_txt
    ],
    onStdout: msg => onStdout(msg),
    onStderr: msg => onStderr(msg),
    onError : msg => onError(msg)
  })

  busy(false)

  return output
}

// -----------------------------------------------------------------------------
async function freePort() {
  let port = ''

  let output = await shell.execute({
    cmd: pythonCmdName,
    args: [
      'free_port.py'
    ],
    options: {
      cwd: get(directory).assets
    },
    onStdout: msg => { port = parseInt(msg) },
    onStderr: msg => { console.log(msg) },
    onError : msg => { console.log(msg) }
  })

  return port
}

// -----------------------------------------------------------------------------
async function runJupyterServer({
  onStdout = msg => {},
  onStderr = msg => {},
  onError  = msg => {}
}) {

  let port = await freePort()
  let token = uuid.generate()

  let store = get({ subscribe })
  let prevPort = store.jupyterServerPort
  let prevToken = store.jupyterServerToken

  store.jupyterServerPort = `${port}`
  store.jupyterServerToken = token
  set (store)

  sessionStorage.set('jupyterServer.port', port)
  sessionStorage.set('jupyterServer.token', token)

  let output = await shell.execute({
    cmd: pythonCmdName,
    args: [
      '-m',
      'jupyter', 'server',
      `--ServerApp.port=${port}`,
      `--ServerApp.port_retries=0`,
      `--ServerApp.allow_origin='*'`,
      `--ServerApp.ip='localhost'`,
      `--ServerApp.allow_remote_access=True`,
      `--ServerApp.disable_check_xsrf=True`,
      `--PasswordIdentityProvider.hashed_password=''`,
      `--IdentityProvider.token='${token}'`
    ],
    options: {
      cwd: get(directory).workspace
    },
    onStdout: msg => onStdout(msg),
    onStderr: msg => onStderr(msg),
    onError : msg => onError(msg)
  })

  if (output.code) {
    store.jupyterServerPort = `${prevPort}`
    store.jupyterServerToken = prevToken
    set (store)

    sessionStorage.set('jupyterServer.port', prevPort)
    sessionStorage.set('jupyterServer.token', prevToken)
  }

  return output
}

// -----------------------------------------------------------------------------
async function runJupyterLab({
  onStdout = msg => {},
  onStderr = msg => {},
  onError  = msg => {}
}) {

  let port = await freePort()
  let token = uuid.generate()

  let store = get({ subscribe })
  let prevPort = store.jupyterLabPort
  let prevToken = store.jupyterLabToken

  store.jupyterLabPort = `${port}`
  store.jupyterLabToken = token
  set (store)

  sessionStorage.set('jupyterLab.port', port)
  sessionStorage.set('jupyterLab.token', token)

  let output = await shell.execute({
    cmd: pythonCmdName,
    args: [
      '-m',
      'jupyter', 'lab',
      `--ServerApp.port=${port}`,
      `--ServerApp.port_retries=0`,
      `--ServerApp.allow_origin='*'`,
      `--ServerApp.ip='localhost'`,
      `--ServerApp.allow_remote_access=True`,
      `--ServerApp.disable_check_xsrf=True`,
      `--PasswordIdentityProvider.hashed_password=''`,
      `--IdentityProvider.token='${token}'`,
    ],
    options: {
      cwd: get(directory).workspace
    },
    onStdout: msg => onStdout(msg),
    onStderr: msg => onStderr(msg),
    onError : msg => onError(msg)
  })

  if (output.code) {
    store.jupyterLabPort = `${prevPort}`
    store.jupyterLabToken = prevToken
    set (store)

    sessionStorage.set('jupyterLab.port', prevPort)
    sessionStorage.set('jupyterLab.token', prevToken)
  }
  
  return output
}

// -----------------------------------------------------------------------------
async function runJupyterLabNoBrowser({
  onStdout = msg => {},
  onStderr = msg => {},
  onError  = msg => {}
}) {

  let port = await freePort()
  let token = uuid.generate()

  let store = get({ subscribe })
  let prevPort = store.jupyterLabPort
  let prevToken = store.jupyterLabToken

  store.jupyterLabPort = `${port}`
  store.jupyterLabToken = token
  set (store)

  sessionStorage.set('jupyterLab.port', port)
  sessionStorage.set('jupyterLab.token', token)

  let output = await shell.execute({
    cmd: pythonCmdName,
    args: [
      '-m',
      'jupyter', 'lab',
      `--ServerApp.port=${port}`,
      `--ServerApp.port_retries=0`,
      `--ServerApp.allow_origin='*'`,
      `--ServerApp.ip='localhost'`,
      `--ServerApp.allow_remote_access=True`,
      `--ServerApp.disable_check_xsrf=True`,
      `--PasswordIdentityProvider.hashed_password=''`,
      `--IdentityProvider.token='${token}'`,
      `--no-browser`
    ],
    options: {
      cwd: get(directory).workspace
    },
    onStdout: msg => onStdout(msg),
    onStderr: msg => onStderr(msg),
    onError : msg => onError(msg)
  })

  if (output.code) {
    store.jupyterLabPort = `${prevPort}`
    store.jupyterLabToken = prevToken
    set (store)

    sessionStorage.set('jupyterLab.port', prevPort)
    sessionStorage.set('jupyterLab.token', prevToken)
  }
  
  return output
}

// -----------------------------------------------------------------------------
export default {
  // store
  subscribe,
  set,
  // functions
  reload,
  installRequirements,
  runJupyterServer,
  runJupyterLab,
  runJupyterLabNoBrowser
}
