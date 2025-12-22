// src/app/data/phoneCategoryData.ts
import type { CategoryProduct } from "@/app/components/Pages/Category";
import { CategorySubListItem } from "../components/Pages/Category/CategorySubList";

// Banner dùng cho category (ảnh trong public/img/banner/product)
export interface CategoryBanner {
  id: string;
  image: string;
  href: string;
}

export const CATEGORY_BANNERS: CategoryBanner[] = [
  {
    id: "banner-asus",
    image: "/img/banner/product/banner-asus.png",
    href: "/category/laptop",
  },
  {
    id: "banner-iphone",
    image: "/img/banner/product/banner-iphone.png",
    href: "/category/phone",
  },
  {
    id: "banner-right-apple-watch",
    image: "/img/banner/product/banner-right-apple-watch.png",
    href: "/category/apple-watch",
  },
  {
    id: "banner-right-sale",
    image: "/img/banner/product/banner-right-sale.png",
    href: "/khuyen-mai",
  },
  {
    id: "banner-right-samsung",
    image: "/img/banner/product/banner-right-samsung.png",
    href: "/category/phone-samsung",
  },
  {
    id: "banner-samsung",
    image: "/img/banner/product/banner-samsung.png",
    href: "/category/phone-samsung",
  },
  {
    id: "banner-xiaomi",
    image: "/img/banner/product/banner-xiaomi.png",
    href: "/category/phone-xiaomi",
  },
];

// DATA SẢN PHẨM: dùng toàn bộ ảnh trong public/img/product/phone/...
// Chỉ lấy 5 mẫu mỗi hãng cho gọn (iPhone, Samsung, Xiaomi)

