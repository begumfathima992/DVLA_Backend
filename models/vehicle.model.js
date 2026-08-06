import { DataTypes } from "sequelize";
import { sequelize } from "../config/DatabaseConfig.js";

const emptyToNull = (instance, key, value) => instance.setDataValue(key, value === "" || value === undefined ? null : value);

const Vehicle = sequelize.define("Vehicle", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  customerId: { type: DataTypes.INTEGER, allowNull: false },
  registrationNumber: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  make: { type: DataTypes.STRING(100), allowNull: false },
  model: { type: DataTypes.STRING(150), allowNull: false },
  year: { type: DataTypes.INTEGER, allowNull: true, set(value) { emptyToNull(this, "year", value); } },
  vinNumber: { type: DataTypes.STRING(50), allowNull: true },
  mileage: { type: DataTypes.INTEGER, allowNull: true, set(value) { emptyToNull(this, "mileage", value); } },
  engineNumber: { type: DataTypes.STRING(100), allowNull: true },
  fuelType: { type: DataTypes.STRING(50), allowNull: true },
  colour: { type: DataTypes.STRING(50), allowNull: true },
  cc: { type: DataTypes.INTEGER, allowNull: true, set(value) { emptyToNull(this, "cc", value); } },
  grossWeight: { type: DataTypes.DECIMAL(10, 2), allowNull: true, set(value) { emptyToNull(this, "grossWeight", value); } },
  taxDueDate: { type: DataTypes.DATEONLY, allowNull: true, set(value) { emptyToNull(this, "taxDueDate", value); } },
  motDueDate: { type: DataTypes.DATEONLY, allowNull: true, set(value) { emptyToNull(this, "motDueDate", value); } },
  nextServiceDate: { type: DataTypes.DATEONLY, allowNull: true, set(value) { emptyToNull(this, "nextServiceDate", value); } },
  lastMileage: { type: DataTypes.INTEGER, allowNull: true, set(value) { emptyToNull(this, "lastMileage", value); } },
}, {
  tableName: "vehicles",
  timestamps: true,
  indexes: [
    { unique: true, fields: ["registrationNumber"] },
    { fields: ["customerId"] },
  ],
});

export default Vehicle;
