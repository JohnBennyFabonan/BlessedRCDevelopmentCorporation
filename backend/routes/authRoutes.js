const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

console.log("🔥 AUTH ROUTES LOADED");

// AUTH ROUTES
router.post("/register", authController.register);
router.post("/login", authController.login);

// USER PROFILE ROUTES
router.get("/user/:id", authController.getUser);
router.put("/update/:id", authController.updateUser);

module.exports = router;
