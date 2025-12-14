const pool = require("../config/db");
const bcrypt = require("bcryptjs");

// =======================
// DASHBOARD STATS
// =======================
exports.getStats = async (req, res) => {
  try {
    const totalProperties = await pool.query("SELECT COUNT(*) FROM properties");
    const totalAppointments = await pool.query("SELECT COUNT(*) FROM appointments");
    const totalCustomers = await pool.query("SELECT COUNT(*) FROM users WHERE role='client'");
    const totalStaff = await pool.query("SELECT COUNT(*) FROM users WHERE role='staff'");
    const totalAgents = await pool.query("SELECT COUNT(*) FROM users WHERE role='agent'");

    res.json({
      success: true,
      data: {
        properties: Number(totalProperties.rows[0].count),
        appointments: Number(totalAppointments.rows[0].count),
        customers: Number(totalCustomers.rows[0].count),
        staff: Number(totalStaff.rows[0].count),
        agents: Number(totalAgents.rows[0].count)
      }
    });

  } catch (err) {
    console.error("ADMIN DASHBOARD ERROR:", err);
    res.status(500).json({ success: false, error: "Failed to fetch stats" });
  }
};

// =======================
// UPDATE ADMIN ACCOUNT
// =======================
exports.updateAdminAccount = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;
    const id = req.params.id;

    if (!full_name || !email)
      return res.status(400).json({ success: false, error: "Missing required fields" });

    if (password && password.trim() !== "") {
      const hash = await bcrypt.hash(password, 10);
      await pool.query(
        "UPDATE users SET full_name=$1, email=$2, password=$3 WHERE id=$4 AND role='admin'",
        [full_name, email, hash, id]
      );
    } else {
      await pool.query(
        "UPDATE users SET full_name=$1, email=$2 WHERE id=$3 AND role='admin'",
        [full_name, email, id]
      );
    }

    const updated = await pool.query(
      "SELECT id, full_name, email, role FROM users WHERE id=$1 AND role='admin'",
      [id]
    );

    res.json({ success: true, data: updated.rows[0] });

  } catch (err) {
    console.error("UPDATE ADMIN ACCOUNT ERROR:", err);
    res.status(500).json({ success: false, error: "Failed to update admin account" });
  }
};

// =======================
// STAFF MANAGEMENT
// =======================
exports.getStaffList = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, full_name, email, contact, role, created_at FROM users WHERE role='staff' ORDER BY id ASC"
    );
    res.json({ success: true, data: result.rows });

  } catch (err) {
    console.error("GET STAFF ERROR:", err);
    res.status(500).json({ success: false, error: "Failed to fetch staff" });
  }
};

exports.getStaffById = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, full_name, email, contact, role FROM users WHERE id=$1 AND role='staff'",
      [req.params.id]
    );

    if (!result.rows[0])
      return res.status(404).json({ success: false, error: "Staff not found" });

    res.json({ success: true, data: result.rows[0] });

  } catch (err) {
    console.error("GET STAFF BY ID ERROR:", err);
    res.status(500).json({ success: false, error: "Failed to fetch staff" });
  }
};

exports.createStaff = async (req, res) => {
  try {
    const { full_name, email, contact, password } = req.body;

    if (!full_name || !email || !password)
      return res.status(400).json({ success: false, error: "Missing required fields" });

    const existing = await pool.query("SELECT id FROM users WHERE email=$1", [email]);
    if (existing.rows[0])
      return res.status(400).json({ success: false, error: "Email already in use" });

    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, password, role, contact, created_at)
       VALUES ($1,$2,$3,'staff',$4,NOW())
       RETURNING id, full_name, email, contact, role, created_at`,
      [full_name, email, hash, contact || null]
    );

    res.json({ success: true, data: result.rows[0] });

  } catch (err) {
    console.error("CREATE STAFF ERROR:", err);
    res.status(500).json({ success: false, error: "Failed to create staff" });
  }
};

exports.updateStaff = async (req, res) => {
  try {
    const { full_name, email, contact, password } = req.body;
    const id = req.params.id;

    if (password && password.trim() !== "") {
      const hash = await bcrypt.hash(password, 10);
      await pool.query(
        "UPDATE users SET full_name=$1, email=$2, contact=$3, password=$4 WHERE id=$5 AND role='staff'",
        [full_name, email, contact || null, hash, id]
      );
    } else {
      await pool.query(
        "UPDATE users SET full_name=$1, email=$2, contact=$3 WHERE id=$4 AND role='staff'",
        [full_name, email, contact || null, id]
      );
    }

    const updated = await pool.query(
      "SELECT id, full_name, email, contact, role FROM users WHERE id=$1 AND role='staff'",
      [id]
    );

    res.json({ success: true, data: updated.rows[0] });

  } catch (err) {
    console.error("UPDATE STAFF ERROR:", err);
    res.status(500).json({ success: false, error: "Failed to update staff" });
  }
};

exports.deleteStaff = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await pool.query(
      "DELETE FROM users WHERE id=$1 AND role='staff'",
      [id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ success: false, error: "Staff not found" });

    res.json({ success: true, message: "Staff deleted" });

  } catch (err) {
    console.error("DELETE STAFF ERROR:", err);
    res.status(500).json({ success: false, error: "Failed to delete staff" });
  }
};

// =======================
// AGENT MANAGEMENT
// =======================
exports.getAgentList = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, full_name, email, contact, role, created_at FROM users WHERE role='agent' ORDER BY id ASC"
    );
    res.json({ success: true, data: result.rows });

  } catch (err) {
    console.error("GET AGENTS ERROR:", err);
    res.status(500).json({ success: false, error: "Failed to fetch agents" });
  }
};

exports.getAgentById = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, full_name, email, contact, role FROM users WHERE id=$1 AND role='agent'",
      [req.params.id]
    );

    if (!result.rows[0])
      return res.status(404).json({ success: false, error: "Agent not found" });

    res.json({ success: true, data: result.rows[0] });

  } catch (err) {
    console.error("GET AGENT BY ID ERROR:", err);
    res.status(500).json({ success: false, error: "Failed to fetch agent" });
  }
};

exports.createAgent = async (req, res) => {
  try {
    const { full_name, email, contact, password } = req.body;

    if (!full_name || !email || !password)
      return res.status(400).json({ success: false, error: "Missing required fields" });

    const existing = await pool.query("SELECT id FROM users WHERE email=$1", [email]);
    if (existing.rows[0])
      return res.status(400).json({ success: false, error: "Email already in use" });

    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, password, role, contact, created_at)
       VALUES ($1,$2,$3,'agent',$4,NOW())
       RETURNING id, full_name, email, contact, role, created_at`,
      [full_name, email, hash, contact || null]
    );

    res.json({ success: true, data: result.rows[0] });

  } catch (err) {
    console.error("CREATE AGENT ERROR:", err);
    res.status(500).json({ success: false, error: "Failed to create agent" });
  }
};

