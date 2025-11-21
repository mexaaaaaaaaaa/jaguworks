import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const ContactPage = () => {
  return (
    <>
      <SEO 
        title="Contact Jagmohan - Hire Full Stack Developer | Gaming Expert"
        description="Get in touch with Jagmohan for Minecraft server development, Discord automation, Telegram bots, or full stack web development projects. Available for freelance work."
        keywords="contact jagmohan, hire developer, minecraft developer for hire, discord bot developer, freelance developer, gaming server expert"
      />
      <div className="min-h-screen bg-background text-foreground">
        <Contact />
        <Footer />
      </div>
    </>
  );
};

export default ContactPage;
