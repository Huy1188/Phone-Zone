"use client";

import classNames from "classnames/bind";

import HotSection from "@/app/components/Common/Section/HotSection";
import ProductCard from "../../Home/ProductCard";
import { Phone_BEST_SELLER } from "@/app/components/Pages/Home/home.data";

// const cx = classNames.bind(styles);


export default function HotProduct() {
  const products = Phone_BEST_SELLER;

  return (
    <HotSection
      id="phone-best-seller"
      image="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:0/q:100/plain/https://cellphones.com.vn/media/catalog/product/s/a/san-pham-noi-bat-20-03-2024.gif"
      scrollable
      itemsPerView={5}
    >
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </HotSection>
  );
}