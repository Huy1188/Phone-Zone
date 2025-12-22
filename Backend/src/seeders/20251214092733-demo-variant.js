"use strict";

const variantsRaw = [
  // iPhone
  {
    product_slug: "iphone-14",
    sku: "IP14-128-VN",
    price: 17990000,
    ram: "6GB",
    rom: "128GB",
    image: "/img/product/phone/iPhone/iphone-14.png",
  },
  {
    product_slug: "iphone-15-plus",
    sku: "IP15P-128-VN",
    price: 21990000,
    ram: "6GB",
    rom: "128GB",
    image: "/img/product/phone/iPhone/iphone-15-plus.png",
  },
  {
    product_slug: "iphone-16",
    sku: "IP16-128-VN",
    price: 22990000,
    ram: "8GB",
    rom: "128GB",
    image: "/img/product/phone/iPhone/iphone-16.png",
  },
  {
    product_slug: "iphone-16-pro",
    sku: "IP16P-256-VN",
    price: 28990000,
    ram: "8GB",
    rom: "256GB",
    image: "/img/product/phone/iPhone/iphone-16-pro.png",
  },
  {
    product_slug: "iphone-16-pro-max",
    sku: "IP16PM-256-VN",
    price: 32990000,
    ram: "8GB",
    rom: "256GB",
    image: "/img/product/phone/iPhone/iphone-16-pro-max.png",
  },
  {
    product_slug: "iphone-17",
    sku: "IP17-128-VN",
    price: 23990000,
    ram: "8GB",
    rom: "128GB",
    image: "/img/product/phone/iPhone/iphone_17.png",
  },
  {
    product_slug: "iphone-17-pro",
    sku: "IP17P-256-VN",
    price: 30990000,
    ram: "8GB",
    rom: "256GB",
    image: "/img/product/phone/iPhone/iphone-17-pro.png",
  },
  {
    product_slug: "iphone-17-pro-max",
    sku: "IP17PM-512-VN",
    price: 37990000,
    ram: "12GB",
    rom: "512GB",
    image: "/img/product/phone/iPhone/iphone-17-pro-max.png",
  },
  {
    product_slug: "iphone-air",
    sku: "IPAIR-256-VN",
    price: 20990000,
    ram: "8GB",
    rom: "256GB",
    image: "/img/product/phone/iPhone/iphone_air.png",
  },
  {
    product_slug: "iphone-13",
    sku: "IP13-128-VN",
    price: 15090000,
    ram: "4GB",
    rom: "128GB",
    image: "/img/product/phone/iPhone/iphone-13.png",
  },
  {
    product_slug: "iphone-14-pro",
    sku: "IP14P-128-VN",
    price: 23590000,
    ram: "6GB",
    rom: "128GB",
    image: "/img/product/phone/iPhone/iphone-14-pro.png",
  },
  {
    product_slug: "iphone-15-pro-max",
    sku: "IP15PM-256-VN",
    price: 28990000,
    ram: "8GB",
    rom: "256GB",
    image: "/img/product/phone/iPhone/iphone-15-pro-max.png",
  },

  // Samsung
  {
    product_slug: "samsung-galaxy-a17-5g",
    sku: "SSA17-5G",
    price: 6290000,
    ram: "6GB",
    rom: "128GB",
    image: "/img/product/phone/Samsung/samsung-galaxy-a17-5g.png",
  },
  {
    product_slug: "samsung-galaxy-a26",
    sku: "SSA26-4G",
    price: 5690000,
    ram: "4GB",
    rom: "128GB",
    image: "/img/product/phone/Samsung/samsung-galaxy-a26.png",
  },
  {
    product_slug: "samsung-galaxy-a36",
    sku: "SSA36-5G",
    price: 7890000,
    ram: "8GB",
    rom: "128GB",
    image: "/img/product/phone/Samsung/samsung-galaxy-a36.png",
  },
  {
    product_slug: "samsung-galaxy-a56",
    sku: "SSA56-5G",
    price: 9390000,
    ram: "8GB",
    rom: "256GB",
    image: "/img/product/phone/Samsung/samsung-galaxy-a56.png",
  },
  {
    product_slug: "samsung-galaxy-m55",
    sku: "SSM55-5G",
    price: 8490000,
    ram: "8GB",
    rom: "256GB",
    image: "/img/product/phone/Samsung/samsung-galaxy-m55.png",
  },
  {
    product_slug: "samsung-galaxy-s24-fe",
    sku: "SSS24FE-256",
    price: 18990000,
    ram: "8GB",
    rom: "256GB",
    image: "/img/product/phone/Samsung/samsung-galaxy-s24-fe.png",
  },
  {
    product_slug: "samsung-galaxy-s25",
    sku: "SSS25-256",
    price: 21990000,
    ram: "12GB",
    rom: "256GB",
    image: "/img/product/phone/Samsung/samsung-galaxy-s25.png",
  },
  {
    product_slug: "samsung-galaxy-s25-ultra",
    sku: "SSS25U-512",
    price: 32990000,
    ram: "16GB",
    rom: "512GB",
    image: "/img/product/phone/Samsung/samsung-galaxy-s25-ultra.png",
  },
  {
    product_slug: "samsung-galaxy-z-flip-6",
    sku: "SSZFLIP6-256",
    price: 25990000,
    ram: "8GB",
    rom: "256GB",
    image: "/img/product/phone/Samsung/samsung-galaxy-z-flip-6.png",
  },
  {
    product_slug: "samsung-galaxy-z-flip-7",
    sku: "SSZFLIP7-256",
    price: 27990000,
    ram: "12GB",
    rom: "256GB",
    image: "/img/product/phone/Samsung/samsung-galaxy-z-flip-7.png",
  },
  {
    product_slug: "samsung-galaxy-z-fold-7",
    sku: "SSZFOLD7-512",
    price: 42990000,
    ram: "16GB",
    rom: "512GB",
    image: "/img/product/phone/Samsung/samsung-galaxy-z-fold-7.png",
  },
  {
    product_slug: "samsung-galaxy-a55",
    sku: "SSA55-5G",
    price: 9690000,
    ram: "8GB",
    rom: "128GB",
    image: "/img/product/phone/Samsung/samsung-galaxy-a36.png",
  },
  {
    product_slug: "samsung-s24-ultra",
    sku: "SSS24U-256-V2",
    price: 26990000,
    ram: "12GB",
    rom: "256GB",
    image: "/img/product/phone/Samsung/samsung-s24-ultra.png",
  },

  // Xiaomi
  {
    product_slug: "xiaomi-15",
    sku: "MI15-256",
    price: 15990000,
    ram: "12GB",
    rom: "256GB",
    image: "/img/product/phone/Xiaomi/dien-thoai-xiaomi-15.png",
  },
  {
    product_slug: "xiaomi-13-pro",
    sku: "MI13PRO-256",
    price: 18990000,
    ram: "12GB",
    rom: "256GB",
    image: "/img/product/phone/Xiaomi/xiaomi-13-pro.png",
  },
  {
    product_slug: "xiaomi-15-ultra",
    sku: "MI15U-512",
    price: 23990000,
    ram: "16GB",
    rom: "512GB",
    image: "/img/product/phone/Xiaomi/xiaomi-15-ultra.png",
  },
  {
    product_slug: "poco-x7-pro-5g",
    sku: "POCOX7PRO-256",
    price: 8990000,
    ram: "8GB",
    rom: "256GB",
    image: "/img/product/phone/Xiaomi/poco-x7-pro-5g.png",
  },
  {
    product_slug: "xiaomi-poco-x7-5g",
    sku: "POCOX7-128",
    price: 7690000,
    ram: "8GB",
    rom: "128GB",
    image: "/img/product/phone/Xiaomi/xiaomi-poco-x7-5g.png",
  },
  {
    product_slug: "xiaomi-redmi-note-12",
    sku: "MIRN12-128",
    price: 5290000,
    ram: "8GB",
    rom: "128GB",
    image: "/img/product/phone/Xiaomi/xiaomi-redmi-note-12.png",
  },
  {
    product_slug: "redmi-note-14-pro-plus",
    sku: "MIRN14PP-256",
    price: 9490000,
    ram: "12GB",
    rom: "256GB",
    image: "/img/product/phone/Xiaomi/redmi-note-14-pro-plus.png",
  },
  {
    product_slug: "xiaomi-redmi-note-14-5g",
    sku: "MIRN14-5G",
    price: 6490000,
    ram: "8GB",
    rom: "128GB",
    image: "/img/product/phone/Xiaomi/xiaomi-redmi-note-14-5g.png",
  },
  {
    product_slug: "xiaomi-redmi-note-14",
    sku: "MIRN14-4G",
    price: 5990000,
    ram: "6GB",
    rom: "128GB",
    image: "/img/product/phone/Xiaomi/xiaomi-redmi-note-14.png",
  },
  {
    product_slug: "xiaomi-14t-pro",
    sku: "MI14TPRO-256",
    price: 16990000,
    ram: "12GB",
    rom: "256GB",
    image: "/img/product/phone/Xiaomi/xiaomi_14t_pro.png",
  },
  {
    product_slug: "xiaomi-redmi-13-pro-5g",
    sku: "MIR13PRO-5G",
    price: 7290000,
    ram: "8GB",
    rom: "256GB",
    image: "/img/product/phone/Xiaomi/xiaomi_redmi_13_pro_5g.png",
  },
  {
    product_slug: "xiaomi-redmi-14c",
    sku: "MIR14C-128",
    price: 3990000,
    ram: "6GB",
    rom: "128GB",
    image: "/img/product/phone/Xiaomi/xiaomi_redmi_14c.png",
  },
  {
    product_slug: "xiaomi-14",
    sku: "MI14-256",
    price: 19990000,
    ram: "12GB",
    rom: "256GB",
    image: "/img/product/phone/Xiaomi/xiaomi-14.png",
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    for (const item of variantsRaw) {
      // Logic: Tìm ID Product bằng Slug -> Rồi mới Insert
      const productId = await queryInterface.rawSelect(
        "Products",
        { where: { slug: item.product_slug } },
        ["product_id"]
      );
      if (productId) {
        const exist = await queryInterface.rawSelect(
          "ProductVariants",
          { where: { sku: item.sku } },
          ["variant_id"]
        );
        if (!exist) {
          await queryInterface.bulkInsert("ProductVariants", [
            {
              product_id: productId,
              sku: item.sku,
              color: "Tiêu chuẩn",
              ram: item.ram,
              rom: item.rom,
              price: item.price,
              stock: 50, // Mặc định 50 cái mỗi mẫu
              image: item.image,
              created_at: new Date(),
              updated_at: new Date(),
            },
          ]);
        }
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("ProductVariants", null, {});
  },
};
