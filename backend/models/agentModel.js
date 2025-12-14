const pool = require("../config/db");
const bcrypt = require("bcryptjs");

module.exports = {

  // =====================================
  // GET ALL AGENTS
  // =====================================
  async getAllAgents() {
    const query = `
      SELECT id, full_name, email, contact 
      FROM users 
      WHERE role = 'agent'
      ORDER BY id ASC;
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  // =====================================
  // CREATE AGENT (FIXED: SAVES CONTACT)
  // =====================================
  async createAgent(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const query = `
      INSERT INTO users (full_name, email, password, role, contact)
      VALUES ($1, $2, $3, 'agent', $4)
      RETURNING id, full_name, email, contact;
    `;

    const values = [
      data.full_name,
      data.email,
      hashedPassword,
      data.contact
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // =====================================
  // GET AGENT BY ID
  // =====================================
  async getAgentById(id) {
    const query = `
      SELECT id, full_name, email, contact
      FROM users
      WHERE id = $1 AND role = 'agent';
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  // =====================================
  // UPDATE AGENT (FIXED: contact included)
  // =====================================
  async updateAgent(id, data) {
    const fields = [];
    const values = [];
    let index = 1;

    if (data.full_name) {
      fields.push(`full_name = $${index++}`);
      values.push(data.full_name);
    }

    if (data.email) {
      fields.push(`email = $${index++}`);
      values.push(data.email);
    }

    if (data.contact) {
      fields.push(`contact = $${index++}`);
      values.push(data.contact);
    }

    if (data.password) {
      const hashed = await bcrypt.hash(data.password, 10);
      fields.push(`password = $${index++}`);
      values.push(hashed);
    }

    values.push(id);

    const query = `
      UPDATE users
      SET ${fields.join(", ")}
      WHERE id = $${index}
      RETURNING id, full_name, email, contact;
    `;

    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // =====================================
  // DELETE AGENT
  // =====================================
  async deleteAgent(id) {
    const query = `
      DELETE FROM users 
      WHERE id = $1 AND role = 'agent'
      RETURNING id;
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
};
