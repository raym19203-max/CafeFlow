// ==========================================
// ADMIN DASHBOARD
// ==========================================

// Import Socket
import socket from "../services/socket";

// Import CSS
import "../styles/Admin.css";

// React Hooks
import { useEffect, useState } from "react";

// React Router
import { useNavigate } from "react-router-dom";


function Admin() {

  const navigate = useNavigate();


  // ==========================================
  // ADMIN LOGIN PROTECTION
  // ==========================================

  useEffect(() => {

    const isAdminLoggedIn =
      localStorage.getItem("adminLoggedIn");

    if (isAdminLoggedIn !== "true") {
      navigate("/admin-login");
    }

  }, [navigate]);


  // ==============================
  // Store Orders
  // ==============================

  const [orders, setOrders] = useState([]);


  // ==============================
  // Store Contact Messages
  // ==============================

  const [messages, setMessages] = useState([]);


  // ==============================
  // Load all orders
  // ==============================

  function loadOrders() {

    fetch("http://localhost:5000/api/orders")

      .then((res) => res.json())

      .then((data) => {
        setOrders(data);
      })

      .catch((err) => {

        console.log(
          "Orders Error:",
          err
        );

      });

  }


  // ==============================
  // Load Contact Messages
  // ==============================

  function loadMessages() {

    fetch("http://localhost:5000/api/contact")

      .then((res) => res.json())

      .then((data) => {

        setMessages(data);

      })

      .catch((err) => {

        console.log(
          "Contact Messages Error:",
          err
        );

      });

  }


  // ==============================
  // Socket Events + Auto Refresh
  // ==============================

  useEffect(() => {

    // Load data when Admin opens

    loadOrders();
    loadMessages();


    // ------------------------------
    // New Order
    // ------------------------------

    const handleNewOrder = () => {

      console.log(
        "🔔 New Order Received"
      );

      loadOrders();

    };


    // ------------------------------
    // Payment Changed
    // ------------------------------

    const handlePaymentChanged = (
      paymentData
    ) => {

      console.log(
        "💰 Payment Changed:",
        paymentData
      );


      setOrders(
        (currentOrders) =>

          currentOrders.map(
            (order) =>

              String(order.id) ===
              String(paymentData.id)

                ? {
                    ...order,

                    payment_status:
                      paymentData.payment_status,
                  }

                : order
          )

      );

    };


    // ------------------------------
    // Socket Listeners
    // ------------------------------

    socket.on(
      "newOrder",
      handleNewOrder
    );

    socket.on(
      "paymentChanged",
      handlePaymentChanged
    );


    // ==========================================
    // AUTO REFRESH CONTACT MESSAGES
    // ==========================================

    const messageTimer = setInterval(() => {

      loadMessages();

    }, 3000);


    // ------------------------------
    // Cleanup
    // ------------------------------

    return () => {

      socket.off(
        "newOrder",
        handleNewOrder
      );

      socket.off(
        "paymentChanged",
        handlePaymentChanged
      );

      // Stop timer when leaving Admin

      clearInterval(messageTimer);

    };

  }, []);


  // ==============================
  // Revenue
  // ==============================

  const totalRevenue =
    orders.reduce(
      (sum, order) =>
        sum + Number(order.total),
      0
    );


  // ==============================
  // Pending Orders
  // ==============================

  const pendingOrders =
    orders.filter(
      (order) =>
        order.status === "Pending"
    ).length;


  // ==============================
  // Accepted Orders
  // ==============================

  const acceptedOrders =
    orders.filter(
      (order) =>
        order.status === "Accepted"
    ).length;


  // ==============================
  // Completed Orders
  // ==============================

  const completedOrders =
    orders.filter(
      (order) =>
        order.status === "Completed"
    ).length;


  // =====================================
  // Update Order Status
  // =====================================

  function updateStatus(
    id,
    status
  ) {

    fetch(
      `http://localhost:5000/api/orders/${id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          status,
        }),

      }
    )

      .then(
        (res) =>
          res.json()
      )

      .then(() => {

        loadOrders();

      })

      .catch((err) => {

        console.log(
          "Status Update Error:",
          err
        );

      });

  }


  // ==========================================
  // Mark Cash Payment as Paid
  // ==========================================

  function markPaymentPaid(id) {

    fetch(
      `http://localhost:5000/api/orders/${id}/payment`,
      {
        method: "PUT",

        headers: {
          "Content-Type":
            "application/json",
        },

      }
    )

      .then(
        (res) =>
          res.json()
      )

      .then(() => {

        loadOrders();

      })

      .catch((err) => {

        console.log(
          "Payment Update Error:",
          err
        );

      });

  }


  // ==========================================
  // Go To Orders
  // ==========================================

  function goToOrders() {

    document
      .getElementById(
        "orders-section"
      )
      ?.scrollIntoView({
        behavior: "smooth",
      });

  }


  // ==========================================
  // Go To Messages
  // ==========================================

  function goToMessages() {

    document
      .getElementById(
        "messages-section"
      )
      ?.scrollIntoView({
        behavior: "smooth",
      });

  }


  // ==========================================
  // Go To Dashboard
  // ==========================================

  function goToDashboard() {

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  }


  // ==========================================
  // LOGOUT
  // ==========================================

  function handleLogout() {

    localStorage.removeItem(
      "adminLoggedIn"
    );

    navigate(
      "/admin-login"
    );

  }


  // ==========================================
  // RETURN
  // ==========================================

  return (

    <div className="admin-container">


      {/* =====================================
          ADMIN HEADER
      ===================================== */}

      <div className="admin-header">


        {/* Logo */}

        <div className="admin-logo">

          <span>
            ☕
          </span>

          <h2>
            CafeFlow Admin
          </h2>

        </div>


        {/* Navigation */}

        <div className="admin-nav">


          <button
            onClick={
              goToDashboard
            }
          >
            Dashboard
          </button>


          <button
            onClick={
              goToOrders
            }
          >
            Orders
          </button>


          <button
            onClick={
              goToMessages
            }
          >
            Messages
          </button>


          <button
            className="admin-logout"
            onClick={
              handleLogout
            }
          >
            Logout
          </button>


        </div>

      </div>


      {/* =====================================
          PAGE TITLE
      ===================================== */}

      <h1 className="admin-title">
        Dashboard Overview
      </h1>


      <p className="admin-subtitle">
        Manage your cafe orders and customer
        messages
      </p>


      {/* =====================================
          DASHBOARD CARDS
      ===================================== */}

      <div className="dashboard">


        {/* Total Orders */}

        <div className="card">

          <h2>
            📦 Total Orders
          </h2>

          <h1>
            {orders.length}
          </h1>

        </div>


        {/* Pending */}

        <div className="card">

          <h2>
            ⏳ Pending
          </h2>

          <h1>
            {pendingOrders}
          </h1>

        </div>


        {/* Accepted */}

        <div className="card">

          <h2>
            ✅ Accepted
          </h2>

          <h1>
            {acceptedOrders}
          </h1>

        </div>


        {/* Completed */}

        <div className="card">

          <h2>
            🎉 Completed
          </h2>

          <h1>
            {completedOrders}
          </h1>

        </div>


        {/* Revenue */}

        <div className="card">

          <h2>
            💰 Total Revenue
          </h2>

          <h1>
            Rs. {totalRevenue}
          </h1>

        </div>


      </div>


      {/* =====================================
          ORDERS SECTION
      ===================================== */}

      <div
        id="orders-section"
        className="orders-section"
      >


        <h2 className="section-title">
          📦 Orders
        </h2>


        <div className="table-wrapper">


          <table>


            <thead>

              <tr>

                <th>ID</th>

                <th>Customer</th>

                <th>Table</th>

                <th>Phone</th>

                <th>Total</th>

                <th>Status</th>

                <th>Payment</th>

                <th>Action</th>

              </tr>

            </thead>


            <tbody>


              {orders.map(
                (order) => (

                  <tr
                    key={
                      order.id
                    }
                  >


                    <td>
                      {order.id}
                    </td>


                    <td>
                      {order.customer_name}
                    </td>


                    <td>
                      {order.table_number}
                    </td>


                    <td>
                      {order.phone}
                    </td>


                    <td>
                      Rs. {order.total}
                    </td>


                    <td
                      className={

                        order.status ===
                        "Pending"

                          ? "pending"

                          : order.status ===
                            "Completed"

                          ? "completed"

                          : order.status ===
                            "Cancelled"

                          ? "cancelled"

                          : "accepted"

                      }
                    >

                      {order.status}

                    </td>


                    <td>

                      {
                        order.payment_status ===
                        "Paid"

                          ? (

                            <span
                              style={{
                                color:
                                  "green",
                                fontWeight:
                                  "bold",
                              }}
                            >
                              🟢 Paid
                            </span>

                          )

                          : (

                            <span
                              style={{
                                color:
                                  "orange",
                                fontWeight:
                                  "bold",
                              }}
                            >
                              🟠 Pending
                            </span>

                          )
                      }

                    </td>


                    <td>


                      {/* Pending */}

                      {
                        order.status ===
                        "Pending" && (

                          <>

                            <button
                              className="accept-btn"
                              onClick={() =>
                                updateStatus(
                                  order.id,
                                  "Accepted"
                                )
                              }
                            >
                              Accept
                            </button>


                            <button
                              className="cancel-btn"
                              onClick={() =>
                                updateStatus(
                                  order.id,
                                  "Cancelled"
                                )
                              }
                            >
                              Cancel
                            </button>

                          </>

                        )
                      }


                      {/* Accepted */}

                      {
                        order.status ===
                        "Accepted" && (

                          <button
                            className="complete-btn"
                            onClick={() =>
                              updateStatus(
                                order.id,
                                "Completed"
                              )
                            }
                          >
                            Complete
                          </button>

                        )
                      }


                      {/* Cash Payment */}

                      {
                        order.status ===
                        "Completed" &&

                        order.payment_status ===
                        "Pending" &&

                        order.payment_method ===
                        "Cash" && (

                          <button
                            className="payment-btn"
                            onClick={() =>
                              markPaymentPaid(
                                order.id
                              )
                            }
                          >
                            💵 Mark Paid
                          </button>

                        )
                      }


                      {/* Completed + Paid */}

                      {
                        order.status ===
                        "Completed" &&

                        order.payment_status ===
                        "Paid" && (

                          <span
                            style={{
                              color:
                                "green",
                              fontWeight:
                                "bold",
                            }}
                          >
                            ✔ Completed
                          </span>

                        )
                      }


                      {/* Cancelled */}

                      {
                        order.status ===
                        "Cancelled" && (

                          <span
                            style={{
                              color:
                                "red",
                              fontWeight:
                                "bold",
                            }}
                          >
                            ✖ Cancelled
                          </span>

                        )
                      }


                    </td>


                  </tr>

                )
              )}


            </tbody>


          </table>


        </div>


      </div>


      {/* =====================================
          CONTACT MESSAGES
      ===================================== */}

      <div
        id="messages-section"
        className="contact-messages-section"
      >


        <h2 className="section-title">
          📩 Contact Messages
        </h2>


        {
          messages.length === 0

            ? (

              <p className="no-messages">
                No contact messages found.
              </p>

            )

            : (

              <div className="table-wrapper">


                <table>


                  <thead>

                    <tr>

                      <th>ID</th>

                      <th>Name</th>

                      <th>Email</th>

                      <th>Subject</th>

                      <th>Message</th>

                      <th>Date</th>

                    </tr>

                  </thead>


                  <tbody>


                    {
                      messages.map(
                        (message) => (

                          <tr
                            key={
                              message.id
                            }
                          >

                            <td>
                              {message.id}
                            </td>

                            <td>
                              {message.name}
                            </td>

                            <td>
                              {message.email}
                            </td>

                            <td>
                              {message.subject}
                            </td>

                            <td className="message-cell">
                              {message.message}
                            </td>

                            <td>
                              {new Date(
                                message.created_at
                              ).toLocaleString()}
                            </td>

                          </tr>

                        )
                      )
                    }


                  </tbody>


                </table>


              </div>

            )
        }


      </div>


    </div>

  );

}


export default Admin;