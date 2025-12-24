"use client";

import { useEffect, useMemo, useState } from "react";
import Section, { TabItem } from "@/app/components/Common/Section";
import ProductCard from "../ProductCard";
import type { Product } from "@/types/product";
import { fetchBrands } from "@/services/brands";
import { fetchProductsPaged } from "@/services/products";

export default function PhoneBestSellerSection() {
  const [brands, setBrands] = useState<Array<{ name: string; slug: string }>>([]);
  const [activeBrandSlug, setActiveBrandSlug] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // 1) load tabs (brands) từ DB theo category phone
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const bs = await fetchBrands({ category_slug: "phone" });
      if (cancelled) return;

      const list = bs.map((b) => ({ name: b.name, slug: b.slug }));
      setBrands(list);

      if (!activeBrandSlug && list.length > 0) setActiveBrandSlug(list[0].slug);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // 2) load products theo brand tab
  useEffect(() => {
    if (!activeBrandSlug) return;

    let cancelled = false;
    setLoading(true);

    (async () => {
      const { products } = await fetchProductsPaged({
        category_slug: "phone",
        brand_slug: activeBrandSlug,
        sort: "hot",     // hoặc "popular" / "newest" tùy bạn
        page: 1,
        limit: 20,
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
  }, [activeBrandSlug]);

  const tabs: TabItem[] = useMemo(() => {
    return brands.map((b) => ({ key: b.slug, label: b.name }));
  }, [brands]);

  return (
    <Section
      id="phone-best-seller"
      title="Điện thoại bán chạy"
      badgeText="Giao hàng toàn quốc"
      tabs={tabs}
      activeKey={activeBrandSlug}
      onTabChange={setActiveBrandSlug}
      viewAllHref={`/search?category_slug=phone&brand_slug=${activeBrandSlug}`} // optional
      scrollable
      itemsPerView={5}
    >
      {loading ? null : products.map((p) => <ProductCard key={p.slug} product={p} />)}
    </Section>
  );
}
