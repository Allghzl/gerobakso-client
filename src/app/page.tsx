import TopBanner from "@/components/TopBanner";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BestSellers from "@/components/BestSellers";
import ExploreMenu from "@/components/ExploreMenu";
import About from "@/components/About";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-bright-snow-50 text-white-900 font-sans">
      <TopBanner />
      <Navbar />
      <Hero />
      <BestSellers />
      <ExploreMenu />
      <About />
      <Footer />
    </div>
  );
}