import multer from "multer";
import path from "path";

// 1. Cấu hình nơi lưu và tên file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Lưu vào thư mục public/images/products
    // Bạn nhớ tạo thư mục này trước nhé!
    cb(null, "./src/public/images/products");
  },
  filename: function (req, file, cb) {
    // Đặt lại tên file: thời gian hiện tại + tên gốc (ví dụ: 1702456789-iphone.png)
    // Cách này giúp không bao giờ bị trùng tên file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// 2. Kiểm tra định dạng (chỉ cho upload ảnh)
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(
      new Error("Sai định dạng! Chỉ chấp nhận file ảnh (jpg, jpeg, png)"),
      false
    );
  }
};

// 3. Khởi tạo upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

export default upload;
