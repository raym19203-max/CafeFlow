import "../styles/checkout.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";


function Checkout() {

  const navigate = useNavigate();

  // ==========================================
  // GET CART FROM GLOBAL CART CONTEXT
  // ==========================================

  const { cart } = useCart();


  // ==========================================
  // CALCULATE TOTAL
  // ==========================================

  const total = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price) *
      Number(item.quantity),
    0
  );


  // ==========================================
  // FORM STATES
  // ==========================================

  const [customerName, setCustomerName] =
    useState("");

  const [tableNumber, setTableNumber] =
    useState("");

  const [phoneNumber, setPhoneNumber] =
    useState("");

  const [instructions, setInstructions] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("Cash");


  // ==========================================
  // PLACE ORDER
  // ==========================================

  async function handleSubmit(e) {

    e.preventDefault();


    // ========================================
    // VALIDATION
    // ========================================

    if (
      !customerName ||
      !tableNumber ||
      !phoneNumber
    ) {

      alert(
        "Please fill all required fields."
      );

      return;
    }


    if (cart.length === 0) {

      alert(
        "Your cart is empty."
      );

      return;
    }


    // ========================================
    // ORDER DATA
    // ========================================

    const order = {

      customerName,

      tableNumber,

      phoneNumber,

      instructions,

      paymentMethod,

      items: cart,

      total,

    };


    console.log(
      "Order:",
      order
    );


    try {

      // ======================================
      // CASH PAYMENT
      // ======================================

      if (paymentMethod === "Cash") {

        const response =
          await fetch(
            // "http://localhost:5000/api/orders",
            "https://cafeflow-api-y0yw.onrender.com/api/orders",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(order),
            }
          );


        const data =
          await response.json();


        console.log(
          "Cash order response:",
          data
        );


        if (
          response.ok &&
          data.success !== false
        ) {

          navigate(
            "/success",
            {
              state: {
                orderId:
                  data.orderId,
              },
            }
          );

        } else {

          alert(
            data.message ||
            "Order could not be placed."
          );

        }

        return;
      }


      // ======================================
      // eSEWA PAYMENT
      // ======================================

      if (paymentMethod === "eSewa") {

        console.log(
          "Starting eSewa payment..."
        );


        const response =
          await fetch(
            // "http://localhost:5000/api/esewa/initiate",
            "https://cafeflow-api-y0yw.onrender.com/api/esewa/initiate",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(order),
            }
          );


        const data =
          await response.json();


        console.log(
          "eSewa initiate response:",
          data
        );


        // Check backend response

        if (
          !response.ok ||
          !data.success
        ) {

          alert(
            data.message ||
            "eSewa payment initialization failed."
          );

          return;
        }


        // Check payment data

        if (!data.paymentData) {

          alert(
            "eSewa payment data was not received."
          );

          return;
        }


        console.log(
          "eSewa Payment Data:",
          data.paymentData
        );


        // ====================================
        // CREATE eSEWA FORM
        // ====================================

        const form =
          document.createElement(
            "form"
          );


        form.method = "POST";


        form.action =
          "https://rc-epay.esewa.com.np/api/epay/main/v2/form";


        form.style.display =
          "none";


        // ====================================
        // ADD PAYMENT FIELDS
        // ====================================

        Object.entries(
          data.paymentData
        ).forEach(
          ([key, value]) => {

            const input =
              document.createElement(
                "input"
              );


            input.type =
              "hidden";


            input.name =
              key;


            input.value =
              String(value);


            form.appendChild(
              input
            );

          }
        );


        // Add form to page

        document.body.appendChild(
          form
        );


        console.log(
          "Submitting payment to eSewa..."
        );


        // Submit payment

        form.submit();

        return;
      }

    } catch (error) {

      console.error(
        "Checkout error:",
        error
      );


      alert(
        "Server connection failed. Please check your server."
      );

    }

  }


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="checkout-container">


      {/* ======================================
          ORDER SUMMARY
      ====================================== */}

      <div className="order-summary">

        <h1>
          Checkout
        </h1>


        <h2>
          Order Summary
        </h2>


        {cart.length === 0 ? (

          <p>
            Your cart is empty.
          </p>

        ) : (

          cart.map(
            (item) => (

              <p
                key={item.id}
              >

                {item.name} ×{" "}
                {item.quantity}

                {" = Rs. "}

                {
                  Number(item.price) *
                  Number(item.quantity)
                }

              </p>

            )
          )

        )}


        <h2>
          Total: Rs. {total}
        </h2>

      </div>


      {/* ======================================
          CHECKOUT FORM
      ====================================== */}

      <form
        className="checkout-form"
        onSubmit={handleSubmit}
      >


        {/* Customer Name */}

        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) =>
            setCustomerName(
              e.target.value
            )
          }
          required
        />


        {/* Table Number */}

        <input
          type="text"
          placeholder="Table Number"
          value={tableNumber}
          onChange={(e) =>
            setTableNumber(
              e.target.value
            )
          }
          required
        />


        {/* Phone Number */}

        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) =>
            setPhoneNumber(
              e.target.value
            )
          }
          required
        />


        {/* Instructions */}

        <textarea
          placeholder="Special Instructions"
          value={instructions}
          onChange={(e) =>
            setInstructions(
              e.target.value
            )
          }
        />


        {/* Payment Method */}

        <select
          value={paymentMethod}
          onChange={(e) =>
            setPaymentMethod(
              e.target.value
            )
          }
        >

          <option value="Cash">
            Cash - Pay at Counter
          </option>

          <option value="eSewa">
            eSewa - Online Payment
          </option>

        </select>


        {/* Submit Button */}

        <button
          type="submit"
        >

          {paymentMethod === "eSewa"
            ? "Pay with eSewa"
            : "Place Order"}

        </button>


      </form>


    </div>

  );

}


