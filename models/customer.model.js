import { DataTypes } from "sequelize";
import { sequelize } from "../config/DatabaseConfig.js";

const Customer = sequelize.define("Customer", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(191), allowNull: false, unique: true },
  phone: { type: DataTypes.STRING(30), allowNull: false, unique: true },
  address: { type: DataTypes.TEXT, allowNull: false },
  customerCode: { type: DataTypes.STRING(50), allowNull: true, unique: true },
  telephone: { type: DataTypes.STRING(30), allowNull: true },
  gdprConsent: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  creditTerms: { type: DataTypes.STRING(100), allowNull: true },
  alternativeAddress: { type: DataTypes.TEXT, allowNull: true },
}, {
  tableName: "customers",
  timestamps: true,
  indexes: [
    { fields: ["name"] },
    { fields: ["createdAt"] },
  ],
});

export default Customer;
