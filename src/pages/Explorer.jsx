import { useEffect, useMemo, useState } from 'react'
import MediaCard from '../components/MediaCard'
import EmptyState from '../components/EmptyState'
import { getTrendingMovies, searchMovies } from '../services/tmdbApi'
import { debounce } from '../utils/debounce'

function Explorer() {
  const [inputValue, setInputValue] = useState('')
  const [query, setQuery] = useState('')

  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)

  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')

  const [hasMore, setHasMore] = useState(true)

  const debouncedSetQuery = useMemo(
    () => debounce((value) => setQuery(value), 400),
    []
  )

  // Quand la query change, on reset la pagination
  useEffect(() => {
    setPage(1)
    setItems([])
    setHasMore(true)
  }, [query])

  // Charger la page 1 (après reset) ou recharger si besoin
  useEffect(() => {
    let cancelled = false

    async function loadFirstPage() {
      try {
        setLoading(true)
        setError('')

        const data = query.trim()
          ? await searchMovies(query.trim(), 1)
          : await getTrendingMovies('week', 1)

        if (cancelled) return

        setItems(data.results || [])
        // TMDB renvoie total_pages
        const totalPages = data.total_pages || 1
        setHasMore(1 < totalPages)
      } catch (err) {
        if (cancelled) return
        setError(err.message || 'Erreur lors du chargement')
      } finally {
        if (cancelled) return
        setLoading(false)
      }
    }

    loadFirstPage()

    return () => {
      cancelled = true
    }
  }, [query])

  async function handleLoadMore() {
    if (loadingMore || loading || !hasMore) return

    const nextPage = page + 1
    setLoadingMore(true)
    setError('')

    try {
      const data = query.trim()
        ? await searchMovies(query.trim(), nextPage)
        : await getTrendingMovies('week', nextPage)

      setItems((prev) => [...prev, ...(data.results || [])])

      const totalPages = data.total_pages || nextPage
      setHasMore(nextPage < totalPages)
      setPage(nextPage)
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement')
    } finally {
      setLoadingMore(false)
    }
  }

  const title = query.trim() ? 'Résultats de recherche' : 'Tendances de la semaine'

  return (
    <div style={{ padding: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
        <h2 style={{ marginTop: 0 }}>{title}</h2>

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

      <input
        type="search"
        value={inputValue}
        placeholder="Rechercher un film…"
        onChange={(e) => {
          const v = e.target.value
          setInputValue(v)
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
              <MediaCard key={`${m.id}-${m.release_date || ''}`} item={m} />
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
