import { Download, FileText, Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

const Resume = () => {
  const handleDownload = () => {
    toast.success("Resume download started!", {
      description: "Your download will begin shortly",
    });
    // TODO: Add actual resume PDF download link
    console.log("Download resume PDF");
  };

  const quickStats = [
    { label: "Years Experience", value: "5+" },
    { label: "Projects Completed", value: "500+" },
    { label: "Happy Clients", value: "100+" },
    { label: "Technologies", value: "20+" },
  ];

  const highlights = [
    "Full-stack developer specializing in gaming & automation",
    "Expert in Minecraft server development & Discord bots",
    "AI/ML integration with Telegram bot systems",
    "Professional cinematic video production",
    "5M+ Instagram followers across projects",
  ];

  return (
    <section className="py-20 px-4 relative overflow-hidden bg-card/20">
      <div className="absolute inset-0 grid-background opacity-20"></div>
      
      <div className="container mx-auto relative z-10 max-w-5xl">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Resume & CV</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-4"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Download my professional resume to learn more about my experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Download Card */}
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 hover:border-primary transition-all duration-300 animate-fade-in-left">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center animate-pulse-glow">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Professional Resume</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4" />
                  Updated January 2025
                </p>
              </div>
            </div>

            <Button
              onClick={handleDownload}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-all duration-300 text-white font-bold py-6 text-lg group"
            >
              <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              Download Resume (PDF)
            </Button>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="grid grid-cols-2 gap-4">
                {quickStats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Highlights Preview */}
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 hover:border-secondary transition-all duration-300 animate-fade-in-right">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-secondary" />
              Career Highlights
            </h3>

            <div className="space-y-4">
              {highlights.map((highlight, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/50 hover:border-secondary/50 transition-all duration-300 stagger-${index + 1} animate-fade-in-left`}
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-secondary to-accent rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {highlight}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-muted-foreground">Available for new projects</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                ⚡ Usually replies within 24 hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resume;
