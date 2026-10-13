import { useState } from "react"
import "./nav-bar.css"

function Navbar({ onNavigateProducts }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const navigate = (event, callback) => {
    event.preventDefault()
    callback?.()
    setMenuOpen(false)
  }

  return (
    <header className="navbar-shell">
      <nav className="navbar" aria-label="Primary">
        <a className="navbar__brand" href="#home" onClick={(event) => navigate(event, () => window.scrollTo({ top: 0, behavior: "smooth" }))}>
          <span className="navbar__logo">PX</span>
          <span>
            <strong>PARTS / INDEX</strong>
            <small>PC component showcase</small>
          </span>
        </a>
        <button className="navbar__toggle" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          <span /><span /><span />
        </button>
        <div className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}>
          <a href="#products" onClick={(event) => navigate(event, onNavigateProducts)}>Collection</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About the index</a>
        </div>
        <span className="navbar__edition">Edition 01 / 2026</span>
      </nav>
    </header>
  )
}

export default Navbar
