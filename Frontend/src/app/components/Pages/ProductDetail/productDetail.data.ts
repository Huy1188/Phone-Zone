import { Product } from '@/types/product';
import { PHONE_CATEGORY_PRODUCTS } from "@/app/data/phoneCategoryData";

// src/app/components/Pages/ProductDetail/productDetail.data.ts

export const RELATED_PRODUCTS: Product[] = PHONE_CATEGORY_PRODUCTS.slice(0, 5);


export const MOCK_PRODUCT: Product = {
  id: 'ip17-pm-256',
  slug: 'iphone-17-pro-max',
  sku: 'IP17PM-256GB-VN',
  name: 'iPhone 17 Pro Max 256GB | Chính hãng VN/A',
  price: 34990000,       // Giá khoảng 35tr
  originalPrice: 37990000, // Giá gốc
  discountRate: 8,
  rating: 5,
  reviewCount: 128,
  images: [
    // Bạn có thể thay bằng link ảnh thật hoặc để ảnh placeholder này để test
    '/img/product/phone/iPhone/iphone-15-plus.png',
    '/img/product/phone/iPhone/iphone-15-pro-max.png',
    '/img/product/phone/iPhone/iphone-13.png',
  ],
  specs: [
    { label: 'Màn hình', value: '6.9 inch Super Retina XDR (120Hz)' },
    { label: 'Chip xử lý', value: 'Apple A19 Pro (2nm)' },
    { label: 'RAM', value: '12GB' },
    { label: 'Dung lượng', value: '256GB' },
    { label: 'Camera sau', value: '48MP + 48MP + 48MP (Zoom 10x)' },
    { label: 'Camera trước', value: '24MP Autofocus' },
    { label: 'Pin', value: '4850 mAh, Sạc nhanh 45W' },
    { label: 'SIM', value: '1 Nano SIM & 1 eSIM' },
  ],
  promotions: [
    'Giảm thêm 2.000.000đ khi thanh toán qua thẻ tín dụng',
    'Thu cũ đổi mới: Trợ giá lên đến 4.000.000đ',
    'Tặng gói iCloud+ 50GB miễn phí 3 tháng',
    'Giảm 20% khi mua kèm ốp lưng chính hãng',
  ],
  warranty: '12 Tháng Chính Hãng Apple Việt Nam',
  status: 'available',
  description: `
    <p><strong>iPhone 17 Pro Max</strong> - Kiệt tác công nghệ mới nhất với khung viền Titanium siêu bền và nút Action Button thế hệ mới.</p>
    <p>Sức mạnh từ chip <strong>Apple A19 Pro</strong> mang lại hiệu năng xử lý AI vượt trội, hỗ trợ các tính năng Apple Intelligence độc quyền.</p>
    <p>Hệ thống camera Pro được nâng cấp mạnh mẽ với khả năng quay video Spatial 8K, sẵn sàng cho kỷ nguyên thực tế ảo.</p>
  `,
};