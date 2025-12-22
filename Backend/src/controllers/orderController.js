import db from "../models/index";

let getCheckoutPage = (req, res) => {
  let cart = req.session.cart || [];

  if (cart.length === 0) {
    return res.status(400).json({ message: "Giỏ hàng trống" });
  }

  let totalMoney = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  let user = req.session.user || null;

  return res.json({ cart, totalMoney, user });
};

let handleCheckout = async (req, res) => {
  let cart = req.session.cart || [];
  if (cart.length === 0) {
    return res.status(400).json({ message: "Giỏ hàng trống" });
  }

  try {
    let totalMoney = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    let data = req.body;

    let order = await db.Order.create({
      user_id: req.session.user ? req.session.user.user_id : null,
      total_money: totalMoney,
      payment_method: data.payment_method,
      shipping_address: `${data.address}, ${data.city}`,
      status: "pending",
      note: `Người nhận: ${data.name} - SĐT: ${data.phone}. ${data.note || ""}`,
    });

    for (let item of cart) {
      await db.OrderDetail.create({
        order_id: order.order_id,
        variant_id: item.variantId,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
      });
    }

    req.session.cart = [];

    return res.json({
      success: true,
      order_id: order.order_id,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Lỗi đặt hàng" });
  }
};

export default {
getCheckoutPage, handleCheckout
};
