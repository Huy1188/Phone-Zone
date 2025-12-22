// src/services/category.ts
import { api } from "@/lib/api";
import { mapBackendProductToProduct } from "@/lib/adapters/product";
import type { ProductsResponse } from "@/types/api";
import type { Product } from "@/types/product";
import { withQuery } from "@/lib/query";

export type FetchProductsByCategoryParams = {
  page?: number;
  limit?: number;
  sort?: string;
};

export async function fetchProductsByCategorySlug(
  categorySlug: string,
  params?: FetchProductsByCategoryParams
): Promise<Product[]> {
  if (!categorySlug) return [];

  const path = withQuery("/products", {
    category_slug: categorySlug,
    ...params,
  });

  const res = await api<ProductsResponse>(path, { cache: "no-store" });

  // Guard chống crash nếu backend trả thiếu products
  const backendProducts = Array.isArray(res.products) ? res.products : [];
  return backendProducts.map(mapBackendProductToProduct);
}
