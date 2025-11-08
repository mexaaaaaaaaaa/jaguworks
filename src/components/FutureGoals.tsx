import { Rocket, Lightbulb, TrendingUp, Globe } from "lucide-react";

const FutureGoals = () => {
  const goals = [
    {
      year: "2025",
      title: "Next-Gen Ecosystem",
      description: "Launch advanced Minecraft & Discord ecosystem with AI integration",
      icon: Rocket,
      color: "from-purple-500 to-pink-500",
    },
    {
      year: "2026",
      title: "Tech Startup",
      description: "Build tech startup focused on AI tools and automation",
      icon: Lightbulb,
      color: "from-cyan-500 to-blue-500",
    },
    {
      year: "2027",
      title: "SaaS Platform",
      description: "Release futuristic SaaS applications for creators and developers",
      icon: TrendingUp,
      color: "from-blue-500 to-purple-500",
    },
    {
      year: "2028",
      title: "Global Scale",
      description: "Scale digital empire globally with international reach",
      icon: Globe,
      color: "from-green-500 to-cyan-500",
    },
  ];

  return (
    <section id="future" className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-background opacity-30"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 animate-slide-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Future Goals</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-4"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The roadmap to building a digital empire
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-secondary hidden md:block"></div>
            
            <div className="space-y-12">
              {goals.map((goal, index) => {
                const Icon = goal.icon;
                return (
                  <div 
                    key={index}
                    className="relative"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="flex items-start gap-6">
                      {/* Icon */}
                      <div className={`relative z-10 flex-shrink-0 w-16 h-16 bg-gradient-to-br ${goal.color} rounded-full flex items-center justify-center glow-primary`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary transition-all duration-300 animated-border">
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-3xl font-bold text-primary">{goal.year}</span>
                          <h3 className="text-xl font-bold text-foreground">{goal.title}</h3>
                        </div>
                        <p className="text-muted-foreground">{goal.description}</p>
                      </div>
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

export default FutureGoals;
