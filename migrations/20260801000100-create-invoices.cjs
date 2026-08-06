"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("invoices", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      invoiceNumber: { type: Sequelize.STRING(80), allowNull: false, unique: true },
      customerId: { type: Sequelize.INTEGER, allowNull: true, references: { model: "customers", key: "id" }, onUpdate: "CASCADE", onDelete: "SET NULL" },
      vehicleId: { type: Sequelize.INTEGER, allowNull: true, references: { model: "vehicles", key: "id" }, onUpdate: "CASCADE", onDelete: "SET NULL" },
      estimateId: { type: Sequelize.INTEGER, allowNull: true, references: { model: "estimates", key: "id" }, onUpdate: "CASCADE", onDelete: "SET NULL" },
      jobSheetId: { type: Sequelize.INTEGER, allowNull: true, unique: true, references: { model: "job_sheets", key: "id" }, onUpdate: "CASCADE", onDelete: "SET NULL" },
      customerName: { type: Sequelize.STRING(150), allowNull: false },
      vehicleRegistration: { type: Sequelize.STRING(20), allowNull: false },
      vehicleDescription: { type: Sequelize.STRING(255), allowNull: true },
      invoiceDate: { type: Sequelize.DATEONLY, allowNull: false },
      dueDate: { type: Sequelize.DATEONLY, allowNull: true },
      status: { type: Sequelize.ENUM("Draft", "Unpaid", "Partial", "Paid", "Overdue", "Void"), allowNull: false, defaultValue: "Draft" },
      paidAmount: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      paymentDate: { type: Sequelize.DATEONLY, allowNull: true },
      paymentMethod: { type: Sequelize.STRING(50), allowNull: true },
      subtotal: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      vatPercentage: { type: Sequelize.DECIMAL(5, 2), allowNull: false, defaultValue: 20 },
      vatAmount: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      discount: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      labourCharge: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      total: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      balance: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      notes: { type: Sequelize.TEXT, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex("invoices", ["status"], { name: "invoices_status_idx" });
    await queryInterface.addIndex("invoices", ["invoiceDate"], { name: "invoices_date_idx" });
  },
  async down(queryInterface) { await queryInterface.dropTable("invoices"); },
};
