import Estimate from "./estimate.model.js";
import EstimateItem from "./estimateItem.model.js";
import Customer from "./customer.model.js";
import Vehicle from "./vehicle.model.js";
import { sequelize } from "../config/DatabaseConfig.js";
import User from "./user.model.js";
import JobSheet from "./jobsheet.model.js";
import JobSheetItem from "./jobSheetItem.model.js";
// Associations

Customer.hasMany(Vehicle, {
  foreignKey: "customerId",
  as: "vehicles",
});

Vehicle.belongsTo(Customer, {
  foreignKey: "customerId",
  as: "customer",
});

Estimate.hasMany(EstimateItem, {
  foreignKey: "estimateId",
  as: "items",
});
Customer.hasMany(Estimate, {
  foreignKey: "customerId",
  as: "estimates",
});
Estimate.belongsTo(Customer, {
  foreignKey: "customerId",
  as: "customer",
});

EstimateItem.belongsTo(Estimate, {
  foreignKey: "estimateId",
});

Vehicle.hasMany(Estimate, {
  foreignKey: "vehicleId",
  as: "estimates",
});

Estimate.belongsTo(Vehicle, {
  foreignKey: "vehicleId",
  as: "vehicle",
});
// new column

Customer.hasMany(JobSheet, {
  foreignKey: "customerId",
  as: "jobSheets",
});

JobSheet.belongsTo(Customer, {
  foreignKey: "customerId",
  as: "customer",
});

Vehicle.hasMany(JobSheet, {
  foreignKey: "vehicleId",
  as: "jobSheets",
});

JobSheet.belongsTo(Vehicle, {
  foreignKey: "vehicleId",
  as: "vehicle",
});

Estimate.hasOne(JobSheet, {
  foreignKey: "estimateId",
  as: "jobSheet",
});

JobSheet.belongsTo(Estimate, {
  foreignKey: "estimateId",
  as: "estimate",
});

JobSheet.hasMany(JobSheetItem, {
  foreignKey: "jobSheetId",
  as: "items",
});

JobSheetItem.belongsTo(JobSheet, {
  foreignKey: "jobSheetId",
  as: "jobSheet",
});

export {
  sequelize,
  Customer,
  Vehicle,
  Estimate,
  EstimateItem,
  User,
  JobSheet,
  JobSheetItem,
};
