"use client";

import { useEffect, useRef } from "react";
import classNames from "classnames/bind";
import styles from "./ProductCarousel.module.scss";
import ProductCard from "@/app/components/Pages/Home/ProductCard";
import type { Product } from "@/types/product";

const cx = classNames.bind(styles);

interface Props {
  title?: string;
  products: Product[];
}

export default function ProductCarousel({ title, products }: Props) {
  const listRef = useRef<HTMLDivElement | null>(null);

  // Tạo danh sách loop: [last, ...original, first]
  const loopProducts = [
    products[products.length - 1],
    ...products,
    products[0],
  ];

  const handleScroll = (direction: "left" | "right") => {
    const container = listRef.current;
    if (!container) return;

    const item = container.children[0] as HTMLElement;
    const width = item.offsetWidth + 16;

    container.scrollBy({
      left: direction === "left" ? -width : width,
      behavior: "smooth",
    });
  };

  /** Xử lý loop vô hạn **/
  useEffect(() => {
    const container = listRef.current;
    if (!container) return;

    const handleInfinite = () => {
      const maxScroll = container.scrollWidth - container.clientWidth;

      // Nếu lướt sang cuối (đang ở clone cuối → nhảy về item thật)
      if (container.scrollLeft >= maxScroll - 5) {
        container.style.scrollBehavior = "auto";
        const firstRealItem = container.children[1] as HTMLElement;
        container.scrollLeft = firstRealItem.offsetLeft;
        container.style.scrollBehavior = "smooth";
      }

      // Nếu lướt sang đầu (đang ở clone đầu → nhảy về item thật cuối)
      if (container.scrollLeft <= 5) {
        container.style.scrollBehavior = "auto";
        const lastRealItem = container.children[products.length] as HTMLElement;
        container.scrollLeft = lastRealItem.offsetLeft;
        container.style.scrollBehavior = "smooth";
      }
    };

    container.addEventListener("scroll", handleInfinite);
    return () => container.removeEventListener("scroll", handleInfinite);
  }, [products]);

  /** Sau khi mount → nhảy về item đầu tiên thật */
  useEffect(() => {
    const container = listRef.current;
    if (!container) return;

    const firstRealItem = container.children[1] as HTMLElement;
    container.scrollLeft = firstRealItem.offsetLeft;
  }, []);

  return (
    <div className={cx("wrapper")}>
      {title && <h2 className={cx("header")}>{title}</h2>}

      <button
        className={cx("arrow", "left")}
        onClick={() => handleScroll("left")}
      >
        ‹
      </button>

      <div className={cx("list")} ref={listRef}>
        {loopProducts.map((product, idx) => (
          <div key={idx} className={cx("item")}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <button
        className={cx("arrow", "right")}
        onClick={() => handleScroll("right")}
      >
        ›
      </button>
    </div>
  );
}
