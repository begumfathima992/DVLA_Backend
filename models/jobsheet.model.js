import { DataTypes } from "sequelize";
import { sequelize } from "../config/DatabaseConfig.js";

const JobSheet = sequelize.define("JobSheet", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  jobNumber: { type: DataTypes.STRING(80), allowNull: false, unique: true },
  estimateId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  customerId: { type: DataTypes.INTEGER, allowNull: false },
  vehicleId: { type: DataTypes.INTEGER, allowNull: false },
  technicianName: { type: DataTypes.STRING(100), allowNull: true },
  vehicleMileage: { type: DataTypes.INTEGER, allowNull: true },
  serviceAdvisor: { type: DataTypes.STRING(100), allowNull: true },
  priority: { type: DataTypes.ENUM("Low", "Medium", "High", "Urgent"), allowNull: false, defaultValue: "Medium" },
  status: { type: DataTypes.ENUM("Open", "In Progress", "Completed", "Cancelled"), allowNull: false, defaultValue: "Open" },
  startDate: { type: DataTypes.DATEONLY, allowNull: true },
  completedDate: { type: DataTypes.DATEONLY, allowNull: true },
  labourRate: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
  notes: { type: DataTypes.TEXT, allowNull: true },
  subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
  vatPercentage: { type: DataTypes.DECIMAL(5, 2), allowNull: false, defaultValue: 20 },
  vatAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
  discount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
  total: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
}, {
  tableName: "job_sheets",
  timestamps: true,
  indexes: [
    { unique: true, fields: ["jobNumber"] },
    { fields: ["status"] },
    { fields: ["priority"] },
  ],
});

export default JobSheet;
