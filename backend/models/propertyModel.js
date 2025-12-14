const pool = require("../config/db");

// Helper: convert images JSON string → array
function parseImages(images) {
  if (!images) return [];
  try {
    return typeof images === "string" ? JSON.parse(images) : images;
  } catch {
    return [];
  }
}

const Property = {

  // ==========================
  // CREATE PROPERTY
  // ==========================
  create: async (data) => {
    const query = `
      INSERT INTO properties 
      (title, location, price, lot_area, phase, type, status, description,
       images, agent, virtual_tour, google_map, availability_image, created_by)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING *;
    `;

    const values = [
      data.title,
      data.location,
      data.price,
      data.lot_area,
      data.phase,
      data.type,
      data.status,
      data.description,
      data.images,
      data.agent,
      data.virtual_tour,
      data.google_map,
      data.availability_image,
      data.created_by
    ];

    const result = await pool.query(query, values);
    const property = result.rows[0];

    return { ...property, images: parseImages(property.images) };
  },

  // ==========================
  // GET ALL PROPERTIES
  // ==========================
  getAll: async () => {
    const result = await pool.query(`SELECT * FROM properties ORDER BY id DESC`);
    return result.rows.map(row => ({
      ...row,
      images: parseImages(row.images)
    }));
  },

  // ==========================
  // GET PROPERTY BY ID
  // ==========================
  getById: async (id) => {
    const result = await pool.query(`SELECT * FROM properties WHERE id=$1`, [id]);
    if (!result.rows.length) return null;

    const p = result.rows[0];
    return { ...p, images: parseImages(p.images) };
  },

  // ==========================
  // UPDATE PROPERTY
  // ==========================
  update: async (id, data) => {
    const query = `
      UPDATE properties SET
        title=$1, location=$2, price=$3, lot_area=$4, phase=$5,
        type=$6, status=$7, description=$8, images=$9,
        agent=$10, virtual_tour=$11, google_map=$12, availability_image=$13
      WHERE id=$14
      RETURNING *;
    `;

    const values = [
      data.title,
      data.location,
      data.price,
      data.lot_area,
      data.phase,
      data.type,
      data.status,
      data.description,
      data.images,
      data.agent,
      data.virtual_tour,
      data.google_map,
      data.availability_image,
      id
    ];

    const result = await pool.query(query, values);
    const p = result.rows[0];

    return { ...p, images: parseImages(p.images) };
  },

  // ==========================
  // DELETE PROPERTY
  // ==========================
  delete: async (id) => {
    const res = await pool.query(`DELETE FROM properties WHERE id=$1`, [id]);
    return res.rowCount > 0;
  }
};

module.exports = Property;
