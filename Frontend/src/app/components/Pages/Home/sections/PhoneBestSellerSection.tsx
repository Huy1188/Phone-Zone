"use client";

import { useEffect, useMemo, useState } from "react";
import Section, { TabItem } from "@/app/components/Common/Section";
import ProductCard from "../ProductCard";
import type { Product } from "@/types/product";

export default function PhoneBestSellerSection({ products }: { products: Product[] }) {
  const [activeKey, setActiveKey] = useState<string>("");

  const phoneProducts = useMemo(() => {
    return products.filter((p) => {
      const u = (p.usage || "").toLowerCase();
      return u.includes("điện thoại") || u.includes("dien thoai") || u.includes("phone");
    });
  }, [products]);

  const tabs: TabItem[] = useMemo(() => {
    const brands = Array.from(
      new Set(phoneProducts.map((p) => (p.brand || "").trim()).filter(Boolean))
    );
    // nếu muốn giữ thứ tự backend thì bỏ sort
    brands.sort((a, b) => a.localeCompare(b));
    return brands.map((b) => ({ key: b, label: b }));
  }, [phoneProducts]);

  useEffect(() => {
    if (!activeKey && tabs.length > 0) setActiveKey(tabs[0].key);
    if (activeKey && tabs.length > 0 && !tabs.some((t) => t.key === activeKey)) {
      setActiveKey(tabs[0].key);
    }
  }, [tabs, activeKey]);

  const filteredProducts = useMemo(() => {
    if (!activeKey) return phoneProducts;
    return phoneProducts.filter((p) => (p.brand || "").trim() === activeKey);
  }, [phoneProducts, activeKey]);

  return (
    <Section
      id="phone-best-seller"
      title="Điện thoại bán chạy"
      badgeText="Giao hàng toàn quốc"
      tabs={tabs}
      activeKey={activeKey}
      onTabChange={setActiveKey}
      viewAllHref="/products?category=phone-gvn"
      scrollable
      itemsPerView={5}
    >
      {filteredProducts.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </Section>
  );
}
