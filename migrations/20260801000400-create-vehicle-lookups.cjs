"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("vehicle_lookups", {
      id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
      registrationNumber: { type: Sequelize.STRING(20), allowNull: false },
      status: { type: Sequelize.ENUM("Success", "Not Found", "Failed"), allowNull: false },
      responseData: { type: Sequelize.JSON, allowNull: true },
      errorMessage: { type: Sequelize.TEXT, allowNull: true },
      requestedIp: { type: Sequelize.STRING(64), allowNull: true },
      userAgent: { type: Sequelize.STRING(500), allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex("vehicle_lookups", ["registrationNumber"], { name: "vehicle_lookups_registration_idx" });
    await queryInterface.addIndex("vehicle_lookups", ["createdAt"], { name: "vehicle_lookups_created_idx" });
  },
  async down(queryInterface) { await queryInterface.dropTable("vehicle_lookups"); },
};
