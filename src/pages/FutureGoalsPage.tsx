import FutureGoals from "@/components/FutureGoals";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const FutureGoalsPage = () => {
  return (
    <>
      <SEO 
        title="Future Goals & Vision - Jagmohan Developer"
        description="Discover Jagmohan's future goals and vision for gaming development, AI-powered solutions, and innovative web applications."
        keywords="future goals, developer vision, gaming innovation, AI development, web development future"
      />
      <div className="min-h-screen bg-background text-foreground">
        <FutureGoals />
        <Footer />
      </div>
    </>
  );
};

export default FutureGoalsPage;
