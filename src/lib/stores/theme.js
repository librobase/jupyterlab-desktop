import {
  writable,
  get
} from 'svelte/store'

import { browser } from '$app/environment'

import localStorage from '$lib/use/localStorage'

// -----------------------------------------------------------------------------
let { subscribe, set, update } = writable({
  state: 'light'
})

subscribe(store => {
  localStorage.set('theme.state', store.state)
  if (browser)
    (store.state === 'dark')
      ? document.body.classList.add('dark')
      : document.body.classList.remove('dark')
})

// -----------------------------------------------------------------------------
function reload() {
  let store = get({ subscribe })

  let state = localStorage.get('theme.state')

  let states = ['light', 'dark']

  if (state === null)
    store.state = 'light'
  else if (!states.includes(state))
    store.state = 'light'
  
  set(store)
}

// -----------------------------------------------------------------------------
function toggle() {
  let store = get({ subscribe })

  if (store.state === 'dark')
    store.state = 'light'
  else
    store.state = 'dark'

  set(store)
}

// -----------------------------------------------------------------------------
export default {
  // store
  subscribe,
  set,
  // functions
  reload,
  toggle
}
