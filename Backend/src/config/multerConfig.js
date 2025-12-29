import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    
    
    cb(null, "./src/public/images/products");
  },
  filename: function (req, file, cb) {
    
    
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});


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


const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

export default upload;
