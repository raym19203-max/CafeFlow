
const mysql = require("mysql2");


const isCloud = Boolean(process.env.DB_HOST);

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "cafe",
  ssl: isCloud
    ? {
        ca: process.env.DB_CA_CERT,
        rejectUnauthorized: true
      }
    : undefined
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err.message);
  } else {
    // console.log("MySQL Connected");
    console.log("MySQL Connected successfully");
    console.log("Database host:", process.env.DB_HOST);
  }
});

module.exports = db;







