"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("vehicles", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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

      registrationNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      make: {
        type: Sequelize.STRING,
      },

      model: {
        type: Sequelize.STRING,
      },

      year: {
        type: Sequelize.STRING,
      },

      vinNumber: {
        type: Sequelize.STRING,
      },

      mileage: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("vehicles");
  },
};
