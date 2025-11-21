import Achievements from "@/components/Achievements";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const AchievementsPage = () => {
  return (
    <>
      <SEO 
        title="Achievements & Milestones - Jagmohan Developer"
        description="View Jagmohan's achievements in Minecraft server development, Discord automation, and full stack development. 500+ projects completed, 100+ happy clients."
        keywords="developer achievements, minecraft server milestones, discord bot success, developer portfolio, project milestones"
      />
      <div className="min-h-screen bg-background text-foreground">
        <Achievements />
        <Footer />
      </div>
    </>
  );
};

export default AchievementsPage;
