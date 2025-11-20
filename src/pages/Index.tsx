import Hero from "@/components/Hero";
import StatsCounter from "@/components/StatsCounter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero />
      <StatsCounter />
      <Footer />
    </div>
  );
};

export default Index;
