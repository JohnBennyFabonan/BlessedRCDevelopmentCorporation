const pool = require("../config/db");
const bcrypt = require("bcryptjs");

module.exports = {

  async getAll() {
    const query = `SELECT id, full_name, username, email, phone, created_at FROM staff ORDER BY id ASC`;
    const { rows } = await pool.query(query);
    return rows;
  },

  async getById(id) {
    const query = `SELECT id, full_name, username, email, phone, created_at FROM staff WHERE id = $1`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  async create(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const query = `
      INSERT INTO staff (full_name, username, email, phone, password)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, full_name, username, email, phone, created_at
    `;

    const values = [
      data.full_name,
      data.username,
      data.email,
      data.phone,
      hashedPassword
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async update(id, data) {
    let updates = [];
    let values = [];
    let index = 1;

    if (data.full_name) {
      updates.push(`full_name = $${index++}`);
      values.push(data.full_name);
    }
    if (data.username) {
      updates.push(`username = $${index++}`);
      values.push(data.username);
    }
    if (data.email) {
      updates.push(`email = $${index++}`);
      values.push(data.email);
    }
    if (data.phone) {
      updates.push(`phone = $${index++}`);
      values.push(data.phone);
    }
    if (data.password) {
      const hashed = await bcrypt.hash(data.password, 10);
      updates.push(`password = $${index++}`);
      values.push(hashed);
    }

    values.push(id);

    const query = `
      UPDATE staff SET ${updates.join(", ")}
      WHERE id = $${index}
      RETURNING id, full_name, username, email, phone, created_at
    `;

    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async delete(id) {
    const query = `DELETE FROM staff WHERE id = $1 RETURNING id`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
};
