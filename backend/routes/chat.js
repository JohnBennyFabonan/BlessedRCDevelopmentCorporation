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
       (property_id, agent_id, client_id, sender_role, message, is_read)
       VALUES ($1,$2,$3,'client',$4,false)`,
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
       (property_id, agent_id, client_id, sender_role, message, is_read)
       VALUES ($1,$2,$3,'agent',$4,true)`,
      [property_id, agent_id, client_id, message]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("❌ AGENT CHAT ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/* ===============================
   AGENT: LOAD CONVERSATIONS (WITH UNREAD)
================================ */
router.get("/agent/:agentId", async (req, res) => {
  try {
    const { agentId } = req.params;

    const result = await pool.query(
      `
      SELECT
        property_id,
        client_id,
        MAX(created_at) AS last_message,
        BOOL_OR(is_read = false AND sender_role = 'client') AS has_unread
      FROM chat_messages
      WHERE agent_id = $1
      GROUP BY property_id, client_id
      ORDER BY last_message DESC
      `,
      [agentId]
    );

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("❌ LOAD CONVERSATIONS ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/* ===============================
   MARK CHAT AS READ (AGENT OPENS)
================================ */
router.post("/mark-read", async (req, res) => {
  try {
    const { property_id, agent_id, client_id } = req.body;

    await pool.query(
      `
      UPDATE chat_messages
      SET is_read = true
      WHERE property_id = $1
        AND agent_id = $2
        AND client_id = $3
        AND sender_role = 'client'
        AND is_read = false
      `,
      [property_id, agent_id, client_id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("❌ MARK READ ERROR:", err);
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
