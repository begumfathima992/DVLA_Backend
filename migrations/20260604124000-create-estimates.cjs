"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("estimates", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      estimateNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      customerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "customers",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      vehicleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "vehicles",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      status: {
        type: Sequelize.ENUM("Draft", "Sent", "Approved", "Rejected"),
        defaultValue: "Draft",
      },

      subtotal: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },

      vatPercentage: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 20,
      },

      vatAmount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },

      discount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },

      total: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },

      notes: {
        type: Sequelize.TEXT,
      },

      validUntil: {
        type: Sequelize.DATEONLY,
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
    await queryInterface.dropTable("estimates");
  },
};
