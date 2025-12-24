export type BrandDTO = { brand_id: number; name: string; slug?: string; logo_url?: string };
export type CategoryDTO = { category_id: number; name: string; slug?: string; image?: string };
import type { BackendProduct } from "./backend";

export type ProductsMeta = {
  total: number;
  page: number;
  limit: number;
};

export type ProductsResponse = {
  success: boolean;
  products: BackendProduct[];
  meta?: ProductsMeta;
  facets?: {
    brands?: BrandDTO[];
    price_ranges?: Record<string, number>;
    specs?: Record<string, string[]>;
  };
  message?: string;
};

export type ProductResponse = {
  success: boolean;
  product: BackendProduct;
};

export type BrandsResponse = {
  success: boolean;
  brands: Array<{
    brand_id: number;
    name: string;
    slug: string;
    logo_url?: string | null;
    origin?: string | null;
  }>;
};


export type ApiSuccess<T> = { success: true; message?: string; data: T; meta?: any };
export type ApiError = { success: false; message: string; errors?: any };
