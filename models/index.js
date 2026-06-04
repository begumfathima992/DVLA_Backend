import fs from "fs";
import path from "path";
import { Sequelize, DataTypes } from "sequelize";
import { fileURLToPath } from "url";
import Customer from "./customer.model.js";
import Vehicle from "./vehicle.model";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);

const db = {};

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  },
);

const files = fs
  .readdirSync(__dirname)
  .filter((file) => file !== basename && file.endsWith(".js"));

for (const file of files) {
  const modelModule = await import(path.join(__dirname, file));

  const model = modelModule.default(sequelize, DataTypes);

  db[model.name] = model;
}
Customer.hasMany(Vehicle, {
  foreignKey: "customerId",
  as: "vehicles",
});

Vehicle.belongsTo(Customer, {
  foreignKey: "customerId",
  as: "customer",
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

export default db;
