import "../styles/offers.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import { useCart } from "../context/CartContext";

import menu from "../data/menu";


function Offers() {

  const navigate = useNavigate();

  // ==========================================
  // GLOBAL CART
  // ==========================================

  const {
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();


  // ==========================================
  // CART DRAWER
  // ==========================================

  const [showCart, setShowCart] = useState(false);


  // ==========================================
  // OFFER PRODUCTS
  // ==========================================

  const offerProducts = menu.slice(0, 8);


  // ==========================================
  // CART COUNT
  // ==========================================

  const cartCount = cart.reduce(
    (sum, item) =>
      sum + Number(item.quantity),
    0
  );


  // ==========================================
  // CART TOTAL
  // ==========================================

  const total = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price) *
      Number(item.quantity),
    0
  );


  return (
    <>
      {/* =====================================
          NAVBAR
      ===================================== */}

      <Navbar
        cartCount={cartCount}
        onCartClick={() =>
          setShowCart(true)
        }
      />


      {/* =====================================
          CART DRAWER
      ===================================== */}

      {showCart && (

        <div className="cart-drawer">

          {/* CART HEADER */}

          <div className="cart-header">

            <h2>
              🛒 Your Cart
            </h2>

            <button
              className="close-btn"
              onClick={() =>
                setShowCart(false)
              }
            >
              ✖
            </button>

          </div>


          {/* =================================
              EMPTY CART
          ================================= */}

          {cart.length === 0 ? (

            <p>
              Your cart is empty.
            </p>

          ) : (

            <>

              {/* =================================
                  CART ITEMS
              ================================= */}

              {cart.map((item) => (

                <div
                  className="cart-item"
                  key={item.id}
                >

                  <h4>
                    {item.name}
                  </h4>


                  <p>

                    Rs. {item.price} ×{" "}
                    {item.quantity}

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
                        decreaseQuantity(
                          item.id
                        )
                      }
                    >
                      -
                    </button>


                    <span>
                      {item.quantity}
                    </span>


                    <button
                      onClick={() =>
                        increaseQuantity(
                          item.id
                        )
                      }
                    >
                      +
                    </button>

                  </div>


                  {/* REMOVE */}

                  <button
                    className="remove-btn"
                    onClick={() =>
                      removeFromCart(
                        item.id
                      )
                    }
                  >
                    Remove
                  </button>


                  <hr />

                </div>

              ))}


              {/* =================================
                  TOTAL + CHECKOUT
              ================================= */}

              <div className="checkout-section">

                <h3 className="total">

                  Total: Rs. {total}

                </h3>


                <button
                  className="checkout-btn"
                  onClick={() => {
                    setShowCart(false);
                    navigate("/checkout");
                  }}
                >
                  Proceed to Checkout
                </button>

              </div>

            </>

          )}

        </div>

      )}


      {/* =====================================
          OFFER PAGE
      ===================================== */}

      <div className="offers-page">


        {/* ===================================
            HEADER
        =================================== */}

        <div className="offers-header">

          <span className="offer-line">
            🔥
          </span>


          <h1>
            Weekend Special Offers
          </h1>


          <span className="offer-line">
            🔥
          </span>


          <p>
            Grab your favourite food at
            special prices!
          </p>

        </div>


        {/* ===================================
            BANNER
        =================================== */}

        <div className="offer-banner">

          <div>

            <span className="banner-badge">
              LIMITED TIME
            </span>


            <h2>
              Delicious Deals
            </h2>


            <p>
              Enjoy amazing food with
              special offers.
            </p>

          </div>


          <div className="banner-icon">
            🍕
          </div>

        </div>


        {/* ===================================
            PRODUCT GRID
        =================================== */}

        <div className="offer-grid">

          {offerProducts.map(
            (item, index) => (

              <div
                className="offer-card"
                key={item.id}
              >

                {/* HOT BADGE */}

                <div className="offer-badge">
                  🔥 HOT
                </div>


                {/* DISCOUNT */}

                <div className="discount-badge">

                  {index % 2 === 0
                    ? "20% OFF"
                    : "15% OFF"}

                </div>


                {/* IMAGE */}

                <div className="offer-image">

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                </div>


                {/* CONTENT */}

                <div className="offer-content">

                  <h3>
                    {item.name}
                  </h3>


                  <p className="offer-description">
                    Special offer on this
                    delicious item.
                  </p>


                  {/* PRICE */}

                  <div className="offer-price">

                    <span className="old-price">

                      Rs.{" "}
                      {Math.round(
                        item.price * 1.2
                      )}

                    </span>


                    <span className="new-price">

                      Rs. {item.price}

                    </span>

                  </div>


                  {/* ADD TO CART */}

                  <button
                    className="offer-cart-btn"
                    onClick={() =>
                      addToCart(item)
                    }
                  >
                    🛒 Add to Cart
                  </button>

                </div>

              </div>

            )
          )}

        </div>

      </div>

    </>
  );
}


