"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Danh sách Role cần thêm
    const rolesData = [
      { role_id: 1, name: "Admin", description: "Quản trị viên toàn quyền" },
      { role_id: 2, name: "User", description: "Khách hàng / Người dùng" },
    ];

    for (const role of rolesData) {
      // 1. Kiểm tra xem Role ID này đã có trong DB chưa
      const exist = await queryInterface.rawSelect(
        "Roles",
        {
          where: { role_id: role.role_id },
        },
        ["role_id"]
      );

      // 2. Nếu chưa có thì mới thêm vào
      if (!exist) {
        await queryInterface.bulkInsert("Roles", [
          {
            role_id: role.role_id,
            name: role.name,
            description: role.description,
            // Nếu model Role của bạn có timestamps: true thì bỏ comment 2 dòng dưới
            // created_at: new Date(),
            // updated_at: new Date()
          },
        ]);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    // Khi undo thì xóa hết
    await queryInterface.bulkDelete("Roles", null, {});
  },
};