export default Checkout;





































// // import "../styles/checkout.css";
// // import { useState } from "react";
// // import { useNavigate, useLocation } from "react-router-dom";

// // function Checkout() {
// //   const navigate = useNavigate();
// //   const location = useLocation();

// //   // Get cart from previous page
// //   const cart = location.state?.cart || [];
  

// //   // Calculate total
// //   const total = cart.reduce(
// //     (sum, item) => sum + Number(item.price) * Number(item.quantity),
// //     0
// //   );

// //   // Form states
// //   const [customerName, setCustomerName] = useState("");
// //   const [tableNumber, setTableNumber] = useState("");
// //   const [phoneNumber, setPhoneNumber] = useState("");
// //   const [instructions, setInstructions] = useState("");
// //   const [paymentMethod, setPaymentMethod] = useState("Cash");

// //   async function handleSubmit(e) {
// //     e.preventDefault();

// //     // --------------------------------
// //     // VALIDATION
// //     // --------------------------------

// //     if (!customerName || !tableNumber || !phoneNumber) {
// //       alert("Please fill all required fields.");
// //       return;
// //     }

// //     if (cart.length === 0) {
// //       alert("Your cart is empty.");
// //       return;
// //     }

// //     const order = {
// //       customerName,
// //       tableNumber,
// //       phoneNumber,
// //       instructions,
// //       paymentMethod,
// //       items: cart,
// //       total,
// //     };

// //     console.log("Order:", order);

// //     try {
// //       // ==========================================
// //       // CASH PAYMENT
// //       // ==========================================

// //       if (paymentMethod === "Cash") {
// //         const response = await fetch(
// //           "http://localhost:5000/api/orders",
// //           {
// //             method: "POST",
// //             headers: {
// //               "Content-Type": "application/json",
// //             },
// //             body: JSON.stringify(order),
// //           }
// //         );

// //         const data = await response.json();

// //         console.log("Cash order response:", data);

// //         if (response.ok && data.success !== false) {
// //           navigate("/success", {
// //             state: {
// //               orderId: data.orderId,
// //             },
// //           });
// //         } else {
// //           alert(
// //             data.message ||
// //               "Order could not be placed."
// //           );
// //         }

