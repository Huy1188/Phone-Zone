"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductVariant extends Model {
    
    static associate(models) {
      ProductVariant.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
      });
      
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
