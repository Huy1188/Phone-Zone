import type { Product } from "@/types/product";

export const PC_BEST_SELLER_TABS = [
  { key: "pc-i3", label: "PC I3" },
  { key: "pc-i5", label: "PC I5" },
  { key: "pc-i7", label: "PC I7" },
  { key: "pc-i9", label: "PC I9" },
  { key: "pc-r3", label: "PC R3" },
  { key: "pc-r5", label: "PC R5" },
  { key: "pc-r7", label: "PC R7" },
  { key: "pc-r9", label: "PC R9" },
];

// mỗi tab 1 mảng sản phẩm (ở đây demo dùng chung)
export const PC_BEST_SELLER_BY_TAB: Record<string, Product[]> = {
  "pc-i3": [],
  "pc-i5": [],
  "pc-i7": [],
  "pc-i9": [],
  "pc-r3": [],
  "pc-r5": [],
  "pc-r7": [],
  "pc-r9": [],
};


