"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("customers", "customerCode", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("customers", "telephone", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("customers", "gdprConsent", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn("customers", "creditTerms", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("customers", "alternativeAddress", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("customers", "customerCode");
    await queryInterface.removeColumn("customers", "telephone");
    await queryInterface.removeColumn("customers", "gdprConsent");
    await queryInterface.removeColumn("customers", "creditTerms");
    await queryInterface.removeColumn("customers", "alternativeAddress");
  },
};
