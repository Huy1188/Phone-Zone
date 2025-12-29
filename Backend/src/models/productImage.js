"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductImage extends Model {
    
    static associate(models) {
      ProductImage.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
      });
    }
  }
  ProductImage.init(
    {
      image_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      product_id: DataTypes.INTEGER,
      image_url: DataTypes.STRING,
      is_thumbnail: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "ProductImage",
      tableName: "ProductImages",
      underscored: true,
    }
  );
  return ProductImage;
};
