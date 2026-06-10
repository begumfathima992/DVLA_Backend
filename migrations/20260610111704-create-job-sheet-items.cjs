"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("job_sheet_items", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      jobSheetId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "job_sheets",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      itemType: {
        type: Sequelize.ENUM("Part", "Labour", "Service"),
        allowNull: false,
      },

      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },

      unitPrice: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },

      totalPrice: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("job_sheet_items");
  },
};
