import { ExternalLink, Code2, Bot } from "lucide-react";
import { Link } from "react-router-dom";

const Projects = () => {
  const projects = [
    {
      title: "DarkMC Network",
      description: "Full-featured Minecraft network with Lifesteal, SMP, Bedwars, and Headsteal game modes",
      icon: Code2,
      gradient: "from-neon-purple via-neon-blue to-neon-cyan",
      link: "#darkmc-project",
    },
    {
      title: "DARKBOT",
      description: "Advanced Discord bot with automation, moderation, and custom commands",
      icon: Bot,
      gradient: "from-neon-cyan via-neon-blue to-neon-purple",
      link: "/discord-automation",
    },
  ];

  return (
    <section id="projects" className="py-20 px-4 md:px-8 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 grid-background opacity-10" />
      
      {/* Floating gradient orbs */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-neon-cyan/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-in-up">
          <h2 className="text-4xl md:text-6xl font-bold mb-3">
            <span className="gradient-text">Featured Projects</span>
          </h2>
          
          {/* Neon underline accent */}
          <div className="flex justify-center mb-6">
            <div className="h-1 w-24 bg-gradient-to-r from-neon-purple via-neon-blue to-neon-cyan rounded-full glow-primary animate-glow-pulse" />
          </div>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore my universe of digital creations — from game servers to AI-powered tools
          </p>
        </div>

        {/* Projects List */}
        <div className="space-y-6">
          {projects.map((project, index) => {
            const Icon = project.icon;
            const isExternal = project.link.startsWith('http');
            
            const cardContent = (
              <>
                {/* Glassmorphism card */}
                <div className="flex items-start gap-6 p-6 md:p-8 bg-card/40 backdrop-blur-xl border-2 border-border/50 rounded-[18px] hover:border-primary/50 transition-all duration-500 group cursor-pointer relative overflow-hidden">
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 via-transparent to-neon-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Left Icon */}
                  <div className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${project.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                    <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={2.5} />
                  </div>
                  
                  {/* Right Content */}
                  <div className="flex-1 min-w-0 relative z-10">
                    <h3 className="text-2xl md:text-3xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-base md:text-lg mb-4 leading-relaxed">
                      {project.description}
                    </p>
                    
                    {/* CTA */}
                    <div className="inline-flex items-center gap-2 text-primary group-hover:text-neon-cyan transition-colors font-medium">
                      <span>View Project</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </>
            );

            return (
              <div
                key={index}
                className="animate-slide-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {isExternal ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {cardContent}
                  </a>
                ) : (
                  <Link to={project.link} className="block">
                    {cardContent}
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* View All Projects Link */}
        <div className="text-center mt-12 animate-slide-in-up" style={{ animationDelay: "300ms" }}>
          <Link 
            to="#all-projects"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
          >
            <span className="text-sm font-medium">View all projects</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Projects;
