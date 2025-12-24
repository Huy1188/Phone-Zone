"use client";

import classNames from "classnames/bind";
import styles from "./Sortbar.module.scss";

const cx = classNames.bind(styles);

// UI options giữ nguyên
const sortOptions = [
  { label: "Phổ biến", value: "popular", icon: "fa-regular fa-star" },
  { label: "Khuyến mãi HOT", value: "hot-discount", icon: "fa-solid fa-fire" },
  { label: "Giá thấp → cao", value: "price-asc", icon: "fa-solid fa-arrow-up-short-wide" },
  { label: "Giá cao → thấp", value: "price-desc", icon: "fa-solid fa-arrow-down-wide-short" },
] as const;

export type SortValue = (typeof sortOptions)[number]["value"];

// ✅ map UI sort -> BE sort
export function mapUiSortToBackend(sort: SortValue): string {
  switch (sort) {
    case "price-asc":
      return "price_asc";
    case "price-desc":
      return "price_desc";
    case "hot-discount":
      return "discount_desc";
    case "popular":
    default:
      // nếu bạn muốn "Phổ biến" = newest thì để newest
      // hoặc nếu có logic popularity thật thì đổi sau
      return "newest";
  }
}

// ✅ map BE sort -> UI sort (để active đúng khi load từ URL)
export function mapBackendSortToUi(sort: string): SortValue {
  switch (sort) {
    case "price_asc":
      return "price-asc";
    case "price_desc":
      return "price-desc";
    case "discount_desc":
      return "hot-discount";
    case "newest":
    default:
      return "popular";
  }
}

export default function Sortbar({
  value,
  onChange,
}: {
  value: string; // sortKey đang dùng ở SearchPage (BE sort)
  onChange: (sort: string) => void; // trả ra BE sort
}) {
  const activeUi = mapBackendSortToUi(value);

  return (
    <div className={cx("sort")}>
      <span className={cx("label")}>Sắp xếp theo</span>

      <div className={cx("select")}>
        {sortOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={cx("item", { "item-active": opt.value === activeUi })}
            onClick={() => onChange(mapUiSortToBackend(opt.value))}
          >
            <i className={opt.icon} />
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
