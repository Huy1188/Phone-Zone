"use client";

import { useEffect, useMemo, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Sortbar.module.scss";

const cx = classNames.bind(styles);

const sortOptions = [
  { label: "Phổ biến", value: "popular", icon: "fa-regular fa-star" },
  { label: "Khuyến mãi HOT", value: "hot-discount", icon: "fa-solid fa-fire" },
  { label: "Giá thấp → cao", value: "price-asc", icon: "fa-solid fa-arrow-up-short-wide" },
  { label: "Giá cao → thấp", value: "price-desc", icon: "fa-solid fa-arrow-down-wide-short" },
] as const;

export type SortValue = (typeof sortOptions)[number]["value"];

// ✅ Lấy giá hiện tại (tuỳ data bạn có field nào)
function getCurrentPrice(p: any) {
  return Number(p?.salePrice ?? p?.finalPrice ?? p?.price ?? p?.regularPrice ?? 0) || 0;
}

// ✅ Lấy giá gốc
function getOriginalPrice(p: any) {
  return Number(p?.originalPrice ?? p?.oldPrice ?? p?.regularPrice ?? 0) || 0;
}

// ✅ % giảm giá
function getDiscountPercent(p: any) {
  const cur = getCurrentPrice(p);
  const ori = getOriginalPrice(p);
  if (!ori || ori <= cur) return 0;
  return (ori - cur) / ori;
}

export default function Sortbar({
  items,
  onSorted,
  defaultSort = "popular",
}: {
  items: any[];
  onSorted: (sorted: any[]) => void;
  defaultSort?: SortValue;
}) {
  const [sortBy, setSortBy] = useState<SortValue>(defaultSort);

  const sorted = useMemo(() => {
    const arr = [...items];

    switch (sortBy) {
      case "price-asc":
        return arr.sort((a, b) => getCurrentPrice(a) - getCurrentPrice(b));
      case "price-desc":
        return arr.sort((a, b) => getCurrentPrice(b) - getCurrentPrice(a));
      case "hot-discount":
        return arr.sort((a, b) => getDiscountPercent(b) - getDiscountPercent(a));
      case "popular":
      default:
        return arr; // giữ nguyên thứ tự data
    }
  }, [items, sortBy]);

  // đẩy kết quả sort ra ngoài để SearchPage paginate
  useEffect(() => {
    onSorted(sorted);
  }, [sorted, onSorted]);

  return (
    <div className={cx("sort")}>
      <span className={cx("label")}>Sắp xếp theo</span>

      <div className={cx("select")}>
        {sortOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={cx("item", { "item-active": opt.value === sortBy })}
            onClick={() => setSortBy(opt.value)}
          >
            <i className={opt.icon} />
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
