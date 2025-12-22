// src/services/products.ts
import { api } from "@/lib/api";
import { mapBackendProductToProduct } from "@/lib/adapters/product";
import type { ProductsResponse, ProductResponse } from "@/types/api";
import type { Product } from "@/types/product";
import { withQuery } from "@/lib/query";

export type FetchProductsParams = {
  page?: number;
  limit?: number;
  sort?: string;
  q?: string; // nếu backend hỗ trợ search
};

export async function fetchProducts(params?: FetchProductsParams): Promise<Product[]> {
  const path = withQuery("/products", params);
  const res = await api<ProductsResponse>(path, { cache: "no-store" });

  // Guard để tránh crash nếu backend trả thiếu products
  const products = Array.isArray(res.products) ? res.products : [];
  return products.map(mapBackendProductToProduct);
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  if (!slug) return null;

  const res = await api<ProductResponse>(`/products/slug/${slug}`, { cache: "no-store" });

  // Nếu API trả thiếu product → trả null thay vì map gây crash
  if (!res?.product) return null;

  return mapBackendProductToProduct(res.product);
}
