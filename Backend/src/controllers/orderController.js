import db from "../models/index";

/**
 * ====== helpers (copy logic từ cartController để dùng chung) ======
 */
async function buildItemFromVariant(variantId, quantity) {
  const v = await db.ProductVariant.findOne({
    where: { variant_id: variantId },
    include: [{ model: db.Product, as: "product" }],
    raw: false,
    nest: true,
  });

  if (!v) return null;

  const p = v.product;
  return {
    variantId: v.variant_id,
    productId: v.product_id,
    name: `${p?.product_name ?? "Sản phẩm"}`,
    image: v.image || p?.image || "",
    price: Number(v.price || 0),
    quantity: Number(quantity || 1),
  };
}

function calcTotalMoney(cart) {
  return cart.reduce((s, it) => s + Number(it.price) * Number(it.quantity), 0);
}

async function getOrCreateCartId(userId) {
  const [cart] = await db.Cart.findOrCreate({
    where: { user_id: userId },
    defaults: { user_id: userId },
  });
  return cart.cart_id;
}

/**
 * ====== GET /checkout ======
 * trả cart + totalMoney + user
 */
let getCheckoutPage = async (req, res) => {
  try {
    const user = req.session.user;
    let cart = [];

    // guest -> session cart
    if (!user) {
      cart = req.session.cart || [];
    }
    // user -> db cart
    else {
      const cartId = await getOrCreateCartId(user.user_id);
      const rows = await db.CartItem.findAll({ where: { cart_id: cartId } });

      for (const r of rows) {
        const view = await buildItemFromVariant(r.variant_id, r.quantity);
        if (view) cart.push(view);
      }
    }

    if (cart.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng trống" });
    }

    return res.json({
      cart,
      totalMoney: calcTotalMoney(cart),
      user: user || null,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Lỗi tải checkout" });
  }
};

/**
 * ====== POST /orders ======
 */
let handleCheckout = async (req, res) => {
  try {
    const user = req.session.user;
    let cart = [];

    // guest
    if (!user) {
      cart = req.session.cart || [];
    }
    // user
    else {
      const cartId = await getOrCreateCartId(user.user_id);
      const rows = await db.CartItem.findAll({ where: { cart_id: cartId } });

      for (const r of rows) {
        const view = await buildItemFromVariant(r.variant_id, r.quantity);
        if (view) cart.push(view);
      }
    }

    if (cart.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng trống" });
    }

    const totalMoney = calcTotalMoney(cart);
    const data = req.body;

    const order = await db.Order.create({
      user_id: user ? user.user_id : null,
      total_money: totalMoney,
      payment_method: data.payment_method,
      shipping_address: `${data.address}, ${data.city}`,
      status: "pending",
      note: `Người nhận: ${data.name} - SĐT: ${data.phone}. ${data.note || ""}`,
    });

    for (const item of cart) {
      await db.OrderDetail.create({
        order_id: order.order_id,
        variant_id: item.variantId,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
      });
    }

    // ===== clear cart =====
    if (!user) {
      req.session.cart = [];
    } else {
      const cartId = await getOrCreateCartId(user.user_id);
      await db.CartItem.destroy({ where: { cart_id: cartId } });
    }

    return res.json({
      success: true,
      order_id: order.order_id,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Lỗi đặt hàng" });
  }
};

// GET /api/orders/me
export const getMyOrders = async (req, res) => {
  try {
    const user = req.session?.user;
    if (!user?.user_id) {
      return res.status(401).json({ success: false, message: "Bạn chưa đăng nhập" });
    }

    const orders = await db.Order.findAll({
      where: { user_id: user.user_id },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: db.OrderDetail,
          as: "details",
          attributes: ["detail_id", "variant_id", "product_name", "quantity", "price"],
          include: [
            {
              model: db.ProductVariant,
              as: "variant",
              attributes: ["variant_id", "sku", "price", "image"],
              include: [
                {
                  model: db.Product,
                  as: "product",
                  attributes: ["product_id", "name", "slug", "image"],
                },
              ],
            },
          ],
        },
      ],
    });

    return res.json({ success: true, orders });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export default {
  getCheckoutPage,
  handleCheckout,
  getMyOrders,
};
