const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/config");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

// Create express app
const app = express();

// Connect databse
connectDB();

// Middleware setup
app.use(cors());
app.use(express.json());

// Static folder for uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// All api routs
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/properties", require("./routes/propertyRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/admin", adminRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server runing on http://localhost:${PORT}`);
});
