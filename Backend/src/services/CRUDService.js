import bcrypt from 'bcrypt';
import db from '../models/index';
import { where } from 'sequelize';
import { raw } from 'body-parser';

const salt = bcrypt.genSaltSync(10);

let createdNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPW = await hashUserPassword(data.password);
            await db.User.create({
                username: data.username,
                password: hashPW,
                email: data.email,
                first_name: data.first_name,
                last_name: data.last_name,
                gender: data.gender,
                phone: data.phone,
                is_active: true,
            });
            resolve('Create a new user successed!');
        } catch (error) {
            reject(error);
        }
    });
};

let hashUserPassword = (pw) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hash = await bcrypt.hashSync(pw, salt);
            resolve(hash);
        } catch (error) {
            reject(error);
        }
    });
};

let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                raw: true,
            });
            resolve(users);
        } catch (error) {
            reject(error);
        }
    });
};

let getUserInfoById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { user_id: userId },
                raw: true,
            });

            if (user) {
                resolve(user);
            } else {
                resolve({});
            }
        } catch (error) {
            reject(error);
        }
    });
};

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { user_id: data.user_id },
                raw: false,
            });
            if (user) {
                user.username = data.username;
                user.email = data.email;
                user.phone = data.phone;
                user.first_name = data.first_name;
                user.last_name = data.last_name;

                await user.save();

                let allUsers = await db.User.findAll();
                resolve(allUsers);
            } else {
                resolve();
            }
        } catch (error) {
            reject(error);
        }
    });
};

let deleteUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { user_id: userId },
            });

            if (user) {
                await user.destroy();
            }
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    createdNewUser: createdNewUser,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    updateUserData: updateUserData,
    deleteUserById: deleteUserById,
};
