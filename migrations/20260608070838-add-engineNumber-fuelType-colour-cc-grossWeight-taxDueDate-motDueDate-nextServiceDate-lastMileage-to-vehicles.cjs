"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("vehicles", "engineNumber", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("vehicles", "fuelType", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("vehicles", "colour", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("vehicles", "cc", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn("vehicles", "grossWeight", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });

    await queryInterface.addColumn("vehicles", "taxDueDate", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("vehicles", "motDueDate", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("vehicles", "nextServiceDate", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("vehicles", "lastMileage", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("vehicles", "engineNumber");
    await queryInterface.removeColumn("vehicles", "fuelType");
    await queryInterface.removeColumn("vehicles", "colour");
    await queryInterface.removeColumn("vehicles", "cc");
    await queryInterface.removeColumn("vehicles", "grossWeight");
    await queryInterface.removeColumn("vehicles", "taxDueDate");
    await queryInterface.removeColumn("vehicles", "motDueDate");
    await queryInterface.removeColumn("vehicles", "nextServiceDate");
    await queryInterface.removeColumn("vehicles", "lastMileage");
  },
};
