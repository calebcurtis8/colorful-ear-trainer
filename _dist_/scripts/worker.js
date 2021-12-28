// Open (or create) the database
const open = indexedDB.open('Stats', 1)

// Create the schema
open.onupgradeneeded = function () {
  const db = open.result
  db.createObjectStore('Stats', { keyPath: 'id' })
}

onmessage = function (event) {
  self[event.data.action](event.data).then(res => {
    postMessage({ action: event.data.action, result: res })
  })
}

self.saveStat = function ({ key, value }) {
  const db = open.result
  const tx = db.transaction('Stats', 'readwrite')
  const store = tx.objectStore('Stats')
  const entry = { id: `${key}`, value }
  return new Promise((resolve, reject) => {
    store.put(entry)
    resolve(entry)
  })
}

self.getStat = async function ({ key }) {
  const db = open.result
  const tx = db.transaction('Stats', 'readwrite')
  const store = tx.objectStore('Stats')
  return new Promise((resolve, reject) => {
    const request = store.get(`${key}`)
    request.onsuccess = function () {
      resolve(request.result?.value)
    }
  })
}
