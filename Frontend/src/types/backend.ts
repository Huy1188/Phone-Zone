export type BackendVariant = {
    variant_id: number;
    sku: string;
    color: string;
    ram: string;
    storage: string;
    price: string;
    stock: number;
    image: string;
};

export type BackendProduct = {
    product_id: number;
    name: string;
    slug: string;
    // image: string | null;
    description: string;
    specifications: string;
    min_price: string | number; // ✅ cho chắc
    discount?: number | string;
    promotion?: string | null;

    image: string | null;

    category?: {
        category_id: number; // ✅
        name: string;
        slug: string;
        image: string;
    };

    brand?: {
        id: number;
        name: string;
        slug: string;
        logo_url?: string | null;
        origin?: string | null;
    };

    variants?: BackendVariant[];
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
