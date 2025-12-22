"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const categories = [
      {
        name: "Điện thoại",
        slug: "dien-thoai",
        image: "/img/category/phone.png",
      },
      { name: "Laptop", slug: "laptop", image: "/img/category/laptop.png" },
      {
        name: "Phụ kiện",
        slug: "phu-kien",
        image: "/img/category/accessory.png",
      },
    ];

    for (const cat of categories) {
      const exist = await queryInterface.rawSelect(
        "Categories",
        { where: { slug: cat.slug } },
        ["category_id"]
      );
      if (!exist) {
        await queryInterface.bulkInsert("Categories", [
          {
            ...cat,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ]);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
