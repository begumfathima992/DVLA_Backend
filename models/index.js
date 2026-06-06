import Estimate from "./estimate.model.js";
import EstimateItem from "./estimateItem.model.js";
import Customer from "./customer.model.js";
import Vehicle from "./vehicle.model.js";
import { sequelize } from "../config/DatabaseConfig.js";
import User from "./user.model.js";
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

export { sequelize, Customer, Vehicle, Estimate, EstimateItem, User };
