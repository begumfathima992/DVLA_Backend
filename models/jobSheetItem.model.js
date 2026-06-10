import { DataTypes } from "sequelize";
import { sequelize } from "../config/DatabaseConfig.js";

const JobSheetItem = sequelize.define(
  "JobSheetItem",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    jobSheetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    itemType: {
      type: DataTypes.ENUM("Part", "Labour", "Other"),
      allowNull: false,
    },

    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },

    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
  },
  {
    tableName: "job_sheet_items",
    timestamps: true,
  },
);

export default JobSheetItem;