exports.updateAgent = async (req, res) => {
  try {
    const { full_name, email, contact, password } = req.body;
    const id = req.params.id;

    if (password && password.trim() !== "") {
      const hash = await bcrypt.hash(password, 10);
      await pool.query(
        "UPDATE users SET full_name=$1, email=$2, contact=$3, password=$4 WHERE id=$5 AND role='agent'",
        [full_name, email, contact || null, hash, id]
      );
    } else {
      await pool.query(
        "UPDATE users SET full_name=$1, email=$2, contact=$3 WHERE id=$4 AND role='agent'",
        [full_name, email, contact || null, id]
      );
    }

    const updated = await pool.query(
      "SELECT id, full_name, email, contact, role FROM users WHERE id=$1 AND role='agent'",
      [id]
    );

    res.json({ success: true, data: updated.rows[0] });

  } catch (err) {
    console.error("UPDATE AGENT ERROR:", err);
    res.status(500).json({ success: false, error: "Failed to update agent" });
  }
};

exports.deleteAgent = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await pool.query(
      "DELETE FROM users WHERE id=$1 AND role='agent'",
      [id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ success: false, error: "Agent not found" });

    res.json({ success: true, message: "Agent deleted" });

  } catch (err) {
    console.error("DELETE AGENT ERROR:", err);
    res.status(500).json({ success: false, error: "Failed to delete agent" });
  }
};

// =======================
// CLIENT MANAGEMENT
// =======================
exports.getCustomerList = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
          id, 
          full_name, 
          email, 
          contact,
          birthday,
          address,
          created_at,
          COALESCE(disabled, false) AS disabled
       FROM users 
       WHERE role='client'
       ORDER BY id ASC`
    );

    res.json({ success: true, data: result.rows });

  } catch (err) {
    console.error("GET CUSTOMERS ERROR:", err);
    res.status(500).json({ success: false, error: "Failed to fetch customers" });
  }
};

exports.disableCustomer = async (req, res) => {
  try {
    const result = await pool.query(
      "UPDATE users SET disabled=true WHERE id=$1 AND role='client'",
      [req.params.id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ success: false, error: "Customer not found" });

    res.json({ success: true, message: "Customer disabled" });

  } catch (err) {
    console.error("DISABLE CUSTOMER ERROR:", err);
    res.status(500).json({ success: false, error: "Failed to disable customer" });
  }
};

exports.enableCustomer = async (req, res) => {
  try {
    const result = await pool.query(
      "UPDATE users SET disabled=false WHERE id=$1 AND role='client'",
      [req.params.id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ success: false, error: "Customer not found" });

    res.json({ success: true, message: "Customer enabled" });

  } catch (err) {
    console.error("ENABLE CUSTOMER ERROR:", err);
    res.status(500).json({ success: false, error: "Failed to enable customer" });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const id = req.params.id;

    // FIXED: appointments uses client_id not user_id
    await pool.query("DELETE FROM appointments WHERE client_id=$1", [id]);

    const result = await pool.query(
      "DELETE FROM users WHERE id=$1 AND role='client'",
      [id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ success: false, error: "Customer not found" });

    res.json({ success: true, message: "Customer permanently deleted" });

  } catch (err) {
    console.error("DELETE CUSTOMER ERROR:", err);
    res.status(500).json({ success: false, error: "Failed to delete customer" });
  }
};
