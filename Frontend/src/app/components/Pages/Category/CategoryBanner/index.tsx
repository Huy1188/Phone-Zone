"use client";

import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./CategoryBanner.module.scss";
import Link from "next/link";

const cx = classNames.bind(styles);

export interface CategoryBannerItem {
  url: string;
}

interface CategoryBannerProps {
  items: CategoryBannerItem[];
}

function CategoryBanner({ items }: CategoryBannerProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!items || items.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [items]);

  return (
    <div className={cx("wrapper")}>
      {/* DESKTOP: chỉ hiển thị banner active */}
      <Link href="#" className={cx("desktopOnly")}>
        <img
          src={items[index].url}
          alt={`banner-${index}`}
          className={cx("banner")}
        />
      </Link>

      {/* MOBILE: cuộn ngang */}
      <div className={cx("mobileOnly")}>
        {items.map((item, i) => (
          <Link href="#" key={i} className={cx("bannerItem")}>
            <img
              src={item.url}
              alt={`banner-${i}`}
              className={cx("banner")}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CategoryBanner;
