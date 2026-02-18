import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Disable body scroll when drawer is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🧠</span>
          <span className="logo-text">Second Brain</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="nav-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/add" className="nav-link">
            Add Note
          </Link>
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
          <Link to="/ask" className="nav-link">
            Ask AI
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="menu-button"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className="menu-line"></span>
          <span className="menu-line"></span>
          <span className="menu-line"></span>
        </button>

        {/* Mobile Drawer Overlay */}
        <div 
          className={`overlay ${isMenuOpen ? "visible" : ""}`} 
          onClick={closeMenu}
        ></div>

        {/* Mobile Drawer Sidebar */}
        <div className={`drawer ${isMenuOpen ? "open" : ""}`}>
          <button className="close-button" onClick={closeMenu} aria-label="Close menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <div className="drawer-links">
            <Link to="/" className="drawer-link" onClick={closeMenu}>
              Home
            </Link>
            <Link to="/add" className="drawer-link" onClick={closeMenu}>
              Add Note
            </Link>
            <Link to="/dashboard" className="drawer-link" onClick={closeMenu}>
              Dashboard
            </Link>
            <Link to="/ask" className="drawer-link" onClick={closeMenu}>
              Ask AI
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
