import * as tauriFs from '@tauri-apps/api/fs'

// -----------------------------------------------------------------------------
async function exists(path, options={}) {
  return await tauriFs.exists(path, options)
}

// -----------------------------------------------------------------------------
export default {
  exists
}