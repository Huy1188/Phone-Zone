import { api } from "@/lib/api";

export type BackendCategory = {
  category_id: number;
  name: string;
  slug: string;
  image?: string | null;
};

export async function fetchCategories(): Promise<BackendCategory[]> {
  const res = await api<{ success: boolean; categories?: BackendCategory[] }>(
    "/categories",
    { cache: "no-store" }
  );

  return Array.isArray(res.categories) ? res.categories : [];
}
