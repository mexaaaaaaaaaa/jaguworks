import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const FeaturedProjects = () => {
  return (
    <>
      <SEO 
        title="Featured Projects - Jagmohan | Minecraft Servers & Discord Bots"
        description="Explore Jagmohan's portfolio of Minecraft servers, Discord automation projects, Telegram bots, and full stack web applications. Professional gaming and development solutions."
        keywords="minecraft server projects, discord bot portfolio, telegram bot projects, gaming server showcase, developer portfolio, web development projects"
      />
      <div className="min-h-screen bg-background text-foreground">
        <Projects />
        <Footer />
      </div>
    </>
  );
};

export default FeaturedProjects;
