const pool = require("../config/db");

// ===============================
// GET PROPERTIES CREATED BY STAFF
// ===============================
exports.getPropertiesByStaff = async (req, res) => {
  try {
    const staffId = req.params.staff_id;

    const result = await pool.query(
      `SELECT * FROM properties WHERE created_by = $1 ORDER BY id DESC`,
      [staffId]
    );

    res.json({
      success: true,
      data: result.rows
    });

  } catch (err) {
    console.error("STAFF GET PROPERTIES ERROR:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// ===============================
// GET APPOINTMENTS FOR STAFF PROPERTIES
// ===============================
exports.getAppointmentsByStaff = async (req, res) => {
  try {
    const staffId = req.params.staff_id;

    const query = `
      SELECT 
        a.id,
        a.date,
        a.time,
        a.message,
        a.status,
        u.full_name AS client_name,
        u.email AS client_email,
        p.title AS property_title
      FROM appointments a
      JOIN properties p ON a.property_id = p.id
      JOIN users u ON a.user_id = u.id
      WHERE p.created_by = $1
      ORDER BY a.id DESC;
    `;

    const result = await pool.query(query, [staffId]);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (err) {
    console.error("STAFF GET APPOINTMENTS ERROR:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// ===============================
// UPDATE APPOINTMENT STATUS (STAFF)
// ===============================
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const apptId = req.params.id;
    const { status } = req.body;

    if (!["Approved", "Declined"].includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid status" });
    }

    await pool.query(
      `UPDATE appointments SET status=$1 WHERE id=$2`,
      [status, apptId]
    );

    return res.json({ success: true, message: `Appointment ${status}` });

  } catch (err) {
    console.error("STAFF UPDATE STATUS ERROR:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
