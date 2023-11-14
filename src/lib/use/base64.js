import { browser } from '$app/environment'

// -----------------------------------------------------------------------------
function encode(utf8Str) {
  if (browser)
    return btoa(encodeURIComponent(utf8Str))
  return null
}

// -----------------------------------------------------------------------------
function decode(base64Str) {
  if (browser)
    return decodeURIComponent(atob(base64Str))
  return null
}

// -----------------------------------------------------------------------------
export default {
  encode,
  decode
}
