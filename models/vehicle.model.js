import { DataTypes } from "sequelize";
import { sequelize } from "../config/DatabaseConfig.js";

const Vehicle = sequelize.define(
  "Vehicle",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    registrationNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    make: {
      type: DataTypes.STRING,
    },

    model: {
      type: DataTypes.STRING,
    },

    year: {
      type: DataTypes.STRING,
    },

    vinNumber: {
      type: DataTypes.STRING,
    },

    mileage: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "vehicles",
    timestamps: true,
  },
);

export default Vehicle;
