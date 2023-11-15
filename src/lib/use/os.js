import * as tauriOs from '@tauri-apps/api/os'

// -----------------------------------------------------------------------------
async function type() {
  return await tauriOs.type()
}

// -----------------------------------------------------------------------------
export default {
  type
}