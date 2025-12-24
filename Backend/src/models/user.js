'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            User.belongsTo(models.Role, {
                foreignKey: 'role_id',
                as: 'role',
            });
            User.hasMany(models.Address, {
                foreignKey: 'user_id',
                as: 'addresses',
            });
            User.hasMany(models.Order, {
                foreignKey: 'user_id',
                as: 'orders',
            });
            User.hasMany(models.Review, {
                foreignKey: 'user_id',
                as: 'reviews',
            });
            User.hasMany(models.Post, {
                foreignKey: 'user_id',
                as: 'posts',
            });
        }
    }
    User.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            username: DataTypes.STRING,
            password: DataTypes.STRING,
            email: DataTypes.STRING,
            first_name: DataTypes.STRING,
            last_name: DataTypes.STRING,
            gender: DataTypes.BOOLEAN,
            phone: DataTypes.STRING(15),
            avatar: DataTypes.STRING,
            role_id: DataTypes.INTEGER,
            is_active: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: 'User',
            tableName: 'Users',
            underscored: true,
        },
    );
    return User;
};
