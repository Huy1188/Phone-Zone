import db from "../models/index";

// LIST PRODUCTS (trang chủ)
export const getHomePage = async (req, res) => {
  try {
    const { category_slug } = req.query;

    // where cho Product
    const whereProduct = { is_active: true };

    // nếu có category_slug -> tìm category_id
    if (category_slug) {
      const category = await db.Category.findOne({ where: { slug: category_slug } });
      if (!category) {
        return res.json({ success: true, products: [] });
      }
      whereProduct.category_id = category.category_id; // hoặc category.id tuỳ schema
    }

    const products = await db.Product.findAll({
      where: whereProduct,
      include: [
        { model: db.Category, as: "category", attributes: ["name", "slug", "image"] },
        { model: db.Brand, as: "brand", attributes: ["name", "slug", "logo_url", "origin"] },
        {
          model: db.ProductImage, // THÊM VÀO ĐÂY
          as: "images",
          attributes: ["image_url", "is_thumbnail"],
        },
        {
          model: db.ProductVariant,
          as: "variants",
          attributes: ["variant_id", "sku", "price", "image"],
          limit: 1,
          order: [["variant_id", "ASC"]],
          separate: true,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const data = products.map((p) => {
      const plain = p.toJSON();
      
      // Ưu tiên 1: Ảnh có is_thumbnail = true trong bảng ProductImage
      // Ưu tiên 2: Ảnh đầu tiên trong danh sách ProductImage
      // Ưu tiên 3: Ảnh trong variants
      const mainImg = plain.images?.find(img => img.is_thumbnail)?.image_url 
                   || plain.images?.[0]?.image_url 
                   || plain.variants?.[0]?.image 
                   || null;

      return { ...plain, image: mainImg };
    });

    return res.json({ success: true, products: data });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ DETAIL BY SLUG (dùng cho FE)
let getDetailProductBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;

    let product = await db.Product.findOne({
      where: { slug }, // ✅ dùng slug
      include: [
        { model: db.Category, as: "category" },
        { model: db.Brand, as: "brand" },
        { model: db.ProductVariant, as: "variants" },
        { 
          model: db.ProductImage, 
          as: "images" // Lấy tất cả ảnh của sản phẩm này
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Sản phẩm không tồn tại" });
    }

    return res.json({ success: true, product });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, message: "Lỗi tải chi tiết sản phẩm" });
  }
};

// (TUỲ CHỌN) DETAIL BY ID - giữ lại để debug/admin nội bộ nếu cần
let getDetailProductById = async (req, res) => {
  try {
    let productId = req.params.id;

    let product = await db.Product.findOne({
      where: { product_id: productId },
      include: [
        { model: db.Category, as: "category" },
        { model: db.Brand, as: "brand" },
        { model: db.ProductVariant, as: "variants" },
      ],
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Sản phẩm không tồn tại" });
    }

    return res.json({ success: true, product });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, message: "Lỗi tải chi tiết sản phẩm" });
  }
};

// LIST CATEGORIES (public)
export const getCategories = async (req, res) => {
  try {
    const categories = await db.Category.findAll({
      raw: true,
      attributes: ["category_id", "name", "slug", "image"],
      order: [["category_id", "ASC"]],
    });

    return res.json({ success: true, categories });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export default {
getHomePage,
getCategories,
  getDetailProductBySlug,
  getDetailProductById, // optional
};
