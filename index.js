import "dotenv/config"; // Cleaner way to load dotenv
import express from "express";
import axios from "axios";
import cors from "cors";
import { sequelize } from "./config/DatabaseConfig.js";

import Routes from "./routes/index.js";

import { Customer, Vehicle } from "./models/index.js";

const app = express();

// Middleware
app.use(cors("*"));
app.use(express.json());

// Database Connection
try {
  await sequelize.authenticate();
  console.log("✅ Database Connected");
} catch (error) {
  console.error("❌ Database connection failed:", error);
}

// Health Check Route
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    environment: process.env.NODE_ENV || "development",
    dvlaUrl: process.env.DVLA_URL,
    apiKeyLoaded: !!process.env.DVLA_API_KEY,
    apiKeyLength: process.env.DVLA_API_KEY?.trim().length || 0,
  });
});

app.use("/api", Routes);
app.get("/", (req, res) => {
  res.json({ message: "server start" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
