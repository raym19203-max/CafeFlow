
import "../styles/menucard.css";

function MenuCard({ name, price, image, onAdd, availability }) {
  const isAvailable =
    availability?.toLowerCase() !== "not available" &&
    availability?.toLowerCase() !== "unavailable";

  return (
    <div className="menu-card">
      <div className="menu-card-image">
        {image ? (
          <img
            // src={`/${image}`}
            // src={image?.startsWith("/") ? image : `/$DIL2`}
            src={image?.startsWith("/") ? image : `/${image || ""}`}
            alt={name || "Menu item"}
            onError={(event) => {
              event.currentTarget.style.display = "none";
              event.currentTarget.parentElement.classList.add("image-error");
            }}
          />
        ) : (
          <div className="image-placeholder">Image unavailable</div>
        )}
      </div>

      <h3>{name}</h3>
      <p>Rs. {price}</p>

      {isAvailable ? (
        <button type="button" onClick={onAdd}>
          Add to Cart
        </button>
      ) : (
        <button type="button" disabled className="unavailable-btn">
          Not Available
        </button>
      )}
    </div>
  );
}

export default MenuCard;









// import "../styles/menucard.css";

// function MenuCard({ name, price, image, onAdd }) {
//   return (
//     <div className="menu-card">
//       {/* <div className="menu-card-image">
//         <img
//           src={image}
//           alt={name || "Menu item"}
//           onError={(event) => {
//             event.currentTarget.style.display = "none";
//             event.currentTarget.parentElement.classList.add("image-error");
//           }}
          
//         />
//       </div> */}
      
//       <div className="menu-card-image">
//         {image ? (
//           <img
//             src={image}
//             alt={name || "Menu item"}
//             onError={(event) => {
//               event.currentTarget.style.display = "none";
//               event.currentTarget.parentElement.classList.add("image-error");
//             }}
//           />
//         ) : (
//           <div className="image-placeholder">Image unavailable</div>
//         )}
//       </div>


//       <h3>{name}</h3>

//       <p>Rs. {price}</p>

//       <button type="button" onClick={onAdd}>
//         Add to Cart
//       </button>
//     </div>
//   );
// }

// export default MenuCard;
