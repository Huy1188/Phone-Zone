import type { Product } from "@/types/product";
import ProductGrid from "@/app/components/Pages/Home/ProductGrid"; // nếu bạn đang dùng path kiểu cũ

export default function SearchResultList({ products }: { products: Product[] }) {
  return <ProductGrid products={products} />;
}
