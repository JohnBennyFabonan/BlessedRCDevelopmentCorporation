const { Pool } = require("pg");
require("dotenv").config();

// ======= Show ENV values loaded (DEBUG) =======
console.log("Loaded ENV:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
});

// ======= PostgreSQL Connection Setup =======
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  }
});

// ======= Test Connection =======
pool.connect()
  .then(() => console.log("✔ PostgreSQL CONNECTED"))
  .catch(err => console.error("❌ DATABASE CONNECTION FAILED:", err.message));

// ======= Display Active Database =======
pool.query("SELECT current_database()", (err, res) => {
  if (err) {
    console.error("❌ ERROR FETCHING DB NAME:", err.message);
  } else {
    console.log("CONNECTED TO DATABASE:", res.rows[0].current_database);
  }
});

module.exports = pool;
