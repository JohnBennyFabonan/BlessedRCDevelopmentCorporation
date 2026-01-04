const express = require("express");
console.log("✅ chat.js LOADED");
const router = express.Router();

// DB CONNECTION
const pool = require("../config/db");

/* ===============================
   CLIENT SEND MESSAGE
================================ */
router.post("/send", async (req, res) => {
  try {
    const { property_id, agent_id, client_id, message } = req.body;

    if (!property_id || !agent_id || !client_id || !message) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    await pool.query(
      `INSERT INTO chat_messages
       (property_id, agent_id, client_id, sender_role, message)
       VALUES ($1,$2,$3,'client',$4)`,
      [property_id, agent_id, client_id, message]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("❌ CLIENT CHAT ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/* ===============================
   AGENT SEND REPLY
================================ */
router.post("/send-agent", async (req, res) => {
  try {
    const { property_id, agent_id, client_id, message } = req.body;

    await pool.query(
      `INSERT INTO chat_messages
       (property_id, agent_id, client_id, sender_role, message)
       VALUES ($1,$2,$3,'agent',$4)`,
      [property_id, agent_id, client_id, message]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("❌ AGENT CHAT ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/* ===============================
   AGENT: LOAD CONVERSATIONS
================================ */
router.get("/agent/:agentId", async (req, res) => {
  try {
    const { agentId } = req.params;

    const result = await pool.query(
      `SELECT DISTINCT ON (client_id, property_id)
         client_id,
         property_id,
         MAX(created_at) AS last_message
       FROM chat_messages
       WHERE agent_id = $1
       GROUP BY client_id, property_id
       ORDER BY client_id, property_id, last_message DESC`,
      [agentId]
    );

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("❌ LOAD CONVERSATIONS ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/* ===============================
   LOAD CHAT MESSAGES
================================ */
router.get("/:propertyId/:agentId/:clientId", async (req, res) => {
  try {
    const { propertyId, agentId, clientId } = req.params;

    const result = await pool.query(
      `SELECT sender_role, message, created_at
       FROM chat_messages
       WHERE property_id = $1
         AND agent_id = $2
         AND client_id = $3
       ORDER BY created_at ASC`,
      [propertyId, agentId, clientId]
    );

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("❌ LOAD MESSAGES ERROR:", err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
