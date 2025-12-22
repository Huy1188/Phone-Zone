import db from "../models/index";

// ADD TO CART
let addToCart = async (req, res) => {
  try {
    const { variant_id, quantity } = req.body;

    if (!variant_id || !quantity) {
      return res.status(400).json({ message: "Thiếu variant_id hoặc quantity" });
    }

    let variant = await db.ProductVariant.findOne({
      where: { variant_id },
      include: [{ model: db.Product, as: "product" }],
      raw: false,
      nest: true,
    });

    if (!variant) {
      return res.status(404).json({ message: "Sản phẩm không hợp lệ!" });
    }

    if (!req.session.cart) req.session.cart = [];
    let cart = req.session.cart;

    let index = cart.findIndex((item) => item.variantId === variant_id);

    if (index !== -1) {
      cart[index].quantity += Number(quantity);
    } else {
      cart.push({
        variantId: variant.variant_id,
        productId: variant.product.product_id,
        name: `${variant.product.name} (${variant.color} - ${variant.rom})`,
        image: variant.image ?? variant.product.image ?? null,
        price: variant.price,
        quantity: Number(quantity),
      });
    }

    req.session.cart = cart;

    return res.json({ success: true, cart });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Lỗi thêm giỏ hàng" });
  }
};

// GET CART
let getCartPage = (req, res) => {
  let cart = req.session.cart || [];
  let totalMoney = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return res.json({ cart, totalMoney });
};

// DELETE ITEM
let deleteItemCart = (req, res) => {
  const { variantId } = req.params; // ✅ lấy từ URL
  let cart = req.session.cart || [];

  req.session.cart = cart.filter((item) => String(item.variantId) !== String(variantId));

  return res.json({
    success: true,
    message: "Đã xóa sản phẩm khỏi giỏ",
    cart: req.session.cart,
  });
};


export default {
addToCart, getCartPage, deleteItemCart
};
