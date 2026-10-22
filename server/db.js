const fs = require("fs");
const path = require("path");

const caPath = process.env.DB_CA_CERT_PATH
  ? path.resolve(__dirname, process.env.DB_CA_CERT_PATH)
  : null;

require("dotenv").config();

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
        ca: caPath ? fs.readFileSync(caPath, "utf8") : process.env.DB_CA_CERT,
        rejectUnauthorized: true
      }
    : undefined  
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err.message);
    return;
  }

  console.log("MySQL Connected successfully");
  console.log("Database host:", db.config.host);
});

module.exports = db;








