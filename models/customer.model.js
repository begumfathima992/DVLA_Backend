import { DataTypes } from "sequelize";
import { sequelize } from "../config/DatabaseConfig.js";
// import sequelize from "../config/DatabaseConfig.js";

const Customer = sequelize.define(
  "Customer",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      unique: true,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    address: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "customers",
    timestamps: true,
  },
);

export default Customer;
