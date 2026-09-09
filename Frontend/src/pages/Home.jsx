import Hero from "../components/sections/Hero";
import StatsBar from "../components/sections/StatsBar";
import AppScreenshotSection from "../components/sections/AppScreenshotSection";
import AboutSection from "../components/sections/AboutSection";
import ServicesSection from "../components/sections/ServicesSection";
import ServiceSearchSection from "../components/sections/ServiceSearchSection";
import SmartMatchingSection from "../components/sections/SmartMatchingSection";
import HowItWorksSection from "../components/sections/HowItWorksSection";
import OfflineFirstSection from "../components/sections/OfflineFirstSection";
import ImpactSection from "../components/sections/ImpactSection";
import TestimonialsSection from "../components/sections/TestimonialsSection";
import FinalCTA from "../components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <StatsBar />
      <AppScreenshotSection />
      <AboutSection />
      <ServicesSection />
      <ServiceSearchSection />
      <SmartMatchingSection />
      <HowItWorksSection />
      <OfflineFirstSection />
      <ImpactSection />
      <TestimonialsSection />
      <FinalCTA />
    </>
  );
}
