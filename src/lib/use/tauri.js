import * as tauri from '@tauri-apps/api/tauri'

// -----------------------------------------------------------------------------
async function invoke(cmd, args) {
  return await tauri.invoke(cmd, args)
}

// -----------------------------------------------------------------------------
export default {
  invoke
}
