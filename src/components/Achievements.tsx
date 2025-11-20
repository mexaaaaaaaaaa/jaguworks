import { Trophy, Users, Code, Rocket, Star, Zap } from "lucide-react";

const Achievements = () => {
  const achievements = [
    {
      icon: Code,
      title: "10+ Minecraft Servers",
      description: "Built custom game modes and experiences",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Rocket,
      title: "5+ Discord Bots",
      description: "Advanced automation and moderation systems",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: Trophy,
      title: "15+ Websites",
      description: "Professional responsive web applications",
      color: "from-blue-500 to-purple-500",
    },
    {
      icon: Users,
      title: "5M+ Community",
      description: "Instagram following and engagement",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Star,
      title: "DARKMC Founder",
      description: "Leading gaming network and community",
      color: "from-green-500 to-cyan-500",
    },
    {
      icon: Zap,
      title: "AI Bot Pioneer",
      description: "First AI bot with referral system",
      color: "from-pink-500 to-purple-500",
    },
  ];

  return (
    <section id="achievements" className="py-20 px-4 relative overflow-hidden bg-card/20">
      <div className="absolute inset-0 grid-background opacity-20"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 animate-slide-in-up">
          <div className="inline-block mb-4">
            <span className="text-sm font-mono text-primary tracking-widest uppercase">Milestones</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-display">
            <span className="gradient-text">Achievements</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary via-accent to-secondary mx-auto rounded-full mb-4"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto font-mono text-sm">
            Building a legacy, one project at a time
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <div 
                key={index}
                className={`group relative bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary transition-all duration-300 animated-border hover-lift animate-scale-in opacity-0 stagger-${index + 1}`}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${achievement.color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 mx-auto animate-pulse-glow`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-center mb-2 text-foreground group-hover:text-primary transition-colors group-hover:scale-105 transform duration-300">
                  {achievement.title}
                </h3>
                
                <p className="text-muted-foreground text-sm text-center group-hover:text-foreground transition-colors duration-300">
                  {achievement.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
