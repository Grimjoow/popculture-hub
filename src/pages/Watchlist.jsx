import { useEffect, useMemo, useState } from 'react'
import { getWatchlist, removeFromWatchlist, toggleSeen } from '../store/watchlistStore'
import MediaCard from '../components/MediaCard'
import EmptyState from '../components/EmptyState'
const SORT_STORAGE_KEY = 'popculture_watchlist_sort_v1'


function Watchlist() {
  const [items, setItems] = useState([])

  const [sortField, setSortField] = useState('addedAt') // addedAt | rating | title | seen
  const [sortOrder, setSortOrder] = useState('desc')    // asc | desc

useEffect(() => {
  setItems(getWatchlist())

  // Lire le tri sauvegardé
  try {
    const raw = localStorage.getItem(SORT_STORAGE_KEY)
    if (raw) {
      const saved = JSON.parse(raw)
      const allowedFields = new Set(['addedAt', 'rating', 'title', 'seen'])
        if (allowedFields.has(saved?.field)) setSortField(saved.field)

      if (saved?.order) setSortOrder(saved.order)
    }
  } catch (e) {
    // ignore
  }
}, [])

useEffect(() => {
  localStorage.setItem(
    SORT_STORAGE_KEY,
    JSON.stringify({ field: sortField, order: sortOrder })
  )
}, [sortField, sortOrder])


  const sortedItems = useMemo(() => {
  const copy = [...items]

  const dir = sortOrder === 'asc' ? 1 : -1

  return copy.sort((a, b) => {
    switch (sortField) {
      case 'addedAt':
        return ((a.addedAt || 0) - (b.addedAt || 0)) * dir

      case 'rating':
        return ((a.vote_average || 0) - (b.vote_average || 0)) * dir

      case 'title':
        return (a.title || '').localeCompare(b.title || '', 'fr') * dir

      case 'seen':
        // vu = true (1), à voir = false (0)
        return (Number(a.seen) - Number(b.seen)) * dir

      default:
      


        return 0
    }
  })
}, [items, sortField, sortOrder])
if (items.length === 0) {
  return (
    <div>
      <h2>Watchlist</h2>
      <div style={{ marginTop: 14 }}>
        <EmptyState
          title="Ta watchlist est vide"
          description="Ajoute des films depuis une page détail pour les retrouver ici."
          ctaLabel="Explorer les tendances"
          ctaTo="/"
        />
      </div>
    </div>
  )
}

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
  <h2>Watchlist</h2>

  <div className="controlRow">
    <label style={{ color: 'var(--muted)' }}>
      Tri&nbsp;
      <select
        className="select"
        value={sortField}
        onChange={(e) => setSortField(e.target.value)}
      >
        <option value="addedAt">Ajout</option>
        <option value="rating">Note</option>
        <option value="title">Titre</option>
        <option value="seen">Vu / À voir</option>
      </select>
    </label>

    <label style={{ color: 'var(--muted)' }}>
      Ordre&nbsp;
      <select
        className="select"
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
      >
        <option value="desc">Desc</option>
        <option value="asc">Asc</option>
      </select>
    </label>
  </div>
</div>


      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
          gap: 16,
          marginTop: 14,
        }}
      >
        {sortedItems.map((item) => (
          <div key={item.id}>
            <MediaCard item={item} />

            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button type="button" onClick={() => setItems(toggleSeen(item.id))}>
                {item.seen ? 'Marquer à voir' : 'Marquer vu'}
              </button>

              <button type="button" onClick={() => setItems(removeFromWatchlist(item.id))}>
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Watchlist
