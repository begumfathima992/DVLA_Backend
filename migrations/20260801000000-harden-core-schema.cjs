"use strict";

const tableNames = async (queryInterface) => {
  const tables = await queryInterface.showAllTables();
  return tables.map((entry) => {
    if (typeof entry === "string") return entry;
    return entry.tableName || entry.table_name || entry.name || Object.values(entry)[0];
  }).filter(Boolean);
};

const describe = async (queryInterface, table) => {
  try { return await queryInterface.describeTable(table); } catch { return {}; }
};

const addColumnIfMissing = async (queryInterface, table, column, definition) => {
  const columns = await describe(queryInterface, table);
  if (!columns[column]) await queryInterface.addColumn(table, column, definition);
};

const changeColumnIfPresent = async (queryInterface, table, column, definition) => {
  const columns = await describe(queryInterface, table);
  if (columns[column]) await queryInterface.changeColumn(table, column, definition);
};

const addIndexIfMissing = async (queryInterface, table, fields, options = {}) => {
  const indexes = await queryInterface.showIndex(table);
  const wanted = options.name || `${table}_${fields.join("_")}${options.unique ? "_unique" : "_idx"}`;
  if (!indexes.some((index) => index.name === wanted)) await queryInterface.addIndex(table, fields, { ...options, name: wanted });
};

module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await tableNames(queryInterface);
    if (tables.includes("Settings") && !tables.includes("settings")) {
      await queryInterface.renameTable("Settings", "settings");
    }

    await addColumnIfMissing(queryInterface, "users", "isActive", { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true });
    await addColumnIfMissing(queryInterface, "users", "lastLoginAt", { type: Sequelize.DATE, allowNull: true });

    await addColumnIfMissing(queryInterface, "estimates", "creditTerms", { type: Sequelize.STRING(100), allowNull: true });
    await addColumnIfMissing(queryInterface, "estimates", "approvedAt", { type: Sequelize.DATE, allowNull: true });
    await changeColumnIfPresent(queryInterface, "estimates", "estimateDate", { type: Sequelize.DATEONLY, allowNull: true });

    await addColumnIfMissing(queryInterface, "estimate_items", "vat", { type: Sequelize.DECIMAL(5, 2), allowNull: false, defaultValue: 20 });
    await changeColumnIfPresent(queryInterface, "estimate_items", "quantity", { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 1 });
    await changeColumnIfPresent(queryInterface, "estimate_items", "description", { type: Sequelize.STRING(500), allowNull: false });
    await changeColumnIfPresent(queryInterface, "estimate_items", "itemType", { type: Sequelize.ENUM("Part", "Parts", "Labour", "Service", "Other"), allowNull: false, defaultValue: "Part" });

    await addColumnIfMissing(queryInterface, "job_sheet_items", "vat", { type: Sequelize.DECIMAL(5, 2), allowNull: false, defaultValue: 20 });
    await changeColumnIfPresent(queryInterface, "job_sheet_items", "quantity", { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 1 });
    await changeColumnIfPresent(queryInterface, "job_sheet_items", "description", { type: Sequelize.STRING(500), allowNull: false });
    await changeColumnIfPresent(queryInterface, "job_sheet_items", "itemType", { type: Sequelize.ENUM("Part", "Parts", "Labour", "Service", "Other"), allowNull: false, defaultValue: "Part" });

    await changeColumnIfPresent(queryInterface, "job_sheets", "startDate", { type: Sequelize.DATEONLY, allowNull: true });
    await changeColumnIfPresent(queryInterface, "job_sheets", "completedDate", { type: Sequelize.DATEONLY, allowNull: true });
    await changeColumnIfPresent(queryInterface, "vehicles", "year", { type: Sequelize.INTEGER, allowNull: true });
    await changeColumnIfPresent(queryInterface, "vehicles", "taxDueDate", { type: Sequelize.DATEONLY, allowNull: true });
    await changeColumnIfPresent(queryInterface, "vehicles", "motDueDate", { type: Sequelize.DATEONLY, allowNull: true });
    await changeColumnIfPresent(queryInterface, "vehicles", "nextServiceDate", { type: Sequelize.DATEONLY, allowNull: true });

    // Backfill legacy nullable fields before production constraints and unique indexes are applied.
    await queryInterface.sequelize.query("UPDATE customers SET email = CONCAT('missing+', id, '@invalid.local') WHERE email IS NULL OR TRIM(email) = ''");
    await queryInterface.sequelize.query("UPDATE customers SET phone = CONCAT('MISSING-', id) WHERE phone IS NULL OR TRIM(phone) = ''");
    await queryInterface.sequelize.query("UPDATE customers SET address = 'Not provided' WHERE address IS NULL OR TRIM(address) = ''");
    await queryInterface.sequelize.query("UPDATE customers SET customerCode = NULL WHERE customerCode IS NOT NULL AND TRIM(customerCode) = ''");
    await queryInterface.sequelize.query("UPDATE vehicles SET make = 'Unknown' WHERE make IS NULL OR TRIM(make) = ''");
    await queryInterface.sequelize.query("UPDATE vehicles SET model = 'Unknown' WHERE model IS NULL OR TRIM(model) = ''");
    await queryInterface.sequelize.query("UPDATE vehicles SET year = NULL WHERE year = ''");
    await queryInterface.sequelize.query("UPDATE estimates SET estimateDate = DATE(createdAt) WHERE estimateDate IS NULL");
    await queryInterface.sequelize.query("UPDATE estimates SET jobNumber = NULL WHERE jobNumber IS NOT NULL AND TRIM(jobNumber) = ''");
    await queryInterface.sequelize.query("UPDATE job_sheets SET jobNumber = CONCAT('JOB-MIG-', id) WHERE jobNumber IS NULL OR TRIM(jobNumber) = ''");

    await addIndexIfMissing(queryInterface, "customers", ["email"], { unique: true, name: "customers_email_unique" });
    await addIndexIfMissing(queryInterface, "customers", ["phone"], { unique: true, name: "customers_phone_unique" });
    await addIndexIfMissing(queryInterface, "vehicles", ["registrationNumber"], { unique: true, name: "vehicles_registration_unique" });
    await addIndexIfMissing(queryInterface, "job_sheets", ["estimateId"], { unique: true, name: "job_sheets_estimate_unique" });
    await addIndexIfMissing(queryInterface, "estimates", ["status"], { name: "estimates_status_idx" });
    await addIndexIfMissing(queryInterface, "job_sheets", ["status"], { name: "job_sheets_status_idx" });
    await addIndexIfMissing(queryInterface, "job_sheets", ["priority"], { name: "job_sheets_priority_idx" });
  },

  async down(queryInterface) {
    const remove = async (table, column) => {
      const columns = await describe(queryInterface, table);
      if (columns[column]) await queryInterface.removeColumn(table, column);
    };
    await remove("users", "isActive");
    await remove("users", "lastLoginAt");
    await remove("estimates", "creditTerms");
    await remove("estimates", "approvedAt");
    await remove("estimate_items", "vat");
    await remove("job_sheet_items", "vat");
  },
};