// //         return;
// //       }

// //       // ==========================================
// //       // eSEWA PAYMENT
// //       // ==========================================

// //       if (paymentMethod === "eSewa") {
// //         console.log(
// //           "Starting eSewa payment..."
// //         );

// //         const response = await fetch(
// //           "http://localhost:5000/api/esewa/initiate",
// //           {
// //             method: "POST",
// //             headers: {
// //               "Content-Type": "application/json",
// //             },
// //             body: JSON.stringify(order),
// //           }
// //         );

// //         const data = await response.json();

// //         console.log(
// //           "eSewa initiate response:",
// //           data
// //         );

// //         // Check backend response
// //         if (!response.ok || !data.success) {
// //           alert(
// //             data.message ||
// //               "eSewa payment initialization failed."
// //           );

// //           return;
// //         }

// //         // Check payment data
// //         if (!data.paymentData) {
// //           alert(
// //             "eSewa payment data was not received."
// //           );

// //           return;
// //         }

// //         console.log(
// //           "eSewa Payment Data:",
// //           data.paymentData
// //         );

// //         // ==========================================
// //         // CREATE eSEWA FORM
// //         // ==========================================

// //         const form =
// //           document.createElement("form");

// //         form.method = "POST";

// //         form.action =
// //           "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

// //         form.style.display = "none";

// //         // ==========================================
// //         // ADD eSEWA PAYMENT FIELDS
// //         // ==========================================

// //         Object.entries(data.paymentData).forEach(
// //           ([key, value]) => {
// //             const input =
// //               document.createElement("input");

// //             input.type = "hidden";

// //             input.name = key;

// //             input.value = String(value);

// //             form.appendChild(input);
// //           }
// //         );

// //         // Add form to page
// //         document.body.appendChild(form);

// //         console.log(
// //           "Submitting payment to eSewa..."
// //         );

// //         // ==========================================
// //         // SUBMIT ONLY ONCE
// //         // ==========================================

// //         form.submit();

// //         return;
// //       }
// //     } catch (error) {
// //       console.error(
// //         "Checkout error:",
// //         error
// //       );

// //       alert(
// //         "Server connection failed. Please check your server."
// //       );
// //     }
// //   }

// //   return (
// //     <div className="checkout-container">

// //       {/* ======================================
// //           ORDER SUMMARY
// //       ====================================== */}

// //       <div className="order-summary">

// //         <h1>Checkout</h1>

// //         <h2>Order Summary</h2>

// //         {cart.length === 0 ? (
// //           <p>Your cart is empty.</p>
// //         ) : (
// //           cart.map((item) => (
// //             <p key={item.id}>
// //               {item.name} × {item.quantity} = Rs.{" "}
// //               {Number(item.price) *
// //                 Number(item.quantity)}
// //             </p>
// //           ))
// //         )}

// //         <h2>
// //           Total: Rs. {total}
// //         </h2>

// //       </div>

// //       {/* ======================================
// //           CHECKOUT FORM
// //       ====================================== */}

// //       <form
// //         className="checkout-form"
// //         onSubmit={handleSubmit}
// //       >

// //         {/* Customer Name */}

// //         <input
// //           type="text"
// //           placeholder="Customer Name"
// //           value={customerName}
// //           onChange={(e) =>
// //             setCustomerName(e.target.value)
// //           }
// //           required
// //         />

// //         {/* Table Number */}

// //         <input
// //           type="text"
// //           placeholder="Table Number"
// //           value={tableNumber}
// //           onChange={(e) =>
// //             setTableNumber(e.target.value)
// //           }
// //           required
// //         />

// //         {/* Phone Number */}

// //         <input
// //           type="text"
// //           placeholder="Phone Number"
// //           value={phoneNumber}
// //           onChange={(e) =>
// //             setPhoneNumber(e.target.value)
// //           }
// //           required
// //         />

