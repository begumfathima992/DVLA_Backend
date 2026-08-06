"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("estimates", "estimateDate", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("estimates", "documentType", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("estimates", "labourRate", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });

    await queryInterface.addColumn("estimates", "jobNumber", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("estimates", "customerOrderNumber", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("estimates", "serviceAdvisor", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("estimates", "defaultDiscount", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });

    await queryInterface.addColumn("estimates", "vehicleMileage", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("estimates", "estimateDate");
    await queryInterface.removeColumn("estimates", "documentType");
    await queryInterface.removeColumn("estimates", "labourRate");
    await queryInterface.removeColumn("estimates", "jobNumber");
    await queryInterface.removeColumn("estimates", "customerOrderNumber");
    await queryInterface.removeColumn("estimates", "serviceAdvisor");
    await queryInterface.removeColumn("estimates", "defaultDiscount");
    await queryInterface.removeColumn("estimates", "vehicleMileage");
  },
};
