"use client";

import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./PcBestSellerSection.module.scss";

import Section, { TabItem } from "@/app/components/Common/Section";
import ProductCard from "../ProductCard";
import { PC_BEST_SELLER_BY_TAB } from "@/app/components/Pages/Home/home.data";
import type { Product } from "@/types/product";

const cx = classNames.bind(styles);

const TABS: TabItem[] = [
  { key: "pc-i3", label: "PC I3" },
  { key: "pc-i5", label: "PC I5" },
  { key: "pc-i7", label: "PC I7" },
  { key: "pc-i9", label: "PC I9" },
  { key: "pc-r3", label: "PC R3" },
  { key: "pc-r5", label: "PC R5" },
  { key: "pc-r7", label: "PC R7" },
  { key: "pc-r9", label: "PC R9" },
];

export default function PcBestSellerSection() {
  const [activeKey, setActiveKey] = useState<string>("pc-i5");
  const products = PC_BEST_SELLER_BY_TAB[activeKey] ?? [];

  return (
    <Section
      id="pc-best-seller"
      title="PC bán chạy"
      badgeText="Trả góp 0%"
      tabs={TABS}
      activeKey={activeKey}
      onTabChange={setActiveKey}
      viewAllHref="/products?category=pc-gvn"
      scrollable
      itemsPerView={5}
    >
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </Section>
  );
}