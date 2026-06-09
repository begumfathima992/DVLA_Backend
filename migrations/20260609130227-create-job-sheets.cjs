"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("job_sheets", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      jobNumber: {
        type: Sequelize.STRING,
        unique: true,
      },

      estimateId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "estimates",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      customerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "customers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      vehicleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "vehicles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      technicianName: {
        type: Sequelize.STRING,
      },

      vehicleMileage: {
        type: Sequelize.INTEGER,
      },

      serviceAdvisor: {
        type: Sequelize.STRING,
      },

      priority: {
        type: Sequelize.ENUM("Low", "Medium", "High", "Urgent"),
        defaultValue: "Medium",
      },

      status: {
        type: Sequelize.ENUM("Open", "In Progress", "Completed", "Cancelled"),
        defaultValue: "Open",
      },

      startDate: {
        type: Sequelize.DATE,
      },

      completedDate: {
        type: Sequelize.DATE,
      },

      notes: {
        type: Sequelize.TEXT,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("job_sheets");
  },
};
