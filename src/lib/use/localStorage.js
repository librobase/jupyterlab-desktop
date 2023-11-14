import { browser } from '$app/environment'

// -----------------------------------------------------------------------------
function set(key, value) {
  if (browser)
    localStorage.setItem(key, value)
}

// -----------------------------------------------------------------------------
function get(key) {
  if (browser)
    return localStorage.getItem(key)
  return null
}

// -----------------------------------------------------------------------------
function remove(key) {
  if (browser)
    localStorage.removeItem(key)
}

// -----------------------------------------------------------------------------
function clear() {
  if (browser)
    localStorage.clear()
}

// -----------------------------------------------------------------------------
export default {
  set,
  get,
  remove,
  clear
}
