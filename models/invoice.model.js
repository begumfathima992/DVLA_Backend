import { DataTypes } from "sequelize";
import { sequelize } from "../config/DatabaseConfig.js";

const Invoice = sequelize.define("Invoice", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  invoiceNumber: { type: DataTypes.STRING(80), allowNull: false, unique: true },
  customerId: { type: DataTypes.INTEGER, allowNull: true },
  vehicleId: { type: DataTypes.INTEGER, allowNull: true },
  estimateId: { type: DataTypes.INTEGER, allowNull: true },
  jobSheetId: { type: DataTypes.INTEGER, allowNull: true, unique: true },
  customerName: { type: DataTypes.STRING(150), allowNull: false },
  vehicleRegistration: { type: DataTypes.STRING(20), allowNull: false },
  vehicleDescription: { type: DataTypes.STRING(255), allowNull: true },
  invoiceDate: { type: DataTypes.DATEONLY, allowNull: false },
  dueDate: { type: DataTypes.DATEONLY, allowNull: true },
  status: { type: DataTypes.ENUM("Draft", "Unpaid", "Partial", "Paid", "Overdue", "Void"), allowNull: false, defaultValue: "Draft" },
  paidAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
  paymentDate: { type: DataTypes.DATEONLY, allowNull: true },
  paymentMethod: { type: DataTypes.STRING(50), allowNull: true },
  subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
  vatPercentage: { type: DataTypes.DECIMAL(5, 2), allowNull: false, defaultValue: 20 },
  vatAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
  discount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
  labourCharge: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
  total: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
  balance: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
  notes: { type: DataTypes.TEXT, allowNull: true },
}, {
  tableName: "invoices",
  timestamps: true,
  indexes: [
    { unique: true, fields: ["invoiceNumber"] },
    { fields: ["status"] },
    { fields: ["invoiceDate"] },
  ],
});

Invoice.prototype.toJSON = function toJSON() {
  const values = { ...this.get() };
  return {
    ...values,
    id: values.invoiceNumber,
    databaseId: values.id,
    customer: values.customerName,
    vehicle: values.vehicleRegistration,
    make: values.vehicleDescription,
    date: values.invoiceDate,
    due: values.dueDate,
    paid: Number(values.paidAmount || 0),
    vatRate: Number(values.vatPercentage || 0),
    vatAmt: Number(values.vatAmount || 0),
    payDate: values.paymentDate,
    payMethod: values.paymentMethod,
  };
};

export default Invoice;
