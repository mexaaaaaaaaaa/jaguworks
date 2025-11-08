import { Code2, Rocket, Sparkles, Zap } from "lucide-react";

const About = () => {
  const timeline = [
    { year: "2020", event: "Started coding", icon: Code2 },
    { year: "2022", event: "Built first Minecraft server", icon: Zap },
    { year: "2023", event: "Started Discord bot dev", icon: Sparkles },
    { year: "2024", event: "Built apps & AI bots", icon: Rocket },
    { year: "2025", event: "Launching digital empire", icon: Sparkles },
  ];

  return (
    <section id="about" className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-background opacity-30"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 animate-slide-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">About Me</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Bio */}
          <div className="animate-slide-in-left">
            <div className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-8 glow-primary">
              <p className="text-lg text-foreground/90 leading-relaxed mb-6">
                Hey, I'm <span className="text-primary font-semibold">Laduu</span> — a developer who builds virtual worlds and digital experiences. From Minecraft servers to Discord systems, and from web apps to AI tools, I create everything that connects technology with creativity.
              </p>
              
              <div className="border-l-4 border-primary pl-4 bg-muted/30 p-4 rounded-r-lg">
                <p className="italic text-primary font-medium text-lg">
                  "Dream it. Build it. Automate it."
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="animate-slide-in-right">
            <div className="space-y-4">
              {timeline.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={index}
                    className="flex items-center gap-4 bg-card/50 backdrop-blur-sm border border-secondary/20 rounded-xl p-4 hover:border-secondary hover:glow-secondary transition-all duration-300 group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center glow-primary">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xl font-bold text-primary">{item.year}</p>
                      <p className="text-foreground/80">{item.event}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
