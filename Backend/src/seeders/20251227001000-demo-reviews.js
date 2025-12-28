"use strict";

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    // Tạo 2 user demo nếu chưa có
    const users = [
      { username: "user1", email: "user1@test.com", password: "123", role_id: 2, is_active: true, created_at: now, updated_at: now },
      { username: "user2", email: "user2@test.com", password: "123", role_id: 2, is_active: true, created_at: now, updated_at: now },
    ];

    // NOTE: password của hệ bạn đang bcrypt ở register.
    // Seeder này chỉ để test UI nhanh -> nếu muốn login thật, tạo user qua API /auth/register.
    // Ở đây mình chỉ seed review bằng user_id có sẵn.

    const productId = await queryInterface.rawSelect(
      "Products",
      { where: { slug: "iphone-14" } },
      ["product_id"]
    );

    if (!productId) throw new Error('Không tìm thấy product slug="iphone-14"');

    // Lấy 2 user_id bất kỳ đang có
    const anyUsers = await queryInterface.sequelize.query(
      "SELECT user_id FROM Users ORDER BY user_id ASC LIMIT 2",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    if (anyUsers.length < 2) throw new Error("Cần ít nhất 2 user trong bảng Users.");

    await queryInterface.bulkDelete("Reviews", { product_id: productId });

    await queryInterface.bulkInsert("Reviews", [
      {
        user_id: anyUsers[0].user_id,
        product_id: productId,
        rating: 5,
        comment: "Sản phẩm rất tốt, pin ổn!",
        created_at: now,
        updated_at: now,
      },
      {
        user_id: anyUsers[1].user_id,
        product_id: productId,
        rating: 4,
        comment: "Máy đẹp, giá hợp lý.",
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    const productId = await queryInterface.rawSelect(
      "Products",
      { where: { slug: "iphone-14" } },
      ["product_id"]
    );
    if (productId) await queryInterface.bulkDelete("Reviews", { product_id: productId });
  },
};
