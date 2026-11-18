import Navbar from "@/components/navbar";
import LoadingScreen from "@/components/loading-screen";
import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";
import StoreSection from "@/components/store-section";
import HowToBuy from "@/components/how-to-buy";
import ScreenshotCarousel from "@/components/screenshot-carousel";
import SiteFooter from "@/components/site-footer";
import ReviewsSection from "@/components/reviews-section";
import StaffSection from "@/components/staff-section";

export default function Page() {
  return (
    <>
      <LoadingScreen />
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <StoreSection />
        <HowToBuy />
        <ScreenshotCarousel />
        <ReviewsSection />
        <StaffSection />
      </main>
      <SiteFooter />
    </>
  );
}
