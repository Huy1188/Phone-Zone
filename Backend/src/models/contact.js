"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Contact extends Model {
    
    static associate(models) {
      
    }
  }
  Contact.init(
    {
      contact_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      message: DataTypes.TEXT,
      is_read: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Contact",
      tableName: "Contacts",
      underscored: true,
    }
  );
  return Contact;
};
