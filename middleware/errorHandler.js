import { ValidationError, UniqueConstraintError, ForeignKeyConstraintError, DatabaseError } from "sequelize";
import AppError from "../utils/AppError.js";
import { env } from "../config/env.js";

const normaliseError = (error) => {
  if (error instanceof AppError) return error;

  if (error?.type === "entity.parse.failed") {
    return new AppError("Request body contains invalid JSON", 400, "INVALID_JSON");
  }

  if (Number.isInteger(error?.status) && error.status >= 400 && error.status < 500) {
    return new AppError(error.message || "Request failed", error.status);
  }

  if (error instanceof UniqueConstraintError) {
    const fields = Object.keys(error.fields || {});
    return new AppError(`${fields.join(", ") || "Record"} already exists`, 409, "CONFLICT");
  }

  if (error instanceof ForeignKeyConstraintError) {
    return new AppError("This record is linked to another resource or references an invalid record", 409, "FOREIGN_KEY_CONFLICT");
  }

  if (error instanceof ValidationError) {
    return new AppError("Database validation failed", 422, "VALIDATION_ERROR", error.errors.map((item) => ({ field: item.path, message: item.message })));
  }

  if (error instanceof DatabaseError) {
    return new AppError("Database request failed", 500, "DATABASE_ERROR");
  }

  return new AppError(error?.message || "Internal server error", 500);
};

export const errorHandler = (error, req, res, _next) => {
  const safeError = normaliseError(error);
  const publicMessage = safeError.statusCode >= 500 && env.nodeEnv === "production"
    ? "Internal server error"
    : safeError.message;
  const payload = {
    success: false,
    message: publicMessage,
    error: publicMessage,
    code: safeError.code,
  };

  if (safeError.details) payload.errors = safeError.details;
  if (req.id) payload.requestId = req.id;
  if (env.nodeEnv !== "production" && safeError.statusCode >= 500) payload.stack = error.stack;

  if (safeError.statusCode >= 500) {
    console.error(`[${req.id || "request"}]`, error);
  }

  res.status(safeError.statusCode).json(payload);
};
