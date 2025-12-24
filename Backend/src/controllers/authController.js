import db from '../models/index';
import bcrypt from 'bcrypt';

// REGISTER
let handleRegister = async (req, res) => {
    try {
        const { email, password, username } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Thiếu email hoặc mật khẩu' });
        }

        let userExist = await db.User.findOne({ where: { email } });
        if (userExist) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

        let hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

        let user = await db.User.create({
            username,
            email,
            password: hashPassword,
            role_id: 2,
            is_active: true,
        });

        return res.json({
            success: true,
            user: { user_id: user.user_id, email: user.email },
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ success: false, message: 'Lỗi đăng ký: ' + e.message });
    }
};

// LOGIN
let handleLogin = async (req, res) => {
    try {
        let { email, password } = req.body;

        let user = await db.User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Email không tồn tại' });
        }

        let checkPass = bcrypt.compareSync(password, user.password);
        if (!checkPass) {
            return res.status(400).json({ message: 'Mật khẩu không đúng' });
        }

        req.session.user = {
            user_id: user.user_id,
            email: user.email,
            role_id: user.role_id,
        };

        return res.json({ success: true, user: req.session.user });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ success: false, message: 'Lỗi đăng nhập' });
    }
};

// LOGOUT
let handleLogout = (req, res) => {
    req.session.destroy(() => {
        return res.json({ success: true });
    });
};

// (Khuyến nghị thêm)
let getMe = (req, res) => {
    return res.json({ success: true, user: req.session.user || null });
};

export default {
    handleRegister,
    handleLogin,
    handleLogout,
    getMe,
};
