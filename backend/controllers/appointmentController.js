const Appointment = require("../models/appointmentModel");

// =====================================
// CREATE APPOINTMENT
// =====================================
exports.createAppointment = async (req, res) => {
  try {
    const appt = await Appointment.create(req.body);

    return res.json({
      success: true,
      message: "Appointment booked successfully",
      data: appt,
    });

  } catch (err) {
    console.error("❌ CREATE APPOINTMENT ERROR:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to book appointment",
    });
  }
};

// =====================================
// GET ALL APPOINTMENTS (ADMIN / STAFF)
// =====================================
exports.getAllAppointments = async (req, res) => {
  try {
    const data = await Appointment.getAll();
    return res.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("❌ GET APPOINTMENTS ERROR:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch appointments",
    });
  }
};

// =====================================
// UPDATE APPOINTMENT STATUS (FIXED)
// =====================================
exports.updateStatus = async (req, res) => {
  try {
    const id = req.params.id;
    let { status } = req.body;

    // Normalize status to lowercase
    status = status.toLowerCase();

    const validStatuses = ["pending", "approved", "declined"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status",
      });
    }

    const updated = await Appointment.updateStatus(id, status);

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
      });
    }

    return res.json({
      success: true,
      message: `Status updated to ${status}`,
      data: updated,
    });

  } catch (err) {
    console.error("❌ UPDATE STATUS ERROR:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to update appointment",
    });
  }
};

// =====================================
// GET APPOINTMENTS BY USER
// =====================================
exports.getUserAppointments = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const data = await Appointment.getByUser(userId);

    return res.json({
      success: true,
      data,
    });

  } catch (err) {
    console.error("❌ GET USER APPOINTMENTS ERROR:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to load appointments",
    });
  }
};

// =====================================
// GET APPOINTMENTS BY PROPERTY
// =====================================
exports.getPropertyAppointments = async (req, res) => {
  try {
    const propertyId = req.params.property_id;
    const data = await Appointment.getByProperty(propertyId);

    return res.json({
      success: true,
      data,
    });

  } catch (err) {
    console.error("❌ GET PROPERTY APPOINTMENTS ERROR:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to load property appointments",
    });
  }
};

// =====================================
// EDIT APPOINTMENT
// =====================================
exports.updateAppointment = async (req, res) => {
  try {
    const id = req.params.id;
    const { date, time, message } = req.body;

    const updated = await Appointment.update(id, {
      date,
      time,
      message,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
      });
    }

    return res.json({
      success: true,
      message: "Appointment updated",
      data: updated,
    });

  } catch (err) {
    console.error("❌ UPDATE APPOINTMENT ERROR:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to update appointment",
    });
  }
};

// =====================================
// DELETE / CANCEL APPOINTMENT
// =====================================
exports.deleteAppointment = async (req, res) => {
  try {
    const id = req.params.id;

    const deleted = await Appointment.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
      });
    }

    return res.json({
      success: true,
      message: "Appointment cancelled",
    });

  } catch (err) {
    console.error("❌ DELETE APPOINTMENT ERROR:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to cancel appointment",
    });
  }
};
