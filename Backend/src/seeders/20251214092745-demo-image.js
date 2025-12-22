"use strict";

const imagesRaw = [
  {
    product_slug: "iphone-14",
    images: ["/img/product/phone/iPhone/iphone-14.png"],
  },
  {
    product_slug: "iphone-15-plus",
    images: ["/img/product/phone/iPhone/iphone-15-plus.png"],
  },
  {
    product_slug: "iphone-16",
    images: ["/img/product/phone/iPhone/iphone-16.png"],
  },
  {
    product_slug: "iphone-16-pro",
    images: ["/img/product/phone/iPhone/iphone-16-pro.png"],
  },
  {
    product_slug: "iphone-16-pro-max",
    images: ["/img/product/phone/iPhone/iphone-16-pro-max.png"],
  },
  {
    product_slug: "iphone-17",
    images: ["/img/product/phone/iPhone/iphone_17.png"],
  },
  {
    product_slug: "iphone-17-pro",
    images: ["/img/product/phone/iPhone/iphone-17-pro.png"],
  },
  {
    product_slug: "iphone-17-pro-max",
    images: ["/img/product/phone/iPhone/iphone-17-pro-max.png"],
  },
  {
    product_slug: "iphone-air",
    images: ["/img/product/phone/iPhone/iphone_air.png"],
  },
  {
    product_slug: "iphone-13",
    images: ["/img/product/phone/iPhone/iphone-13.png"],
  },
  {
    product_slug: "iphone-14-pro",
    images: ["/img/product/phone/iPhone/iphone-14-pro.png"],
  },
  {
    product_slug: "iphone-15-pro-max",
    images: ["/img/product/phone/iPhone/iphone-15-pro-max.png"],
  },

  {
    product_slug: "samsung-galaxy-a17-5g",
    images: ["/img/product/phone/Samsung/samsung-galaxy-a17-5g.png"],
  },
  {
    product_slug: "samsung-galaxy-a26",
    images: ["/img/product/phone/Samsung/samsung-galaxy-a26.png"],
  },
  {
    product_slug: "samsung-galaxy-a36",
    images: ["/img/product/phone/Samsung/samsung-galaxy-a36.png"],
  },
  {
    product_slug: "samsung-galaxy-a56",
    images: ["/img/product/phone/Samsung/samsung-galaxy-a56.png"],
  },
  {
    product_slug: "samsung-galaxy-m55",
    images: ["/img/product/phone/Samsung/samsung-galaxy-m55.png"],
  },
  {
    product_slug: "samsung-galaxy-s24-fe",
    images: ["/img/product/phone/Samsung/samsung-galaxy-s24-fe.png"],
  },
  {
    product_slug: "samsung-galaxy-s25",
    images: ["/img/product/phone/Samsung/samsung-galaxy-s25.png"],
  },
  {
    product_slug: "samsung-galaxy-s25-ultra",
    images: ["/img/product/phone/Samsung/samsung-galaxy-s25-ultra.png"],
  },
  {
    product_slug: "samsung-galaxy-z-flip-6",
    images: ["/img/product/phone/Samsung/samsung-galaxy-z-flip-6.png"],
  },
  {
    product_slug: "samsung-galaxy-z-flip-7",
    images: ["/img/product/phone/Samsung/samsung-galaxy-z-flip-7.png"],
  },
  {
    product_slug: "samsung-galaxy-z-fold-7",
    images: ["/img/product/phone/Samsung/samsung-galaxy-z-fold-7.png"],
  },
  {
    product_slug: "samsung-galaxy-a55",
    images: ["/img/product/phone/Samsung/samsung-galaxy-a36.png"],
  },
  {
    product_slug: "samsung-s24-ultra",
    images: ["/img/product/phone/Samsung/samsung-s24-ultra.png"],
  },

  {
    product_slug: "xiaomi-15",
    images: ["/img/product/phone/Xiaomi/dien-thoai-xiaomi-15.png"],
  },
  {
    product_slug: "xiaomi-13-pro",
    images: ["/img/product/phone/Xiaomi/xiaomi-13-pro.png"],
  },
  {
    product_slug: "xiaomi-15-ultra",
    images: ["/img/product/phone/Xiaomi/xiaomi-15-ultra.png"],
  },
  {
    product_slug: "poco-x7-pro-5g",
    images: ["/img/product/phone/Xiaomi/poco-x7-pro-5g.png"],
  },
  {
    product_slug: "xiaomi-poco-x7-5g",
    images: ["/img/product/phone/Xiaomi/xiaomi-poco-x7-5g.png"],
  },
  {
    product_slug: "xiaomi-redmi-note-12",
    images: ["/img/product/phone/Xiaomi/xiaomi-redmi-note-12.png"],
  },
  {
    product_slug: "redmi-note-14-pro-plus",
    images: ["/img/product/phone/Xiaomi/redmi-note-14-pro-plus.png"],
  },
  {
    product_slug: "xiaomi-redmi-note-14-5g",
    images: ["/img/product/phone/Xiaomi/xiaomi-redmi-note-14-5g.png"],
  },
  {
    product_slug: "xiaomi-redmi-note-14",
    images: ["/img/product/phone/Xiaomi/xiaomi-redmi-note-14.png"],
  },
  {
    product_slug: "xiaomi-14t-pro",
    images: ["/img/product/phone/Xiaomi/xiaomi_14t_pro.png"],
  },
  {
    product_slug: "xiaomi-redmi-13-pro-5g",
    images: ["/img/product/phone/Xiaomi/xiaomi_redmi_13_pro_5g.png"],
  },
  {
    product_slug: "xiaomi-redmi-14c",
    images: ["/img/product/phone/Xiaomi/xiaomi_redmi_14c.png"],
  },
  {
    product_slug: "xiaomi-14",
    images: ["/img/product/phone/Xiaomi/xiaomi-14.png"],
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    for (const item of imagesRaw) {
      const productId = await queryInterface.rawSelect(
        "Products",
        { where: { slug: item.product_slug } },
        ["product_id"]
      );
      if (productId) {
        // Xóa ảnh cũ
        await queryInterface.bulkDelete("ProductImages", {
          product_id: productId,
        });
        const imageRecords = item.images.map((imgUrl, index) => ({
          product_id: productId,
          image_url: imgUrl,
          is_thumbnail: index === 0,
          created_at: new Date(),
          updated_at: new Date(),
        }));
        await queryInterface.bulkInsert("ProductImages", imageRecords);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("ProductImages", null, {});
  },
};
