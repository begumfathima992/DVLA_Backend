import { DataTypes } from "sequelize";
import { sequelize } from "../config/DatabaseConfig.js";

const VehicleLookup = sequelize.define("VehicleLookup", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  registrationNumber: { type: DataTypes.STRING(20), allowNull: false },
  status: { type: DataTypes.ENUM("Success", "Not Found", "Failed"), allowNull: false },
  responseData: { type: DataTypes.JSON, allowNull: true },
  errorMessage: { type: DataTypes.TEXT, allowNull: true },
  requestedIp: { type: DataTypes.STRING(64), allowNull: true },
  userAgent: { type: DataTypes.STRING(500), allowNull: true },
}, {
  tableName: "vehicle_lookups",
  timestamps: true,
  indexes: [{ fields: ["registrationNumber"] }, { fields: ["createdAt"] }],
});

export default VehicleLookup;
