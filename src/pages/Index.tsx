import { useState } from "react";
import Hero from "@/components/Hero";
import StatsCounter from "@/components/StatsCounter";
import Testimonials from "@/components/Testimonials";
import ActivityFeed from "@/components/ActivityFeed";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import LoadingScreen from "@/components/LoadingScreen";
import BackToTop from "@/components/BackToTop";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />}
      <PageTransition>
        <div className="min-h-screen bg-background text-foreground">
          <Hero />
          <StatsCounter />
          <ActivityFeed />
          <Testimonials />
          <Footer />
          <BackToTop />
        </div>
      </PageTransition>
    </>
  );
};

export default Index;
