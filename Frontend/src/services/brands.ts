import { api } from "@/lib/api";
import { withQuery } from "@/lib/query";
import type { BrandsResponse } from "@/types/api";

export async function fetchBrands(params?: { category_slug?: string }) {
  const path = withQuery("/brands", params);
  const res = await api<BrandsResponse>(path, { cache: "no-store" });
  return Array.isArray(res.brands) ? res.brands : [];
}
