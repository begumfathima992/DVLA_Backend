"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("job_sheets", "subtotal", {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 0,
    });

    await queryInterface.addColumn("job_sheets", "vatPercentage", {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 20,
    });

    await queryInterface.addColumn("job_sheets", "vatAmount", {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 0,
    });

    await queryInterface.addColumn("job_sheets", "discount", {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 0,
    });

    await queryInterface.addColumn("job_sheets", "total", {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("job_sheets", "subtotal");
    await queryInterface.removeColumn("job_sheets", "vatPercentage");
    await queryInterface.removeColumn("job_sheets", "vatAmount");
    await queryInterface.removeColumn("job_sheets", "discount");
    await queryInterface.removeColumn("job_sheets", "total");
  },
};
