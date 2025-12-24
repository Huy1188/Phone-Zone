'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Users', {
            user_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            username: {
                type: Sequelize.STRING,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            first_name: {
                type: Sequelize.STRING,
            },
            last_name: {
                type: Sequelize.STRING,
            },
            gender: {
                type: Sequelize.BOOLEAN,
            },
            phone: {
                type: Sequelize.STRING(15),
            },
            avatar: {
                type: Sequelize.STRING,
            },
            // Khóa ngoại liên kết với bảng Roles
            role_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 2, // Mặc định là khách hàng
                references: {
                    model: 'Roles', // Tên bảng Roles
                    key: 'role_id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'NO ACTION', // Nếu xóa role, user này sẽ về default
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Users');
    },
};
