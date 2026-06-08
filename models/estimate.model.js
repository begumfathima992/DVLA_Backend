import { DataTypes } from "sequelize";
import { sequelize } from "../config/DatabaseConfig.js";

const Estimate = sequelize.define(
  "Estimate",
  {
    estimateNumber: {
      type: DataTypes.STRING,
      unique: true,
    },

    customerId: DataTypes.INTEGER,

    vehicleId: DataTypes.INTEGER,

    status: {
      type: DataTypes.ENUM("Draft", "Sent", "Approved", "Rejected"),
      defaultValue: "Draft",
    },

    subtotal: DataTypes.DECIMAL(10, 2),

    vatPercentage: DataTypes.DECIMAL(5, 2),

    vatAmount: DataTypes.DECIMAL(10, 2),

    discount: DataTypes.DECIMAL(10, 2),

    total: DataTypes.DECIMAL(10, 2),

    notes: DataTypes.TEXT,

    validUntil: DataTypes.DATEONLY,
    estimateDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    documentType: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    labourRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },

    jobNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    customerOrderNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    serviceAdvisor: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    defaultDiscount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },

    vehicleMileage: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "estimates",
  },
);

export default Estimate;
