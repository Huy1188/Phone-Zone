"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", {
      order_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: "Users", key: "user_id" },
      },
      voucher_id: {
        type: Sequelize.INTEGER,
        references: { model: "Vouchers", key: "voucher_id" },
        allowNull: true,
      },
      total_money: {
        type: Sequelize.DECIMAL(15, 0),
        defaultValue: 0,
      },
      payment_method: {
        type: Sequelize.STRING,
        defaultValue: "COD",
      },
      shipping_address: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM("pending", "shipping", "delivered", "cancelled"),
        defaultValue: "pending",
      },
      note: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("Orders");
  },
};
