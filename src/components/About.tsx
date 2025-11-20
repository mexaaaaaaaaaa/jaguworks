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
          <div className="animate-fade-in-left opacity-0">
            <div className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-8 glow-primary hover-lift">
              <p className="text-lg text-foreground/90 leading-relaxed mb-6 animate-fade-in-up opacity-0 stagger-1">
                Hey, I'm <span className="text-primary font-semibold">Jagmohan</span> — a developer who builds virtual worlds and digital experiences. From Minecraft servers to Discord systems, and from web apps to AI tools, I create everything that connects technology with creativity.
              </p>
              
              <div className="border-l-4 border-primary pl-4 bg-muted/30 p-4 rounded-r-lg animate-fade-in-up opacity-0 stagger-2 hover-glow">
                <p className="italic text-primary font-medium text-lg">
                  "Dream it. Build it. Automate it."
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="animate-fade-in-right opacity-0">
            <div className="space-y-4">
              {timeline.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={index}
                    className={`flex items-center gap-4 bg-card/50 backdrop-blur-sm border border-secondary/20 rounded-xl p-4 hover:border-secondary hover:glow-secondary transition-all duration-300 group hover-lift animate-fade-in-left opacity-0 stagger-${index + 1}`}
                  >
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center glow-primary group-hover:animate-pulse-glow group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xl font-bold text-primary group-hover:text-glow-primary transition-all duration-300">{item.year}</p>
                      <p className="text-foreground/80 group-hover:text-foreground transition-colors duration-300">{item.event}</p>
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
