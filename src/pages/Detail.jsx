import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getCredits, getDetails } from '../services/tmdbApi'
import { isInWatchlist, toggleWatchlist } from '../store/watchlistStore'
import styles from './Detail.module.css'

const IMG_BASE = 'https://image.tmdb.org/t/p/w500'

function Detail() {
  const { mediaType = 'movie', id } = useParams()

  const [media, setMedia] = useState(null)
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

        const [data, creditsData] = await Promise.all([
          getDetails(mediaType, id),
          getCredits(mediaType, id),
        ])

        if (cancelled) return

        setMedia(data)
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
  }, [mediaType, id])

  useEffect(() => {
    if (!media) return
    setInWatchlist(isInWatchlist(media.id, mediaType))
  }, [media?.id, mediaType])

  if (loading) return <p>Chargement…</p>
  if (error) return <p>Erreur : {error}</p>
  if (!media) return null

  const title = media.title || media.name || 'Titre inconnu'
  const date = media.release_date || media.first_air_date || '—'

  return (
    <div className={styles.layout}>
      <div>
        {media.poster_path && (
          <img
            src={`${IMG_BASE}${media.poster_path}`}
            alt={`Affiche de ${title}`}
            className={styles.poster}
          />
        )}
      </div>

      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.watchBtn}
            onClick={() => {
              const next = toggleWatchlist({
                id: media.id,
                mediaType,
                title,
                poster_path: media.poster_path,
                vote_average: media.vote_average,
                release_date: media.release_date,
                first_air_date: media.first_air_date,
              })
              setInWatchlist(next.some((x) => x.key === `${mediaType}-${media.id}`))
            }}
          >
            {inWatchlist ? 'Retirer de la Watchlist' : 'Ajouter à la Watchlist'}
          </button>
        </div>

        <p><strong>Type :</strong> {mediaType === 'tv' ? 'Série' : 'Film'}</p>
        <p><strong>Note :</strong> {media.vote_average?.toFixed(1) ?? 'N/A'}</p>
        <p><strong>Date :</strong> {date}</p>

        {media.genres?.length > 0 && (
          <p>
            <strong>Genres :</strong> {media.genres.map((g) => g.name).join(', ')}
          </p>
        )}

        <p className={styles.synopsis}>{media.overview || 'Pas de synopsis.'}</p>

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
                  style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}
                >
                  <div style={{ aspectRatio: '2 / 3', background: 'rgba(255,255,255,0.04)' }}>
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
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{person.name}</div>
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
