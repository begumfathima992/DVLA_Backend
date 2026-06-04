"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("estimate_items", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      estimateId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "estimates",
          key: "id",
        },
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

  async down(queryInterface) {
    await queryInterface.dropTable("estimate_items");
  },
};
