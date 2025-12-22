// src/app/components/pages/Home/home.data.ts
import type { Product } from "@/types/product";

// Định nghĩa kiểu đầu vào cho hàm tạo (bao gồm các trường legacy như image, specsString)
type ProductInput = Partial<Product> & { 
  price: number; 
  originalPrice: number; 
  image: string; 
  specsString?: string[]; 
  badge?: string;
  brand?: string;
  usage?: string;
};

const createProduct = (data: ProductInput): Product => {
  const { image, specsString, badge, ...rest } = data;

  // Tính giảm giá
  const discountRate = Math.round(((rest.originalPrice - rest.price) / rest.originalPrice) * 100);
  
  // Format specs
  const formattedSpecs = specsString?.map((spec, index) => ({
    label: ["Chip/CPU", "Màn hình/VGA", "RAM", "Bộ nhớ/SSD"][index] || "Thông số",
    value: spec
  })) || [];

  return {
    id: rest.slug || "unknown-id",
    sku: `SKU-${Math.floor(Math.random() * 10000)}`,
    rating: 5,
    reviewCount: Math.floor(Math.random() * 100) + 10,
    warranty: "12 Tháng",
    status: "available",
    description: "<p>Mô tả sản phẩm đang cập nhật...</p>",
    discountRate: discountRate,
    brand: "generic",
    usage: "general",
    
    // Spread ...rest trước
    ...rest, 

    // Gán đè các trường bắt buộc để đảm bảo không bị undefined
    slug: data.slug || "", // Fix lỗi: Nếu không có slug thì gán chuỗi rỗng
    name: data.name || "", // Fix lỗi: Nếu không có name thì gán chuỗi rỗng

    // Các trường xử lý riêng
    images: [image],
    specs: formattedSpecs,
    promotions: badge ? [badge] : [],
    badge: badge,
  };
};

export const HOT_DEAL_PRODUCTS: Product[] = [
  createProduct({
    slug: "iphone-15-pro-max-256-hot",
    name: "iPhone 15 Pro Max 256GB - Hot Deal",
    image: "/img/product/phone/iPhone/iphone-15-pro-max.png",
    price: 29990000,
    originalPrice: 34990000,
    badge: "Giảm sốc",
    specsString: ["A17 Pro", "6.7 inch", "8GB", "256GB"],
    brand: "iphone",
    usage: "phone"
  }),
  createProduct({
    slug: "samsung-galaxy-s24-ultra-hot",
    name: "Samsung Galaxy S24 Ultra 256GB",
    image: "/img/product/phone/Samsung/samsung-s24-ultra.png",
    price: 27990000,
    originalPrice: 31990000,
    badge: "Trả góp 0%",
    specsString: ["Snapdragon 8 Gen 3", "6.8 inch", "12GB", "256GB"],
    brand: "samsung",
    usage: "phone"
  }),
  createProduct({
    slug: "xiaomi-15-ultra-hot",
    name: "Xiaomi 15 Ultra 256GB",
    image: "/img/product/phone/Xiaomi/xiaomi-15-ultra.png",
    price: 19990000,
    originalPrice: 22990000,
    badge: "Hàng mới",
    specsString: ["Snapdragon 8 Gen 4", "6.73 inch", "12GB", "256GB"],
    brand: "xiaomi",
    usage: "phone"
  }),
  createProduct({
    slug: "iphone-14-pro-hot",
    name: "iPhone 14 Pro 128GB",
    image: "/img/product/phone/iPhone/iphone-14-pro.png",
    price: 22990000,
    originalPrice: 26990000,
    badge: "Giảm 4 triệu",
    specsString: ["A16 Bionic", "6.1 inch", "6GB", "128GB"],
    brand: "iphone",
    usage: "phone"
  }),
  createProduct({
    slug: "samsung-z-fold-7-hot",
    name: "Samsung Galaxy Z Fold 7",
    image: "/img/product/phone/Samsung/samsung-galaxy-z-fold-7.png",
    price: 42990000,
    originalPrice: 47990000,
    badge: "Độc quyền",
    specsString: ["Snapdragon 8 Gen 4", "7.6 inch", "12GB", "512GB"],
    brand: "samsung",
    usage: "phone"
  }),
];

