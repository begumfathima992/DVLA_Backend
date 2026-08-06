"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("invoice_payments", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      invoiceId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "invoices", key: "id" }, onUpdate: "CASCADE", onDelete: "CASCADE" },
      amount: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      paymentDate: { type: Sequelize.DATEONLY, allowNull: false },
      paymentMethod: { type: Sequelize.STRING(50), allowNull: false, defaultValue: "Card" },
      reference: { type: Sequelize.STRING(100), allowNull: true },
      notes: { type: Sequelize.TEXT, allowNull: true },
      createdBy: { type: Sequelize.INTEGER, allowNull: true, references: { model: "users", key: "id" }, onUpdate: "CASCADE", onDelete: "SET NULL" },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex("invoice_payments", ["invoiceId"], { name: "invoice_payments_invoice_idx" });
    await queryInterface.addIndex("invoice_payments", ["paymentDate"], { name: "invoice_payments_date_idx" });
  },
  async down(queryInterface) { await queryInterface.dropTable("invoice_payments"); },
};
