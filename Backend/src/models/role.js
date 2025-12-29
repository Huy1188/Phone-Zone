"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    
    static associate(models) {
      Role.hasMany(models.User, {
        foreignKey: "role_id",
        as: "users",
      });
    }
  }
  Role.init(
    {
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Role",
      tableName: "Roles",
      timestamps: false,
    }
  );
  return Role;
};
