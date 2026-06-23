import { DataTypes } from "sequelize";
import { sequelize } from "../config/DatabaseConfig.js";

const Setting = sequelize.define(
  "Setting",
  {
    defaultDiscount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    labourCharge: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    otherCharge: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    vatPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "settings",
    timestamps: true,
  },
);

export default Setting;
