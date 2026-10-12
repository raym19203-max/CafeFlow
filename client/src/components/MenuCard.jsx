
import "../styles/menucard.css";

function MenuCard({ name, price, image, onAdd }) {
  return (
    <div className="menu-card">
      <div className="menu-card-image">
        <img
          src={image}
          alt={name || "Menu item"}
          onError={(event) => {
            event.currentTarget.style.display = "none";
            event.currentTarget.parentElement.classList.add("image-error");
          }}
        />
      </div>

      <h3>{name}</h3>

      <p>Rs. {price}</p>

      <button type="button" onClick={onAdd}>
        Add to Cart
      </button>
    </div>
  );
}

export default MenuCard;
