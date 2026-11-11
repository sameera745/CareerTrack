const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const applicationRoutes = require("./routes/applicationRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const authRoutes = require("./routes/authRoutes");
const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded certificate files

app.use("/api/applications", applicationRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.json({
    message: "Applications & Certificates API is running",
  });
});

const PORT = 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });