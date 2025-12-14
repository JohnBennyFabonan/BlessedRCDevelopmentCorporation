const Agent = require("../models/agentModel");
const pool = require("../config/db");

// =====================================
// GET ALL AGENTS
// =====================================
exports.getAgents = async (req, res) => {
  try {
    const agents = await Agent.getAllAgents();
    res.json({ success: true, data: agents });
  } catch (err) {
    console.error("❌ GET AGENTS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch agents" });
  }
};

// =====================================
// CREATE AGENT
// =====================================
exports.createAgent = async (req, res) => {
  try {
    const agent = await Agent.createAgent(req.body);
    res.json({ success: true, data: agent });
  } catch (err) {
    console.error("❌ CREATE AGENT ERROR:", err);
    res.status(500).json({ error: "Failed to create agent" });
  }
};

// =====================================
// GET AGENT BY ID
// =====================================
exports.getAgentById = async (req, res) => {
  try {
    const agent = await Agent.getAgentById(req.params.id);
    res.json({ success: true, data: agent });
  } catch (err) {
    console.error("❌ GET AGENT ERROR:", err);
    res.status(500).json({ error: "Failed to fetch agent" });
  }
};

// =====================================
// UPDATE AGENT
// =====================================
exports.updateAgent = async (req, res) => {
  try {
    const updated = await Agent.updateAgent(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("❌ UPDATE AGENT ERROR:", err);
    res.status(500).json({ error: "Failed to update agent" });
  }
};

// =====================================
// DELETE AGENT
// =====================================
exports.deleteAgent = async (req, res) => {
  try {
    await Agent.deleteAgent(req.params.id);
    res.json({ success: true, message: "Agent deleted successfully" });
  } catch (err) {
    console.error("❌ DELETE AGENT ERROR:", err);
    res.status(500).json({ error: "Failed to delete agent" });
  }
};

// =====================================
// GET ASSIGNED PROPERTIES
// FIXED: must return {success, data}
// =====================================
exports.getAssignedProperties = async (req, res) => {
  try {
    const agentId = req.params.agentId;

    const query = `
      SELECT * FROM properties 
      WHERE agent_id = $1
    `;

    const result = await pool.query(query, [agentId]);

    return res.json({
      success: true,
      data: result.rows
    });

  } catch (err) {
    console.error("❌ GET ASSIGNED PROPERTIES ERROR:", err);
    res.status(500).json({ error: "Failed to fetch assigned properties" });
  }
};
