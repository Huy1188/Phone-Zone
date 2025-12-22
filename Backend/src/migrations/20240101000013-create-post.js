"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Posts", {
      post_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING,
        unique: true,
      },
      content: {
        type: Sequelize.TEXT,
      }, // TEXT cho bài viết dài
      thumbnail: {
        type: Sequelize.STRING,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: "Users", key: "user_id" },
      },
      post_category_id: {
        type: Sequelize.INTEGER,
        references: { model: "PostCategories", key: "cate_id" },
      },
      product_id: {
        type: Sequelize.INTEGER,
        references: { model: "Products", key: "product_id" },
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
    await queryInterface.dropTable("Posts");
  },
};
