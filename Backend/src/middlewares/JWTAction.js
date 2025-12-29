import jwt from "jsonwebtoken";
require("dotenv").config();

const nonSecurePaths = ["/admin-login", "/admin-logout", "/create-new-user"]; 

const createJWT = (payload) => {
  let key = process.env.JWT_SECRET || "bi_mat_khong_bat_mi";
  let token = null;
  try {
    token = jwt.sign(payload, key, { expiresIn: "1d" }); 
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


const checkUserJWT = (req, res, next) => {
  if (nonSecurePaths.includes(req.path)) return next(); 

  let cookies = req.cookies;
  let tokenFromHeader = cookies.jwt; 

  if (tokenFromHeader) {
    let decoded = verifyToken(tokenFromHeader);
    if (decoded && decoded.role_id === 1) {
      
      req.user = decoded; 
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
