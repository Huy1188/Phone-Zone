"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Category, {
        foreignKey: "category_id",
        as: "category",
      });
      Product.belongsTo(models.Brand, {
        foreignKey: "brand_id",
        as: "brand",
      });
      Product.hasMany(models.ProductVariant, {
        foreignKey: "product_id",
        as: "variants",
      });
      Product.hasMany(models.ProductImage, {
        foreignKey: "product_id",
        as: "images",
      });
      Product.hasMany(models.Review, {
        foreignKey: "product_id",
        as: "reviews",
      });
    }
  }
  Product.init(
    {
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
      image: DataTypes.STRING,
      description: DataTypes.TEXT,
      specifications: DataTypes.JSON,
      min_price: DataTypes.DECIMAL(15, 0),
      brand_id: DataTypes.INTEGER,
      category_id: DataTypes.INTEGER,
      is_hot: DataTypes.BOOLEAN,
      is_active: DataTypes.BOOLEAN,
      discount: DataTypes.INTEGER,
      promotion: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "Products",
      underscored: true,
    }
  );
  return Product;
};