import { DataTypes } from "sequelize";
import { sequelize } from "../config/DatabaseConfig.js";

const Setting = sequelize.define("Setting", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  defaultDiscount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
  labourCharge: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
  otherCharge: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
  vatPercentage: { type: DataTypes.DECIMAL(5, 2), allowNull: false, defaultValue: 20 },
}, {
  tableName: "settings",
  timestamps: true,
});

export default Setting;
