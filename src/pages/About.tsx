import About from "@/components/About";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const AboutPage = () => {
  return (
    <>
      <SEO 
        title="About Jagmohan - Full Stack Developer & Gaming Expert"
        description="Learn about Jagmohan's journey as a Full Stack Developer specializing in Minecraft servers, Discord automation, and Telegram bots. Building innovative gaming solutions."
        keywords="about jagmohan, developer story, minecraft developer, discord specialist, full stack developer portfolio"
      />
      <div className="min-h-screen bg-background text-foreground">
        <About />
        <Footer />
      </div>
    </>
  );
};

export default AboutPage;
