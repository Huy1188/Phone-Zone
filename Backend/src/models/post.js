"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Post.belongsTo(models.PostCategory, {
        foreignKey: "post_category_id",
        as: "category",
      });
      Post.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "author",
      });
      Post.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
      });
    }
  }
  Post.init(
    {
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      title: DataTypes.STRING,
      slug: DataTypes.STRING,
      content: DataTypes.TEXT,
      thumbnail: DataTypes.STRING, //ảnh đại diện bài viết
      user_id: DataTypes.INTEGER,
      post_category_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Post",
      tableName: "Posts",
      underscored: true,
    }
  );
  return Post;
};
