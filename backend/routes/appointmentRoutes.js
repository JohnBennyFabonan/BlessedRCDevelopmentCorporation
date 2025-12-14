const express = require("express");
const router = express.Router();

const appointmentController = require("../controllers/appointmentController");

console.log("🔥 APPOINTMENT ROUTES LOADED");

// =====================================================
// CLIENT ROUTES
// =====================================================

// Create appointment
router.post("/", appointmentController.createAppointment);

// Get all appointments of a specific client
router.get("/user/:user_id", appointmentController.getUserAppointments);

// Edit appointment
router.put("/:id", appointmentController.updateAppointment);

// Cancel appointment
router.delete("/:id", appointmentController.deleteAppointment);

// =====================================================
// STAFF / ADMIN ROUTES
// =====================================================

// Get all appointments
router.get("/", appointmentController.getAllAppointments);

// Get appointments for a specific property
router.get("/property/:property_id", appointmentController.getPropertyAppointments);

// ✅ UPDATE APPOINTMENT STATUS (MATCHES FRONTEND)
router.put("/:id/status", appointmentController.updateStatus);

module.exports = router;
