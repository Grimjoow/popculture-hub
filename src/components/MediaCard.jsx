import { Link } from 'react-router-dom'
import styles from './MediaCard.module.css'

const IMG_BASE = 'https://image.tmdb.org/t/p/w342'

function MediaCard({ item }) {
  const title = item.title || item.name || 'Titre inconnu'
  const posterPath = item.poster_path
  const rating = item.vote_average
  const year = (item.release_date || item.first_air_date || '').slice(0, 4)

  return (
    <article className={styles.card}>
      <Link to={`/detail/${item.id}`} className={styles.link}>
        <div className={styles.posterWrap}>
          {item.seen ? <div className={styles.badge}>Vu</div> : null}
          {posterPath ? (
            <img
              src={`${IMG_BASE}${posterPath}`}
              alt={`Affiche de ${title}`}
              className={styles.poster}
              loading="lazy"
            />
          ) : null}
        </div>

        <div className={styles.body}>
          <div className={styles.title}>{title}</div>
          <div className={styles.meta}>
            <span>{year || '—'}</span>
            <span>★ {rating ? rating.toFixed(1) : 'N/A'}</span>
          </div>
        </div>
      </Link>
    </article>
  )
}

export default MediaCard
