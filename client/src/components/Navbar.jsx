// import "../styles/navbar.css";
// import { Link } from "react-router-dom";

// function Navbar({ cartCount,onCartClick }) {
//   return (
//     <nav className="navbar">

//       <h2 className="logo">☕ CafeFlow</h2>

//       <div className="nav-links">
//         <a href="#">Home</a>
//         <a href="#">Offers</a>
//         <a href="/menu">Menu</a>
//         <a href="/contact">Contact</a>
//       </div>

//       <button className="cart-btn"  onClick={onCartClick}>
//         🛒 <span className="cart-count">{cartCount}</span>
//       </button>

//     </nav>
//   );
// }

// export default Navbar;





import "../styles/navbar.css";
import { Link } from "react-router-dom";

function Navbar({ cartCount, onCartClick }) {

  return (
    <nav className="navbar">

      {/* Logo */}
      <h2 className="logo">
        ☕ CafeFlow
      </h2>


      {/* Navigation */}
      <div className="nav-links">

        <Link to="/">
          Home
        </Link>

        {/* <Link to="/offers">
          Offers
        </Link> */}

        <Link to="/menu">
          Menu
        </Link>

        <Link to="/offers">
          Offers
        </Link>

        <Link to="/contact">
          Contact
        </Link>

      </div>


      {/* Cart */}
      <button
        className="cart-btn"
        onClick={onCartClick}
      >
        🛒
        <span className="cart-count">
          {cartCount}
        </span>
      </button>

    </nav>
  );
}

export default Navbar;