export default Offers;











// import "../styles/offers.css";

// import Navbar from "../components/Navbar";

// import menu from "../data/menu";

// import { useCart } from "../context/CartContext";


// function Offers() {

//   // ==============================
//   // Shared Cart
//   // ==============================

//   const {
//     cart,
//     addToCart,
//   } = useCart();


//   // ==============================
//   // Offer Products
//   // ==============================

//   const offerProducts = menu.slice(0, 8);


//   return (

//     <>

//       {/* ==============================
//           Navbar
//       ============================== */}

//       <Navbar
//         cartCount={cart.length}
//         onCartClick={() =>
//           window.location.href = "/checkout"
//         }
//       />


//       {/* ==============================
//           OFFER PAGE
//       ============================== */}

//       <div className="offers-page">


//         {/* ==============================
//             Heading
//         ============================== */}

//         <div className="offers-header">

//           <span className="offer-line">
//             🔥
//           </span>


//           <h1>
//             Weekend Special Offers
//           </h1>


//           <span className="offer-line">
//             🔥
//           </span>


//           <p>
//             Grab your favourite food at
//             special prices!
//           </p>

//         </div>


//         {/* ==============================
//             Offer Banner
//         ============================== */}

//         <div className="offer-banner">

//           <div>

//             <span className="banner-badge">
//               LIMITED TIME
//             </span>


//             <h2>
//               Delicious Deals
//             </h2>


//             <p>
//               Enjoy amazing food with
//               special offers.
//             </p>

//           </div>


//           <div className="banner-icon">
//             🍕
//           </div>

//         </div>


//         {/* ==============================
//             PRODUCT GRID
//         ============================== */}

//         <div className="offer-grid">


//           {offerProducts.map(
//             (item, index) => (

//               <div
//                 className="offer-card"
//                 key={item.id}
//               >


//                 {/* ==============================
//                     HOT BADGE
//                 ============================== */}

//                 <div className="offer-badge">
//                   🔥 HOT
//                 </div>


//                 {/* ==============================
//                     DISCOUNT
//                 ============================== */}

//                 <div className="discount-badge">

//                   {index % 2 === 0
//                     ? "20% OFF"
//                     : "15% OFF"}

//                 </div>


//                 {/* ==============================
//                     IMAGE
//                 ============================== */}

//                 <div className="offer-image">

//                   <img
//                     src={item.image}
//                     alt={item.name}
//                   />

//                 </div>


//                 {/* ==============================
//                     PRODUCT INFORMATION
//                 ============================== */}

//                 <div className="offer-content">


//                   <h3>
//                     {item.name}
//                   </h3>


//                   <p className="offer-description">

//                     Special offer on
//                     this delicious item.

//                   </p>


//                   {/* ==============================
//                       PRICE
//                   ============================== */}

//                   <div className="offer-price">


//                     <span className="old-price">

//                       Rs.{" "}

//                       {Math.round(
//                         item.price * 1.2
//                       )}

//                     </span>


//                     <span className="new-price">

//                       Rs. {item.price}

//                     </span>


//                   </div>


//                   {/* ==============================
//                       ADD TO CART
//                   ============================== */}

//                   <button
//                     className="offer-cart-btn"
//                     onClick={() =>
//                       addToCart(item)
//                     }
//                   >

//                     🛒 Add to Cart

//                   </button>


//                 </div>


//               </div>

//             )
//           )}


//         </div>


//       </div>

//     </>

//   );

// }


// export default Offers;