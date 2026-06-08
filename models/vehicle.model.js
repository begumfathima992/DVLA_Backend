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
    // new field add on
    engineNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    fuelType: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    colour: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    cc: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    grossWeight: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },

    taxDueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    motDueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    nextServiceDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    lastMileage: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "vehicles",
    timestamps: true,
  },
);

export default Vehicle;
