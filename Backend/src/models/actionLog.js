"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ActionLog extends Model {
    
    static associate(models) {
      ActionLog.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }
  ActionLog.init(
    {
      log_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: DataTypes.INTEGER,
      action: DataTypes.STRING,
      entity: DataTypes.STRING,
      entity_id: DataTypes.INTEGER,
      details: DataTypes.TEXT,
      ip_address: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ActionLog",
      tableName: "ActionLogs", 

      
      underscored: true,

      
      updatedAt: false,
      timestamps: true,
    }
  );
  return ActionLog;
};
