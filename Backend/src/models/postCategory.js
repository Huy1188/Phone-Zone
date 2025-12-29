"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PostCategory extends Model {
    
    static associate(models) {
      PostCategory.hasMany(models.Post, {
        foreignKey: "post_category_id",
        as: "posts",
      });
    }
  }
  PostCategory.init(
    {
      cate_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "PostCategory",
      tableName: "PostCategories",
      underscored: true,
    }
  );
  return PostCategory;
};
