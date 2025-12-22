"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Vouchers", {
      voucher_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      code: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      discount_type: {
        type: Sequelize.ENUM("percent", "fixed"),
        defaultValue: "fixed",
      },
      discount_value: {
        type: Sequelize.DECIMAL(15, 0),
        allowNull: false,
      },
      min_order_value: {
        type: Sequelize.DECIMAL(15, 0),
        defaultValue: 0,
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      start_date: {
        type: Sequelize.DATE,
      },
      end_date: {
        type: Sequelize.DATE,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Vouchers");
  },
};
