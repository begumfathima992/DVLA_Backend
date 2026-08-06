import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { sequelize } from "./models/index.js";
import Routes from "./routes/index.js";
import { requestContext } from "./middleware/requestContext.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import AppError from "./utils/AppError.js";

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(requestContext);
app.use((_, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});
app.use(cors({
  origin(origin, callback) {
    if (!origin || env.corsOrigins.includes("*") || env.corsOrigins.includes(origin)) return callback(null, true);
    return callback(new AppError("Origin is not allowed by CORS", 403, "CORS_FORBIDDEN"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.get("/", (_req, res) => res.json({ success: true, message: "PrestigeWorkshops API", version: "2.0.0" }));
app.get("/health", async (_req, res, next) => {
  try {
    await sequelize.authenticate();
    res.json({ success: true, status: "OK", environment: env.nodeEnv, database: "connected", dvlaConfigured: Boolean(env.dvlaApiKey), timestamp: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
});

app.use(env.apiPrefix, Routes);
app.use(notFound);
app.use(errorHandler);

let server;
const start = async () => {
  await sequelize.authenticate();
  console.log("Database connected");
  server = app.listen(env.port, () => console.log(`PrestigeWorkshops API listening on port ${env.port}`));
};

const shutdown = async (signal) => {
  console.log(`${signal} received; shutting down`);
  const forceExit = setTimeout(() => process.exit(1), 10000);
  forceExit.unref?.();
  if (server) await new Promise((resolve) => server.close(resolve));
  await sequelize.close();
  process.exit(0);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
  shutdown("unhandledRejection");
});
process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  shutdown("uncaughtException");
});

start().catch((error) => {
  console.error("Application startup failed:", error);
  process.exit(1);
});

export default app;
