import { browser } from '$app/environment'

// -----------------------------------------------------------------------------
function set(key, value) {
  if (browser)
    sessionStorage.setItem(key, value)
}

// -----------------------------------------------------------------------------
function get(key) {
  if (browser)
    return sessionStorage.getItem(key)
  return null
}

// -----------------------------------------------------------------------------
function remove(key) {
  if (browser)
    sessionStorage.removeItem(key)
}

// -----------------------------------------------------------------------------
function clear() {
  if (browser)
    sessionStorage.clear()
}

// -----------------------------------------------------------------------------
export default {
  set,
  get,
  remove,
  clear
}
