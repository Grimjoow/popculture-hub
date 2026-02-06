import { tmdbFetch } from './tmdbClient'

export function getPopularMovies(page = 1) {
  return tmdbFetch(`/movie/popular?language=fr-FR&page=${page}`)
}

export function getPopularTv(page = 1) {
  return tmdbFetch(`/tv/popular?language=fr-FR&page=${page}`)
}
export function getMovieDetails(id) {
  return tmdbFetch(`/movie/${id}?language=fr-FR`)
}
export function getMovieCredits(id) {
  return tmdbFetch(`/movie/${id}/credits?language=fr-FR`)
}
export function getTrendingMovies(timeWindow = 'week', page = 1) {
  return tmdbFetch(`/trending/movie/${timeWindow}?language=fr-FR&page=${page}`)
}

export function searchMovies(query, page = 1) {
  const q = encodeURIComponent(query)
  return tmdbFetch(`/search/movie?language=fr-FR&query=${q}&page=${page}&include_adult=false`)
}
