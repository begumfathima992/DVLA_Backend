import { DataTypes } from "sequelize";
import { sequelize } from "../config/DatabaseConfig.js";

const InvoiceItem = sequelize.define("InvoiceItem", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  invoiceId: { type: DataTypes.INTEGER, allowNull: false },
  itemType: { type: DataTypes.ENUM("Part", "Parts", "Labour", "Service", "Other"), allowNull: false, defaultValue: "Part" },
  description: { type: DataTypes.STRING(500), allowNull: false },
  quantity: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 1 },
  unitPrice: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
  vat: { type: DataTypes.DECIMAL(5, 2), allowNull: false, defaultValue: 20 },
  totalPrice: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
}, {
  tableName: "invoice_items",
  timestamps: true,
});

InvoiceItem.prototype.toJSON = function toJSON() {
  const values = { ...this.get() };
  return {
    ...values,
    desc: values.description,
    type: values.itemType === "Part" ? "Parts" : values.itemType,
    qty: Number(values.quantity || 0),
    rate: Number(values.unitPrice || 0),
  };
};

export default InvoiceItem;
