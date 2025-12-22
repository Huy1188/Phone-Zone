"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    static associate(models) {
      CartItem.belongsTo(models.Cart, {
        foreignKey: "cart_id",
        as: "cart",
      });

      // Variant model của bạn tên gì thì đổi ở đây
      CartItem.belongsTo(models.ProductVariant, {
        foreignKey: "variant_id",
        as: "variant",
      });
    }
  }

  CartItem.init(
    {
      cart_item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      cart_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      variant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: "CartItem",
      tableName: "CartItems",
      underscored: true,
    }
  );

  return CartItem;
};