// //         {/* Instructions */}

// //         <textarea
// //           placeholder="Special Instructions"
// //           value={instructions}
// //           onChange={(e) =>
// //             setInstructions(e.target.value)
// //           }
// //         />

// //         {/* Payment Method */}

// //         <select
// //           value={paymentMethod}
// //           onChange={(e) =>
// //             setPaymentMethod(e.target.value)
// //           }
// //         >

// //           <option value="Cash">
// //             Cash - Pay at Counter
// //           </option>

// //           <option value="eSewa">
// //             eSewa - Online Payment
// //           </option>

// //         </select>

// //         {/* Submit Button */}

// //         <button type="submit">

// //           {paymentMethod === "eSewa"
// //             ? "Pay with eSewa"
// //             : "Place Order"}

// //         </button>

// //       </form>

// //     </div>
// //   );
// // }

// // export default Checkout;














// import "../styles/checkout.css";

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// import { useCart } from "../context/CartContext";

// function Checkout() {
//   const navigate = useNavigate();

//   // ==========================================
//   // GET SAME CART FROM CART CONTEXT
//   // ==========================================

//   const { cart } = useCart();

//   // ==========================================
//   // CALCULATE TOTAL
//   // ==========================================

//   const total = cart.reduce(
//     (sum, item) =>
//       sum +
//       Number(item.price) * Number(item.quantity),
//     0
//   );

//   // ==========================================
//   // FORM STATES
//   // ==========================================

//   const [customerName, setCustomerName] =
//     useState("");

//   const [tableNumber, setTableNumber] =
//     useState("");

//   const [phoneNumber, setPhoneNumber] =
//     useState("");

//   const [instructions, setInstructions] =
//     useState("");

//   const [paymentMethod, setPaymentMethod] =
//     useState("Cash");


//   // ==========================================
//   // PLACE ORDER
//   // ==========================================

//   async function handleSubmit(e) {
//     e.preventDefault();

//     // ------------------------------------------
//     // VALIDATION
//     // ------------------------------------------

//     if (
//       !customerName ||
//       !tableNumber ||
//       !phoneNumber
//     ) {
//       alert(
//         "Please fill all required fields."
//       );
//       return;
//     }

//     if (cart.length === 0) {
//       alert("Your cart is empty.");
//       return;
//     }


//     // ------------------------------------------
//     // ORDER DATA
//     // ------------------------------------------

//     const order = {
//       customerName,
//       tableNumber,
//       phoneNumber,
//       instructions,
//       paymentMethod,
//       items: cart,
//       total,
//     };

//     console.log("Order:", order);


//     try {

//       // ========================================
//       // CASH PAYMENT
//       // ========================================

//       if (paymentMethod === "Cash") {

//         const response = await fetch(
//           "http://localhost:5000/api/orders",
//           {
//             method: "POST",

//             headers: {
//               "Content-Type":
//                 "application/json",
//             },

//             body: JSON.stringify(order),
//           }
//         );


//         const data =
//           await response.json();


//         console.log(
//           "Cash order response:",
//           data
//         );


//         if (
//           response.ok &&
//           data.success !== false
//         ) {

//           navigate("/success", {
//             state: {
//               orderId: data.orderId,
//             },
//           });

//         } else {

//           alert(
//             data.message ||
//               "Order could not be placed."
//           );

//         }

//         return;
//       }


//       // ========================================
//       // eSEWA PAYMENT
//       // ========================================

//       if (paymentMethod === "eSewa") {

//         console.log(
//           "Starting eSewa payment..."
//         );


//         const response = await fetch(
//           "http://localhost:5000/api/esewa/initiate",
//           {
//             method: "POST",

//             headers: {
//               "Content-Type":
//                 "application/json",
//             },

//             body: JSON.stringify(order),
//           }
//         );


//         const data =
//           await response.json();


//         console.log(
//           "eSewa initiate response:",
//           data
//         );


//         // Check backend response

