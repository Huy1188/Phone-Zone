"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ProductVariants", {
      variant_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Products",
          key: "product_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE", 
      },
      
      sku: {
        type: Sequelize.STRING,
        unique: true,
      },
      color: {
        type: Sequelize.STRING,
      },
      ram: {
        type: Sequelize.STRING,
      },
      rom: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.DECIMAL(15, 0),
        allowNull: false,
        defaultValue: 0,
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      image: {
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
    await queryInterface.dropTable("ProductVariants");
  },
};
