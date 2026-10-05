// import "../styles/cart.css";
// import menu from "../data/menu";
// import { useState } from "react";

// import Navbar from "../components/Navbar";
// import Categories from "../components/Categories";
// import MenuCard from "../components/MenuCard";

// function Menu() {
//   const [cart, setCart] = useState([]);
//   const [showCart, setShowCart] = useState(false);

//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [searchTerm, setSearchTerm] = useState("");

//   function addToCart(item) {
//     const existingItem = cart.find(
//       (cartItem) => cartItem.id === item.id
//     );

//     if (existingItem) {
//       setCart(
//         cart.map((cartItem) =>
//           cartItem.id === item.id
//             ? {
//                 ...cartItem,
//                 quantity: cartItem.quantity + 1,
//               }
//             : cartItem
//         )
//       );
//     } else {
//       setCart([
//         ...cart,
//         {
//           ...item,
//           quantity: 1,
//         },
//       ]);
//     }
//   }

//   function removeFromCart(index) {
//     setCart(cart.filter((_, i) => i !== index));
//   }

//   function increaseQuantity(id) {
//     setCart(
//       cart.map((item) =>
//         item.id === id
//           ? {
//               ...item,
//               quantity: item.quantity + 1,
//             }
//           : item
//       )
//     );
//   }

//   function decreaseQuantity(id) {
//     setCart(
//       cart
//         .map((item) =>
//           item.id === id
//             ? {
//                 ...item,
//                 quantity: item.quantity - 1,
//               }
//             : item
//         )
//         .filter((item) => item.quantity > 0)
//     );
//   }

//   const filteredMenu = menu.filter((item) => {
//     const matchesCategory =
//       selectedCategory === "All" ||
//       item.category === selectedCategory;

//     const matchesSearch = item.name
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase());

//     return matchesCategory && matchesSearch;
//   });

//   return (
//     <>
//       <Navbar
//         cartCount={cart.length}
//         onCartClick={() => setShowCart(true)}
//       />

//       {/* CART */}
//       {showCart && (
//         <div className="cart-drawer">

//           <div className="cart-header">
//             <h2>🛒 Your Cart</h2>

//             <button
//               className="close-btn"
//               onClick={() => setShowCart(false)}
//             >
//               ✖
//             </button>
//           </div>

//           {cart.length === 0 ? (
//             <p>Your cart is empty.</p>
//           ) : (
//             <>
//               {cart.map((item, index) => (
//                 <div
//                   className="cart-item"
//                   key={index}
//                 >

//                   <h4>{item.name}</h4>

//                   <p>
//                     Rs. {item.price} × {item.quantity} ={" "}
//                     <b>
//                       Rs. {item.price * item.quantity}
//                     </b>
//                   </p>

//                   <div className="quantity-box">

//                     <button
//                       onClick={() =>
//                         decreaseQuantity(item.id)
//                       }
//                     >
//                       -
//                     </button>

//                     <span>{item.quantity}</span>

//                     <button
//                       onClick={() =>
//                         increaseQuantity(item.id)
//                       }
//                     >
//                       +
//                     </button>

//                   </div>

//                   <button
//                     className="remove-btn"
//                     onClick={() =>
//                       removeFromCart(index)
//                     }
//                   >
//                     Remove
//                   </button>

//                 </div>
//               ))}

//               <div className="checkout-section">

//                 <h3 className="total">
//                   Total: Rs.{" "}
//                   {cart.reduce(
//                     (sum, item) =>
//                       sum + item.price * item.quantity,
//                     0
//                   )}
//                 </h3>

//               </div>
//             </>
//           )}

//         </div>
//       )}

//       {/* MENU PAGE */}

//       <div className="menu-page">

//         <h2 className="menu-titles">
//           Our Menu
//         </h2>

//         {/* SEARCH */}

//         <div className="search-box">

//           <span>🔍</span>

//           <input
//             type="text"
//             placeholder="Search menu items..."
//             value={searchTerm}
//             onChange={(e) =>
//               setSearchTerm(e.target.value)
//             }
//           />

//         </div>

//         {/* CATEGORIES */}

//         <Categories
//           selectedCategory={selectedCategory}
//           onCategoryChange={setSelectedCategory}
//         />

//         {/* MENU CARDS */}

//         <div className="menu-grid">

//           {filteredMenu.length > 0 ? (

//             filteredMenu.map((item) => (

//               <MenuCard
//                 key={item.id}
//                 name={item.name}
//                 price={item.price}
//                 image={item.image}
//                 onAdd={() => addToCart(item)}
//               />

//             ))

//           ) : (

//             <p className="no-results">
//               No menu items found.
//             </p>

//           )}

//         </div>

//       </div>
//     </>
//   );
// }

// export default Menu;










import "../styles/cart.css";
import menu from "../data/menu";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Categories from "../components/Categories";
import MenuCard from "../components/MenuCard";

import { useCart } from "../context/CartContext";

function Menu() {

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
  // CATEGORY
  // ==========================================

  const [selectedCategory, setSelectedCategory] =
    useState("All");


  // ==========================================
  // SEARCH
  // ==========================================

  const [searchTerm, setSearchTerm] =
    useState("");


  // ==========================================
  // CART COUNT
  // ==========================================

  const cartCount = cart.reduce(
    (sum, item) =>
      sum + Number(item.quantity),
    0
  );


  // ==========================================
  // FILTER MENU
  // ==========================================

  const filteredMenu = menu.filter((item) => {

    const matchesCategory =
      selectedCategory === "All" ||
      item.category === selectedCategory;

    const matchesSearch =
      item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return (
      matchesCategory &&
      matchesSearch
    );

  });


  // ==========================================
  // TOTAL
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


          {/* EMPTY CART */}

          {cart.length === 0 ? (

            <p>
              Your cart is empty.
            </p>

          ) : (

            <>

              {/* CART ITEMS */}

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
                    {item.quantity} ={" "}
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

                </div>

              ))}


              {/* =================================
                  CHECKOUT SECTION
              ================================= */}

              <div className="checkout-section">

                <h3 className="total">

                  Total: Rs.{" "}
                  {total}

                </h3>


                <button
                  className="checkout-btn"
                  onClick={() =>
                    navigate("/checkout")
                  }
                >
                  Proceed to Checkout
                </button>

              </div>

            </>

          )}

        </div>

      )}


      {/* =====================================
          MENU PAGE
      ===================================== */}

      <div className="menu-page">


        {/* TITLE */}

        <h2 className="menu-titles">
          Our Menu
        </h2>


        {/* ===================================
            SEARCH
        =================================== */}

        <div className="search-box">

          <span>
            🔍
          </span>

          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
          />

        </div>


        {/* ===================================
            CATEGORIES
        =================================== */}

        <Categories
          selectedCategory={
            selectedCategory
          }
          onCategoryChange={
            setSelectedCategory
          }
        />


        {/* ===================================
            MENU CARDS
        =================================== */}

        <div className="menu-grid">

          {filteredMenu.length > 0 ? (

            filteredMenu.map((item) => (

              <MenuCard
                key={item.id}
                name={item.name}
                price={item.price}
                image={item.image}
                onAdd={() =>
                  addToCart(item)
                }
              />

            ))

          ) : (

            <p className="no-results">
              No menu items found.
            </p>

          )}

        </div>

      </div>

    </>
  );
}

export default Menu;