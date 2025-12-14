const pool = require("../config/db");

module.exports = {

  // ============================================
  // CREATE APPOINTMENT
  // ============================================
  async create(data) {
    const query = `
      INSERT INTO appointments
      (user_id, property_id, full_name, email, contact, date, time, message, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'pending')
      RETURNING *;
    `;

    const values = [
      data.user_id,
      data.property_id,
      data.full_name,
      data.email,
      data.contact,
      data.date,
      data.time,
      data.message
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // ============================================
  // GET ALL APPOINTMENTS (ADMIN / STAFF)
  // ============================================
  async getAll() {
    const query = `
      SELECT 
        a.*,
        p.title AS property_title
      FROM appointments a
      LEFT JOIN properties p ON a.property_id = p.id
      ORDER BY a.id ASC;
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  // ============================================
  // UPDATE STATUS (APPROVE / DECLINE)
  // ============================================
  async updateStatus(id, status) {
    const query = `
      UPDATE appointments
      SET status = $1
      WHERE id = $2
      RETURNING *;
    `;
    const values = [status, id];

    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // ============================================
  // CLIENT: GET APPOINTMENTS BY USER
  // ============================================
  async getByUser(user_id) {
    const query = `
      SELECT 
        a.*,
        p.title AS property_title
      FROM appointments a
      LEFT JOIN properties p ON a.property_id = p.id
      WHERE a.user_id = $1
      ORDER BY a.id DESC;
    `;
    const { rows } = await pool.query(query, [user_id]);
    return rows;
  },

  // ============================================
  // STAFF: GET APPOINTMENTS BY PROPERTY
  // ============================================
  async getByProperty(property_id) {
    const query = `
      SELECT 
        a.id,
        a.user_id,
        a.property_id,
        a.full_name,
        a.email,
        a.contact,
        a.date,
        a.time,
        a.message,
        a.status,
        p.title AS property_title
      FROM appointments a
      LEFT JOIN properties p ON a.property_id = p.id
      WHERE a.property_id = $1
      ORDER BY a.date ASC, a.time ASC;
    `;

    const { rows } = await pool.query(query, [property_id]);
    return rows;
  },

  // ============================================
  // UPDATE APPOINTMENT (CLIENT EDIT)
  // ============================================
  async update(id, data) {
    const query = `
      UPDATE appointments
      SET date = $1, time = $2, message = $3
      WHERE id = $4
      RETURNING *;
    `;
    const values = [data.date, data.time, data.message, id];

    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // ============================================
  // DELETE / CANCEL APPOINTMENT
  // ============================================
  async delete(id) {
    const query = `
      DELETE FROM appointments
      WHERE id = $1
      RETURNING id;
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  // ============================================
  // COUNT APPOINTMENTS BY PROPERTY
  // ============================================
  async countByProperty(property_id) {
    const query = `
      SELECT COUNT(*) 
      FROM appointments 
      WHERE property_id = $1;
    `;
    const { rows } = await pool.query(query, [property_id]);
    return Number(rows[0].count);
  }
};
