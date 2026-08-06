import Joi from "joi";
import "dotenv/config";

const schema = Joi.object({
  NODE_ENV: Joi.string().valid("development", "test", "production").default("development"),
  PORT: Joi.number().port().default(5000),
  API_PREFIX: Joi.string().pattern(/^\//).default("/api"),
  CORS_ORIGIN: Joi.string().default("http://localhost:5173"),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().port().default(3306),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().allow("").required(),
  DB_LOGGING: Joi.boolean().truthy("true").falsy("false").default(false),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default("7d"),
  ALLOW_PUBLIC_REGISTRATION: Joi.boolean().truthy("true").falsy("false").default(false),
  DVLA_URL: Joi.string().uri().default("https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles"),
  DVLA_API_KEY: Joi.string().allow("").default(""),
}).unknown(true);

const { value, error } = schema.validate(process.env, { abortEarly: false, convert: true });
if (error) {
  const details = error.details.map((item) => item.message).join("; ");
  throw new Error(`Environment validation failed: ${details}`);
}

const origins = value.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean);

export const env = Object.freeze({
  nodeEnv: value.NODE_ENV,
  port: value.PORT,
  apiPrefix: value.API_PREFIX,
  corsOrigins: origins,
  db: {
    host: value.DB_HOST,
    port: value.DB_PORT,
    name: value.DB_NAME,
    user: value.DB_USER,
    password: value.DB_PASSWORD,
    logging: value.DB_LOGGING,
  },
  jwtSecret: value.JWT_SECRET,
  jwtExpiresIn: value.JWT_EXPIRES_IN,
  allowPublicRegistration: value.ALLOW_PUBLIC_REGISTRATION,
  dvlaUrl: value.DVLA_URL,
  dvlaApiKey: value.DVLA_API_KEY,
});
