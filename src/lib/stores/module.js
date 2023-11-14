import { writable, get } from 'svelte/store'

// -----------------------------------------------------------------------------
let { subscribe, set, update } = writable({
  var1: 1,
  var2: 'string',
  var3: [1, 2, 3],
  var4: {a: 1, b: 2},
  var5: {a: {c: 'c', d: 'd'}, b: {e: 'e', f: 'f'}}
})

subscribe(obj => {
  console.log(obj)
})

// -----------------------------------------------------------------------------
async function reload() {}

// -----------------------------------------------------------------------------
function display() {
  console.log('runing a function')
  let obj = get({ subscribe })
  console.log(obj)
}

// -----------------------------------------------------------------------------
export default {
  subscribe,
  set,
  reload,
  display
}
