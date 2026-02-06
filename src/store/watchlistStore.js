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

function makeKey(id, mediaType = 'movie') {
  return `${mediaType}-${id}`
}

export function isInWatchlist(id, mediaType = 'movie') {
  const key = makeKey(id, mediaType)
  return read().some((x) => x.key === key)
}

export function toggleWatchlist(item) {
  const mediaType = item.mediaType || 'movie'
  const key = makeKey(item.id, mediaType)

  const items = read()
  const exists = items.some((x) => x.key === key)

  const normalized = {
    key,
    id: item.id,
    mediaType,
    title: item.title,
    poster_path: item.poster_path,
    vote_average: item.vote_average,
    release_date: item.release_date,
    first_air_date: item.first_air_date,
    seen: item.seen ?? false,
    addedAt: item.addedAt ?? Date.now(),
  }

  const next = exists
    ? items.filter((x) => x.key !== key)
    : [normalized, ...items]

  write(next)
  return next
}

export function toggleSeen(id, mediaType = 'movie') {
  const key = makeKey(id, mediaType)
  const items = read()
  const next = items.map((x) => (x.key === key ? { ...x, seen: !x.seen } : x))
  write(next)
  return next
}

export function removeFromWatchlist(id, mediaType = 'movie') {
  const key = makeKey(id, mediaType)
  const next = read().filter((x) => x.key !== key)
  write(next)
  return next
}
