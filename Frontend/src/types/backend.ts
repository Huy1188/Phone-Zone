export type BackendVariant = {
  variant_id: number;
  sku: string;
  color?: string | null;
  ram?: string | null;

  // ✅ BE dùng rom; giữ thêm storage optional để “an toàn”
  rom?: string | null;
  storage?: string | null;

  price: string;
  stock?: number | null;
  image?: string | null;
};


export type BackendProductImage = {
  image_url: string;
  is_thumbnail?: boolean;
};


export type BackendProduct = {
  product_id: number;
  name: string;
  slug: string;
  description: string;
  specifications: string;
  min_price: string | number;
  discount?: number | string;
  promotion?: string | null;

  image: string | null;

  images?: BackendProductImage[]; // ✅ THÊM

  category?: {
    category_id: number;
    name: string;
    slug: string;
    image: string;
  };

  brand?: {
    brand_id?: number;        // ✅ đổi id -> brand_id (optional)
    name: string;
    slug: string;
    logo_url?: string | null;
    origin?: string | null;
  };

  variants?: BackendVariant[];
  is_hot?: boolean;           // ✅ nếu BE có
  is_active?: boolean;        // ✅ nếu BE có
};


export type BackendSpec = { label: string; value: string };

export type SessionCartItem = {
    variantId: number;
    productId: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
};

export type GetCartResponse = {
    cart: SessionCartItem[];
    totalMoney: number;
};

export type CreateOrderPayload = {
    payment_method: 'cod' | 'bank' | 'momo';
    name: string;
    phone: string;
    address: string;
    city: string;
    note?: string;
};

export type CreateOrderResponse = {
    success: boolean;
    order_id: number;
};

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: any;
  errors?: any;
}
