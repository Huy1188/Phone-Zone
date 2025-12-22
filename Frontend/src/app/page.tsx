// src/app/page.tsx
import HeroBanner from "./components/Pages/Home/HeroSection";
import PhoneBestSellerSection from "./components/Pages/Home/sections/PhoneBestSellerSection";
import { fetchProducts } from "@/services/products";

export default async function Home() {
  const products = await fetchProducts(); // Product[]

  return (
    <>
      <HeroBanner />
      
      {/* <PcBestSellerSection /> */}
      <PhoneBestSellerSection products={products}/>
    </>
  );
}
