"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("invoice_items", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      invoiceId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "invoices", key: "id" }, onUpdate: "CASCADE", onDelete: "CASCADE" },
      itemType: { type: Sequelize.ENUM("Part", "Parts", "Labour", "Service", "Other"), allowNull: false, defaultValue: "Part" },
      description: { type: Sequelize.STRING(500), allowNull: false },
      quantity: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 1 },
      unitPrice: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      vat: { type: Sequelize.DECIMAL(5, 2), allowNull: false, defaultValue: 20 },
      totalPrice: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex("invoice_items", ["invoiceId"], { name: "invoice_items_invoice_idx" });
  },
  async down(queryInterface) { await queryInterface.dropTable("invoice_items"); },
};
