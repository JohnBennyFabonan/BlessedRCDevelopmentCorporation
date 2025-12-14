const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

console.log("🔥 ADMIN ROUTES LOADED");

// ========================
// DASHBOARD
// ========================
router.get("/stats", adminController.getStats);

// ========================
// ADMIN ACCOUNT
// ========================
router.put("/account/:id", adminController.updateAdminAccount);

// ========================
// STAFF MANAGEMENT
// ========================
router.get("/staff", adminController.getStaffList);
router.get("/staff/:id", adminController.getStaffById);
router.post("/staff", adminController.createStaff);
router.put("/staff/:id", adminController.updateStaff);
router.delete("/staff/:id", adminController.deleteStaff);

// ========================
// AGENT MANAGEMENT
// ========================
router.get("/agents", adminController.getAgentList);
router.get("/agents/:id", adminController.getAgentById);
router.post("/agents", adminController.createAgent);
router.put("/agents/:id", adminController.updateAgent);
router.delete("/agents/:id", adminController.deleteAgent);

// ========================
// CUSTOMER MANAGEMENT
// ========================
router.get("/customers", adminController.getCustomerList);
router.put("/customers/:id/disable", adminController.disableCustomer);
router.put("/customers/:id/enable", adminController.enableCustomer);
router.delete("/customers/:id", adminController.deleteCustomer);

module.exports = router;