export const PHONE_CATEGORY_PRODUCTS: CategoryProduct[] = [
  // iPhone
  {
    slug: "iphone-13",
    name: "iPhone 13",
    image: "/img/product/phone/iPhone/iphone-13.png",
    price: "15.090.000₫",
    originalPrice: "16.590.000₫",
    badge: "Trả góp 0%",
    brand: "iphone",
    priceRange: "15-20",
    usage: "phone",
    priceValue: 15000000,
  },
  {
    slug: "iphone-14-pro",
    name: "iPhone 14 Pro",
    image: "/img/product/phone/iPhone/iphone-14-pro.png",
    price: "16.590.000₫",
    originalPrice: "18.190.000₫",
    badge: "Trả góp 0%",
    brand: "iphone",
    priceRange: "15-20",
    usage: "phone",
    priceValue: 16500000,
  },
  {
    slug: "iphone-14",
    name: "iPhone 14",
    image: "/img/product/phone/iPhone/iphone-14.png",
    price: "18.090.000₫",
    originalPrice: "19.890.000₫",
    badge: "Trả góp 0%",
    brand: "iphone",
    priceRange: "15-20",
    usage: "phone",
    priceValue: 18000000,
  },
  {
    slug: "iphone-15-plus",
    name: "iPhone 15 Plus",
    image: "/img/product/phone/iPhone/iphone-15-plus.png",
    price: "19.590.000₫",
    originalPrice: "21.490.000₫",
    badge: "Trả góp 0%",
    brand: "iphone",
    priceRange: "15-20",
    usage: "phone",
    priceValue: 19500000,
  },
  {
    slug: "iphone-15-pro-max",
    name: "iPhone 15 Pro Max",
    image: "/img/product/phone/iPhone/iphone-15-pro-max.png",
    price: "21.090.000₫",
    originalPrice: "23.190.000₫",
    badge: "Trả góp 0%",
    brand: "iphone",
    priceRange: "tren-20",
    usage: "phone",
    priceValue: 21000000,
  },

  // Samsung
  {
    slug: "samsung-galaxy-a17-5g",
    name: "Samsung Galaxy A17 5G",
    image: "/img/product/phone/Samsung/samsung-galaxy-a17-5g.png",
    price: "12.090.000₫",
    originalPrice: "13.290.000₫",
    badge: "Trả góp 0%",
    brand: "samsung",
    priceRange: "duoi-15",
    usage: "phone",
    priceValue: 12000000,
  },
  {
    slug: "samsung-galaxy-a26",
    name: "Samsung Galaxy A26",
    image: "/img/product/phone/Samsung/samsung-galaxy-a26.png",
    price: "13.590.000₫",
    originalPrice: "14.890.000₫",
    badge: "Trả góp 0%",
    brand: "samsung",
    priceRange: "duoi-15",
    usage: "phone",
    priceValue: 13500000,
  },
  {
    slug: "samsung-galaxy-a36",
    name: "Samsung Galaxy A36",
    image: "/img/product/phone/Samsung/samsung-galaxy-a36.png",
    price: "15.090.000₫",
    originalPrice: "16.590.000₫",
    badge: "Trả góp 0%",
    brand: "samsung",
    priceRange: "15-20",
    usage: "phone",
    priceValue: 15000000,
  },
  {
    slug: "samsung-galaxy-a56",
    name: "Samsung Galaxy A56",
    image: "/img/product/phone/Samsung/samsung-galaxy-a56.png",
    price: "16.590.000₫",
    originalPrice: "18.190.000₫",
    badge: "Trả góp 0%",
    brand: "samsung",
    priceRange: "15-20",
    usage: "phone",
    priceValue: 16500000,
  },
  {
    slug: "samsung-galaxy-m55",
    name: "Samsung Galaxy M55",
    image: "/img/product/phone/Samsung/samsung-galaxy-m55.png",
    price: "18.090.000₫",
    originalPrice: "19.890.000₫",
    badge: "Trả góp 0%",
    brand: "samsung",
    priceRange: "15-20",
    usage: "phone",
    priceValue: 18000000,
  },

  // Xiaomi
  {
    slug: "dien-thoai-xiaomi-15",
    name: "Xiaomi 15",
    image: "/img/product/phone/Xiaomi/dien-thoai-xiaomi-15.png",
    price: "9.090.000₫",
    originalPrice: "9.990.000₫",
    badge: "Trả góp 0%",
    brand: "xiaomi",
    priceRange: "duoi-15",
    usage: "phone",
    priceValue: 9000000,
  },
  {
    slug: "poco-x7-pro-5g",
    name: "Xiaomi Poco X7 Pro 5G",
    image: "/img/product/phone/Xiaomi/poco-x7-pro-5g.png",
    price: "10.590.000₫",
    originalPrice: "11.590.000₫",
    badge: "Trả góp 0%",
    brand: "xiaomi",
    priceRange: "duoi-15",
    usage: "phone",
    priceValue: 10500000,
  },
  {
    slug: "redmi-note-14-pro-plus",
    name: "Xiaomi Redmi Note 14 Pro Plus",
    image: "/img/product/phone/Xiaomi/redmi-note-14-pro-plus.png",
    price: "12.090.000₫",
    originalPrice: "13.290.000₫",
    badge: "Trả góp 0%",
    brand: "xiaomi",
    priceRange: "duoi-15",
    usage: "phone",
    priceValue: 12000000,
  },
  {
    slug: "xiaomi-13-pro",
    name: "Xiaomi 13 Pro",
    image: "/img/product/phone/Xiaomi/xiaomi-13-pro.png",
    price: "13.590.000₫",
    originalPrice: "14.890.000₫",
    badge: "Trả góp 0%",
    brand: "xiaomi",
    priceRange: "duoi-15",
    usage: "phone",
    priceValue: 13500000,
  },
  {
    slug: "xiaomi-14",
    name: "Xiaomi 14",
    image: "/img/product/phone/Xiaomi/xiaomi-14.png",
    price: "15.090.000₫",
    originalPrice: "16.590.000₫",
    badge: "Trả góp 0%",
    brand: "xiaomi",
    priceRange: "15-20",
    usage: "phone",
    priceValue: 15000000,
  },
];

export const LAPTOP_LOGO: CategorySubListItem[] = [
    {
        label: 'MACBOOK',
        value: 'macbook',
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:50/q:30/plain/https://cellphones.com.vn/media/wysiwyg/Icon/brand_logo/macbook.png',
    },
    {
        label: 'ASUS',
        value: 'asus',
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:50/q:30/plain/https://cellphones.com.vn/media/wysiwyg/Icon/brand_logo/Asus.png',
    },
    {
        label: 'HP',
        value: 'hp',
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:50/q:30/plain/https://cellphones.com.vn/media/wysiwyg/Icon/brand_logo/HP.png',
    },
    {
        label: 'Dell',
        value: 'dell',
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:50/q:30/plain/https://cellphones.com.vn/media/wysiwyg/Icon/brand_logo/Dell.png',
    },
    {
        label: 'MSI',
        value: 'msi',
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:50/q:30/plain/https://cellphones.com.vn/media/wysiwyg/Icon/brand_logo/MSI.png',
    },
]

const PHONE_USAGE: CategorySubListItem[] = [
    {
        label: 'Mỏng nhẹ',
        value: 'mong-nhe',
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:150:0/q:70/plain/https://cellphones.com.vn/media/wysiwyg/image_6__1.png',
    },
    {
        label: 'Văn phòng',
        value: 'van-phong',
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:150:0/q:70/plain/https://cellphones.com.vn/media/wysiwyg/Group_846.png',
    },
    {
        label: 'Gaming',
        value: 'gaming',
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:150:0/q:70/plain/https://cellphones.com.vn/media/wysiwyg/Group_848_2.png',
    },
];