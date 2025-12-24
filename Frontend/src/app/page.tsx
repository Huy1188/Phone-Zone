// src/app/page.tsx
import HeroBanner from "./components/Pages/Home/HeroSection";
import PhoneBestSellerSection from "./components/Pages/Home/sections/PhoneBestSellerSection";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <PhoneBestSellerSection />
    </>
  );
}
