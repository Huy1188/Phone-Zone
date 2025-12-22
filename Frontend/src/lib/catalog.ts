import type { Product } from "@/types/product";

// ✅ Bạn sửa lại đúng tên export từ data của bạn:
import { PHONE_CATEGORY_PRODUCTS as PHONE_PRODUCTS } from "@/app/data/phoneCategoryData";
// import { CATEGORY_PRODUCTS as LAPTOP_PRODUCTS } from "@/app/data/laptopCategoryData";

export const ALL_PRODUCTS: Product[] = [
  ...(PHONE_PRODUCTS as any),
//   ...(LAPTOP_PRODUCTS as any),
];
