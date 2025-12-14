const express = require("express");
const router = express.Router();
const agentController = require("../controllers/agentController");

// ========================================================
// ORDER MATTERS!
// Place "assigned" routes BEFORE "/:id"
// ========================================================

// GET properties assigned to a specific agent
router.get("/assigned/:agentId", agentController.getAssignedProperties);

// GET all agents
router.get("/", agentController.getAgents);

// CREATE agent
router.post("/", agentController.createAgent);

// GET agent by ID
router.get("/:id", agentController.getAgentById);

// UPDATE agent
router.put("/:id", agentController.updateAgent);

// DELETE agent
router.delete("/:id", agentController.deleteAgent);

module.exports = router;
