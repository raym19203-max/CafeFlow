
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/navbar.css";

function Navbar({ cartCount = 0, onCartClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav className="navbar">
      <Link to="/" className="logo" onClick={closeMenu}>
        ☕ CafeFlow
      </Link>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" onClick={closeMenu}>Home</Link>
        <Link to="/menu" onClick={closeMenu}>Menu</Link>
        <Link to="/offers" onClick={closeMenu}>Offers</Link>
        <Link to="/contact" onClick={closeMenu}>Contact</Link>
      </div>

      <div className="navbar-actions">
        <button
          type="button"
          className="cart-btn"
          onClick={() => {
            closeMenu();
            if (onCartClick) onCartClick();
          }}
          aria-label={`Open cart, ${cartCount} items`}
        >
          🛒
          <span className="cart-count">{cartCount}</span>
        </button>

        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;









// import "../styles/navbar.css";
// import { Link } from "react-router-dom";

// function Navbar({ cartCount = 0, onCartClick }) {
//   return (
//     <nav className="navbar">
//       <h2 className="logo">☕ CafeFlow</h2>

//       <div className="nav-links">
//         <Link to="/">Home</Link>
//         <Link to="/menu">Menu</Link>
//         <Link to="/offers">Offers</Link>
//         <Link to="/contact">Contact</Link>
//       </div>

//       <button
//         type="button"
//         className="cart-btn"
//         onClick={onCartClick}
//         aria-label={`Open cart, ${cartCount} items`}
//       >
//         🛒
//         <span className="cart-count">{cartCount}</span>
//       </button>
//     </nav>
//   );
// }

// export default Navbar;
