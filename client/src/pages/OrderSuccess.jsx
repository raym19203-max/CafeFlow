
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import socket from "../services/socket";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

function OrderSuccess() {
  const location = useLocation();
  const orderId = location.state?.orderId;

  const [status, setStatus] = useState("Pending");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("Pending");

  useEffect(() => {
    if (!orderId) return;

    let cancelled = false;

    const loadOrder = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/orders/${orderId}`
        );

        if (!response.ok) {
          throw new Error("Could not load order");
        }

        const data = await response.json();

        if (!cancelled) {
          setStatus(data.status || "Pending");
          setPaymentMethod(data.payment_method || "");
          setPaymentStatus(data.payment_status || "Pending");
        }
      } catch (error) {
        console.error("Error loading order:", error);
      }
    };

    const handleStatusChanged = (data) => {
      if (String(data.id) === String(orderId)) {
        setStatus(data.status);
      }
    };

    const handlePaymentChanged = (data) => {
      if (String(data.id) === String(orderId)) {
        setPaymentStatus(data.payment_status);
      }
    };

    socket.on("statusChanged", handleStatusChanged);
    socket.on("paymentChanged", handlePaymentChanged);

    // Load the latest saved status from the database.
    loadOrder();

    // Recheck when the socket reconnects.
    socket.on("connect", loadOrder);

    return () => {
      cancelled = true;
      socket.off("statusChanged", handleStatusChanged);
      socket.off("paymentChanged", handlePaymentChanged);
      socket.off("connect", loadOrder);
    };
  }, [orderId]);

  return (
    <div style={{ textAlign: "center", marginTop: "60px", padding: "20px" }}>
      <h1>✅ Order Placed Successfully!</h1>
      <h3>Order ID: #{orderId || "Not found"}</h3>

      <h2>Order Status</h2>

      <h2>
        {status === "Pending" && "🟡 Pending"}
        {status === "Accepted" && "🟢 Order Confirmed"}
        {status === "Completed" && "🍽️ Order Served"}
        {status === "Cancelled" && "❌ Order Cancelled"}
      </h2>

      {status === "Pending" && (
        <p>Your order has been sent to the kitchen.</p>
      )}

      {status === "Accepted" && (
        <div>
          <h3>Estimated Waiting Time: 10–15 Minutes</h3>
          <p>Please remain seated. Your food will be served shortly.</p>
        </div>
      )}

      {status === "Completed" && (
        <div>
          <hr style={{ maxWidth: "300px", margin: "25px auto" }} />
          <h2>Payment</h2>
          <h3>Payment Method: {paymentMethod || "Not provided"}</h3>

          {paymentStatus === "Paid" ? (
            <>
              <h3 style={{ color: "green" }}>🟢 Payment Successful</h3>
              <p>Thank you for your payment.</p>
            </>
          ) : (
            <>
              <h3 style={{ color: "darkorange" }}>🟠 Payment Pending</h3>
              {paymentMethod === "Cash" && (
                <p>Please pay at the counter.</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default OrderSuccess;












// import { useLocation } from "react-router-dom";
// import { useEffect, useState } from "react";
// import socket from "../services/socket";

// function OrderSuccess() {

//   const location = useLocation();

//   // Get Order ID from Checkout
//   const orderId = location.state?.orderId;

//   // Order information
//   const [status, setStatus] = useState("Pending");
//   const [paymentMethod, setPaymentMethod] = useState("");
//   const [paymentStatus, setPaymentStatus] = useState("Pending");


//   // ==========================================
//   // Load order information from database
//   // ==========================================

//   useEffect(() => {

//     if (!orderId) return;

//     fetch(`http://localhost:5000/api/orders/${orderId}`)
//       .then((res) => res.json())
//       .then((data) => {

//         console.log("Order Details:", data);

//         setStatus(data.status);
//         setPaymentMethod(data.payment_method);
//         setPaymentStatus(data.payment_status);

//       })
//       .catch((err) => {
//         console.log("Error loading order:", err);
//       });

//   }, [orderId]);


//   // ==========================================
//   // Listen for real-time updates
//   // ==========================================

//   useEffect(() => {

//     // Order status updates
//     socket.on("statusChanged", (data) => {

//       if (Number(data.id) === Number(orderId)) {
//         setStatus(data.status);
//       }

//     });


//     // Payment status updates
//     socket.on("paymentChanged", (data) => {

//       if (Number(data.id) === Number(orderId)) {
//         setPaymentStatus(data.payment_status);
//       }

//     });


//     // Cleanup
//     return () => {

//       socket.off("statusChanged");
//       socket.off("paymentChanged");

//     };

//   }, [orderId]);


//   return (

//     <div
//       style={{
//         textAlign: "center",
//         marginTop: "100px",
//       }}
//     >

//       <h1>✅ Order Placed Successfully!</h1>

//       <h3>
//         Order ID: #{orderId}
//       </h3>


//       {/* ==========================================
//           ORDER STATUS
//       ========================================== */}

//       <h2>Status</h2>

//       <h1>

//         {status === "Pending" && (
//           <span style={{ color: "orange" }}>
//             🟡 Pending
//           </span>
//         )}

//         {status === "Accepted" && (
//           <span style={{ color: "green" }}>
//             🟢 Order Confirmed
//           </span>
//         )}

//         {status === "Completed" && (
//           <span style={{ color: "green" }}>
//             🍽️ Order Served
//           </span>
//         )}

//       </h1>


//       {/* ==========================================
//           WAITING TIME
//       ========================================== */}

//       {status === "Accepted" && (

//         <div>

//           <h3>
//             Estimated Waiting Time
//             <br />
//             10–15 Minutes
//           </h3>

//           <p>
//             Please remain seated.
//             <br />
//             Your food will be served at your table shortly.
//           </p>

//         </div>

//       )}


//       {/* ==========================================
//           PAYMENT INFORMATION
//       ========================================== */}

//       {status === "Completed" && (

//         <div>

//           <hr
//             style={{
//               width: "300px",
//               margin: "25px auto",
//             }}
//           />

//           <h2>Payment</h2>


//           {/* ==========================================
//               CASH / COUNTER PAYMENT
//           ========================================== */}

//           {paymentMethod === "Cash" && (

//             <div>

//               <h3>
//                 Payment Method: 💵 Cash
//               </h3>


//               {/* CASH PAYMENT SUCCESSFUL */}

//               {paymentStatus === "Paid" ? (

//                 <div>

//                   <h3 style={{ color: "green" }}>
//                     🟢 Payment Successful
//                   </h3>

//                   <p>
//                     Thank you for your payment.
//                   </p>

//                 </div>

//               ) : (

//                 /* CASH PAYMENT PENDING */

//                 <div>

//                   <h3 style={{ color: "orange" }}>
//                     🟠 Payment Pending
//                   </h3>

//                   <p>
//                     Please pay at the counter.
//                   </p>

//                 </div>

//               )}

//             </div>

//           )}


//           {/* ==========================================
//               ONLINE PAYMENT
//           ========================================== */}

//           {paymentMethod !== "Cash" && paymentMethod && (

//             <div>

//               <h3>
//                 Payment Method: 💳 {paymentMethod}
//               </h3>


//               {paymentStatus === "Paid" ? (

//                 <div>

//                   <h3 style={{ color: "green" }}>
//                     🟢 Payment Successful
//                   </h3>

//                   <p>
//                     Thank you for your payment.
//                   </p>

//                 </div>

//               ) : (

//                 <div>

//                   <h3 style={{ color: "orange" }}>
//                     🟠 Payment Pending
//                   </h3>

//                 </div>

//               )}

//             </div>

//           )}

//         </div>

//       )}


//       {/* ==========================================
//           PENDING ORDER
//       ========================================== */}

//       {status === "Pending" && (

//         <p>
//           Your order has been sent to the kitchen.
//         </p>

//       )}

//     </div>

//   );

// }

// export default OrderSuccess;