import db from '../models/index';
import { Op } from 'sequelize';

// middleware nhỏ: bắt buộc đăng nhập (session)
export const requireUser = (req, res, next) => {
  const user = req.session?.user;
  if (!user?.user_id) {
    return res.status(401).json({ success: false, message: 'Bạn cần đăng nhập để đánh giá.' });
  }
  next();
};

// GET /api/products/:productId/reviews?page=&limit=
export const listProductReviews = async (req, res) => {
  try {
    const productId = Number(req.params.productId);
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const offset = (page - 1) * limit;

    const { rows, count } = await db.Review.findAndCountAll({
      where: { product_id: productId },
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['user_id', 'username', 'avatar'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      distinct: true,
    });

    return res.json({
      success: true,
      reviews: rows.map((r) => r.toJSON()),
      meta: { total: count, page, limit },
    });
  } catch (e) {
    console.error('listProductReviews error:', e?.message);
    console.error(e?.stack);
    return res.status(500).json({ success: false, message: 'Lỗi tải đánh giá' });
  }
};

// GET /api/products/:productId/reviews/summary
export const getReviewSummary = async (req, res) => {
  try {
    const productId = Number(req.params.productId);

    const rows = await db.Review.findAll({
      where: { product_id: productId },
      attributes: ['rating'],
      raw: true,
    });

    const count = rows.length;
    const sum = rows.reduce((a, r) => a + Number(r.rating || 0), 0);
    const avg = count ? sum / count : 0;

    const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    rows.forEach((r) => {
      const k = Number(r.rating);
      if (dist[k] !== undefined) dist[k] += 1;
    });

    return res.json({ success: true, summary: { avg, count, dist } });
  } catch (e) {
    console.error('getReviewSummary error:', e?.message);
    console.error(e?.stack);
    return res.status(500).json({ success: false, message: 'Lỗi tải tổng quan đánh giá' });
  }
};

/**
 * Check user đã mua sản phẩm và đơn đã delivered chưa
 * Cách làm chắc ăn: không include/join để tránh lỗi eager loading
 */
async function hasPurchasedProductDelivered(userId, productId) {
  // 1) lấy orders delivered của user
  const deliveredOrders = await db.Order.findAll({
    where: { user_id: userId, status: 'delivered' },
    attributes: ['order_id'],
    raw: true,
  });

  const orderIds = deliveredOrders.map((o) => o.order_id);
  if (!orderIds.length) return false;

  // 2) lấy danh sách variant_id thuộc productId
  const variants = await db.ProductVariant.findAll({
    where: { product_id: productId },
    attributes: ['variant_id'],
    raw: true,
  });

  const variantIds = variants.map((v) => v.variant_id);
  if (!variantIds.length) return false;

  // 3) check OrderDetails có variant thuộc product và nằm trong order delivered không
  const found = await db.OrderDetail.findOne({
    where: {
      order_id: { [Op.in]: orderIds },
      variant_id: { [Op.in]: variantIds },
    },
    raw: true,
  });

  return !!found;
}

// GET /api/products/:productId/reviews/can-review
export const canReview = async (req, res) => {
  try {
    const user = req.session?.user;
    if (!user?.user_id) {
      return res.json({ success: true, can: false, reason: 'not_logged_in' });
    }

    const productId = Number(req.params.productId);
    const can = await hasPurchasedProductDelivered(user.user_id, productId);

    return res.json({
      success: true,
      can,
      reason: can ? null : 'not_delivered',
    });
  } catch (e) {
    console.error('canReview error:', e?.message);
    console.error(e?.stack);
    return res.status(500).json({ success: false, message: 'Lỗi kiểm tra quyền đánh giá' });
  }
};

// POST /api/products/:productId/reviews
export const upsertMyReview = async (req, res) => {
  try {
    // guard tránh 500 nếu route quên gắn middleware requireUser hoặc session mất
    const userId = req.session?.user?.user_id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Bạn cần đăng nhập để đánh giá.' });
    }

    const productId = Number(req.params.productId);

    const ok = await hasPurchasedProductDelivered(userId, productId);
    if (!ok) {
      return res.status(403).json({
        success: false,
        message: 'Bạn chỉ có thể đánh giá sau khi đơn hàng đã giao (delivered).',
      });
    }

    const rating = Number(req.body.rating);
    const comment = String(req.body.comment || '').trim();

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating phải từ 1 đến 5.' });
    }

    const existing = await db.Review.findOne({
      where: { product_id: productId, user_id: userId },
    });

    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
      await existing.save();
      return res.json({ success: true, review: existing.toJSON(), updated: true });
    }

    const created = await db.Review.create({
      product_id: productId,
      user_id: userId,
      rating,
      comment,
    });

    return res.json({ success: true, review: created.toJSON(), created: true });
  } catch (e) {
    console.error('upsertMyReview error:', e?.message);
    console.error(e?.stack);
    return res.status(500).json({ success: false, message: 'Lỗi gửi đánh giá' });
  }
};
