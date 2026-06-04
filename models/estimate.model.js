import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

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
  },
  {
    tableName: "estimates",
  },
);

export default Estimate;
