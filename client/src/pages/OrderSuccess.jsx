import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import socket from "../services/socket";

function OrderSuccess() {

  const location = useLocation();

  // Get Order ID from Checkout
  const orderId = location.state?.orderId;

  // Order information
  const [status, setStatus] = useState("Pending");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("Pending");


  // ==========================================
  // Load order information from database
  // ==========================================

  useEffect(() => {

    if (!orderId) return;

    fetch(`http://localhost:5000/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {

        console.log("Order Details:", data);

        setStatus(data.status);
        setPaymentMethod(data.payment_method);
        setPaymentStatus(data.payment_status);

      })
      .catch((err) => {
        console.log("Error loading order:", err);
      });

  }, [orderId]);


  // ==========================================
  // Listen for real-time updates
  // ==========================================

  useEffect(() => {

    // Order status updates
    socket.on("statusChanged", (data) => {

      if (Number(data.id) === Number(orderId)) {
        setStatus(data.status);
      }

    });


    // Payment status updates
    socket.on("paymentChanged", (data) => {

      if (Number(data.id) === Number(orderId)) {
        setPaymentStatus(data.payment_status);
      }

    });


    // Cleanup
    return () => {

      socket.off("statusChanged");
      socket.off("paymentChanged");

    };

  }, [orderId]);


  return (

    <div
      style={{
        textAlign: "center",
        marginTop: "100px",
      }}
    >

      <h1>✅ Order Placed Successfully!</h1>

      <h3>
        Order ID: #{orderId}
      </h3>


      {/* ==========================================
          ORDER STATUS
      ========================================== */}

      <h2>Status</h2>

      <h1>

        {status === "Pending" && (
          <span style={{ color: "orange" }}>
            🟡 Pending
          </span>
        )}

        {status === "Accepted" && (
          <span style={{ color: "green" }}>
            🟢 Order Confirmed
          </span>
        )}

        {status === "Completed" && (
          <span style={{ color: "green" }}>
            🍽️ Order Served
          </span>
        )}

      </h1>


      {/* ==========================================
          WAITING TIME
      ========================================== */}

      {status === "Accepted" && (

        <div>

          <h3>
            Estimated Waiting Time
            <br />
            10–15 Minutes
          </h3>

          <p>
            Please remain seated.
            <br />
            Your food will be served at your table shortly.
          </p>

        </div>

      )}


      {/* ==========================================
          PAYMENT INFORMATION
      ========================================== */}

      {status === "Completed" && (

        <div>

          <hr
            style={{
              width: "300px",
              margin: "25px auto",
            }}
          />

          <h2>Payment</h2>


          {/* ==========================================
              CASH / COUNTER PAYMENT
          ========================================== */}

          {paymentMethod === "Cash" && (

            <div>

              <h3>
                Payment Method: 💵 Cash
              </h3>


              {/* CASH PAYMENT SUCCESSFUL */}

              {paymentStatus === "Paid" ? (

                <div>

                  <h3 style={{ color: "green" }}>
                    🟢 Payment Successful
                  </h3>

                  <p>
                    Thank you for your payment.
                  </p>

                </div>

              ) : (

                /* CASH PAYMENT PENDING */

                <div>

                  <h3 style={{ color: "orange" }}>
                    🟠 Payment Pending
                  </h3>

                  <p>
                    Please pay at the counter.
                  </p>

                </div>

              )}

            </div>

          )}


          {/* ==========================================
              ONLINE PAYMENT
          ========================================== */}

          {paymentMethod !== "Cash" && paymentMethod && (

            <div>

              <h3>
                Payment Method: 💳 {paymentMethod}
              </h3>


              {paymentStatus === "Paid" ? (

                <div>

                  <h3 style={{ color: "green" }}>
                    🟢 Payment Successful
                  </h3>

                  <p>
                    Thank you for your payment.
                  </p>

                </div>

              ) : (

                <div>

                  <h3 style={{ color: "orange" }}>
                    🟠 Payment Pending
                  </h3>

                </div>

              )}

            </div>

          )}

        </div>

      )}


      {/* ==========================================
          PENDING ORDER
      ========================================== */}

      {status === "Pending" && (

        <p>
          Your order has been sent to the kitchen.
        </p>

      )}

    </div>

  );

}

export default OrderSuccess;