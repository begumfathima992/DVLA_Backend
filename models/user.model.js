import { DataTypes } from "sequelize";
import { sequelize } from "../config/DatabaseConfig.js";

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(191), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  role: { type: DataTypes.ENUM("Admin", "Manager", "Technician"), allowNull: false, defaultValue: "Admin" },
  token: { type: DataTypes.TEXT, allowNull: true },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  lastLoginAt: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: "users",
  timestamps: true,
  defaultScope: { attributes: { exclude: ["password", "token"] } },
  scopes: { withSecrets: { attributes: { include: ["password", "token"] } } },
});

User.prototype.toJSON = function toJSON() {
  const values = { ...this.get() };
  delete values.password;
  delete values.token;
  return values;
};

export default User;
