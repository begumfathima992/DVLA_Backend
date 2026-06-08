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

    // --- NUMERIC FIELDS WITH SETTERS ---
    mileage: {
      type: DataTypes.INTEGER,
      set(value) {
        this.setDataValue("mileage", value === "" ? null : value);
      },
    },

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
      set(value) {
        this.setDataValue("cc", value === "" ? null : value);
      },
    },

    grossWeight: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      set(value) {
        this.setDataValue("grossWeight", value === "" ? null : value);
      },
    },

    // --- DATE FIELDS WITH SETTERS ---
    taxDueDate: {
      type: DataTypes.DATE,
      allowNull: true,
      set(value) {
        this.setDataValue("taxDueDate", value === "" ? null : value);
      },
    },

    motDueDate: {
      type: DataTypes.DATE,
      allowNull: true,
      set(value) {
        this.setDataValue("motDueDate", value === "" ? null : value);
      },
    },

    nextServiceDate: {
      type: DataTypes.DATE,
      allowNull: true,
      set(value) {
        this.setDataValue("nextServiceDate", value === "" ? null : value);
      },
    },

    lastMileage: {
      type: DataTypes.INTEGER,
      allowNull: true,
      set(value) {
        this.setDataValue("lastMileage", value === "" ? null : value);
      },
    },
  },
  {
    tableName: "vehicles",
    timestamps: true,
  },
);

export default Vehicle;