import db from "../models/index";

const getUserId = (req, res) => {
  const userId = req.session?.user?.user_id;
  if (!userId) {
    res.status(401).json({ success: false, message: "Not logged in" });
    return null;
  }
  return userId;
};

// GET /users/me/addresses
export const listMyAddresses = async (req, res) => {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const addresses = await db.Address.findAll({
      where: { user_id: userId },
      order: [["is_default", "DESC"], ["updated_at", "DESC"]],
    });

    return res.json({ success: true, addresses });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /users/me/addresses
export const createMyAddress = async (req, res) => {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const { recipient_name, recipient_phone, street, city, is_default } = req.body;

    if (!recipient_name || !recipient_phone || !street || !city) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin địa chỉ" });
    }

    await db.sequelize.transaction(async (t) => {
      if (is_default) {
        await db.Address.update(
          { is_default: false },
          { where: { user_id: userId }, transaction: t }
        );
      }

      await db.Address.create(
        {
          user_id: userId,
          recipient_name,
          recipient_phone,
          street,
          city,
          is_default: !!is_default,
        },
        { transaction: t }
      );

      // Nếu user chưa có default nào -> set default cho địa chỉ mới
      const hasDefault = await db.Address.findOne({
        where: { user_id: userId, is_default: true },
        transaction: t,
      });

      if (!hasDefault) {
        const latest = await db.Address.findOne({
          where: { user_id: userId },
          order: [["address_id", "DESC"]],
          transaction: t,
        });
        if (latest) await latest.update({ is_default: true }, { transaction: t });
      }
    });

    const addresses = await db.Address.findAll({
      where: { user_id: userId },
      order: [["is_default", "DESC"], ["updated_at", "DESC"]],
    });

    return res.json({ success: true, addresses });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /users/me/addresses/:id
export const updateMyAddress = async (req, res) => {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const id = Number(req.params.id);
    const { recipient_name, recipient_phone, street, city, is_default } = req.body;

    const addr = await db.Address.findOne({ where: { address_id: id, user_id: userId } });
    if (!addr) return res.status(404).json({ success: false, message: "Address not found" });

    await db.sequelize.transaction(async (t) => {
      if (is_default) {
        await db.Address.update(
          { is_default: false },
          { where: { user_id: userId }, transaction: t }
        );
      }

      await addr.update(
        {
          recipient_name: recipient_name ?? addr.recipient_name,
          recipient_phone: recipient_phone ?? addr.recipient_phone,
          street: street ?? addr.street,
          city: city ?? addr.city,
          is_default: is_default !== undefined ? !!is_default : addr.is_default,
        },
        { transaction: t }
      );
    });

    const addresses = await db.Address.findAll({
      where: { user_id: userId },
      order: [["is_default", "DESC"], ["updated_at", "DESC"]],
    });

    return res.json({ success: true, addresses });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /users/me/addresses/:id
export const deleteMyAddress = async (req, res) => {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const id = Number(req.params.id);

    const addr = await db.Address.findOne({ where: { address_id: id, user_id: userId } });
    if (!addr) return res.status(404).json({ success: false, message: "Address not found" });

    const wasDefault = !!addr.is_default;
    await addr.destroy();

    // Nếu xóa default -> set default cho địa chỉ mới nhất còn lại
    if (wasDefault) {
      const latest = await db.Address.findOne({
        where: { user_id: userId },
        order: [["updated_at", "DESC"]],
      });
      if (latest) await latest.update({ is_default: true });
    }

    const addresses = await db.Address.findAll({
      where: { user_id: userId },
      order: [["is_default", "DESC"], ["updated_at", "DESC"]],
    });

    return res.json({ success: true, addresses });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PATCH /users/me/addresses/:id/default
export const setDefaultMyAddress = async (req, res) => {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const id = Number(req.params.id);
    const addr = await db.Address.findOne({ where: { address_id: id, user_id: userId } });
    if (!addr) return res.status(404).json({ success: false, message: "Address not found" });

    await db.sequelize.transaction(async (t) => {
      await db.Address.update(
        { is_default: false },
        { where: { user_id: userId }, transaction: t }
      );
      await addr.update({ is_default: true }, { transaction: t });
    });

    const addresses = await db.Address.findAll({
      where: { user_id: userId },
      order: [["is_default", "DESC"], ["updated_at", "DESC"]],
    });

    return res.json({ success: true, addresses });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /users/me/addresses/default  (checkout autofill)
export const getMyDefaultAddress = async (req, res) => {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const address = await db.Address.findOne({
      where: { user_id: userId, is_default: true },
      order: [["updated_at", "DESC"]],
    });

    return res.json({ success: true, address: address || null });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
