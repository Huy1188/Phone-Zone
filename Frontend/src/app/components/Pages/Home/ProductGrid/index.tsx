// src/app/components/pages/Home/ProductGrid/index.tsx
import classNames from "classnames/bind";
import styles from "./ProductGrid.module.scss";
import type { Product } from "@/types/product";
import ProductCard from "../ProductCard";

const cx = classNames.bind(styles);

interface Props {
  products: Product[];
}

function ProductGrid({ products }: Props) {
  return (
    <div className={cx("grid-list")}>
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;
