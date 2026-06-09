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
    //     customerCode: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    //   field: 'customer_code' // <-- This tells Sequelize to look for 'customer_code' in the actual DB
    // },

    telephone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // gdprConsent: {
    //   type: DataTypes.BOOLEAN,
    //   allowNull: true,
    // },

    gdprConsent: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      set(value) {
        // If the frontend sends an empty string, convert it to null (or false)
        if (value === "") {
          this.setDataValue("gdprConsent", null);
        } else {
          this.setDataValue("gdprConsent", value);
        }
      },
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
