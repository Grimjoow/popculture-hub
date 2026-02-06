import { useEffect, useState } from 'react'

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400)
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        borderRadius: '50%',
        width: 44,
        height: 44,
        fontSize: 18,
        boxShadow: 'var(--shadow)',
        zIndex: 20,
      }}
      aria-label="Retour en haut"
    >
      ↑
    </button>
  )
}

export default ScrollToTopButton
