import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const navLinks = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/usuarios", label: "Usuários" },
  { path: "/locador", label: "Locador" },
  { path: "/locatarios", label: "Locatários" },
  { path: "/imoveis", label: "Imóveis" },
  { path: "/contratos", label: "Contratos" },
  { path: "/recebimentos", label: "Recebimentos" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    // localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo + Nome */}
        <Link
          to="/dashboard"
          className="navbar-brand"
          onClick={() => setMenuOpen(false)}
        >
          <div className="brand-logo">
            <img src="/logo-j.svg" alt="Contratos" className="logo-img" />
          </div>
          <span className="brand-name">Contratos</span>
        </Link>

        {/* Links */}
        <nav className={`navbar-links ${menuOpen ? "open" : ""}`}>
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Ações à direita */}
        <div className="navbar-actions">
          <button className="logout-btn" onClick={handleLogout}>
            Sair
          </button>

          {/* Menu mobile */}
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menu"
          >
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}