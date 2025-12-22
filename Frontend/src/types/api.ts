export type BrandDTO = { brand_id: number; name: string; slug?: string; logo_url?: string };
export type CategoryDTO = { category_id: number; name: string; slug?: string; image?: string };
import type { BackendProduct } from "./backend";


export type ProductsResponse = {
  success: boolean;
  products: BackendProduct[];
};

export type ProductResponse = {
  success: boolean;
  product: BackendProduct;
};

export type ApiSuccess<T> = { success: true; message?: string; data: T; meta?: any };
export type ApiError = { success: false; message: string; errors?: any };
