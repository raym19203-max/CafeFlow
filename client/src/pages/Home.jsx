import "../styles/home.css";
import "../styles/cart.css";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

function Home() {
  const navigate = useNavigate();

  // ==========================================
  // SHARED CART
  // ==========================================

  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const [showCart, setShowCart] = useState(false);

  // ==========================================
  // CART COUNT
  // ==========================================

  const cartCount = cart.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  );

  // ==========================================
  // CART TOTAL
  // ==========================================

  const total = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price) * Number(item.quantity),
    0
  );

  return (
    <>
      {/* ======================================
          NAVBAR
      ====================================== */}

      <Navbar
        cartCount={cartCount}
        onCartClick={() => setShowCart(true)}
      />

      {/* ======================================
          CART DRAWER
      ====================================== */}

      {showCart && (
        <div className="cart-drawer">

          {/* CART HEADER */}

          <div className="cart-header">

            <h2>🛒 Your Cart</h2>

            <button
              className="close-btn"
              onClick={() => setShowCart(false)}
            >
              ✖
            </button>

          </div>

          {/* EMPTY CART */}

          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              {/* CART ITEMS */}

              {cart.map((item) => (
                <div
                  className="cart-item"
                  key={item.id}
                >

                  <h4>{item.name}</h4>

                  <p>
                    Rs. {item.price} × {item.quantity}
                    {" = "}
                    <b>
                      Rs.{" "}
                      {Number(item.price) *
                        Number(item.quantity)}
                    </b>
                  </p>

                  {/* QUANTITY */}

                  <div className="quantity-box">

                    <button
                      onClick={() =>
                        decreaseQuantity(item.id)
                      }
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        increaseQuantity(item.id)
                      }
                    >
                      +
                    </button>

                  </div>

                  {/* REMOVE */}

                  <button
                    className="remove-btn"
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                  >
                    Remove
                  </button>

                  <hr />

                </div>
              ))}

              {/* =================================
                  CHECKOUT
              ================================= */}

              <div className="checkout-section">

                <h3 className="total">
                  Total: Rs. {total}
                </h3>

                <button
                  className="checkout-btn"
                  onClick={() => {
                    setShowCart(false);

                    navigate("/checkout", {
                      state: {
                        cart: cart,
                      },
                    });
                  }}
                >
                  Proceed to Checkout
                </button>

              </div>
            </>
          )}
        </div>
      )}

      {/* ======================================
          HERO SECTION
      ====================================== */}

      <section className="hero-section">

        <div className="hero-overlay">

          <div className="hero-content">

            <p className="hero-small-title">
              WELCOME TO CAFEFLOW
            </p>

            <h1>
              Fresh Food,
              <br />
              <span>Warm Moments</span>
            </h1>

            <p className="hero-description">
              Fresh food, warm drinks,
              and a friendly atmosphere.
            </p>

            <Link
              to="/menu"
              className="hero-menu-btn"
            >
              View Our Menu →
            </Link>

          </div>

        </div>

      </section>

      {/* ==========================================
          SECOND HOME SECTION
      ========================================== */}

      <section className="home-story-section">

        <div className="home-story-image">

          <img
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"
            alt="Fresh coffee and cafe"
          />

        </div>

        <div className="home-story-content">

          <p className="story-small-title">
            OUR CAFE
          </p>

          <h2>
            Fresh Flavours,
            <br />
            Happy Moments
          </h2>

          <p>
            At CafeFlow, every cup and every plate
            is prepared with care. Enjoy freshly made
            food, delicious coffee, and a relaxing
            atmosphere with your friends and family.
          </p>

          <p>
            Whether you are starting your morning
            with a hot coffee or enjoying a delicious
            meal, we are here to make your visit special.
          </p>

          <button
            className="story-btn"
            onClick={() => navigate("/menu")}
          >
            Discover Our Menu →
          </button>

        </div>

      </section>

      {/* ==========================================
          ONO CAFE REVIEW SECTION
      ========================================== */}

      <section className="review-section">

        {/* HEADING */}

        <div className="review-heading">

          <h2>
            ⭐ Share Your Experience ⭐
          </h2>

          <p>
            Visited Ono Cafe?
            We would love to hear about your experience.
            Leave us a review on Google Maps.
          </p>

        </div>

        {/* MAIN REVIEW CONTAINER */}

        <div className="review-container">

          {/* ======================================
              GOOGLE MAP
          ====================================== */}

          <div className="review-map">

            <iframe
              title="Ono Cafe Tinpaini Biratnagar"
              src="https://www.google.com/maps?q=Ono+Cafe+Tinpaini+Biratnagar+Nepal&output=embed"
              loading="lazy"
              allowFullScreen
            ></iframe>

          </div>

          {/* ======================================
              HOW IT WORKS
          ====================================== */}

          <div className="review-card">

            <h2>
              How it Works
            </h2>

            <p className="review-intro">
              It only takes a few seconds to
              share your experience with us.
            </p>

            {/* STEP 1 */}

            <div className="review-step">

              <span className="step-number">
                1
              </span>

              <div>

                <h3>
                  Open Ono Cafe on Google Maps
                </h3>

                <p>
                  Click the button below to open
                  Ono Cafe on Google Maps.
                </p>

              </div>

            </div>

            {/* STEP 2 */}

            <div className="review-step">

              <span className="step-number">
                2
              </span>

              <div>

                <h3>
                  Share your honest feedback
                </h3>

                <p>
                  Give us a rating and write
                  a quick comment about your visit.
                </p>

              </div>

            </div>

            {/* STEP 3 */}

            <div className="review-step">

              <span className="step-number">
                3
              </span>

              <div>

                <h3>
                  Thank you for your review
                </h3>

                <p>
                  Your feedback helps us improve
                  our food and service.
                </p>

              </div>

            </div>

            {/* GOOGLE MAP BUTTON */}

            <a
              href="https://www.google.com/maps/search/?api=1&query=Ono+Cafe+Tinpaini+Biratnagar+Nepal"
              target="_blank"
              rel="noopener noreferrer"
              className="google-review-btn"
            >
              📍 Open Ono Cafe Reviews ↗
            </a>

            {/* NOTE */}

            <div className="review-note">

              ✓ No account needed
              &nbsp; • &nbsp;
              ✓ Takes only a few seconds

            </div>

          </div>

        </div>

      </section>

      {/* ==========================================
          FOOTER
      ========================================== */}

      <footer className="footer">

        <div className="footer-container">

          {/* =================================
              ABOUT CAFE
          ================================= */}

          <div className="footer-column">

            <h2 className="footer-logo">
              CafeFlow
            </h2>

            <p>
              Your cozy place for delicious food,
              fresh coffee, and warm moments.
            </p>

            <p>
              Enjoy freshly prepared meals and
              refreshing drinks in a friendly
              atmosphere.
            </p>

          </div>

          {/* =================================
              QUICK LINKS
          ================================= */}

          <div className="footer-column">

            <h3>Quick Links</h3>

            <ul>

              <li>
                <Link to="/">
                  Home
                </Link>
              </li>

              <li>
                <Link to="/menu">
                  Menu
                </Link>
              </li>

              <li>
                <Link to="/offers">
                  Offers
                </Link>
              </li>

              <li>
                <Link to="/contact">
                  Contact
                </Link>
              </li>

            </ul>

          </div>

          {/* =================================
              CONTACT
          ================================= */}

          <div className="footer-column">

            <h3>Contact Us</h3>

            {/* LOCATION */}

            <p className="contact-item">

              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" />
                <circle
                  cx="12"
                  cy="9"
                  r="2.5"
                />
              </svg>

              <span>
                Tinpaini, Biratnagar, Nepal
              </span>

            </p>

            {/* PHONE */}

            <p className="contact-item">

              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .7 2.9a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.4 1.9.6 2.9.7a2 2 0 0 1 1.8 2z" />
              </svg>

              <span>
                +977 9709022843
              </span>

            </p>

            {/* EMAIL */}

            <p className="contact-item">

              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                />

                <path d="m3 7 9 6 9-6" />
              </svg>

              <span>
                info@cafeflow.com
              </span>

            </p>

            {/* OPENING HOURS */}

            <p className="contact-item">

              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                />

                <path d="M12 7v5l3 2" />
              </svg>

              <span>
                Open Daily: 8:00 AM - 10:00 PM
              </span>

            </p>

          </div>

          {/* =================================
              FOLLOW US
          ================================= */}

          <div className="footer-column">

            <h3>
              Follow Us
            </h3>

            <p>
              Follow CafeFlow for our latest
              food, offers and updates.
            </p>

            <div className="social-links">

              {/* INSTAGRAM */}

              <a
                href="#"
                className="social-icon"
                aria-label="Instagram"
              >

                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >

                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="5"
                  />

                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                  />

                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                  />

                </svg>

              </a>

              {/* FACEBOOK */}

              <a
                href="#"
                className="social-icon"
                aria-label="Facebook"
              >

                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="currentColor"
                >

                  <path d="M14 8h3V4h-3c-3.3 0-5 1.7-5 5v3H6v4h3v6h4v-6h3.5l.5-4H13V9c0-.7.3-1 1-1z" />

                </svg>

              </a>

              {/* TIKTOK */}

              <a
                href="#"
                className="social-icon"
                aria-label="TikTok"
              >

                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="currentColor"
                >

                  <path d="M15.5 3c.4 2.4 1.7 3.8 4 4v3.2c-1.5.1-2.8-.3-4-1v6.3c0 3.6-2.4 5.5-5.4 5.5-2.9 0-5.1-1.9-5.1-4.7 0-3 2.5-4.9 5.8-4.6v3.2c-1.5-.2-2.6.4-2.6 1.5 0 .9.7 1.5 1.7 1.5 1.1 0 2.3-.7 2.3-2.6V3h3.3z" />

                </svg>

              </a>

            </div>

          </div>

        </div>

        {/* =================================
            FOOTER BOTTOM
        ================================= */}

        <div className="footer-bottom">

          <p>
            © 2026 CafeFlow. All rights reserved.
          </p>

          <p>
            Made with ❤️ for food lovers.
          </p>

        </div>

      </footer>

    </>
  );
}

export default Home;