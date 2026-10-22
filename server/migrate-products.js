
// require("dotenv").config();
require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const fs = require("fs");
const path = require("path");
const mysql = require("mysql2");

const caPath = process.env.DB_CA_CERT_PATH
  ? path.resolve(__dirname, process.env.DB_CA_CERT_PATH)
  : null;

const localDb = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.LOCAL_DB_PASSWORD,
  database: "cafe",
});

const cloudDb = mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "cafe",
  
  ssl: {
    ca: fs.readFileSync(
      path.join(__dirname, "ca.pem"),
      "utf8"
    ),
    rejectUnauthorized: true,
  },
});

function query(db, sql, values = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) =>
      err ? reject(err) : resolve(result)
    );
  });
}

async function migrate() {
  try {
    await new Promise((resolve, reject) =>
      localDb.connect(err => err ? reject(err) : resolve())
    );

    await new Promise((resolve, reject) =>
      cloudDb.connect(err => err ? reject(err) : resolve())
    );

    const products = await query(
      localDb,
      `SELECT id, name, category, subcategory, price, image, availability
       FROM products ORDER BY id`
    );

    console.log("Local products found:", products.length);

    const existing = await query(
      cloudDb,
      "SELECT id FROM products"
    );

    if (existing.length > 0) {
      throw new Error(
        "Cloud table is not empty. Migration stopped to prevent conflicts."
      );
    }

    for (const p of products) {
      await query(
        cloudDb,
        `INSERT INTO products
         (id, name, category, subcategory, price, image, availability)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          p.id,
          p.name,
          p.category,
          p.subcategory,
          p.price,
          p.image,
          p.availability,
        ]
      );
    }

    const check = await query(
      cloudDb,
      "SELECT COUNT(*) AS total FROM products"
    );

    console.log("Cloud products after migration:", check[0].total);
    console.log("Migration completed successfully.");
  } catch (err) {
    console.error("Migration stopped:", err.message);
  } finally {
    localDb.end();
    cloudDb.end();
  }
}

migrate();
