import Hero from "@/components/Hero";
import StatsCounter from "@/components/StatsCounter";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import BackToTop from "@/components/BackToTop";

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground">
        <Hero />
        <StatsCounter />
        <Testimonials />
        <Footer />
        <BackToTop />
      </div>
    </PageTransition>
  );
};

export default Index;
