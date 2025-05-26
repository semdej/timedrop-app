import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { CallToAction } from "@/components/CallToAction";
import { Footer } from "@/components/Footer";
import { FestivalsPreview } from "@/components/FestivalsPreview";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <FestivalsPreview />
      <Features />
      <HowItWorks />
      <CallToAction />
      <Footer />
    </>
  );
}
