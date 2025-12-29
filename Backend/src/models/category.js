"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    
    static associate(models) {
      Category.hasMany(models.Product, {
        foreignKey: "category_id",
        as: "products",
      });
    }
  }
  Category.init(
    {
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Category",
      tableName: "Categories",
      underscored: true,
    }
  );
  return Category;
};
