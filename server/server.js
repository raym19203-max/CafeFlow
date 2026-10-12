console.log("THIS IS MY NEW SERVER");

const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const http = require("http");

const { Server } = require("socket.io");
const db = require("./db");

const app = express();


// ==========================================
// Middleware
// ==========================================

app.use(cors());

app.use(express.json());


// ==========================================
// Test Route
// ==========================================

app.get("/", (req, res) => {
  res.send("Cafe Backend Running...");
});


// ==========================================
// Create HTTP Server
// ==========================================

const server = http.createServer(app);


// ==========================================
// Socket.IO
// ==========================================

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT"],
  },
});


// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:5173", "http://localhost:5174"],
//     methods: ["GET", "POST", "PUT"],
//     credentials: true,
//   },
// });



// ==========================================
// Socket Connection
// ==========================================

io.on("connection", (socket) => {

  console.log("✅ Client Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client Disconnected");
  });

});


// ==========================================
// GET ALL ORDERS
// Admin Dashboard
// ==========================================

app.get("/api/orders", (req, res) => {

  const sql = `
    SELECT *
    FROM orders
    ORDER BY id DESC
  `;

  db.query(sql, (err, result) => {

    if (err) {

      console.log(err);

      return res.status(500).json({
        message: "Database Error",
      });

    }

    res.json(result);

  });

});


// ==========================================
// GET SINGLE ORDER
// Customer OrderSuccess Page
// ==========================================

app.get("/api/orders/:id", (req, res) => {

  const { id } = req.params;

  const sql = `
    SELECT *
    FROM orders
    WHERE id = ?
  `;

  db.query(sql, [id], (err, result) => {

    if (err) {

      console.log(err);

      return res.status(500).json({
        message: "Database Error",
      });

    }

    if (result.length === 0) {

      return res.status(404).json({
        message: "Order not found",
      });

    }

    res.json(result[0]);

  });

});


// ==========================================
// UPDATE ORDER STATUS
// Pending → Accepted → Completed
// ==========================================

app.put("/api/orders/:id", (req, res) => {

  const id = req.params.id;

  const { status } = req.body;

  const sql = `
    UPDATE orders
    SET status = ?
    WHERE id = ?
  `;

  db.query(sql, [status, id], (err) => {

    if (err) {

      console.log(err);

      return res.status(500).json({
        message: "Database Error",
      });

    }

    // Send real-time status update
    io.emit("statusChanged", {
      id: id,
      status: status,
    });

    res.json({
      message: "Status Updated",
    });

  });

});


// ==========================================
// MARK CASH PAYMENT AS PAID
// Admin → Mark Paid
// ==========================================

app.put("/api/orders/:id/payment", (req, res) => {

  const { id } = req.params;

  const sql = `
    UPDATE orders
    SET payment_status = 'Paid'
    WHERE id = ?
  `;

  db.query(sql, [id], (err) => {

    if (err) {

      console.log(err);

      return res.status(500).json({
        message: "Payment update failed",
      });

    }

    // Real-time payment update
    io.emit("paymentChanged", {
      id: id,
      payment_status: "Paid",
    });

    res.json({
      message: "Payment marked as paid",
    });

  });

});


// ==========================================
// CREATE CASH / NORMAL ORDER
// ==========================================

app.post("/api/orders", (req, res) => {

  const {
    customerName,
    tableNumber,
    phoneNumber,
    instructions,
    paymentMethod,
    items,
    total,
  } = req.body;


  // All new orders start as Pending.
  // Online payment will become Paid only
  // after the payment gateway verifies it.

  const paymentStatus = "Pending";


  const sql = `
    INSERT INTO orders
    (
      customer_name,
      table_number,
      phone,
      instructions,
      payment_method,
      payment_status,
      items,
      total
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;


  db.query(
    sql,
    [
      customerName,
      tableNumber,
      phoneNumber,
      instructions,
      paymentMethod,
      paymentStatus,
      JSON.stringify(items),
      total,
    ],
    (err, result) => {

      if (err) {

        console.log(err);

        return res.status(500).json({
          message: "Database Error",
        });

      }


      // Notify Admin
      io.emit("newOrder");


      res.json({
        message: "Order Saved Successfully",
        orderId: result.insertId,
      });

    }
  );

});





// ==========================================
// CONTACT MESSAGE
// ==========================================

app.post("/api/contact", (req, res) => {

  const {
    name,
    email,
    subject,
    message
  } = req.body;

  // Validate fields
  if (!name || !email || !subject || !message) {

    return res.status(400).json({
      message: "Please fill all fields."
    });

  }

  const sql = `
    INSERT INTO contact_messages
    (
      name,
      email,
      subject,
      message
    )
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      name,
      email,
      subject,
      message
    ],
    (err, result) => {

      if (err) {

        console.log("Contact DB Error:", err);

        return res.status(500).json({
          message: "Could not save contact message."
        });

      }

      console.log(
        "✅ Contact message saved:",
        result.insertId
      );

      res.json({
        success: true,
        message: "Message sent successfully!",
        id: result.insertId
      });

    }
  );

});





