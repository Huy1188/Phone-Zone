"use client";

import { useEffect, useState } from "react";
import HotSection from "@/app/components/Common/Section/HotSection";
import ProductCard from "../../Home/ProductCard";
import { fetchProductsPaged } from "@/services/products";
import type { Product } from "@/types/product";

export default function HotProduct({
  categorySlug,
  limit = 10,
}: {
  categorySlug: string;
  limit?: number;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const slug = (categorySlug || "").trim();
    if (!slug) {
      setProducts([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      const { products } = await fetchProductsPaged({
        category_slug: slug,
        sort: "hot",     // ✅ sort toàn DB theo is_hot
        page: 1,
        limit,
      });

      if (!cancelled) setProducts(products);
    })()
      .catch(() => {
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [categorySlug, limit]);

  // không có data thì ẩn section (hoặc bạn muốn show skeleton thì nói mình)
  if (!loading && products.length === 0) return null;

  return (
    <HotSection
      id="phone-best-seller"
      image="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:0/q:100/plain/https://cellphones.com.vn/media/catalog/product/s/a/san-pham-noi-bat-20-03-2024.gif"
      scrollable
      itemsPerView={5}
    >
      {loading
        ? Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ height: 260 }} /> // ✅ placeholder đơn giản
          ))
        : products.map((product) => <ProductCard key={product.slug} product={product} />)}
    </HotSection>
  );
}
