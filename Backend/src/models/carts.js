"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      Cart.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });

      Cart.hasMany(models.CartItem, {
        foreignKey: "cart_id",
        as: "items",
      });
    }
  }

  Cart.init(
    {
      cart_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Cart",
      tableName: "Carts",
      underscored: true,
    }
  );

  return Cart;
};
