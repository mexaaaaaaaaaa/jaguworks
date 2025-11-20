import { Button } from "@/components/ui/button";
import { ExternalLink, Code2, Bot, Cpu, Film, Layout, Settings, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const Projects = () => {
  const projects = [
    {
      title: "Minecraft Server Plans",
      description: "Professional SMP setup services with custom features and optimization",
      icon: Code2,
      color: "from-purple-500 to-pink-500",
      link: "/minecraft-plans",
    },
    {
      title: "Discord Server Plans",
      description: "Professional Discord server setup with bots, roles, and automation",
      icon: Bot,
      color: "from-cyan-500 to-blue-500",
      link: "/discord-plans",
    },
    {
      title: "AI Telegram Bot",
      description: "Smart assistant with TTS capabilities and referral system integration",
      icon: Cpu,
      color: "from-blue-500 to-purple-500",
      link: "/ai-telegram-bots",
    },
    {
      title: "Minecraft Launcher",
      description: "Custom Windows 10 launcher with no-login authentication system",
      icon: Settings,
      color: "from-green-500 to-cyan-500",
    },
    {
      title: "Cinematic Reel Project",
      description: "Professional 10-scene cinematic Minecraft video production",
      icon: Film,
      color: "from-orange-500 to-red-500",
      link: "/cinematic-reel",
    },
    {
      title: "Website Templates",
      description: "Professional responsive templates built with HTML/CSS/JS & React",
      icon: Layout,
      color: "from-pink-500 to-purple-500",
    },
    {
      title: "Discord Automation",
      description: "Complete automation systems with auto-roles, tickets, and event management",
      icon: Bot,
      color: "from-cyan-500 to-purple-500",
      link: "/discord-automation",
    },
    {
      title: "Business Tools",
      description: "Telegram-based automation scripts for workflow optimization",
      icon: Briefcase,
      color: "from-yellow-500 to-orange-500",
    },
  ];

  return (
    <section id="projects" className="py-20 px-4 relative overflow-hidden bg-card/20">
      <div className="absolute inset-0 grid-background opacity-20"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 animate-slide-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Featured Projects</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-4"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore my universe of digital creations — from game servers to AI-powered tools
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project, index) => {
            const Icon = project.icon;
            return (
              <div 
                key={index}
                className="group relative bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary transition-all duration-300 animated-border"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${project.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4">
                  {project.description}
                </p>
                
                {project.link ? (
                  <Link to={project.link}>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="group-hover:text-primary transition-colors"
                    >
                      View Project
                      <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="group-hover:text-primary transition-colors"
                  >
                    View Project
                    <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;
