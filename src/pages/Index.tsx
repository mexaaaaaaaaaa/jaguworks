import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Achievements from "@/components/Achievements";
import MinecraftPlans from "@/components/MinecraftPlans";
import FutureGoals from "@/components/FutureGoals";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Achievements />
      <MinecraftPlans />
      <FutureGoals />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
