"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    
    static associate(models) {
      Address.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }
  Address.init(
    {
      address_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: DataTypes.INTEGER,
      recipient_name: DataTypes.STRING,
      recipient_phone: DataTypes.STRING,
      street: DataTypes.STRING,
      city: DataTypes.STRING,
      is_default: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Address",
      tableName: "Addresses",
      underscored: true,
    }
  );
  return Address;
};