export const SUGGESTED_PRODUCTS: Product[] = [
  createProduct({
    slug: "iphone-16-pro",
    name: "iPhone 16 Pro 128GB",
    image: "/img/product/phone/iPhone/iphone-16-pro.png",
    price: 29990000,
    originalPrice: 32990000,
    badge: "Gợi ý cho bạn",
    specsString: ["A18 Pro", "6.3 inch", "8GB", "128GB"],
    brand: "iphone"
  }),
  createProduct({
    slug: "iphone-14",
    name: "iPhone 14 128GB",
    image: "/img/product/phone/iPhone/iphone-14.png",
    price: 17990000,
    originalPrice: 19990000,
    specsString: ["A15 Bionic", "6.1 inch", "6GB", "128GB"],
    brand: "iphone"
  }),
  createProduct({
    slug: "xiaomi-15",
    name: "Xiaomi 15 256GB",
    image: "/img/product/phone/Xiaomi/xiaomi-15-ultra.png",
    price: 16990000,
    originalPrice: 18990000,
    specsString: ["Snapdragon 8 Gen 4", "6.36 inch", "12GB", "256GB"],
    brand: "xiaomi"
  }),
  createProduct({
    slug: "samsung-a17-5g",
    name: "Samsung Galaxy A17 5G",
    image: "/img/product/phone/Samsung/samsung-galaxy-a17-5g.png",
    price: 7990000,
    originalPrice: 8990000,
    specsString: ["Exynos 1480", "6.6 inch", "8GB", "128GB"],
    brand: "samsung"
  }),
  createProduct({
    slug: "poco-x7-pro",
    name: "Xiaomi Poco X7 Pro 5G",
    image: "/img/product/phone/Xiaomi/poco-x7-pro-5g.png",
    price: 9490000,
    originalPrice: 10490000,
    badge: "Best seller",
    specsString: ["Dimensity 8300", "6.67 inch", "12GB", "256GB"],
    brand: "xiaomi"
  }),
];

export const PC_BEST_SELLER_BY_TAB: Record<string, Product[]> = {
  "pc-i3": [
    createProduct({
      slug: "pc-gvn-i3-12100f-gtx1650-8gb-256",
      name: "PC GVN Intel i3-12100F / GTX 1650 / 8GB / 256GB",
      image: "/img/pc/pc-gvn-i3-12100f-gtx1650.png",
      price: 11990000,
      originalPrice: 13490000,
      badge: "PC văn phòng",
      specsString: ["i3-12100F", "GTX 1650", "8GB", "256GB SSD"],
      brand: "pc-gvn"
    }),
    createProduct({
      slug: "pc-gvn-i3-12100f-arc-a380-16gb-256",
      name: "PC GVN Intel i3-12100F / Arc A380 / 16GB / 256GB",
      image: "/img/pc/pc-gvn-i3-12100f-arc-a380.png",
      price: 12990000,
      originalPrice: 14490000,
      badge: "Giá rẻ",
      specsString: ["i3-12100F", "Arc A380", "16GB", "256GB SSD"],
      brand: "pc-gvn"
    }),
    createProduct({
      slug: "pc-gvn-i3-14100f-gtx1660s-16gb-512",
      name: "PC GVN Intel i3-14100F / GTX 1660 Super / 16GB / 512GB",
      image: "/img/pc/pc-gvn-i3-14100f-gtx1660s.png",
      price: 14490000,
      originalPrice: 16490000,
      badge: "Tặng quà",
      specsString: ["i3-14100F", "GTX 1660S", "16GB", "512GB SSD"],
      brand: "pc-gvn"
    }),
  ],
  // Các tab PC khác có thể thêm tương tự...
  "pc-i5": [], 
  "pc-i7": [],
  "pc-i9": [],
  "pc-r3": [],
  "pc-r5": [],
  "pc-r7": [],
  "pc-r9": [],
};

