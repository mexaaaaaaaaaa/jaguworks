import { Code2, Gamepad2, Bot, Palette, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const Skills = () => {
  const skillCategories = [
    {
      title: "Coding",
      icon: Code2,
      skills: ["HTML/CSS/JS", "React & Node.js", "Python", "TypeScript"],
      color: "from-purple-500 to-pink-500",
      progress: 90,
    },
    {
      title: "Minecraft Dev",
      icon: Gamepad2,
      skills: ["Skript", "Plugin Dev", "Essentials", "LuckPerms", "PhoenixCrates"],
      color: "from-green-500 to-cyan-500",
      progress: 95,
    },
    {
      title: "Discord Dev",
      icon: Bot,
      skills: ["Discord.js", "Embed Systems", "Auto Roles", "Bot Development"],
      color: "from-blue-500 to-purple-500",
      progress: 88,
    },
    {
      title: "Design",
      icon: Palette,
      skills: ["UI/UX", "CapCut", "Canva", "Adobe Tools"],
      color: "from-orange-500 to-red-500",
      progress: 85,
    },
    {
      title: "Business",
      icon: TrendingUp,
      skills: ["Marketing", "Social Media", "Branding", "Growth Hacking"],
      color: "from-cyan-500 to-blue-500",
      progress: 80,
    },
  ];

  const [isVisible, setIsVisible] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState<{ [key: number]: number }>({});
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          
          // Animate progress bars
          skillCategories.forEach((_, index) => {
            setTimeout(() => {
              const targetProgress = skillCategories[index].progress;
              let currentProgress = 0;
              const increment = targetProgress / 50;
              
              const interval = setInterval(() => {
                currentProgress += increment;
                if (currentProgress >= targetProgress) {
                  currentProgress = targetProgress;
                  clearInterval(interval);
                }
                setAnimatedProgress(prev => ({ ...prev, [index]: currentProgress }));
              }, 30);
            }, index * 150);
          });
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-background opacity-30"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 animate-slide-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Skills & Expertise</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div 
                key={index}
                className={`bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary transition-all duration-500 hover-lift group ${
                  isVisible ? "animate-fade-in-up opacity-100" : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{category.title}</h3>
                </div>
                
                <div className="space-y-2 mb-4">
                  {category.skills.map((skill, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-200 hover:translate-x-1"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Proficiency</span>
                    <span className="text-primary font-bold transition-all duration-300">
                      {Math.round(animatedProgress[index] || 0)}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden relative">
                    <div 
                      className={`h-full bg-gradient-to-r ${category.color} rounded-full transition-all duration-1000 ease-out hover:brightness-125 shadow-lg`}
                      style={{ 
                        width: `${animatedProgress[index] || 0}%`,
                        boxShadow: isVisible ? `0 0 20px ${category.color.includes('purple') ? 'hsl(270 85% 65% / 0.5)' : 'hsl(185 90% 50% / 0.5)'}` : 'none'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
