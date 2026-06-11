import { DataTypes } from "sequelize";
import { sequelize } from "../config/DatabaseConfig.js";

const JobSheet = sequelize.define(
  "JobSheet",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    jobNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },

    estimateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    vehicleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    technicianName: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    vehicleMileage: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    serviceAdvisor: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    priority: {
      type: DataTypes.ENUM("Low", "Medium", "High", "Urgent"),
      defaultValue: "Medium",
    },

    status: {
      type: DataTypes.ENUM("Open", "In Progress", "Completed", "Cancelled"),
      defaultValue: "Open",
    },

    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    completedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    labourRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    vatPercentage: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 20,
    },

    vatAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    total: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
  },
  {
    tableName: "job_sheets",
    timestamps: true,
  },
);

export default JobSheet;