// ==========================================
// GET ALL CONTACT MESSAGES
// Admin Dashboard
// ==========================================

app.get("/api/contact", (req, res) => {

  const sql = `
    SELECT *
    FROM contact_messages
    ORDER BY id DESC
  `;

  db.query(sql, (err, result) => {

    if (err) {

      console.log("Contact Fetch Error:", err);

      return res.status(500).json({
        message: "Database Error",
      });

    }

    res.json(result);

  });

});





// ==========================================
// eSEWA PAYMENT INITIATE
// ==========================================

app.post("/api/esewa/initiate", (req, res) => {

  const {
    customerName,
    tableNumber,
    phoneNumber,
    instructions,
    items,
    total,
  } = req.body;

  const amount = Number(total);

  if (!amount || amount <= 0) {
    return res.status(400).json({
      message: "Invalid order amount",
    });
  }

  const productCode = "EPAYTEST";

  const taxAmount = 0;
  const serviceCharge = 0;
  const deliveryCharge = 0;

  const totalAmount =
    amount +
    taxAmount +
    serviceCharge +
    deliveryCharge;

  const paymentMethod = "eSewa";
  const paymentStatus = "Pending";
  const status = "Pending";

  // ----------------------------------------
  // First save order
  // ----------------------------------------

  const sql = `
    INSERT INTO orders
    (
      customer_name,
      table_number,
      phone,
      instructions,
      payment_method,
      payment_status,
      items,
      total,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      customerName,
      tableNumber,
      phoneNumber,
      instructions,
      paymentMethod,
      paymentStatus,
      JSON.stringify(items),
      total,
      status,
    ],
    (err, result) => {

      if (err) {
        console.log("Order DB Error:", err);

        return res.status(500).json({
          message: "Could not create eSewa order",
        });
      }

      const orderId = result.insertId;

      // ----------------------------------------
      // Create transaction UUID AFTER order ID
      // ----------------------------------------

      const transactionUuid =
        `ORDER-${orderId}-${Date.now()}`;

      // ----------------------------------------
      // eSewa UAT secret key
      // ----------------------------------------

      const secretKey =
        "8gBm/:&EnhH.1/q";

      // ----------------------------------------
      // Signature
      // ----------------------------------------

      const signedFieldNames =
        "total_amount,transaction_uuid,product_code";

      const message =
        `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;

      const signature =
        crypto
          .createHmac("sha256", secretKey)
          .update(message)
          .digest("base64");

      // ----------------------------------------
      // Notify admin
      // ----------------------------------------

      io.emit("newOrder");

      // ----------------------------------------
      // eSewa Payment Data
      // ----------------------------------------

      const paymentData = {

        amount: amount.toString(),

        tax_amount:
          taxAmount.toString(),

        total_amount:
          totalAmount.toString(),

        transaction_uuid:
          transactionUuid,

        product_code:
          productCode,

        product_service_charge:
          serviceCharge.toString(),

        product_delivery_charge:
          deliveryCharge.toString(),

        // IMPORTANT:
        // Do NOT add orderId here
        success_url:
          "http://localhost:5173/esewa-success",

        failure_url:
          "http://localhost:5173/esewa-failure",

        signed_field_names:
          signedFieldNames,

        signature:
          signature,
      };

      console.log(
        "✅ eSewa Payment Created for Order:",
        orderId
      );

      console.log(
        "Transaction UUID:",
        transactionUuid
      );

      res.json({

        success: true,

        orderId: orderId,

        paymentData: paymentData,

      });

    }
  );

});












// ==========================================
// eSEWA PAYMENT VERIFICATION
// ==========================================

