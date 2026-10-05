import"../styles/menucard.css";
function MenuCard({ name, price, image, onAdd }) {
  return (
    <div className="menu-card">
      <img src={image} alt={name} width="200" />

      <h3>{name}</h3>

      <p>Rs. {price}</p>

      <button onClick={onAdd}>
        Add to Cart
      </button>
    </div>
  );
}

export default MenuCard;