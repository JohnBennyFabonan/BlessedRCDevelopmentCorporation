const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staffController");

router.get("/properties/:staff_id", staffController.getPropertiesByStaff);
router.get("/appointments/:staff_id", staffController.getAppointmentsByStaff);

// ⭐ NEW — staff can approve/decline appointments
router.put("/appointments/update-status/:id", staffController.updateAppointmentStatus);

module.exports = router;
