"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("contact_enquiries", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      firstName: { type: Sequelize.STRING(80), allowNull: false },
      lastName: { type: Sequelize.STRING(80), allowNull: false },
      email: { type: Sequelize.STRING(191), allowNull: false },
      phone: { type: Sequelize.STRING(30), allowNull: false },
      registration: { type: Sequelize.STRING(20), allowNull: true },
      service: { type: Sequelize.STRING(100), allowNull: true },
      message: { type: Sequelize.TEXT, allowNull: false },
      consent: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      source: { type: Sequelize.STRING(50), allowNull: false, defaultValue: "website" },
      status: { type: Sequelize.ENUM("New", "In Review", "Contacted", "Booked", "Closed", "Spam"), allowNull: false, defaultValue: "New" },
      assignedTo: { type: Sequelize.STRING(100), allowNull: true },
      internalNotes: { type: Sequelize.TEXT, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex("contact_enquiries", ["status"], { name: "contact_enquiries_status_idx" });
    await queryInterface.addIndex("contact_enquiries", ["createdAt"], { name: "contact_enquiries_created_idx" });
  },
  async down(queryInterface) { await queryInterface.dropTable("contact_enquiries"); },
};
