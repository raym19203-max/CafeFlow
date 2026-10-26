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

//charts
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import React from "react";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";


function Admin() {
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [selectedOrder, setSelectedOrder] = useState(null);
 
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  // REPORT FILTERS
  const [reportFromDate, setReportFromDate] = useState("");
  const [reportToDate, setReportToDate] = useState("");
  const [reportOrderStatus, setReportOrderStatus] = useState("All");
  const [reportPaymentStatus, setReportPaymentStatus] = useState("All");
  const [reportTable, setReportTable] = useState("All");
  const [reportSearch, setReportSearch] = useState("");
  const [reportPage, setReportPage] = useState(1);
  const reportPageSize = 10;


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

  const salesData = Array.from({ length: 24 }, (_, hour) => {
    const time =
      hour === 0
        ? "12 AM"
        : hour < 12
        ? `${hour} AM`
        : hour === 12
        ? "12 PM"
        : `${hour - 12} PM`;

    const sales = orders
      .filter((order) => {
        const orderDate = new Date(order.created_at);

        return (
          orderDate.toDateString() === new Date().toDateString() &&
          orderDate.getHours() === hour &&
          order.status === "Completed"
        );
      })
      .reduce((sum, order) => sum + Number(order.total || 0), 0);

    return { time, sales };
  });


  // ==============================

  // Store Contact Messages

  // ==============================

  const [messages, setMessages] = useState([]);

  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  function loadProducts() {

    fetch("https://cafeflow-api-y0yw.onrender.com/api/products")
    // fetch("/api/products")

      .then((res) => {

        if (!res.ok) {

          throw new Error("Failed to load products");

        }

        return res.json();

      })

      .then((data) => setProducts(data))

      .catch((err) => {

        console.log("Products Error:", err);

      });

  }

  // ==============================

  // Load all orders

  // ==============================


  
function loadOrders() {
  fetch("https://cafeflow-api-y0yw.onrender.com/api/orders")
    .then((res) => res.json())
    .then((data) => {
      const parsedOrders = data.map((order) => {
        let items = order.items;

        if (typeof items === "string") {
          try {
            items = JSON.parse(items);
          } catch (error) {
            items = [];
          }
        }

        return {
          ...order,
          items: Array.isArray(items) ? items : [],
        };
      });

      console.log("Orders received from API:", parsedOrders);
      setOrders(parsedOrders);
    })
    .catch((err) => {
      console.log("Orders Error:", err);
    });
}


  // ==============================

  // Load Contact Messages

  // ==============================

  function loadMessages() {

    // fetch("https://cafeflow-api-y0yw.onrender.com/api/contact")
    fetch(`${import.meta.env.VITE_API_URL}/api/contact`)

      .then((res) => res.json())

      .then((data) => {

        // setMessages(data);
        setMessages(Array.isArray(data) ? data : []);

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

    loadProducts();

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

  // total Revenue onlt after pay
  // ==============================

 
   const totalRevenue = orders
  .filter((order) => order.status === "Completed")
  .reduce((sum, order) => sum + Number(order.total || 0), 0); 

  // ==============================

  // Pending Orders

  // ==============================

  const pendingOrders =

    orders.filter(

      (order) =>

        order.status === "Pending"

    ).length;

   
  // REPORT FILTERING
const filteredReportOrders = orders.filter((order) => {
  const orderDate = new Date(order.created_at);

  const fromDateMatch =
    !reportFromDate ||
    orderDate >= new Date(`${reportFromDate}T00:00:00`);

  const toDateMatch =
    !reportToDate ||
    orderDate < new Date(
      new Date(`${reportToDate}T00:00:00`).getTime() +
        24 * 60 * 60 * 1000
    );

  const statusMatch =
    reportOrderStatus === "All" ||
    order.status === reportOrderStatus;



  const paymentStatus = String(
  order.payment_status ?? order.paymentStatus ?? ""
)
  .trim()
  .toLowerCase();

  const selectedPaymentStatus = reportPaymentStatus.trim().toLowerCase();

  const paymentMatch =
    selectedPaymentStatus === "all" ||
    paymentStatus === selectedPaymentStatus;  



  const tableMatch =
    reportTable === "All" ||
    String(order.table_number || order.table_no || order.tableNumber) ===
      reportTable;

  // const search = reportSearch.trim().toLowerCase();   
  const search = reportSearch.trim().replace("#", "").toLowerCase();        
 
  const searchMatch = (() => {
    if (!search) return true;

    const orderId = String(order.id ?? order.order_id ?? "")
      .replace("#", "")
      .trim();

    if (/^\d+$/.test(search)) {
      const exactIdExists = orders.some(
        (item) =>
          String(item.id ?? item.order_id ?? "")
            .replace("#", "")
            .trim() === search
      );

      if (exactIdExists) {
        return orderId === search;
      }
    }

    return (
      String(order.customer_name ?? order.customer ?? order.name ?? "")
        .toLowerCase()
        .includes(search) ||
      String(order.phone ?? "")
        .toLowerCase()
        .includes(search) ||
      String(order.table_number ?? order.table_no ?? order.tableNumber ?? "")
        .toLowerCase()
        .includes(search) ||
      orderId.toLowerCase().includes(search)
    );
  })();
  

  return (
    fromDateMatch &&
    toDateMatch &&
    statusMatch &&
    paymentMatch &&
    tableMatch &&
    searchMatch
  );
});

//  pdf report
const downloadReportPDF = () => {
  const doc = new jsPDF({ orientation: "landscape" });

  doc.setFontSize(18);
  doc.text("CafeFlow - Order Report", 14, 15);

  autoTable(doc, {
    startY: 22,
    head: [[
      "Order ID",
      "Date & Time",
      "Customer",
      "Table",
      "Phone",
      "Total (Rs.)",
      "Order Status",
      "Payment Status",
    ]],
    body: filteredReportOrders.map((order) => [
      `#${String(order.id ?? order.order_id ?? "").replace(/^#/, "")}`,
      order.created_at
        ? new Date(order.created_at).toLocaleString()
        : "-",
      order.customer_name ?? order.customer ?? order.name ?? "-",
      order.table_number ?? order.table_no ?? order.tableNumber ?? "-",
      order.phone ?? "-",
      Number(order.total ?? 0).toLocaleString(),
      order.status ?? "-",
      order.payment_status ?? order.paymentStatus ?? "-",
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [25, 55, 80] },
  });

  doc.save("CafeFlow-Order-Report.pdf");
};


//csv report
const downloadReportCSV = () => {
  const headers = [
    "Order ID",
    "Date & Time",
    "Customer",
    "Table",
    "Phone",
    "Total (Rs.)",
    "Order Status",
    "Payment Status",
  ];

  const rows = filteredReportOrders.map((order) => [
    `#${String(order.id ?? order.order_id ?? "").replace(/^#/, "")}`,
    order.created_at
      ? new Date(order.created_at).toLocaleString()
      : "-",
    order.customer_name ?? order.customer ?? order.name ?? "-",
    order.table_number ?? order.table_no ?? order.tableNumber ?? "-",
    order.phone ?? "-",
    Number(order.total ?? 0),
    order.status ?? "-",
    order.payment_status ?? order.paymentStatus ?? "-",
  ]);

  const escapeCSV = (value) =>
    `"${String(value).replace(/"/g, '""')}"`;

  const csvContent = [headers, ...rows]
    .map((row) => row.map(escapeCSV).join(","))
    .join("\r\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "CafeFlow-Order-Report.csv";
  link.click();

  URL.revokeObjectURL(link.href);
};


const reportTotalPages = Math.max(
  1,
  Math.ceil(filteredReportOrders.length / reportPageSize)
);

const paginatedReportOrders = filteredReportOrders.slice(
  (reportPage - 1) * reportPageSize,
  reportPage * reportPageSize
);


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


  
  // Today's Orders
const today = new Date().toLocaleDateString();

const todaysOrders = orders.filter((order) => {
  return new Date(order.created_at).toLocaleDateString() === today;
});

const orderStatusData = [
  {
    name: "Pending",
    value: todaysOrders.filter((order) => order.status === "Pending").length,
  },
  {
    name: "Accepted",
    value: todaysOrders.filter((order) => order.status === "Accepted").length,
  },
  {
    name: "Completed",
    value: todaysOrders.filter((order) => order.status === "Completed").length,
  },
];


const todaysRevenue = todaysOrders
  .filter((order) => order.status === "Completed")
  .reduce((sum, order) => sum + Number(order.total || 0), 0);



  // =====================================

  // Update Order Status

  // =====================================

  function updateStatus(

    id,

    status

  ) {

    fetch(

      `https://cafeflow-api-y0yw.onrender.com/api/orders/${id}`,

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

      `https://cafeflow-api-y0yw.onrender.com/api/orders/${id}/payment`,

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
      {/* Order Details Popup */}
{selectedOrder && (
  <div className="order-modal-overlay">
    <div className="order-modal">
      <h2>📋 Order Details</h2>

      <p><strong>Order ID:</strong> #{selectedOrder.id}</p>
      <p><strong>Customer:</strong> {selectedOrder.customer_name}</p>
      <p><strong>Phone:</strong> {selectedOrder.phone || "Not provided"}</p>
      <p><strong>Table:</strong> {selectedOrder.table_number}</p>

      <h3>Items</h3>
      {Array.isArray(selectedOrder.items) &&
      selectedOrder.items.length > 0 ? (
        selectedOrder.items.map((item, index) => (
          <p key={index}>
            {item.name || item.product_name || "Item"} × {item.quantity || 1}
          </p>
        ))
      ) : (
        <p>No items found</p>
      )}

      <p><strong>Total:</strong> Rs. {selectedOrder.total}</p>
      <p><strong>Status:</strong> {selectedOrder.status}</p>
      <p><strong>Payment:</strong> {selectedOrder.payment_method || "Not provided"} ({selectedOrder.payment_status || "Pending"})</p>

      <button onClick={() => setSelectedOrder(null)}>
        Close
      </button>
    </div>
  </div>
)}

      <button
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {/* ADMIN SIDEBAR */}
      <div
       className={`admin-sidebar ${sidebarOpen ? "active" : ""}`}
        style={{
          left: sidebarOpen ? "0" : undefined
        }}
      >
        <h2>☕ CafeFlow</h2>

        <button
          onClick={() => {
            setActiveSection("dashboard");
            setSidebarOpen(false);
          }}
        >
          🏠 Dashboard
        </button>

        
          <button
            onClick={() => setActiveSection("todayOrders")}
          >
            🛒 Today's Orders
          </button>



        <button
          onClick={() => {
            setActiveSection("products");
            setSidebarOpen(false);
          }}
        >
          📦 Products
        </button>


        <button
          onClick={() => {
            setActiveSection("reports");
            setSidebarOpen(false);
          }}
        >
           📊 Reports
        </button>
        

        <button
          onClick={() => {
            setActiveSection("messages");
            setSidebarOpen(false);
          }}
        >
          💬 Contact Messages
        </button> 

        <button
          onClick={() => {
            localStorage.removeItem("adminLoggedIn");
            setSidebarOpen(false);
            navigate("/admin-login");
          }}
        >
          🚪 Logout
        </button>
      </div>

      {/* =====================================

          ADMIN HEADER

      ===================================== */}

   
      

      {/* =====================================

          PAGE TITLE

      ===================================== */}
      
    


      {/* {activeSection !== "reports" && ( */}
      {!["reports", "products", "messages"].includes(activeSection) && (  
        <>
          <h1 className="admin-title">
            Dashboard Overview
          </h1>

          <p className="admin-subtitle">
            Manage your cafe orders and customer messages
          </p>
        </>
      )}

      {/* =====================================

          DASHBOARD CARDS

      ===================================== */}

      {/* <div className="dashboard"> */}
      {/* <div className={`dashboard ${activeSection === "reports" ? "hide-report-cards" : ""}`}> */}
      <div
        className={`dashboard ${
          ["reports", "products", "messages"].includes(activeSection)
            ? "hide-report-cards"
            : ""
        }`}
      >
        {/* Total Orders */}

        <div className="card">

          <h2>

            📦 Today's Orders

          </h2>

          <h1>

            {todaysOrders.length}

          </h1>

        </div>

        {/* Pending */}

        <div className="card">

          <h2>

            ⏳ Pending

          </h2>

          <h1>

            {todaysOrders.filter((order) => order.status === "Pending").length}

          </h1>

        </div>

        {/* Accepted */}

        <div className="card">

          <h2>

            ✅ Accepted

          </h2>

          <h1>

            {todaysOrders.filter((order) => order.status === "Accepted").length}

          </h1>

        </div>

        {/* Completed */}

        <div className="card">

          <h2>

            🎉 Completed

          </h2>

          <h1>

            {todaysOrders.filter((order) => order.status === "Completed").length}

          </h1>

        </div>

        {/* Revenue */}

        <div className="card">

          <h2>

            💰 Today's Revenue

          </h2>

          <h1>

            Rs. {todaysRevenue.toLocaleString()}

          </h1>

        </div>

      </div>
      

      
{/* ALL-TIME STATISTICS */}
{activeSection === "dashboard" && (
 <div className="summary-panels">
  <div className="summary-panel">
    <h3>📊 All-Time Statistics</h3>
    <div className="summary-panel-content">
      <div>
        <p>Total Orders</p>
        <h2>{orders.length}</h2>
      </div>
      <div>
        <p>Total Revenue</p>
        <h2>Rs. {totalRevenue.toLocaleString()}</h2>
      </div>
    </div>
  </div>

  
 <div className="summary-panel">
   <h3>📦 Products</h3>

   <div className="summary-panel-content">
     <div>
       <p>Total Products</p>
       <h2>{products.length}</h2>
     </div>

     <div>
       <p>Available</p>
       <h2>
         {products.filter(
           (product) => product.availability === "Available"
         ).length}
       </h2>
     </div>

     <div>
       <p>Not Available</p>
       <h2>
         {products.filter(
           (product) => product.availability === "Not Available"
         ).length}
       </h2>
     </div>
   </div>
 </div>

 
  <div className="summary-panel">
    <h3>💬 Messages</h3>

    <div className="summary-panel-content">
      <div>
        <p>Total Messages</p>
        <h2>{messages.length}</h2>
     </div>

     <div>
       <p>New Messages</p>
       <h2>
         {messages.filter(
           (message) => message.status === "New"
         ).length}
       </h2>
     </div>
   </div>
 </div>

</div>
)}



{/* DASHBOARD CHARTS */}
{activeSection === "dashboard" && (
  <div className="dashboard-charts">
    <div className="chart-card">
      <h2>📊 Today's Sales</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="sales" fill="#ff6500" />
        </BarChart>
      </ResponsiveContainer>
    </div>

    <div className="chart-card">
      <h2>📈 Order Status (Today)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={orderStatusData.filter((item) => item.value > 0)}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {orderStatusData
              .filter((item) => item.value > 0)
              .map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={["#ff6500", "#168bff", "#20a464"][index]}
                />
              ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
)}



{/* TODAY'S ORDERS PAGE */}
{activeSection === "todayOrders" && (
  <div className="orders-section">
    <h2 className="section-title">🛒 Today's Orders</h2>
    <p>Manage and track all orders received today.</p>

    <div className="orders-filters">
  <input
    type="text"
    placeholder="Search by Order ID or customer name..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
  >
    <option value="All">All Status</option>
    <option value="Pending">Pending</option>
    <option value="Accepted">Accepted</option>
    <option value="Completed">Completed</option>
    <option value="Cancelled">Cancelled</option>
  </select>

  <button
    type="button"
    onClick={() => {
    setSearchTerm("");
    setStatusFilter("All");
  }}
  >
    Clear Filters
  </button>
</div>

<div className="table-wrapper">
  <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Table</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Payment</th>
            <th>Time</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {todaysOrders
            .filter((order) => {
              const search = searchTerm.toLowerCase();

              const matchesSearch =
                String(order.id).toLowerCase().includes(search) ||
                String(order.customer_name || "").toLowerCase().includes(search);

              const matchesStatus =
                statusFilter === "All" ||
                String(order.status || "").toLowerCase() ===
                  statusFilter.toLowerCase();

              return matchesSearch && matchesStatus;
            })
            .map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer_name}</td>
              <td>{order.table_number}</td>
              {/* <td>
                {Array.isArray(order.items)
                  ? order.items.length
                  : "—"}
              </td> */}
              <td>
                 {Array.isArray(order.items) && order.items.length > 0
                   ? order.items.map((item, index) => (
                       <div key={index}>
                         {item.name || item.product_name || "Item"}
                         {" × "}
                         {item.quantity || 1}
                       </div>
                     ))
                   : "—"}
               </td>

              
              
              <td>Rs. {Number(order.total || 0).toLocaleString()}</td>
              {/* <td>{order.status}</td> */}
              <td>{order.status}</td>
              <td>
                {order.payment_status === "Paid" ? (
                  <span className="paid-status">🟢 Paid</span>
                ) : (
                  <span className="pending-status">🟠 Pending</span>
                )}
             </td>

              {/* <td>{order.payment_status || "Pending"}</td> */}
              <td>
                {new Date(order.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>              
              {/* <td>
               <button
                 type="button"
                 onClick={() =>  setSelectedOrder(order)}
               >
                        View Details
               </button>
             </td> */}

             
<td>
  {order.status === "Pending" && (
    <button
      className="accept-btn"
      onClick={() => updateStatus(order.id, "Accepted")}
    >
      Accept
    </button>
  )}

  {order.status === "Accepted" && (
    <button
      className="complete-btn"
      onClick={() => updateStatus(order.id, "Completed")}
    >
      Complete
    </button>
  )}

  {order.status === "Completed" &&
    order.payment_status !== "Paid" && (
      <button
        className="accept-btn"
        // onClick={() => updatePaymentStatus(order.id, "Paid")}
        onClick={() => markPaymentPaid(order.id)}
      >
        💵Mark Paid
      </button>
    )}

  <button
    type="button"
    onClick={() => setSelectedOrder(order)}
  >
    View Details
  </button>
</td>


            </tr>
          ))}
        </tbody>
      </table>

      {todaysOrders.length === 0 && (
        <p>No orders received today.</p>
      )}
    </div>
  </div>
)}


      {/* =====================================

          ORDERS SECTION

      ===================================== */}
    {activeSection === "orders" && (
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
      )}


{/* PRODUCTS SECTION */}

{activeSection === "products" && (
 <div
   id="products-section"
   className="products-section"
 >

  <h2 className="section-title">Manage Products</h2>

  <p>

    Products loaded: {products.length}

  </p>

  
<form

  className="product-form"

  onSubmit={async (e) => {

    e.preventDefault();

    const form = e.currentTarget;

      const formData = new FormData(form);

    const product = {

      name: formData.get("name"),

      category: formData.get("category"),

      subcategory: formData.get("subcategory"),

      price: Number(formData.get("price")),

      image: formData.get("image"),

      availability: formData.get("availability"),

    };

    try {

      const response = await fetch(
         editingProduct
         ? `https://cafeflow-api-y0yw.onrender.com/api/products/${editingProduct.id}`
         : "https://cafeflow-api-y0yw.onrender.com/api/products",
       {
         method: editingProduct ? "PUT" : "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify(product),
       }
      );

      const result = await response.json();

      if (!response.ok) {

        throw new Error(result.message || "Failed to add product");

      }

      alert(
       editingProduct
         ? "Product updated successfully!"
         : "Product added successfully!"
      );

      form.reset();

      setEditingProduct(null);

      loadProducts();

    } catch (error) {

      alert(error.message);

    }

  }}

>
  


  <input
  name="name"
  placeholder="Product name"
  defaultValue={editingProduct ? editingProduct.name : ""}
  required
/>

  {/* <select name="category" required defaultValue=""> */}

  <select
  name="category"
  required
  defaultValue={editingProduct ? editingProduct.category : ""}
>
  

    <option value="" disabled>Select category</option>

    <option value="Food">Food</option>

    <option value="Coffee/Tea">Coffee/Tea</option>

    <option value="Drinks">Drinks</option>

    <option value="Snacks">Snacks</option>

  </select>

  {/* <input

    name="subcategory"

    placeholder="Subcategory (e.g. Momo)"

  /> */}

  <input
  name="subcategory"
  placeholder="Subcategory (e.g. Momo)"
  defaultValue={editingProduct ? editingProduct.subcategory : ""}
/>

  <input

    name="price"

    type="number"

    placeholder="Price in Rs."

    min="0"

    step="0.01"

    defaultValue={editingProduct ? editingProduct.price : ""}

    required

  />


  <input

    name="image"

    type="text"

    placeholder="Image URL (optional)"

    defaultValue={editingProduct ? editingProduct.image : ""}

  />


  <select
   name="availability"
   defaultValue={editingProduct ? editingProduct.availability : "Available"}
  >

    <option value="Available">Available</option>

    <option value="Not Available">Not Available</option>

  </select>


  <button type="submit">
    {editingProduct ? "Update Product" : "Add Product"}
  </button>

</form>

  <div className="table-wrapper">

    <table>

      <thead>

        <tr>

          <th>ID</th>

          <th>Name</th>

          <th>Category</th>

          <th>Price</th>

          <th>Availability</th>

          <th>Actions</th>

        </tr>

      </thead>

      <tbody>

        {products.map((product) => (

          <tr key={product.id}>

            <td>{product.id}</td>

            <td>{product.name}</td>

            <td>{product.category}</td>

            <td>Rs. {product.price}</td>

            <td>{product.availability}</td>

            <td>
             {/* <button
                type="button"
                onClick={() => {
                  setEditingProduct(product);
                }}
             >
               Edit
             </button> */}
             <button
                type="button"
                onClick={() => {
                  setEditingProduct(product);
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              >
                Edit
              </button>



             <button
  type="button"
  onClick={async () => {
    if (!window.confirm(`Delete ${product.name}?`)) return;

    try {
      const response = await fetch(
        `https://cafeflow-api-y0yw.onrender.com/api/products/${product.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Could not delete product"
        );
      }

      alert("Product deleted successfully!");
      loadProducts();
    } catch (error) {
      alert(error.message);
    }
  }}
>
  Delete
</button>



           </td>

          </tr>

        ))}

      </tbody>

    </table>

    {products.length === 0 && (

      <p>No products found. Add products to your database first.</p>

    )}

  </div>

</div>
)}



      {/* =====================================

          CONTACT MESSAGES

      ===================================== */}
     {activeSection === "messages" && (
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

            ) }

      </div>
     )}

           {activeSection === "reports" && (
        // <div className="reports-section">
        <div className="reports-section reports-page">  
           <div className="reports-sticky-header">
              <h1>📊 Order Report</h1>
              <p>View, search and download all past and today's orders.</p>
            </div>
        
          <div className="report-filters">
            <label>
              From Date
              <input
                type="date"
                value={reportFromDate}
                onChange={(e) => {
                  setReportFromDate(e.target.value);
                  setReportPage(1);
                }}
              />
            </label>

            <label>
              To Date
              <input type="date" />
            </label>

            <label>
              Order Status
              <select
                value={reportOrderStatus}
                onChange={(e) => {
                  setReportOrderStatus(e.target.value);
                  setReportPage(1);
                }}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </label>

            <label>
              Payment Status
              <select
                value={reportPaymentStatus}
                onChange={(e) => {
                  setReportPaymentStatus(e.target.value);
                  setReportPage(1);
                }}
              >
                <option value="All">All Payment</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </label>

            <label>
              Search
            
              <input
                type="text"
                placeholder="Search ID,name,phone.."
                value={reportSearch}
                onChange={(e) => {
                  setReportSearch(e.target.value);
                  setReportPage(1);
                }}
              />
            </label>

            <button type="button" onClick={downloadReportPDF}>
              📄 Download Report (PDF)
            </button>

            <button type="button" onClick={downloadReportCSV}>
              📊 Download (CSV)
            </button>
          </div>

          <div className="report-history">
            <h2>📄 Order History</h2>
            <p>Total Orders: {orders.length}</p>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Order ID</th>
                    <th>Date &amp; Time</th>
                    <th>Customer</th>
                    <th>Table</th>
                    <th>Phone</th>
                    <th>Total</th>
                    <th>Order Status</th>
                    <th>Payment Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedReportOrders.map((order, index) => (
                    <tr key={order.id}>
                      <td>{(reportPage - 1) * reportPageSize + index + 1}</td>
                      <td>#{order.id}</td>
                      <td>
                        {order.created_at
                          ? new Date(order.created_at).toLocaleString()
                          : "—"}
                      </td>
                      <td>{order.customer_name || "—"}</td>
                      <td>{order.table_number || "—"}</td>
                      <td>{order.phone || "—"}</td>
                      <td>Rs. {Number(order.total || 0).toLocaleString()}</td>
                      <td>{order.status || "—"}</td>
                      <td>{order.payment_status || "—"}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                        >
                          👁️ View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
            <div className="report-pagination">
              <button
                type="button"
                disabled={reportPage === 1}
                onClick={() => setReportPage((p) => p - 1)}
              >
                Previous
              </button>

              
            {Array.from({ length: reportTotalPages }, (_, i) => i + 1)
              .filter((page) =>
                page === 1 ||
                page === reportTotalPages ||
                Math.abs(page - reportPage) <= 1
              )
              .map((page, index, pages) => (
                <React.Fragment key={page}>
                  {index > 0 && page - pages[index - 1] > 1 && (
                    <span>...</span>
                  )}
                  <button
                    type="button"
                    className={reportPage === page ? "active" : ""}
                    onClick={() => setReportPage(page)}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}

              <button
                type="button"
                disabled={reportPage === reportTotalPages}
                onClick={() => setReportPage((p) => p + 1)}
              >
                Next
              </button>
            </div>

        </div>
      )}
    </div>

  );


}


export default Admin;
























