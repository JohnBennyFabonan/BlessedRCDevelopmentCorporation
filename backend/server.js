require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// CORS Configuration - Allow frontend domain
const corsOptions = {
  origin: [
    "https://blessedrandcdevelopmentcorp.com",
    "https://www.blessedrandcdevelopmentcorp.com",
    "https://api.blessedrandcdevelopmentcorp.com",
    "https://digital-reality.onrender.com",
    "https://digital-reality-mg9y.onrender.com",
    "http://localhost:5500",
    "http://localhost:3000",
    "http://127.0.0.1:5500",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/properties", require("./routes/propertyRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/staff", require("./routes/staffRoutes"));
app.use("/api/agents", require("./routes/agentRoutes"));

app.get("/", (req, res) => {
  res.json({ message: "Digital Realty API running 🚀" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
