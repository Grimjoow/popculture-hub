const STORAGE_KEY = 'popculture_watchlist_v1'

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function write(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function getWatchlist() {
  return read()
}

export function isInWatchlist(id) {
  return read().some((x) => x.id === id)
}

export function toggleWatchlist(item) {
  const items = read()
  const exists = items.some((x) => x.id === item.id)

  const next = exists ? items.filter((x) => x.id !== item.id) : [{ ...item, seen: false, addedAt: Date.now() }, ...items]
  write(next)
  return next
}

export function toggleSeen(id) {
  const items = read()
  const next = items.map((x) => (x.id === id ? { ...x, seen: !x.seen } : x))
  write(next)
  return next
}

export function removeFromWatchlist(id) {
  const next = read().filter((x) => x.id !== id)
  write(next)
  return next
}
