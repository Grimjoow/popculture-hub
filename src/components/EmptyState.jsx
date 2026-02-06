import { Link } from 'react-router-dom'

function EmptyState({ title, description, ctaLabel, ctaTo, onCtaClick }) {
  return (
    <div
      style={{
        border: '1px solid var(--border)',
        background: 'var(--surface)',
        borderRadius: 'var(--radius)',
        padding: 18,
        boxShadow: 'var(--shadow)',
        maxWidth: 520,
      }}
    >
      <h3 style={{ marginBottom: 8 }}>{title}</h3>
      <p style={{ marginTop: 0 }}>{description}</p>

      {ctaLabel && onCtaClick && (
        <button
          type="button"
          onClick={onCtaClick}
          style={{
            marginTop: 10,
            borderRadius: 12,
            border: '1px solid rgba(124, 92, 255, 0.55)',
            background: 'rgba(124, 92, 255, 0.12)',
          }}
        >
          {ctaLabel}
        </button>
      )}

      {ctaLabel && ctaTo && !onCtaClick && (
        <Link
          to={ctaTo}
          style={{
            display: 'inline-block',
            marginTop: 10,
            textDecoration: 'none',
            padding: '10px 12px',
            borderRadius: 12,
            border: '1px solid rgba(124, 92, 255, 0.55)',
            background: 'rgba(124, 92, 255, 0.12)',
            color: 'var(--text)',
          }}
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  )
}

export default EmptyState