//         if (
//           !response.ok ||
//           !data.success
//         ) {

//           alert(
//             data.message ||
//               "eSewa payment initialization failed."
//           );

//           return;
//         }


//         // Check payment data

//         if (!data.paymentData) {

//           alert(
//             "eSewa payment data was not received."
//           );

//           return;
//         }


//         console.log(
//           "eSewa Payment Data:",
//           data.paymentData
//         );


//         // ======================================
//         // CREATE eSEWA FORM
//         // ======================================

//         const form =
//           document.createElement("form");


//         form.method = "POST";


//         form.action =
//           "https://rc-epay.esewa.com.np/api/epay/main/v2/form";


//         form.style.display = "none";


//         // ======================================
//         // ADD eSEWA PAYMENT FIELDS
//         // ======================================

//         Object.entries(
//           data.paymentData
//         ).forEach(
//           ([key, value]) => {

//             const input =
//               document.createElement(
//                 "input"
//               );

//             input.type = "hidden";

//             input.name = key;

//             input.value =
//               String(value);

//             form.appendChild(input);
//           }
//         );


//         // Add form to page

//         document.body.appendChild(
//           form
//         );


//         console.log(
//           "Submitting payment to eSewa..."
//         );


//         // Submit

//         form.submit();

//         return;
//       }

//     } catch (error) {

//       console.error(
//         "Checkout error:",
//         error
//       );

//       alert(
//         "Server connection failed. Please check your server."
//       );
//     }
//   }


//   // ==========================================
//   // RETURN
//   // ==========================================

//   return (
//     <div>

//       {/* ======================================
//           ORDER SUMMARY
//       ====================================== */}

//       <div className="order-summary">

//         <h1>
//           Checkout
//         </h1>


//         <h2>
//           Order Summary
//         </h2>


//         {cart.length === 0 ? (

//           <p>
//             Your cart is empty.
//           </p>

//         ) : (

//           cart.map((item) => (

//             <p key={item.id}>

//               {item.name} ×{" "}
//               {item.quantity}

//               {" = Rs. "}

//               {
//                 Number(item.price) *
//                 Number(item.quantity)
//               }

//             </p>

//           ))

//         )}


//         <h2>
//           Total: Rs. {total}
//         </h2>

//       </div>


//       {/* ======================================
//           CHECKOUT FORM
//       ====================================== */}

//       <form
//         className="checkout-form"
//         onSubmit={handleSubmit}
//       >

//         {/* Customer Name */}

//         <input
//           type="text"
//           placeholder="Customer Name"
//           value={customerName}
//           onChange={(e) =>
//             setCustomerName(
//               e.target.value
//             )
//           }
//           required
//         />


//         {/* Table Number */}

//         <input
//           type="text"
//           placeholder="Table Number"
//           value={tableNumber}
//           onChange={(e) =>
//             setTableNumber(
//               e.target.value
//             )
//           }
//           required
//         />


//         {/* Phone Number */}

//         <input
//           type="text"
//           placeholder="Phone Number"
//           value={phoneNumber}
//           onChange={(e) =>
//             setPhoneNumber(
//               e.target.value
//             )
//           }
//           required
//         />


//         {/* Instructions */}

//         <textarea
//           placeholder="Special Instructions"
//           value={instructions}
//           onChange={(e) =>
//             setInstructions(
//               e.target.value
//             )
//           }
//         />


//         {/* Payment Method */}

//         <select
//           value={paymentMethod}
//           onChange={(e) =>
//             setPaymentMethod(
//               e.target.value
//             )
//           }
//         >

//           <option value="Cash">
//             Cash - Pay at Counter
//           </option>

//           <option value="eSewa">
//             eSewa - Online Payment
//           </option>

//         </select>


//         {/* Submit */}

//         <button type="submit">

//           {paymentMethod === "eSewa"
//             ? "Pay with eSewa"
//             : "Place Order"}

//         </button>

//       </form>

//     </div>
//   );
// }

// export default Checkout;