import { Button } from "@/components/ui/button";
import { ExternalLink, Code2, Bot, Cpu, Film, Layout, Settings, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { use3DTilt } from "@/hooks/use3DTilt";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

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
      title: "Minecraft Server",
      description: "Join our lag-free Minecraft server with exciting game modes and a vibrant community",
      icon: Settings,
      color: "from-green-500 to-cyan-500",
      link: "/minecraft-server",
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
            return <ProjectCard key={index} project={project} index={index} Icon={Icon} />;
          })}
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({ project, index, Icon }: any) => {
  const { ref: tiltRef, isHovered } = use3DTilt({ maxTilt: 8, scale: 1.05, speed: 300 });
  const { ref: scrollRef, isVisible } = useScrollAnimation({
    threshold: 0.2,
    animationType: 'fade',
    stagger: 150,
    index,
  });

  return (
    <div ref={scrollRef as any} className={`transition-all duration-700 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      <div 
        ref={tiltRef as any}
        className={`group relative glass-heavy rounded-2xl p-6 border border-border/50 hover:border-primary/50 transition-all duration-500 overflow-hidden ${
          isHovered ? 'shadow-2xl shadow-primary/20' : ''
        }`}
        style={{ 
          transitionDelay: `${index * 100}ms`,
          willChange: 'transform'
        }}
      >
        {/* Animated gradient background on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Glow effect */}
        <div className={`absolute -inset-1 bg-gradient-to-br ${project.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-all duration-500`} />
        
        <div className="relative z-10">
          {/* Icon with enhanced animation */}
          <div className={`w-14 h-14 bg-gradient-to-br ${project.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
            <Icon className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300" />
          </div>
          
          {/* Title with gradient on hover */}
          <h3 className="text-xl font-bold mb-3 text-foreground group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
            {project.title}
          </h3>
          
          {/* Description */}
          <p className="text-muted-foreground text-sm mb-5 leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
            {project.description}
          </p>
          
          {/* Button with enhanced effects */}
          {project.link ? (
            <Link to={project.link}>
              <Button 
                variant="ghost" 
                size="sm"
                className="relative overflow-hidden group/btn bg-primary/5 hover:bg-primary/10 border border-primary/20 hover:border-primary/40 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  View Project
                  <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />
                </span>
                {/* Shine effect on hover */}
                <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </Button>
            </Link>
          ) : (
            <Button 
              variant="ghost" 
              size="sm"
              className="relative overflow-hidden group/btn bg-primary/5 hover:bg-primary/10 border border-primary/20 hover:border-primary/40 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                View Project
                <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />
              </span>
              {/* Shine effect on hover */}
              <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </Button>
          )}
        </div>
        
        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  );
};

export default Projects;
