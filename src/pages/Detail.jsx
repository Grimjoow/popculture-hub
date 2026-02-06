import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getMovieCredits, getMovieDetails } from '../services/tmdbApi'
import { isInWatchlist, toggleWatchlist } from '../store/watchlistStore'


const IMG_BASE = 'https://image.tmdb.org/t/p/w500'

function Detail() {
  const { id } = useParams()

  const [movie, setMovie] = useState(null)
  const [cast, setCast] = useState([])
  const [inWatchlist, setInWatchlist] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

useEffect(() => {
  let cancelled = false

  async function load() {
    try {
      setLoading(true)
      setError('')

      const [movieData, creditsData] = await Promise.all([
        getMovieDetails(id),
        getMovieCredits(id),
      ])

      if (cancelled) return

      setMovie(movieData)
      setCast((creditsData.cast || []).slice(0, 12))
    } catch (err) {
      if (cancelled) return
      setError(err.message || 'Erreur lors du chargement')
    } finally {
      if (cancelled) return
      setLoading(false)
    }
  }

  load()

  return () => {
    cancelled = true
  }
}, [id])

useEffect(() => {
  if (!movie) return
  setInWatchlist(isInWatchlist(movie.id))
}, [movie?.id])



  if (loading) return <p>Chargement…</p>
  if (error) return <p>Erreur : {error}</p>
  if (!movie) return null

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>
      <div>
        {movie.poster_path && (
          <img
            src={`${IMG_BASE}${movie.poster_path}`}
            alt={`Affiche de ${movie.title}`}
            style={{ width: '100%', borderRadius: 8 }}
          />
        )}
      </div>

      <div>
        <h2>{movie.title}</h2>
<button
  type="button"
  onClick={() => {
    const next = toggleWatchlist({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
    })
    setInWatchlist(next.some((x) => x.id === movie.id))
  }}
  style={{
    marginTop: 10,
    padding: '8px 12px',
    borderRadius: 8,
    border: '1px solid #ddd',
    cursor: 'pointer',
  }}
>
  {inWatchlist ? 'Retirer de la Watchlist' : 'Ajouter à la Watchlist'}
</button>


        <p><strong>Note :</strong> {movie.vote_average?.toFixed(1) ?? 'N/A'}</p>
        <p><strong>Date de sortie :</strong> {movie.release_date || '—'}</p>

        {movie.genres?.length > 0 && (
          <p>
            <strong>Genres :</strong>{' '}
            {movie.genres.map((g) => g.name).join(', ')}
          </p>
        )}

        <p style={{ marginTop: 16 }}>{movie.overview || 'Pas de synopsis.'}</p>
        <h3 style={{ marginTop: 24 }}>Casting</h3>

{cast.length === 0 ? (
  <p>Pas d’informations de casting.</p>
) : (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
      gap: 12,
      marginTop: 12,
    }}
  >
    {cast.map((person) => {
      const profile = person.profile_path
        ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
        : null

      return (
        <div
          key={person.cast_id ?? person.credit_id ?? person.id}
          style={{ border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden' }}
        >
          <div style={{ aspectRatio: '2 / 3', background: '#f3f3f3' }}>
            {profile ? (
              <img
                src={profile}
                alt={person.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                loading="lazy"
              />
            ) : (
              <div style={{ padding: 10 }}>Pas de photo</div>
            )}
          </div>
          <div style={{ padding: 10 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{person.name}</div>
            <div style={{ opacity: 0.8, fontSize: 12 }}>{person.character}</div>
          </div>
        </div>
      )
    })}
  </div>
)}

      </div>
    </div>
  )
}

export default Detail
