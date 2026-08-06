import AppError from "../utils/AppError.js";

/**
 * Express 5 mein req.query getter-only property hai.
 * Object.defineProperty validated query ko request par safely set karta hai.
 */
const setValidatedValue = (req, property, value) => {
  if (property === "query") {
    Object.defineProperty(req, "query", {
      value,
      writable: true,
      configurable: true,
      enumerable: true,
    });

    return;
  }

  req[property] = value;
};

export const validate = (schema, property = "body") => {
  return (req, _res, next) => {
    const { value, error } = schema.validate(req[property], {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      const details = error.details.map((item) => ({
        field: item.path.join("."),
        message: item.message.replace(/"/g, ""),
        type: item.type,
      }));

      return next(
        new AppError(
          "Validation failed",
          422,
          "VALIDATION_ERROR",
          details,
        ),
      );
    }

    setValidatedValue(req, property, value);

    return next();
  };
};