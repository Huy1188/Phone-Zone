import db from "../models/index";

// build label biến thể giống UI hiện tại
function variantLabel(v) {
  const parts = [];
  if (v.ram) parts.push(v.ram);
  if (v.rom) parts.push(v.rom);
  if (v.color) parts.unshift(v.color);
  return parts.length === 0 ? "Tiêu chuẩn" : parts.join(" - ");
}

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
    name: `${p?.product_name ?? "Sản phẩm"} (${variantLabel(v)})`,
    image: v.image || p?.image || "",
    price: Number(v.price || 0),
    quantity: Number(quantity || 1),
  };
}

function calcTotalMoney(cart) {
  return cart.reduce((s, it) => s + Number(it.price) * Number(it.quantity), 0);
}

function getSessionCart(req) {
  if (!req.session.cart) req.session.cart = [];
  return req.session.cart;
}

async function getOrCreateCartId(userId) {
  const [cart] = await db.Cart.findOrCreate({
    where: { user_id: userId },
    defaults: { user_id: userId },
  });
  return cart.cart_id;
}

// GET /api/cart
let getCart = async (req, res) => {
  try {
    const user = req.session.user;

    // guest -> session
    if (!user) {
      const cart = getSessionCart(req);
      return res.json({ cart, totalMoney: calcTotalMoney(cart) });
    }

    // user -> db
    const cartId = await getOrCreateCartId(user.user_id);
    const rows = await db.CartItem.findAll({ where: { cart_id: cartId } });

    const cart = [];
    for (const r of rows) {
      const view = await buildItemFromVariant(r.variant_id, r.quantity);
      if (view) cart.push(view);
    }

    return res.json({ cart, totalMoney: calcTotalMoney(cart) });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// POST /api/cart/items { variant_id, quantity }
let addItem = async (req, res) => {
  try {
    const user = req.session.user;
    const variantId = Number(req.body.variant_id);
    const qty = Math.max(1, Number(req.body.quantity || 1));

    // guest -> session
    if (!user) {
      const cart = getSessionCart(req);
      const ex = cart.find((x) => x.variantId === variantId);

      if (ex) ex.quantity += qty;
      else {
        const view = await buildItemFromVariant(variantId, qty);
        if (!view) return res.status(400).json({ success: false, message: "Variant not found" });
        cart.push(view);
      }

      return res.json({ success: true, cart });
    }

    // user -> db
    const cartId = await getOrCreateCartId(user.user_id);
    const ex = await db.CartItem.findOne({ where: { cart_id: cartId, variant_id: variantId } });

    if (ex) {
      ex.quantity += qty;
      await ex.save();
    } else {
      await db.CartItem.create({ cart_id: cartId, variant_id: variantId, quantity: qty });
    }

    return res.json({ success: true });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// PATCH /api/cart/items/:variantId { quantity }
let updateQuantity = async (req, res) => {
  try {
    const user = req.session.user;
    const variantId = Number(req.params.variantId);
    const qty = Number(req.body.quantity);

    if (!qty || qty < 1) return res.status(400).json({ success: false, message: "quantity must be >= 1" });

    // guest
    if (!user) {
      const cart = getSessionCart(req);
      const ex = cart.find((x) => x.variantId === variantId);
      if (ex) ex.quantity = qty;
      return res.json({ success: true, cart });
    }

    // user
    const cartId = await getOrCreateCartId(user.user_id);
    const ex = await db.CartItem.findOne({ where: { cart_id: cartId, variant_id: variantId } });
    if (ex) {
      ex.quantity = qty;
      await ex.save();
    }

    return res.json({ success: true });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// DELETE /api/cart/items/:variantId
let deleteItem = async (req, res) => {
  try {
    const user = req.session.user;
    const variantId = Number(req.params.variantId);

    // guest
    if (!user) {
      const cart = getSessionCart(req);
      req.session.cart = cart.filter((x) => x.variantId !== variantId);
      return res.json({ success: true, cart: req.session.cart });
    }

    // user
    const cartId = await getOrCreateCartId(user.user_id);
    await db.CartItem.destroy({ where: { cart_id: cartId, variant_id: variantId } });

    return res.json({ success: true });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default { getCart, addItem, updateQuantity, deleteItem };
