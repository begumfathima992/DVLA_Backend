const HTTP_CODES = {
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  409: "CONFLICT",
  422: "VALIDATION_ERROR",
  429: "TOO_MANY_REQUESTS",
};

export default class AppError extends Error {
  constructor(message, statusCode = 500, code, details) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code ?? HTTP_CODES[statusCode] ?? "INTERNAL_SERVER_ERROR";
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace?.(this, AppError);
  }
}
