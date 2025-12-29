"use client";

import { useEffect, useMemo, useState } from "react";
import Section, { TabItem } from "@/app/components/Common/Section";
import ProductCard from "../ProductCard";
import type { Product } from "@/types/product";
import { fetchBrands } from "@/services/brands";
import { fetchProductsPaged } from "@/services/products";

export default function LaptopBestSellerSection() {
  const [brands, setBrands] = useState<Array<{ name: string; slug: string }>>([]);
  const [activeBrandSlug, setActiveBrandSlug] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const bs = await fetchBrands({ category_slug: "laptop" });
      if (cancelled) return;

      const list = bs.map((b) => ({ name: b.name, slug: b.slug }));
      setBrands(list);

      if (!activeBrandSlug && list.length > 0) setActiveBrandSlug(list[0].slug);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  
  useEffect(() => {
    if (!activeBrandSlug) return;

    let cancelled = false;
    setLoading(true);

    (async () => {
      const { products } = await fetchProductsPaged({
        category_slug: "laptop",
        brand_slug: activeBrandSlug,
        sort: "hot",     
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
      title="Laptop bán chạy"
      badgeText="Giao hàng toàn quốc"
      tabs={tabs}
      activeKey={activeBrandSlug}
      onTabChange={setActiveBrandSlug}
      viewAllHref={`/category/laptop`} 
      scrollable
      itemsPerView={5}
    >
      {loading ? null : products.map((p) => <ProductCard key={p.slug} product={p} />)}
    </Section>
  );
}
