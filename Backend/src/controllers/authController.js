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

    // lưu session (để me dùng user_id)
    req.session.user = {
      user_id: user.user_id,
      email: user.email,
      role_id: user.role_id,
    };

    return res.json({
      success: true,
      user: req.session.user,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, message: "Lỗi đăng ký: " + e.message });
  }
};

const mergeSessionCartToDb = async (userId, sessionCart) => {
  if (!sessionCart || sessionCart.length === 0) return;

  const [cart] = await db.Cart.findOrCreate({
    where: { user_id: userId },
    defaults: { user_id: userId },
  });

  const cartId = cart.cart_id;

  const dbItems = await db.CartItem.findAll({ where: { cart_id: cartId } });
  const map = new Map();
  for (const it of dbItems) map.set(it.variant_id, it);

  for (const s of sessionCart) {
    const variantId = Number(s.variantId);
    const qty = Math.max(1, Number(s.quantity || 1));

    const ex = map.get(variantId);
    if (ex) {
      ex.quantity += qty;
      await ex.save();
    } else {
      await db.CartItem.create({
        cart_id: cartId,
        variant_id: variantId,
        quantity: qty,
      });
    }
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

    // giữ cart guest trước
    const guestCart = req.session.cart || [];

    req.session.user = {
      user_id: user.user_id,
      email: user.email,
      role_id: user.role_id,
    };

    // merge guest -> db
    await mergeSessionCartToDb(user.user_id, guestCart);
    req.session.cart = [];

    return res.json({ success: true, user: req.session.user });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, message: "Lỗi đăng nhập" });
  }
};

// LOGOUT
let handleLogout = (req, res) => {
    req.session.destroy(() => {
        return res.json({ success: true });
    });
};

// GET ME: lấy full user từ DB
let getMe = async (req, res) => {
  try {
    const sess = req.session?.user;
    if (!sess?.user_id) return res.json({ success: true, user: null });

    const user = await db.User.findByPk(sess.user_id, {
      attributes: [
        "user_id",
        "email",
        "username",
        "first_name",
        "last_name",
        "gender",
        "phone",
        "avatar",
        "role_id",
        "is_active",
        "createdAt",
        "updatedAt",
      ],
    });

    return res.json({ success: true, user: user ? user.toJSON() : null });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export default {
  handleRegister,
  handleLogin,
  handleLogout,
  getMe,
};
