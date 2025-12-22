"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
      Order.belongsTo(models.Voucher, {
        foreignKey: "voucher_id",
        as: "voucher",
      });
      Order.hasMany(models.OrderDetail, {
        foreignKey: "order_id",
        as: "details",
      });
    }
  }
  Order.init(
    {
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: DataTypes.INTEGER,
      voucher_id: DataTypes.INTEGER,
      total_money: DataTypes.DECIMAL(15, 0),
      payment_method: DataTypes.STRING,
      shipping_address: DataTypes.STRING,
      status: DataTypes.ENUM("pending", "shipping", "delivered", "cancelled"),
      note: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "Orders",
      underscored: true,
    }
  );
  return Order;
};
