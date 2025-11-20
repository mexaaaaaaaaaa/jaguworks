import { Bot, Code2, Film, Gamepad, Trophy, Zap } from "lucide-react";

const ActivityFeed = () => {
  const activities = [
    {
      icon: Gamepad,
      title: "Just launched new Minecraft server",
      description: "FireCraft X - Premium SMP with custom features",
      timestamp: "2 days ago",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Bot,
      title: "AI Bot hit 1000+ users milestone",
      description: "Telegram assistant with TTS capabilities",
      timestamp: "5 days ago",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: Code2,
      title: "Completed client project",
      description: "Professional Discord server setup with automation",
      timestamp: "1 week ago",
      color: "from-green-500 to-cyan-500",
    },
    {
      icon: Film,
      title: "New cinematic reel released",
      description: "10-scene Minecraft cinematic production",
      timestamp: "2 weeks ago",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Trophy,
      title: "Achieved 500+ projects milestone",
      description: "Thank you to all clients and supporters",
      timestamp: "3 weeks ago",
      color: "from-yellow-500 to-orange-500",
    },
  ];

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-background opacity-10"></div>
      
      <div className="container mx-auto relative z-10 max-w-4xl">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Live Activity</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-4"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Recent achievements and project updates
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-transparent"></div>

          <div className="space-y-8">
            {activities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div
                  key={index}
                  className={`relative pl-16 animate-fade-in-left stagger-${index + 1}`}
                >
                  <div className={`absolute left-0 w-12 h-12 bg-gradient-to-br ${activity.color} rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary transition-all duration-300 hover-lift">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-lg font-bold text-foreground">
                        {activity.title}
                      </h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {activity.timestamp}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {activity.description}
                    </p>
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

export default ActivityFeed;
