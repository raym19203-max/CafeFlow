
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import menu from "../data/menu";
import Navbar from "../components/Navbar";
import Categories from "../components/Categories";
import MenuCard from "../components/MenuCard";
import { useCart } from "../context/CartContext";

import "../styles/categories.css";
import "../styles/cart.css";

function Menu() {
  const navigate = useNavigate();

  const {
    cart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
  } = useCart();

  const [showCart, setShowCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubcategory, setSelectedSubcategory] =
    useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const foodSubcategories = [
    "All",
    "Momo",
    "Pizza",
    "Burger",
    "Chowmein",
    "Thukpa",
    "Biryani",
    "Pasta",
    "Fried Rice",
  ];

  function handleCategoryChange(category) {
    setSelectedCategory(category);
    setSelectedSubcategory("All");
    setSelectedType("All");
  }

  const filteredMenu = menu.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" ||
      item.category === selectedCategory;

    const matchesSubcategory =
      selectedCategory !== "Food" ||
      selectedSubcategory === "All" ||
      item.subcategory === selectedSubcategory;

    const matchesType =
      selectedCategory !== "Food" ||
      selectedType === "All" ||
      item.type === selectedType;

    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return (
      matchesCategory &&
      matchesSubcategory &&
      matchesType &&
      matchesSearch
    );
  });

  const cartCount = cart.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  const cartTotal = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  return (
    <>
      <Navbar
         cartCount={cartCount}
         onCartClick={() => setShowCart(true)}
       />

      <main className="menu-page">
        <h1 className="menu-titles">Our Menu</h1>

        <div className="search-box">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search food and drinks..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <Categories
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        {selectedCategory === "Food" && (
          <>
            <div className="category-list">
              {foodSubcategories.map((subcategory) => (
                <button
                  type="button"
                  key={subcategory}
                  className={
                    selectedSubcategory === subcategory
                      ? "category-btn active"
                      : "category-btn"
                  }
                  onClick={() => {
                    setSelectedSubcategory(subcategory);
                    setSelectedType("All");
                  }}
                >
                  {subcategory}
                </button>
              ))}
            </div>

            <div className="category-list">
              {["All", "Veg", "Non-Veg"].map((type) => (
                <button
                  type="button"
                  key={type}
                  className={
                    selectedType === type
                      ? "category-btn active"
                      : "category-btn"
                  }
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="menu-grid">
          {filteredMenu.length > 0 ? (
            filteredMenu.map((item) => (
              <MenuCard
                key={item.id}
                name={item.name}
                price={item.price}
                image={item.image}
                onAdd={() => addToCart(item)}
              />
            ))
          ) : (
            <p className="no-results">
              No menu items found.
            </p>
          )}
        </div>
{/* 
        <button
          type="button"
          className="cart-toggle-btn"
          onClick={() => setShowCart(true)}
        >
          🛒 View Cart ({cartCount})
        </button> */}
        
      </main>

      {showCart && (
        <>
          <div
            className="cart-overlay"
            onClick={() => setShowCart(false)}
          />

          <section
            className="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            <div className="cart-header">
              <h2>🛒 Your Cart</h2>

              <button
                type="button"
                className="close-btn"
                onClick={() => setShowCart(false)}
                aria-label="Close cart"
              >
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="cart-item"
                  >
                    <h4>{item.name}</h4>

                    <p>
                      Rs. {item.price} × {item.quantity} = Rs.{" "}
                      {Number(item.price) *
                        Number(item.quantity)}
                    </p>

                    <div className="quantity-box">
                      <button
                        type="button"
                        onClick={() =>
                          decreaseQuantity(item.id)
                        }
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        onClick={() =>
                          increaseQuantity(item.id)
                        }
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <div className="checkout-section">
                  <h3 className="total">
                    Total: Rs. {cartTotal}
                  </h3>

                  <button
                    type="button"
                    className="checkout-btn"
                    onClick={() => navigate("/checkout")}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </section>
        </>
      )}
    </>
  );
}

export default Menu;
