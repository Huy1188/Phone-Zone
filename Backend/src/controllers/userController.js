import db from "../models/index";
import bcrypt from "bcrypt";

export const updateMe = async (req, res) => {
  try {
    const sess = req.session?.user;
    if (!sess?.user_id) {
      return res.status(401).json({ success: false, message: "Not logged in" });
    }

    const user = await db.User.findByPk(sess.user_id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const { username, first_name, last_name, phone, gender, avatar } = req.body;

    // validate nhẹ
    if (phone && !/^[0-9+\-\s]{8,15}$/.test(String(phone))) {
      return res.status(400).json({ success: false, message: "Số điện thoại không hợp lệ" });
    }

    // gender: FE gửi "male/female" hoặc boolean → convert về boolean
    let genderBool = user.gender;
    if (gender === "male") genderBool = true;
    else if (gender === "female") genderBool = false;
    else if (typeof gender === "boolean") genderBool = gender;

    await user.update({
      username: username ?? user.username,
      first_name: first_name ?? user.first_name,
      last_name: last_name ?? user.last_name,
      phone: phone ?? user.phone,
      gender: genderBool,
      avatar: avatar ?? user.avatar,
    });

    const fresh = await db.User.findByPk(sess.user_id, {
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

    return res.json({ success: true, user: fresh?.toJSON() });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const changeMyPassword = async (req, res) => {
  try {
    const sess = req.session?.user;
    if (!sess?.user_id) {
      return res.status(401).json({ success: false, message: "Not logged in" });
    }

    const { oldPassword, newPassword } = req.body || {};
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Thiếu mật khẩu hiện tại hoặc mật khẩu mới" });
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({ success: false, message: "Mật khẩu mới phải có ít nhất 6 ký tự" });
    }

    const user = await db.User.findByPk(sess.user_id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const ok = bcrypt.compareSync(String(oldPassword), String(user.password || ""));
    if (!ok) {
      return res.status(400).json({ success: false, message: "Mật khẩu hiện tại không đúng" });
    }

    // Không cho đặt lại trùng mật khẩu cũ
    const same = bcrypt.compareSync(String(newPassword), String(user.password || ""));
    if (same) {
      return res.status(400).json({ success: false, message: "Mật khẩu mới phải khác mật khẩu hiện tại" });
    }

    user.password = bcrypt.hashSync(String(newPassword), bcrypt.genSaltSync(10));
    await user.save();

    return res.json({ success: true, message: "Đổi mật khẩu thành công" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
