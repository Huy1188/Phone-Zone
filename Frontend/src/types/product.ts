export interface ProductSpec {
  label: string;
  value: string;
}

export type ProductVariant = {
  variant_id: number;
  price: number;
  image?: string;

  // ✅ thêm option
  sku?: string;
  color?: string | null;
  ram?: string | null;
  rom?: string | null;      // dùng “rom” thống nhất
  stock?: number | null;
};


export type ProductImage = {
    image_id: number;
    product_id: number;
    image_url: string;
    is_thumbnail: boolean;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountRate?: number;
  rating: number;
  reviewCount: number;
  images: string[];

  // ✅ giữ brand string để không vỡ code cũ
  brand?: string;

  // ✅ thêm để map logo hãng từ BE
  brandSlug?: string;
  brandLogo?: string | null;

  variants?: ProductVariant[];

  usage?: string;
  badge?: string;
  specs: ProductSpec[];
  promotions?: string | null;
  warranty: string;
  status: "available" | "out_of_stock";
  description: string;
}

export interface Category {
    category_id: number;
    name: string;
    slug: string;
    image: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface Brand {
    brand_id: number;
    name: string;
    slug: string;
    logo_url: string | null;
    origin: string | null;
    createdAt?: string;
    updatedAt?: string;
}
