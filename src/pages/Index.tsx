import { Navbar } from "@/components/amp/Navbar";
import { Hero } from "@/components/amp/Hero";
import { Features } from "@/components/amp/Features";
import { Stats } from "@/components/amp/Stats";
import { HowItWorks } from "@/components/amp/HowItWorks";
import { Portfolio } from "@/components/amp/Portfolio";
import { Testimonials } from "@/components/amp/Testimonials";
import { CTA } from "@/components/amp/CTA";
import { Footer } from "@/components/amp/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <Stats />
      <HowItWorks />
      <Portfolio />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
};

export default Index;
