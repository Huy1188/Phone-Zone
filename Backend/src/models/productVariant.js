"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductVariant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductVariant.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
      });
      // Giúp kiểm tra: Biến thể này đã bán được cái nào chưa?
      ProductVariant.hasMany(models.OrderDetail, {
        foreignKey: "variant_id",
        as: "order_details",
      });
    }
  }
  ProductVariant.init(
    {
      variant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      product_id: DataTypes.INTEGER,
      // Ví dụ: IP15PM-TI-256 (iPhone 15 PM - Titan - 256GB)
      sku: DataTypes.STRING,
      color: DataTypes.STRING,
      ram: DataTypes.STRING,
      rom: DataTypes.STRING,
      price: DataTypes.DECIMAL(15, 0),
      stock: DataTypes.INTEGER,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ProductVariant",
      tableName: "ProductVariants",
      underscored: true,
    }
  );
  return ProductVariant;
};
