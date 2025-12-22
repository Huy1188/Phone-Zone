"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const brands = [
      { name: "Apple", slug: "apple", origin: "USA" },
      { name: "Samsung", slug: "samsung", origin: "Korea" },
      { name: "Xiaomi", slug: "xiaomi", origin: "China" },
    ];

    for (const brand of brands) {
      const exist = await queryInterface.rawSelect(
        "Brands",
        { where: { slug: brand.slug } },
        ["brand_id"]
      );
      if (!exist) {
        await queryInterface.bulkInsert("Brands", [
          {
            ...brand,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ]);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Brands", null, {});
  },
};
