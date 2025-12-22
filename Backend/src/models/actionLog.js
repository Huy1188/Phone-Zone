"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ActionLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
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
      tableName: "ActionLogs", // Nên ép cứng tên bảng cho chắc chắn

      // QUAN TRỌNG: Để map đúng created_at trong DB
      underscored: true,

      // Log chỉ cần ngày tạo, không cần ngày sửa
      updatedAt: false,
      timestamps: true,
    }
  );
  return ActionLog;
};
