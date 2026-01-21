require("dotenv").config();
const express = require("express");
const cors = require("cors");

// ✅ PostgreSQL pool (USE YOUR EXISTING DB CONFIG FILE)
const pool = require("./config/db"); // make sure this path is correct

const app = express();

// CORS Configuration
const corsOptions = {
  origin: [
    "https://blessedrandcdevelopmentcorp.com",
    "https://www.blessedrandcdevelopmentcorp.com",
    "https://api.blessedrandcdevelopmentcorp.com",
    "https://digital-reality.onrender.com",
    "https://digital-reality-mg9y.onrender.com",
    "https://digital-realty-mg9y.onrender.com",
    "http://localhost:5500",
    "http://localhost:3000",
    "http://127.0.0.1:5500",
    "http://localhost:5000",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use("/api/chat", require("./routes/chat"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/properties", require("./routes/propertyRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/staff", require("./routes/staffRoutes"));
app.use("/api/agents", require("./routes/agentRoutes"));

/* ================= USERS API (FIX FOR UNKNOWN CLIENT) ================= */
app.get("/api/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await pool.query(
      "SELECT id, full_name FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.json({ success: false });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("USER FETCH ERROR:", err);
    res.status(500).json({ success: false });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Digital Realty API running 🚀" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
