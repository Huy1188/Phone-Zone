"use strict";


module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("CartItems", {
      cart_item_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      cart_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Carts",
          key: "cart_id",
        },
        onDelete: "CASCADE",
      },

      variant_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "ProductVariants",
          key: "variant_id",
        },
        onDelete: "CASCADE",
      },

      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    
    await queryInterface.addConstraint("CartItems", {
      fields: ["cart_id", "variant_id"],
      type: "unique",
      name: "unique_cart_variant",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("CartItems");
  },
};
