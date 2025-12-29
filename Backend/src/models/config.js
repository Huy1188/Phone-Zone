"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Config extends Model {
    
    static associate(models) {
      
    }
  }
  Config.init(
    {
      config_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      key: DataTypes.STRING,
      value: DataTypes.TEXT,
      type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Config",
      tableName: "Configs",
      underscored: true,
    }
  );
  return Config;
};
