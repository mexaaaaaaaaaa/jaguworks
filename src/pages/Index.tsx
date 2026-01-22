import Hero from "@/components/Hero";
import StatsCounter from "@/components/StatsCounter";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import BackToTop from "@/components/BackToTop";
import SEO from "@/components/SEO";
import DynamicSectionsRenderer from "@/components/DynamicSectionsRenderer";
import { AdSlot, PopupAd, StickyMobileAd, AdBlockerMessage } from "@/components/ads";

const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Jagmohan",
    "jobTitle": "Full Stack Developer & Gaming Expert",
    "description": "Professional Minecraft server developer, Discord automation specialist, and AI bot creator",
    "url": "https://jaguworks.online",
    "image": "https://i.postimg.cc/7YVhHKSt/IMG-20251108-205333.jpg",
    "sameAs": [
      "https://www.youtube.com/@D4dirtyGaming",
      "https://www.instagram.com/dkd_jagmohan_?igsh=aWJlejgyOWNvd3Fo",
      "https://discord.gg/6CdCgjsVua",
      "https://github.com/theghoxt69-creator/FIRECRAFTX"
    ]
  };

  return (
    <PageTransition>
      <SEO 
        title="Jagmohan - Full Stack Developer | Minecraft & Discord Expert"
        description="Professional Minecraft server developer, Discord automation specialist, Telegram bot creator, and Full Stack Developer. Building innovative gaming solutions and digital experiences."
        keywords="jagmohan, full stack developer, minecraft server developer, discord bot developer, telegram bots, gaming server expert, discord automation, AI bots"
        structuredData={structuredData}
      />
      <div className="min-h-screen bg-background text-foreground">
        <Hero />
        {/* Ad slot after hero */}
        <AdSlot placement="between-sections" page="home" className="container mx-auto" />
        <DynamicSectionsRenderer page="home" />
        {/* Ad slot before stats */}
        <AdSlot placement="between-sections" page="home" className="container mx-auto" />
        <StatsCounter />
        <Testimonials />
        {/* Ad slot before footer */}
        <AdSlot placement="footer" page="home" className="container mx-auto" />
        <Footer />
        <BackToTop />
        {/* Popup ad (shows once per session after 15 seconds) */}
        <PopupAd delay={15} page="home" />
        {/* Mobile sticky ad */}
        <StickyMobileAd page="home" />
        {/* Ad blocker detection message */}
        <AdBlockerMessage />
      </div>
    </PageTransition>
  );
};

export default Index;
