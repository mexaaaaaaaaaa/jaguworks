import { Code2, Gamepad2, Bot, Palette, TrendingUp } from "lucide-react";

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

  return (
    <section id="skills" className="py-20 px-4 relative overflow-hidden">
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
                className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary transition-all duration-300 animated-border"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{category.title}</h3>
                </div>
                
                <div className="space-y-2 mb-4">
                  {category.skills.map((skill, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Proficiency</span>
                    <span className="text-primary font-bold">{category.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${category.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${category.progress}%` }}
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
