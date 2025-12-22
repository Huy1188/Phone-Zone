"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Brand extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Brand.hasMany(models.Product, {
        foreignKey: "brand_id",
        as: "products",
      });
    }
  }
  Brand.init(
    {
      brand_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
      logo_url: DataTypes.STRING,
      origin: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Brand",
      tableName: "Brands",
      underscored: true,
    }
  );
  return Brand;
};
