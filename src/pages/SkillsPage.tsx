import Skills from "@/components/Skills";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const SkillsPage = () => {
  return (
    <>
      <SEO 
        title="Skills & Expertise - Jagmohan | Full Stack Developer"
        description="Explore Jagmohan's technical skills: React, Node.js, TypeScript, Minecraft server development, Discord bot automation, Telegram bots, and full stack development expertise."
        keywords="technical skills, full stack developer, react developer, minecraft expertise, discord bots, telegram bots, nodejs, typescript"
      />
      <div className="min-h-screen bg-background text-foreground">
        <Skills />
        <Footer />
      </div>
    </>
  );
};

export default SkillsPage;
