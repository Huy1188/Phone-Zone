import jwt from "jsonwebtoken";
require("dotenv").config();

const nonSecurePaths = ["/admin-login", "/admin-logout", "/create-new-user"]; // Các API không cần check token

const createJWT = (payload) => {
  let key = process.env.JWT_SECRET || "bi_mat_khong_bat_mi";
  let token = null;
  try {
    token = jwt.sign(payload, key, { expiresIn: "1d" }); // Token sống 1 ngày
  } catch (err) {
    console.log(err);
  }
  return token;
};

const verifyToken = (token) => {
  let key = process.env.JWT_SECRET || "bi_mat_khong_bat_mi";
  let decoded = null;
  try {
    decoded = jwt.verify(token, key);
  } catch (err) {
    console.log(err);
  }
  return decoded;
};

// Middleware check quyền Admin trên từng request
const checkUserJWT = (req, res, next) => {
  if (nonSecurePaths.includes(req.path)) return next(); // Bỏ qua trang login

  let cookies = req.cookies;
  let tokenFromHeader = cookies.jwt; // Lấy token từ cookie tên là 'jwt'

  if (tokenFromHeader) {
    let decoded = verifyToken(tokenFromHeader);
    if (decoded && decoded.role_id === 1) {
      // Chỉ cho phép Admin (role_id = 1)
      req.user = decoded; // Gán user vào request để dùng sau này
      next();
    } else {
      return res
        .status(401)
        .json({
          errCode: -1,
          message: "Không có quyền Admin hoặc Token hết hạn",
        });
    }
  } else {
    return res.status(401).json({ errCode: -1, message: "Bạn chưa đăng nhập" });
  }
};

module.exports = {
  createJWT,
  verifyToken,
  checkUserJWT,
};
