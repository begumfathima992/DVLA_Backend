import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const EstimateItem = sequelize.define(
  "EstimateItem",
  {
    estimateId: DataTypes.INTEGER,

    itemType: DataTypes.ENUM("Part", "Labour", "Service"),

    description: DataTypes.STRING,

    quantity: DataTypes.INTEGER,

    unitPrice: DataTypes.DECIMAL(10, 2),

    totalPrice: DataTypes.DECIMAL(10, 2),
  },
  {
    tableName: "estimate_items",
  },
);

export default EstimateItem;
