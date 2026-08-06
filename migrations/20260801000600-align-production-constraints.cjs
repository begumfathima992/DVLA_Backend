"use strict";

const describe = async (queryInterface, table) => {
  try { return await queryInterface.describeTable(table); } catch { return {}; }
};

const changeColumnIfPresent = async (queryInterface, table, column, definition) => {
  const columns = await describe(queryInterface, table);
  if (columns[column]) await queryInterface.changeColumn(table, column, definition);
};

const addIndexIfMissing = async (queryInterface, table, fields, options) => {
  const indexes = await queryInterface.showIndex(table);
  if (!indexes.some((index) => index.name === options.name)) {
    await queryInterface.addIndex(table, fields, options);
  }
};

module.exports = {
  async up(queryInterface, Sequelize) {
    await changeColumnIfPresent(queryInterface, "customers", "name", { type: Sequelize.STRING(100), allowNull: false });
    await changeColumnIfPresent(queryInterface, "customers", "email", { type: Sequelize.STRING(191), allowNull: false });
    await changeColumnIfPresent(queryInterface, "customers", "phone", { type: Sequelize.STRING(30), allowNull: false });
    await changeColumnIfPresent(queryInterface, "customers", "address", { type: Sequelize.TEXT, allowNull: false });
    await changeColumnIfPresent(queryInterface, "customers", "customerCode", { type: Sequelize.STRING(50), allowNull: true });
    await changeColumnIfPresent(queryInterface, "customers", "telephone", { type: Sequelize.STRING(30), allowNull: true });
    await changeColumnIfPresent(queryInterface, "customers", "creditTerms", { type: Sequelize.STRING(100), allowNull: true });

    await changeColumnIfPresent(queryInterface, "vehicles", "registrationNumber", { type: Sequelize.STRING(20), allowNull: false });
    await changeColumnIfPresent(queryInterface, "vehicles", "make", { type: Sequelize.STRING(100), allowNull: false });
    await changeColumnIfPresent(queryInterface, "vehicles", "model", { type: Sequelize.STRING(150), allowNull: false });
    await changeColumnIfPresent(queryInterface, "vehicles", "vinNumber", { type: Sequelize.STRING(50), allowNull: true });

    await changeColumnIfPresent(queryInterface, "estimates", "estimateNumber", { type: Sequelize.STRING(80), allowNull: false });
    await changeColumnIfPresent(queryInterface, "estimates", "estimateDate", { type: Sequelize.DATEONLY, allowNull: false });
    await changeColumnIfPresent(queryInterface, "estimates", "subtotal", { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 });
    await changeColumnIfPresent(queryInterface, "estimates", "vatAmount", { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 });
    await changeColumnIfPresent(queryInterface, "estimates", "discount", { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 });
    await changeColumnIfPresent(queryInterface, "estimates", "total", { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 });
    await changeColumnIfPresent(queryInterface, "estimates", "labourRate", { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 });
    await changeColumnIfPresent(queryInterface, "estimates", "defaultDiscount", { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 });

    await changeColumnIfPresent(queryInterface, "estimate_items", "unitPrice", { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 });
    await changeColumnIfPresent(queryInterface, "estimate_items", "totalPrice", { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 });

    await changeColumnIfPresent(queryInterface, "job_sheets", "jobNumber", { type: Sequelize.STRING(80), allowNull: false });
    await changeColumnIfPresent(queryInterface, "job_sheets", "subtotal", { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 });
    await changeColumnIfPresent(queryInterface, "job_sheets", "vatPercentage", { type: Sequelize.DECIMAL(5, 2), allowNull: false, defaultValue: 20 });
    await changeColumnIfPresent(queryInterface, "job_sheets", "vatAmount", { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 });
    await changeColumnIfPresent(queryInterface, "job_sheets", "discount", { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 });
    await changeColumnIfPresent(queryInterface, "job_sheets", "total", { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 });
    await changeColumnIfPresent(queryInterface, "job_sheets", "labourRate", { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 });

    await changeColumnIfPresent(queryInterface, "job_sheet_items", "unitPrice", { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 });
    await changeColumnIfPresent(queryInterface, "job_sheet_items", "totalPrice", { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 });

    await changeColumnIfPresent(queryInterface, "settings", "defaultDiscount", { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 });
    await changeColumnIfPresent(queryInterface, "settings", "labourCharge", { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 });
    await changeColumnIfPresent(queryInterface, "settings", "otherCharge", { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 });
    await changeColumnIfPresent(queryInterface, "settings", "vatPercentage", { type: Sequelize.DECIMAL(5, 2), allowNull: false, defaultValue: 20 });

    await addIndexIfMissing(queryInterface, "customers", ["customerCode"], { unique: true, name: "customers_code_unique" });
    await addIndexIfMissing(queryInterface, "customers", ["name"], { name: "customers_name_idx" });
    await addIndexIfMissing(queryInterface, "customers", ["createdAt"], { name: "customers_created_idx" });
    await addIndexIfMissing(queryInterface, "vehicles", ["customerId"], { name: "vehicles_customer_idx" });
    await addIndexIfMissing(queryInterface, "estimates", ["customerId"], { name: "estimates_customer_idx" });
    await addIndexIfMissing(queryInterface, "estimates", ["vehicleId"], { name: "estimates_vehicle_idx" });
    await addIndexIfMissing(queryInterface, "estimates", ["jobNumber"], { unique: true, name: "estimates_job_number_unique" });
    await addIndexIfMissing(queryInterface, "contact_enquiries", ["email"], { name: "contact_enquiries_email_idx" });
  },

  async down() {
    // Constraint widening and data backfills are intentionally not reversed automatically.
  },
};
