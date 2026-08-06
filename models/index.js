import { sequelize } from "../config/DatabaseConfig.js";
import User from "./user.model.js";
import Customer from "./customer.model.js";
import Vehicle from "./vehicle.model.js";
import Estimate from "./estimate.model.js";
import EstimateItem from "./estimateItem.model.js";
import JobSheet from "./jobsheet.model.js";
import JobSheetItem from "./jobSheetItem.model.js";
import Setting from "./setting.model.js";
import Invoice from "./invoice.model.js";
import InvoiceItem from "./invoiceItem.model.js";
import InvoicePayment from "./invoicePayment.model.js";
import ContactEnquiry from "./contactEnquiry.model.js";
import VehicleLookup from "./vehicleLookup.model.js";

Customer.hasMany(Vehicle, { foreignKey: "customerId", as: "vehicles", onDelete: "CASCADE" });
Vehicle.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });

Customer.hasMany(Estimate, { foreignKey: "customerId", as: "estimates" });
Estimate.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });
Vehicle.hasMany(Estimate, { foreignKey: "vehicleId", as: "estimates" });
Estimate.belongsTo(Vehicle, { foreignKey: "vehicleId", as: "vehicle" });
Estimate.hasMany(EstimateItem, { foreignKey: "estimateId", as: "items", onDelete: "CASCADE" });
EstimateItem.belongsTo(Estimate, { foreignKey: "estimateId", as: "estimate" });

Customer.hasMany(JobSheet, { foreignKey: "customerId", as: "jobSheets" });
JobSheet.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });
Vehicle.hasMany(JobSheet, { foreignKey: "vehicleId", as: "jobSheets" });
JobSheet.belongsTo(Vehicle, { foreignKey: "vehicleId", as: "vehicle" });
Estimate.hasOne(JobSheet, { foreignKey: "estimateId", as: "jobSheet" });
JobSheet.belongsTo(Estimate, { foreignKey: "estimateId", as: "estimate" });
JobSheet.hasMany(JobSheetItem, { foreignKey: "jobSheetId", as: "items", onDelete: "CASCADE" });
JobSheetItem.belongsTo(JobSheet, { foreignKey: "jobSheetId", as: "jobSheet" });

Customer.hasMany(Invoice, { foreignKey: "customerId", as: "invoices" });
Invoice.belongsTo(Customer, { foreignKey: "customerId", as: "customerRecord" });
Vehicle.hasMany(Invoice, { foreignKey: "vehicleId", as: "invoices" });
Invoice.belongsTo(Vehicle, { foreignKey: "vehicleId", as: "vehicleRecord" });
Estimate.hasMany(Invoice, { foreignKey: "estimateId", as: "invoices" });
Invoice.belongsTo(Estimate, { foreignKey: "estimateId", as: "estimate" });
JobSheet.hasOne(Invoice, { foreignKey: "jobSheetId", as: "invoice" });
Invoice.belongsTo(JobSheet, { foreignKey: "jobSheetId", as: "jobSheet" });
Invoice.hasMany(InvoiceItem, { foreignKey: "invoiceId", as: "items", onDelete: "CASCADE" });
InvoiceItem.belongsTo(Invoice, { foreignKey: "invoiceId", as: "invoice" });
Invoice.hasMany(InvoicePayment, { foreignKey: "invoiceId", as: "payments", onDelete: "CASCADE" });
InvoicePayment.belongsTo(Invoice, { foreignKey: "invoiceId", as: "invoice" });
User.hasMany(InvoicePayment, { foreignKey: "createdBy", as: "recordedPayments" });
InvoicePayment.belongsTo(User, { foreignKey: "createdBy", as: "recordedBy" });

export {
  sequelize,
  User,
  Customer,
  Vehicle,
  Estimate,
  EstimateItem,
  JobSheet,
  JobSheetItem,
  Setting,
  Invoice,
  InvoiceItem,
  InvoicePayment,
  ContactEnquiry,
  VehicleLookup,
};
