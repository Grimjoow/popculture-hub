const BASE_URL = 'https://api.themoviedb.org/3'

export async function tmdbFetch(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  if (!response.ok) {
    // On essaie de récupérer le message d’erreur TMDB si possible
    let details = ''
    try {
      const data = await response.json()
      details = data?.status_message ? ` — ${data.status_message}` : ''
    } catch {
      // ignore
    }
    throw new Error(`TMDB error (${response.status})${details}`)
  }

  return response.json()
}
