import type { Product } from "@/types/product";
import ProductGrid from "@/app/components/Pages/Home/ProductGrid"; 

export default function SearchResultList({ products }: { products: Product[] }) {
  return <ProductGrid products={products} />;
}
