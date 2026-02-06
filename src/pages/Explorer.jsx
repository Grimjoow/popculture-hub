import { useEffect, useMemo, useState } from 'react'
import MediaCard from '../components/MediaCard'
import EmptyState from '../components/EmptyState'
import { getTrending, searchByType } from '../services/tmdbApi'
import { debounce } from '../utils/debounce'

function Explorer() {
  const [inputValue, setInputValue] = useState('')
  const [query, setQuery] = useState('')

  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)

  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')

  const [mediaType, setMediaType] = useState('movie') // "movie" | "tv"
  const [hasMore, setHasMore] = useState(true)

  const debouncedSetQuery = useMemo(
    () => debounce((value) => setQuery(value), 400),
    []
  )

  const trimmedQuery = query.trim()
  const isSearching = Boolean(inputValue.trim())
  const label = mediaType === 'tv' ? 'Séries' : 'Films'

  // Reset pagination when query OR mediaType changes
  useEffect(() => {
    setPage(1)
    setItems([])
    setHasMore(true)
  }, [trimmedQuery, mediaType])

  // Load first page when query OR mediaType changes
  useEffect(() => {
    let cancelled = false

    async function loadFirstPage() {
      try {
        setLoading(true)
        setError('')

        const data = isSearching
          ? await searchByType(mediaType, trimmedQuery, 1)
          : await getTrending(mediaType, 'week', 1)

        if (cancelled) return

        setItems(data.results || [])
        const totalPages = data.total_pages || 1
        setHasMore(1 < totalPages)
      } catch (err) {
        if (cancelled) return
        setError(err?.message || 'Erreur lors du chargement')
      } finally {
        if (cancelled) return
        setLoading(false)
      }
    }

    loadFirstPage()

    return () => {
      cancelled = true
    }
  }, [isSearching, trimmedQuery, mediaType])

  async function handleLoadMore() {
    if (loadingMore || loading || !hasMore) return

    const nextPage = page + 1
    setLoadingMore(true)
    setError('')

    try {
      const data = isSearching
        ? await searchByType(mediaType, trimmedQuery, nextPage)
        : await getTrending(mediaType, 'week', nextPage)

      setItems((prev) => [...prev, ...(data.results || [])])

      const totalPages = data.total_pages || nextPage
      setHasMore(nextPage < totalPages)
      setPage(nextPage)
    } catch (err) {
      setError(err?.message || 'Erreur lors du chargement')
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <div style={{ padding: 12 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
        <div className="pageHeading">
          <div className="pageHeadingTop">
            <h2 className="pageTitle">{isSearching ? 'Résultats de recherche' : 'Tendances de la semaine'}</h2>
            <span className={`pageBadge ${mediaType}`}>{label}</span>
          </div>

          <p className="pageSubtitle">Films & séries — tendances et watchlist.</p>
          <div className="pageAccentBar"></div>
        </div>

        {inputValue && (
          <button
            type="button"
            onClick={() => {
              setInputValue('')
              setQuery('')
              setItems([])
              setPage(1)
              setHasMore(true)
            }}
          >
            Effacer
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 10, marginTop: 10, marginBottom: 12 }}>
        <button
          type="button"
          onClick={() => setMediaType('movie')}
          style={{
            borderColor: mediaType === 'movie' ? 'rgba(124, 92, 255, 0.55)' : undefined,
            boxShadow: mediaType === 'movie' ? '0 0 0 3px rgba(124, 92, 255, 0.15)' : undefined,
          }}
        >
          Films
        </button>

        <button
          type="button"
          onClick={() => setMediaType('tv')}
          style={{
            borderColor: mediaType === 'tv' ? 'rgba(34, 197, 94, 0.55)' : undefined,
            boxShadow: mediaType === 'tv' ? '0 0 0 3px rgba(34, 197, 94, 0.12)' : undefined,
          }}
        >
          Séries
        </button>
      </div>

      {/* Search */}
      <input
        type="search"
        value={inputValue}
        placeholder={mediaType === 'tv' ? 'Rechercher une série…' : 'Rechercher un film…'}
        onChange={(e) => {
          const v = e.target.value
          setInputValue(v)

          if (!v.trim()) {
            setQuery('')
            return
          }
          debouncedSetQuery(v)
        }}
        style={{ maxWidth: 520, marginTop: 10, marginBottom: 16 }}
      />

      {loading && <p>Chargement…</p>}
      {!loading && error && <p>Erreur : {error}</p>}

      {!loading && !error && items.length === 0 && (
        <div style={{ marginTop: 14 }}>
          <EmptyState
            title="Aucun résultat"
            description="Essaie un autre mot-clé, ou reviens aux tendances."
            ctaLabel="Retour aux tendances"
            onCtaClick={() => {
              setInputValue('')
              setQuery('')
              setItems([])
              setPage(1)
              setHasMore(true)
            }}
          />
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
              gap: 16,
              marginTop: 14,
            }}
          >
            {items.map((m) => (
              <MediaCard
                key={`${m.id}-${m.release_date || m.first_air_date || ''}`}
                item={m}
                mediaType={mediaType}
              />
            ))}
          </div>

          <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center' }}>
            {hasMore ? (
              <button type="button" onClick={handleLoadMore} disabled={loadingMore}>
                {loadingMore ? 'Chargement…' : 'Charger plus'}
              </button>
            ) : (
              <p style={{ margin: 0 }}>Fin des résultats.</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Explorer