export const Phone_BEST_SELLER_BY_TAB: Record<string, Product[]> = {
  "phone-iphone": [
    createProduct({
      slug: "iphone-17",
      name: "iPhone 17 128GB",
      image: "/img/product/phone/iPhone/iphone_17.png",
      price: 23990000,
      originalPrice: 26990000,
      badge: "Trả góp 0%",
      specsString: ["A19 Bionic", "6.1 OLED", "8GB", "128GB"],
      brand: "iphone",
      usage: "choi-game"
    }),
    createProduct({
      slug: "iphone-15-pro-max",
      name: "iPhone 15 Pro Max 256GB",
      image: "/img/product/phone/iPhone/iphone-15-pro-max.png",
      price: 28990000,
      originalPrice: 34990000,
      badge: "Hot sale",
      specsString: ["A17 Pro", "6.7 OLED", "8GB", "256GB"],
      brand: "iphone",
      usage: "chup-anh-dep"
    }),
    createProduct({
      slug: "iphone-14-pro",
      name: "iPhone 14 Pro 128GB",
      image: "/img/product/phone/iPhone/iphone-14-pro.png",
      price: 23590000,
      originalPrice: 25190000,
      specsString: ["A16 Bionic", "6.1 OLED", "6GB", "128GB"],
      brand: "iphone",
      usage: "chup-anh-dep"
    }),

    // ⭐ Thêm các best seller iPhone khác
    createProduct({
      slug: "iphone-16",
      name: "iPhone 16 128GB",
      image: "/img/product/phone/iPhone/iphone-16.png",
      price: 22990000,
      originalPrice: 24990000,
      specsString: ["A18 Bionic", "6.1 inch", "8GB", "128GB"],
      brand: "iphone",
      usage: "phone"
    }),
    createProduct({
      slug: "iphone-16-pro",
      name: "iPhone 16 Pro 256GB",
      image: "/img/product/phone/iPhone/iphone-16-pro.png",
      price: 28990000,
      originalPrice: 31990000,
      specsString: ["A18 Pro", "6.1 inch 120Hz", "8GB", "256GB"],
      brand: "iphone",
      usage: "chup-anh-dep"
    }),
    createProduct({
      slug: "iphone-17-pro-max",
      name: "iPhone 17 Pro Max 512GB",
      image: "/img/product/phone/iPhone/iphone-17-pro-max.png",
      price: 37990000,
      originalPrice: 41990000,
      specsString: ["A19 Pro", "6.9 inch 120Hz", "12GB", "512GB"],
      brand: "iphone",
      usage: "chup-anh-dep"
    }),
    createProduct({
      slug: "iphone-air",
      name: "iPhone Air 256GB",
      image: "/img/product/phone/iPhone/iphone_air.png",
      price: 20990000,
      originalPrice: 22990000,
      specsString: ["Chip mạnh", "6.3 inch", "8GB", "256GB"],
      brand: "iphone",
      usage: "office"
    }),
  ],

  "phone-samsung": [
    createProduct({
      slug: "samsung-galaxy-s25-ultra",
      name: "Samsung Galaxy S25 Ultra 12GB 256GB",
      image: "/img/product/phone/Samsung/samsung-galaxy-s25-ultra.png",
      price: 32990000,
      originalPrice: 35990000,
      badge: "Trả góp 0%",
      specsString: ["Snapdragon 8 Gen 4", "6.8 QHD+ 120Hz", "12GB", "256GB"],
      brand: "samsung",
      usage: "chup-anh-dep"
    }),
    createProduct({
      slug: "samsung-galaxy-a36",
      name: "Samsung Galaxy A36 5G 8GB 128GB",
      image: "/img/product/phone/Samsung/samsung-galaxy-a36.png",
      price: 7890000,
      originalPrice: 8690000,
      specsString: ["Chip 5G", "AMOLED 120Hz", "8GB", "128GB"],
      brand: "samsung",
      usage: "phone"
    }),

    // ⭐ Thêm best seller Samsung
    createProduct({
      slug: "samsung-galaxy-s24-ultra",
      name: "Samsung Galaxy S24 Ultra 256GB",
      image: "/img/product/phone/Samsung/samsung-s24-ultra.png",
      price: 26990000,
      originalPrice: 33990000,
      specsString: ["Snapdragon 8 Gen 3", "QHD+ 120Hz", "12GB", "256GB"],
      brand: "samsung",
      usage: "choi-game"
    }),
    createProduct({
      slug: "samsung-galaxy-a17-5g",
      name: "Samsung Galaxy A17 5G",
      image: "/img/product/phone/Samsung/samsung-galaxy-a17-5g.png",
      price: 6290000,
      originalPrice: 6990000,
      specsString: ["Chip 5G", "6.6 inch 90Hz", "6GB", "128GB"],
      brand: "samsung",
      usage: "5g"
    }),
    createProduct({
      slug: "samsung-galaxy-z-flip-7",
      name: "Samsung Galaxy Z Flip7 256GB",
      image: "/img/product/phone/Samsung/samsung-galaxy-z-flip-7.png",
      price: 27990000,
      originalPrice: 30990000,
      specsString: ["Snapdragon 8 Gen 4", "Màn gập 6.8 120Hz", "12GB", "256GB"],
      brand: "samsung",
      usage: "gap"
    }),
    createProduct({
      slug: "samsung-galaxy-z-fold-7",
      name: "Samsung Galaxy Z Fold7 512GB",
      image: "/img/product/phone/Samsung/samsung-galaxy-z-fold-7.png",
      price: 42990000,
      originalPrice: 46990000,
      specsString: ["Snapdragon 8 Gen 4", "7.8 inch 120Hz", "16GB", "512GB"],
      brand: "samsung",
      usage: "gap"
    }),
  ],

  "phone-xiaomi": [
    createProduct({
      slug: "xiaomi-15-ultra",
      name: "Xiaomi 15 Ultra 12GB 256GB",
      image: "/img/product/phone/Xiaomi/xiaomi-15-ultra.png",
      price: 23990000,
      originalPrice: 25990000,
      badge: "Flagship",
      specsString: ["Snapdragon 8 Gen 4", "AMOLED 120Hz", "12GB", "256GB"],
      brand: "xiaomi",
      usage: "chup-anh-dep"
    }),

    // ⭐ Thêm best seller Xiaomi
    createProduct({
      slug: "xiaomi-14",
      name: "Xiaomi 14 12GB/256GB",
      image: "/img/product/phone/Xiaomi/xiaomi-14.png",
      price: 19990000,
      originalPrice: 22990000,
      specsString: ["Snapdragon 8 Gen 3", "LTPO OLED 120Hz", "12GB", "256GB"],
      brand: "xiaomi",
      usage: "chup-anh-dep"
    }),
    createProduct({
      slug: "poco-x7-pro-5g",
      name: "POCO X7 Pro 5G 8GB/256GB",
      image: "/img/product/phone/Xiaomi/poco-x7-pro-5g.png",
      price: 8990000,
      originalPrice: 9990000,
      specsString: ["Dimensity 8300", "AMOLED 120Hz", "8GB", "256GB"],
      brand: "xiaomi",
      usage: "choi-game"
    }),
    createProduct({
      slug: "redmi-note-14-pro-plus",
      name: "Redmi Note 14 Pro+ 12GB/256GB",
      image: "/img/product/phone/Xiaomi/redmi-note-14-pro-plus.png",
      price: 9490000,
      originalPrice: 10490000,
      specsString: ["Chip tầm trung", "AMOLED 120Hz", "12GB", "256GB"],
      brand: "xiaomi",
      usage: "chup-anh-dep"
    }),
    createProduct({
      slug: "xiaomi-redmi-14c",
      name: "Xiaomi Redmi 14C 6GB/128GB",
      image: "/img/product/phone/Xiaomi/xiaomi_redmi_14c.png",
      price: 3990000,
      originalPrice: 4490000,
      specsString: ["Chip tiết kiệm", "LCD 90Hz", "6GB", "128GB"],
      brand: "xiaomi",
      usage: "phone"
    }),
  ],
};

export const Phone_BEST_SELLER: Product[] = [
  ...Phone_BEST_SELLER_BY_TAB["phone-iphone"],
  ...(Phone_BEST_SELLER_BY_TAB["phone-samsung"] || []),
  ...(Phone_BEST_SELLER_BY_TAB["phone-xiaomi"] || []),
];
