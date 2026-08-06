import { DataTypes } from "sequelize";
import { sequelize } from "../config/DatabaseConfig.js";

const ContactEnquiry = sequelize.define("ContactEnquiry", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  firstName: { type: DataTypes.STRING(80), allowNull: false },
  lastName: { type: DataTypes.STRING(80), allowNull: false },
  email: { type: DataTypes.STRING(191), allowNull: false },
  phone: { type: DataTypes.STRING(30), allowNull: false },
  registration: { type: DataTypes.STRING(20), allowNull: true },
  service: { type: DataTypes.STRING(100), allowNull: true },
  message: { type: DataTypes.TEXT, allowNull: false },
  consent: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  source: { type: DataTypes.STRING(50), allowNull: false, defaultValue: "website" },
  status: { type: DataTypes.ENUM("New", "In Review", "Contacted", "Booked", "Closed", "Spam"), allowNull: false, defaultValue: "New" },
  assignedTo: { type: DataTypes.STRING(100), allowNull: true },
  internalNotes: { type: DataTypes.TEXT, allowNull: true },
}, {
  tableName: "contact_enquiries",
  timestamps: true,
  indexes: [{ fields: ["status"] }, { fields: ["createdAt"] }, { fields: ["email"] }],
});

export default ContactEnquiry;
