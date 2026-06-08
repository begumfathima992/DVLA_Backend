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
    customerCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    telephone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    gdprConsent: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },

    creditTerms: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    alternativeAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "customers",
    timestamps: true,
  },
);

export default Customer;
