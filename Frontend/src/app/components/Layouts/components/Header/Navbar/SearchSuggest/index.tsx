"use client";

import classNames from "classnames/bind";
import styles from "./SearchSuggest.module.scss";
import Link from "next/link";
import { searchProducts } from "@/lib/search";
import { ALL_PRODUCTS } from "@/lib/catalog";

const cx = classNames.bind(styles);

interface Props {
  open: boolean;
  keyword: string;       // debounced
  rawKeyword: string;    // giá trị đang gõ
  onSelect?: () => void;
}


export default function SearchSuggest({
  open,
  keyword,
  rawKeyword,
  onSelect,
}: Props) {
  if (!open || !rawKeyword.trim()) return null;

  // Nếu user đang gõ nhưng debounce chưa xong
  if (!keyword.trim()) {
    return (
      <div className={cx("suggest")}>
        <div className={cx("loading")}>Đang tìm kiếm...</div>
      </div>
    );
  }

  const results = searchProducts(ALL_PRODUCTS, keyword).slice(0, 6);

  if (results.length === 0) {
    return (
      <div className={cx("suggest")}>
        <div className={cx("empty")}>Không tìm thấy sản phẩm</div>
      </div>
    );
  }

  return (
    <div className={cx("suggest")}>
      {results.map((item) => (
        <Link
          key={item.id}
          href={`/product/${item.slug}`}
          className={cx("item")}
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect?.();
          }}
        >
          <img src={item.images[0]} alt={item.name} />
          <span>{item.name}</span>
        </Link>
      ))}

      <Link
        href={`/search?keyword=${encodeURIComponent(rawKeyword)}`}
        className={cx("viewAll")}
        onMouseDown={(e) => {
          e.preventDefault();
          onSelect?.();
        }}
      >
        Xem tất cả kết quả →
      </Link>
    </div>
  );
}

