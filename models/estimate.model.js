import { DataTypes } from "sequelize";
import { sequelize } from "../config/DatabaseConfig.js";

const Estimate = sequelize.define("Estimate", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  estimateNumber: { type: DataTypes.STRING(80), allowNull: false, unique: true },
  customerId: { type: DataTypes.INTEGER, allowNull: false },
  vehicleId: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.ENUM("Draft", "Sent", "Approved", "Rejected"), allowNull: false, defaultValue: "Draft" },
  subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
  vatPercentage: { type: DataTypes.DECIMAL(5, 2), allowNull: false, defaultValue: 20 },
  vatAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
  discount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
  total: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
  notes: { type: DataTypes.TEXT, allowNull: true },
  validUntil: { type: DataTypes.DATEONLY, allowNull: true },
  estimateDate: { type: DataTypes.DATEONLY, allowNull: false },
  documentType: { type: DataTypes.STRING(50), allowNull: true, defaultValue: "Estimate" },
  labourRate: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
  jobNumber: { type: DataTypes.STRING(80), allowNull: true, unique: true },
  customerOrderNumber: { type: DataTypes.STRING(100), allowNull: true },
  serviceAdvisor: { type: DataTypes.STRING(100), allowNull: true },
  defaultDiscount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
  vehicleMileage: { type: DataTypes.INTEGER, allowNull: true },
  creditTerms: { type: DataTypes.STRING(100), allowNull: true },
  approvedAt: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: "estimates",
  timestamps: true,
  indexes: [
    { unique: true, fields: ["estimateNumber"] },
    { fields: ["status"] },
    { fields: ["customerId"] },
  ],
});

export default Estimate;
