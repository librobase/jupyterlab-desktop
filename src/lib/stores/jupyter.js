import {
  writable,
  get
} from 'svelte/store'

import { fetch } from '@tauri-apps/api/http'

import {
  ServerConnection,
  ServiceManager
} from '@jupyterlab/services'

import sessionStorage from '$lib/use/sessionStorage'

// -----------------------------------------------------------------------------
let serviceManager = null

let { subscribe, set, update } = writable({
  url: '',
  connected: false,
  running: {} // { session1: true, session2: true }
})

// -----------------------------------------------------------------------------
async function reload() {
  let url = sessionStorage.get('jupyter.url')

  if (url)
    await connect(url)
}

// -----------------------------------------------------------------------------
async function connectJupyterServer() {
  let port = sessionStorage.get('jupyterServer.port')
  let token = sessionStorage.get('jupyterServer.token')

  let url = ''
  
  if (token)
    url = `http://localhost:${port}/?token=${token}`
  else
    url = `http://localhost:${port}`

  await connect(url)
}

// -----------------------------------------------------------------------------
async function connectJupyterLab() {
  let port = sessionStorage.get('jupyterLab.port')
  let token = sessionStorage.get('jupyterLab.token')

  let url = ''
  
  if (token)
    url = `http://localhost:${port}/?token=${token}`
  else
    url = `http://localhost:${port}`
  
  await connect(url)
}

// -----------------------------------------------------------------------------
async function connect(url) {
  let store = get({ subscribe })

  // if this server is already connected, do nothing
  if (store.url === url && store.connected)
    return

  // check server status
  let serverStatus = null
  try {
    let urlObj = new URL(url)
    urlObj.pathname = '/api/status/'
    let res = await fetch(urlObj)
    serverStatus = res.ok
  }
  catch(err) {}
  serverStatus = serverStatus? true : false

  // if server is not available
  if (!serverStatus) {
    serviceManager = null
    store.connected = false
    store.running = {}
    set(store)
    console.log('jupyter server not available.')
    return
  }
  
  // create server connection object
  let urlObj = new URL(url)
  let host = urlObj.host
  let token = urlObj.searchParams.get('token')
  token = token? token : ''

  let serverConnectionOptions = {
    baseUrl: `http://${host}`,
    wsUrl: `ws://${host}`,
    appUrl: ``,
    token: `${token}`
  }

  // create server settings
  let serverSettings = ServerConnection.makeSettings(serverConnectionOptions)
  
  // create service manager
  serviceManager = new ServiceManager({ serverSettings })

  if (serviceManager) {
    store.url = url
    store.connected = true
    store.running = {}
    set(store)

    sessionStorage.set('jupyter.url', url)

    await serviceManager.ready
  }
  else {
    serviceManager = null
    store.connected = false
    store.running = {}
    set(store)
  }
}

// -----------------------------------------------------------------------------
async function disconnect() {
  let store = get({ subscribe })

  try {
    serviceManager.dispose()
  }
  catch(err) {}
  finally {
    serviceManager = null
    store.url = ''
    store.connected = false
    store.running = {}
    set(store)

    sessionStorage.remove('jupyter.url')
  }
}

// -----------------------------------------------------------------------------
async function execute({
  session,
  code = '',
  onIOPub = msg => {},
  onStatus = msg => {},
  onExecuteInput = msg => {},
  onDisplayData = msg => {},
  onStream = msg => {},
  onError = msg => {},
  onReply = () => {}
}) {

  let store = get({ subscribe })
  
  // find session
  let sessionModel = await serviceManager.sessions.findByPath(session)

  // if session does not exist, create it
  if (!sessionModel) {
    let createOptions = {
      path: session,
      type: "notebook",
      name: session,
      kernel: {
        name: "python"
      }
    }
    let connectOptions = {
      clientId: 'username',
      username: 'username',
      kernelConnectionOptions: {
        handleComms: undefined
      }
    }
    let sessionConnection = await serviceManager.sessions.startNew(createOptions, connectOptions)
    sessionModel = await serviceManager.sessions.findByPath(session)
  }

  // connect to session and execute code
  let sessionConnection = await serviceManager.sessions.connectTo({ model: sessionModel })
  let future = sessionConnection.kernel.requestExecute({ code, store_history: false })

  // handle all messages
  future.onIOPub = (msg) => {
    onIOPub(msg)
    
    let type = msg['header']['msg_type']
    if (type === 'status') {
      onStatus(msg)
      if (msg['content']['execution_state'] === 'busy')
        store.running[session] = true
      else if (msg['content']['execution_state'] === 'idle')
        store.running[session] = false
      set(store)
    }
    else if (type === 'execute_input') onExecuteInput(msg)
    else if (type === 'display_data')  onDisplayData(msg)
    else if (type === 'stream')        onStream(msg)
    else if (type === 'error')         onError(msg)
    else {
      console.log('un-handled message from jupyter:')
      console.log(msg)
    }
  }

  let status = false

  future.onReply = (msg) => {
    status = (msg.content.status === 'ok')
    onReply(msg)
  }

  await future.done
  return status
}

// -----------------------------------------------------------------------------
async function shutdown(session) {
  let store = get({ subscribe })

  let sessionModel = await serviceManager.sessions.findByPath(session)
  await serviceManager.sessions.shutdown(sessionModel.id)
  
  store.running[session] = false
  set(store)
}

// -----------------------------------------------------------------------------
async function interrupt(session) {
  let store = get({ subscribe })

  let sessionModel = await serviceManager.sessions.findByPath(session)
  try {
    let kernelId = sessionModel.kernel.id
    let urlObj = new URL(store.url)
    urlObj.pathname = `/api/kernels/${kernelId}/interrupt`
    let res = await fetch(urlObj)
    
    store.running[session] = false
    set(store)
  }
  catch(err) {}
}

// -----------------------------------------------------------------------------
async function restart(session) {
  let store = get({ subscribe })

  let sessionModel = await serviceManager.sessions.findByPath(session)
  try {
    let kernelId = sessionModel.kernel.id
    let urlObj = new URL(store.url)
    urlObj.pathname = `/api/kernels/${kernelId}/restart`
    let res = await fetch(urlObj)
    
    store.running[session] = false
    set(store)
  }
  catch(err) {}
}

// -----------------------------------------------------------------------------
export default {
  // store
  subscribe,
  set,
  // functions
  reload,
  connectJupyterServer,
  connectJupyterLab,
  connect,
  disconnect,
  execute,
  shutdown,
  interrupt,
  restart
}
