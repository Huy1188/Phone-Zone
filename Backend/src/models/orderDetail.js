"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OrderDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      OrderDetail.belongsTo(models.Order, {
        foreignKey: "order_id",
        as: "order",
      });
      OrderDetail.belongsTo(models.ProductVariant, {
        foreignKey: "variant_id",
        as: "variant",
      });
    }
  }
  OrderDetail.init(
    {
      detail_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      order_id: DataTypes.INTEGER,
      variant_id: DataTypes.INTEGER,
      product_name: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      price: DataTypes.DECIMAL(15, 0),
    },
    {
      sequelize,
      modelName: "OrderDetail",
      tableName: "OrderDetails",
      underscored: true,
    }
  );
  return OrderDetail;
};
