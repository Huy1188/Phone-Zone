import type { Product } from "@/types/product";


export function normalizeText(input: string) {
  return input
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); 
}

export function searchProducts(products: Product[], keyword: string) {
  const q = normalizeText(keyword);
  if (!q) return [];

  return products.filter((p) => {
    const name = normalizeText(p.name || "");
    const sku = normalizeText(p.sku || "");
    
    return name.includes(q) || sku.includes(q);
  });
}
