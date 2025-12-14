const pool = require("../config/db");

const User = {

    // ==============================
    // FIND USER BY EMAIL
    // ==============================
    findByEmail: async (email) => {
        const result = await pool.query(
            "SELECT * FROM users WHERE email=$1 LIMIT 1",
            [email]
        );
        return result.rows[0];
    },

    // ==============================
    // FIND USER BY ID
    // ==============================
    findById: async (id) => {
        const result = await pool.query(
            "SELECT * FROM users WHERE id=$1",
            [id]
        );
        return result.rows[0];
    },

    // ==============================
    // GET USERS BY ROLE
    // ==============================
    getByRole: async (role) => {
        const result = await pool.query(
            "SELECT * FROM users WHERE role=$1 ORDER BY id ASC",
            [role]
        );
        return result.rows;
    },

    // ==============================
    // CREATE USER (CLIENT / STAFF / AGENT)
    // ==============================
    create: async (data) => {
        const query = `
            INSERT INTO users (
                full_name,
                email,
                password,
                role,
                contact,
                birthday,
                address,
                disabled,
                created_at
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW())
            RETURNING *;
        `;

        const values = [
            data.full_name,
            data.email,
            data.password,
            data.role,
            data.contact || null,
            data.birthday || null,
            data.address || null,
            data.disabled ?? false
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // ==============================
    // UPDATE USER PROFILE (CLIENT)
    // ==============================
    update: async (id, data) => {
        const query = `
            UPDATE users SET
                full_name = COALESCE($1, full_name),
                contact = COALESCE($2, contact),
                birthday = COALESCE($3, birthday),
                address = COALESCE($4, address),
                password = COALESCE($5, password)
            WHERE id=$6
            RETURNING *;
        `;

        const values = [
            data.full_name || null,
            data.contact || null,
            data.birthday || null,
            data.address || null,
            data.password || null,
            id
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // ==============================
    // PARTIAL UPDATE (DISABLE / ENABLE)
    // ==============================
    updatePartial: async (id, fields) => {
        const setParts = [];
        const values = [];
        let index = 1;

        for (const key in fields) {
            setParts.push(`${key}=$${index}`);
            values.push(fields[key]);
            index++;
        }

        values.push(id);

        const query = `
            UPDATE users
            SET ${setParts.join(", ")}
            WHERE id=$${index}
            RETURNING *;
        `;

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // ==============================
    // DELETE USER
    // ==============================
    delete: async (id) => {
        const result = await pool.query(
            "DELETE FROM users WHERE id=$1 RETURNING id",
            [id]
        );
        return result.rowCount > 0;
    }

};

module.exports = User;
