import { DataTypes } from "sequelize";
import { sequelize } from "../config/DatabaseConfig.js";

const EstimateItem = sequelize.define("EstimateItem", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  estimateId: { type: DataTypes.INTEGER, allowNull: false },
  itemType: { type: DataTypes.ENUM("Part", "Parts", "Labour", "Service", "Other"), allowNull: false, defaultValue: "Part" },
  description: { type: DataTypes.STRING(500), allowNull: false },
  quantity: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 1 },
  unitPrice: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
  vat: { type: DataTypes.DECIMAL(5, 2), allowNull: false, defaultValue: 20 },
  totalPrice: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
}, {
  tableName: "estimate_items",
  timestamps: true,
});

export default EstimateItem;
