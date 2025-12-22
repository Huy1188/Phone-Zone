import type { Product } from "@/types/product";

// normalize để search tiếng Việt “có dấu / không dấu” đều ra
export function normalizeText(input: string) {
  return input
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // bỏ dấu
}

export function searchProducts(products: Product[], keyword: string) {
  const q = normalizeText(keyword);
  if (!q) return [];

  return products.filter((p) => {
    const name = normalizeText(p.name || "");
    const sku = normalizeText(p.sku || "");
    // bạn có thể thêm brand/category nếu có
    return name.includes(q) || sku.includes(q);
  });
}
