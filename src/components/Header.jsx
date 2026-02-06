import { NavLink } from 'react-router-dom'
import styles from './Header.module.css'

function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <NavLink to="/" className={styles.brand} aria-label="Retour à l’accueil">
          <div className={styles.logo} />
          <span>PopCulture Hub</span>
        </NavLink>

        <nav className={styles.nav}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
          >
            Explorer
          </NavLink>

          <NavLink
            to="/watchlist"
            className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
          >
            Watchlist
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Header
