'use strict';
const bcrypt = require('bcrypt');

let salt = bcrypt.genSaltSync(10);
let hashPassword = bcrypt.hashSync('123456', salt); // Pass mặc định là 123456

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Users', [
            {
                user_id: '1',
                username: 'admin',
                email: 'admin@gmail.com',
                password: hashPassword,
                first_name: 'Super',
                last_name: 'Admin',
                phone: '',
                gender: true, // true: Male
                role_id: 1,
                is_active: true,
                avatar: null,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        // Xóa user admin này nếu chạy undo
        return queryInterface.bulkDelete('Users', { username: 'admin' }, {});
    },
};
