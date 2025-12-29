  
  import { api } from "@/lib/api";
  import { mapBackendProductToProduct } from "@/lib/adapters/product";
  import type { ProductsResponse, ProductResponse } from "@/types/api";
  import type { Product } from "@/types/product";
  import { withQuery } from "@/lib/query";

  export type FetchProductsParams = {
    page?: number;
    limit?: number;
    sort?: string;
    q?: string;
    category_slug?: string;

    
    brand_slug?: string | string[];

    
    price_range?: string | string[]; 
    price_min?: number;
    price_max?: number;

    
    specs?: string;

    
    facets?: 0 | 1;
  };

  export type ProductsMeta = { total: number; page: number; limit: number };

  export async function fetchProductsPaged(params?: FetchProductsParams): Promise<{
    products: Product[];
    meta: ProductsMeta;
    facets?: ProductsResponse["facets"];
  }> {
    const path = withQuery("/products", params);
    const res = await api<ProductsResponse>(path, { cache: "no-store" });

    const products = Array.isArray(res.products) ? res.products : [];
    return {
      products: products.map(mapBackendProductToProduct),
      meta:
        res.meta ??
        ({
          total: products.length,
          page: params?.page ?? 1,
          limit: params?.limit ?? products.length,
        } as ProductsMeta),
      facets: res.facets,
    };
  }

  export async function fetchProducts(params?: FetchProductsParams): Promise<Product[]> {
    const path = withQuery("/products", params);
    const res = await api<ProductsResponse>(path, { cache: "no-store" });

    const products = Array.isArray(res.products) ? res.products : [];
    return products.map(mapBackendProductToProduct);
  }

  export async function fetchProductBySlug(slug: string): Promise<Product | null> {
    if (!slug) return null;

    const res = await api<ProductResponse>(`/products/slug/${slug}`, { cache: "no-store" });
    if (!res?.product) return null;

    return mapBackendProductToProduct(res.product);
  }

export async function fetchRelatedProducts(params: {
  brandSlug: string;
  excludeSlug?: string;
  limit?: number;
}): Promise<Product[]> {
  const path = withQuery("/products/related", {
    brand_slug: params.brandSlug,
    exclude_slug: params.excludeSlug,
    limit: params.limit ?? 5,
  });

  const res = await api<ProductsResponse>(path, { cache: "no-store" });

  const products = Array.isArray(res.products) ? res.products : [];
  return products.map(mapBackendProductToProduct);
}

