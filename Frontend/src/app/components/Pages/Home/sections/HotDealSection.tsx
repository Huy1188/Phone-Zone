// src/app/components/pages/Home/sections/PcBestSellerSection.tsx
"use client";

import { useState } from "react";
import Section from "@/app/components/Common/Section";
import ProductGrid from "../ProductGrid";
import {
  PC_BEST_SELLER_TABS,
  PC_BEST_SELLER_BY_TAB,
} from "../home.pc-data";

function HotDealSection() {
  const [activeKey, setActiveKey] = useState<string>("pc-i5");

  const products = PC_BEST_SELLER_BY_TAB[activeKey] ?? [];

  return (
    <Section
      id="pc-best-seller"
      title="PC bán chạy"
      badgeText="Trả góp 0%"
      tabs={PC_BEST_SELLER_TABS}
      activeKey={activeKey}
      onTabChange={setActiveKey}
      viewAllHref="/products?category=pc-gvn"
    >
      <ProductGrid products={products} />
    </Section>
  );
}

export default HotDealSection;