app.get("/api/esewa/verify", async (req, res) => {

  const { data } = req.query;

  if (!data) {
    return res.status(400).json({
      message: "Missing eSewa payment data",
    });
  }

  try {

    // ----------------------------------------
    // Decode eSewa Base64 response
    // ----------------------------------------

    const decoded =
      Buffer.from(data, "base64").toString("utf8");

    console.log("Decoded eSewa Data:", decoded);

    const paymentData =
      JSON.parse(decoded);

    console.log(
      "eSewa Payment Object:",
      paymentData
    );

    const {
      transaction_uuid,
      total_amount,
      product_code,
      status,
    } = paymentData;

    if (
      !transaction_uuid ||
      !total_amount ||
      !product_code
    ) {

      return res.status(400).json({
        message: "Invalid eSewa response",
      });

    }

    // ----------------------------------------
    // Extract order ID
    //
    // ORDER-25-1754660000000
    //       ^^
    // ----------------------------------------

    const parts =
      transaction_uuid.split("-");

    const orderId = parts[1];

    if (!orderId) {

      return res.status(400).json({
        message: "Invalid transaction UUID",
      });

    }

    // ----------------------------------------
    // Verify with eSewa
    // ----------------------------------------

    const verifyUrl =
      `https://rc.esewa.com.np/api/epay/transaction/status/` +
      `?product_code=${encodeURIComponent(product_code)}` +
      `&total_amount=${encodeURIComponent(total_amount)}` +
      `&transaction_uuid=${encodeURIComponent(transaction_uuid)}`;

    console.log(
      "Checking eSewa:",
      verifyUrl
    );

    const response =
      await fetch(verifyUrl);

    const result =
      await response.json();

    console.log(
      "eSewa Verification Result:",
      result
    );

    // ----------------------------------------
    // Check payment
    // ----------------------------------------

    if (
      result.status === "COMPLETE" &&
      String(result.transaction_uuid) ===
        String(transaction_uuid)
    ) {

      // ----------------------------------------
      // Update database
      // ----------------------------------------

      const sql = `
        UPDATE orders
        SET payment_status = 'Paid'
        WHERE id = ?
      `;

      db.query(
        sql,
        [orderId],
        (err) => {

          if (err) {

            console.log(
              "Database Update Error:",
              err
            );

            return res.status(500).json({
              message:
                "Database update failed",
            });

          }

          // ----------------------------------------
          // Notify admin/customer
          // ----------------------------------------

          io.emit("paymentChanged", {
            id: orderId,
            payment_status: "Paid",
          });

          console.log(
            `✅ Order ${orderId} payment marked as PAID`
          );

          return res.json({

            success: true,

            orderId: orderId,

            message:
              "Payment verified successfully",

            payment_status:
              "Paid",

          });

        }
      );

    } else {

      return res.json({

        success: false,

        orderId: orderId,

        message:
          result.status ||
          "Payment not completed",

        payment_status:
          "Pending",

      });

    }

  } catch (error) {

    console.log(
      "eSewa verification error:",
      error
    );

    return res.status(500).json({
      message:
        "Payment verification failed",
    });

  }

});





 // GET ALL PRODUCTS
app.get("/api/products", (req, res) => {
  const sql = "SELECT * FROM products ORDER BY id DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.log("Products Error:", err);
      return res.status(500).json({
        message: "Could not load products"
      });
    }

    res.json(results);
  });
});






 // ADD NEW PRODUCT
app.post("/api/products", (req, res) => {
  const {
    name,
    category,
    subcategory,
    price,
    image,
    availability
  } = req.body;

  if (!name || !category || price === undefined || Number(price) < 0) {
    return res.status(400).json({
      message: "Name, category and a valid price are required"
    });
  }

  const sql = `
    INSERT INTO products
    (name, category, subcategory, price, image, availability)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      name,
      category,
      subcategory || "",
      Number(price),
      image || "",
      availability || "Available"
    ],
    (err, result) => {
      if (err) {
        console.log("Add Product Error:", err);
        return res.status(500).json({
          message: "Could not add product"
        });
      }

      res.status(201).json({
        message: "Product added successfully",
        id: result.insertId
      });
    }
  );
});






// UPDATE PRODUCT
app.put("/api/products/:id", (req, res) => {
  const { id } = req.params;

  const {
    name,
    category,
    subcategory,
    price,
    image,
    availability,
  } = req.body;

  if (
    !name ||
    !category ||
    price === undefined ||
    !Number.isFinite(Number(price)) ||
    Number(price) < 0 ||
    !["Available", "Not Available"].includes(availability)
  ) {
    return res.status(400).json({
      message: "Please provide valid product details",
    });
  }

  const sql = `
    UPDATE products
    SET name = ?,
        category = ?,
        subcategory = ?,
        price = ?,
        image = ?,
        availability = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      name.trim(),
      category.trim(),
      subcategory || "",
      Number(price),
      image || "",
      availability,
      id,
    ],
    (err, result) => {
      if (err) {
        console.log("Update Product Error:", err);
        return res.status(500).json({
          message: "Could not update product",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      res.json({
        message: "Product updated successfully",
      });
    }
  );
});




// DELETE PRODUCT
app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM products WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.log("Delete Product Error:", err);

        return res.status(500).json({
          message: "Could not delete product",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      res.json({
        message: "Product deleted successfully",
      });
    }
  );
});







// ==========================================
// START SERVER
// ==========================================

server.listen(5000, () => {

  console.log(
    "🚀 Server running on port 5000"
  );

});