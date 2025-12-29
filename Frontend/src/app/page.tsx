
import HeroBanner from "./components/Pages/Home/HeroSection";
import PhoneBestSellerSection from "./components/Pages/Home/sections/PhoneBestSellerSection";
import LaptopBestSellerSection from "./components/Pages/Home/sections/LaptopBestSellerSection";
import TabletBestSellerSection from "./components/Pages/Home/sections/TabletBestSellerSection";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <PhoneBestSellerSection />
      <LaptopBestSellerSection />
      <TabletBestSellerSection />
    </>
  );
}
