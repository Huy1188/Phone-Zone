"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Voucher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Voucher.hasMany(models.Order, {
        foreignKey: "voucher_id",
        as: "orders",
      });
    }
  }
  Voucher.init(
    {
      voucher_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      code: DataTypes.STRING,
      discount_type: DataTypes.ENUM("percent", "fixed"),
      discount_value: DataTypes.DECIMAL(15, 0),
      min_order_value: DataTypes.DECIMAL(15, 0),
      quantity: DataTypes.INTEGER,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Voucher",
      tableName: "Vouchers",
      underscored: true,
    }
  );
  return Voucher;
};
