import { useEffect, useRef, useState } from "react";
import { Trophy, Users, Code, Rocket, Star, Zap, Award, CheckCircle2 } from "lucide-react";

const Achievements = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

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

  const progressAchievements = [
    {
      title: "Road to 10M Followers",
      current: 5000000,
      target: 10000000,
      icon: Users,
      color: "from-pink-500 to-purple-500",
    },
    {
      title: "Websites Built",
      current: 15,
      target: 100,
      icon: Zap,
      color: "from-cyan-500 to-blue-500",
    },
    {
      title: "Discord Communities",
      current: 8,
      target: 20,
      icon: Award,
      color: "from-green-500 to-cyan-500",
    },
  ];

  return (
    <section 
      ref={sectionRef}
      id="achievements" 
      className="py-20 px-4 relative overflow-hidden bg-card/20"
    >
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

        {/* Main Achievements */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <div 
                key={index}
                className={`group relative bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary transition-all duration-300 animated-border hover-lift ${
                  isVisible ? `animate-scale-in stagger-${index + 1}` : 'opacity-0'
                }`}
              >
                {/* Verified Badge */}
                <div className="absolute top-4 right-4">
                  <CheckCircle2 className="w-5 h-5 text-primary animate-pulse" />
                </div>

                <div className={`w-16 h-16 bg-gradient-to-br ${achievement.color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 mx-auto animate-pulse-glow relative`}>
                  <Icon className="w-8 h-8 text-white" />
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
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

        {/* Progress Achievements */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8 gradient-text">
            In Progress
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {progressAchievements.map((achievement, index) => {
              const Icon = achievement.icon;
              const progress = (achievement.current / achievement.target) * 100;
              
              return (
                <div
                  key={index}
                  className={`bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-secondary transition-all duration-300 hover-lift ${
                    isVisible ? `animate-fade-in-up stagger-${index + 4}` : 'opacity-0'
                  }`}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${achievement.color} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h4 className="font-bold text-foreground mb-3">
                    {achievement.title}
                  </h4>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {achievement.current.toLocaleString()}
                      </span>
                      <span className="text-primary font-bold">
                        {Math.round(progress)}%
                      </span>
                    </div>

                    <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${achievement.color} transition-all duration-1000 ease-out relative`}
                        style={{ 
                          width: isVisible ? `${progress}%` : '0%'
                        }}
                      >
                        <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground text-right">
                      Goal: {achievement.target.toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Achievements;
