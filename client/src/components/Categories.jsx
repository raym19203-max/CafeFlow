import "../styles/categories.css";

function Categories({ selectedCategory, onCategoryChange }) {

  const categories = [
    { name: "All", icon: "🍽️" },
    { name: "Momo", icon: "🥟" },
    { name: "Pizza", icon: "🍕" },
    { name: "Burger", icon: "🍔" },
    { name: "Coffee/Tea", icon: "☕" },
    { name: "Drinks", icon: "🥤" },
    { name: "Snacks", icon: "🍟" }
  ];

  return (
    <div className="category-list">

      {categories.map((category) => (

        <button
          key={category.name}
          className={
            selectedCategory === category.name
              ? "category-btn active"
              : "category-btn"
          }
          onClick={() =>
            onCategoryChange(category.name)
          }
        >
          {category.icon} {category.name}
        </button>

      ))}

    </div>
  );
}

export default Categories;