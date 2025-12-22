"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Products", {
      product_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT, // Bài viết dài
      },
      specifications: {
        type: Sequelize.JSON, // Lưu thông số kỹ thuật
      },
      min_price: {
        type: Sequelize.DECIMAL(15, 0),
        defaultValue: 0,
      },
      // KHÓA NGOẠI (Foreign Keys)
      brand_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Brands", // Tên bảng Brands
          key: "brand_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Categories", // Tên bảng Categories
          key: "category_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      is_hot: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      discount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      promotion: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.dropTable("Products");
  },
};