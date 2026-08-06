import { DataTypes } from "sequelize";
import { sequelize } from "../config/DatabaseConfig.js";

const InvoicePayment = sequelize.define("InvoicePayment", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  invoiceId: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  paymentDate: { type: DataTypes.DATEONLY, allowNull: false },
  paymentMethod: { type: DataTypes.STRING(50), allowNull: false, defaultValue: "Card" },
  reference: { type: DataTypes.STRING(100), allowNull: true },
  notes: { type: DataTypes.TEXT, allowNull: true },
  createdBy: { type: DataTypes.INTEGER, allowNull: true },
}, {
  tableName: "invoice_payments",
  timestamps: true,
  indexes: [{ fields: ["invoiceId"] }, { fields: ["paymentDate"] }],
});

export default InvoicePayment;
