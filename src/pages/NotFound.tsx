import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, Briefcase, Mail, BookOpen, Rocket } from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const quickLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/projects", label: "Projects", icon: Briefcase },
    { path: "/blog", label: "Blog", icon: BookOpen },
    { path: "/contact", label: "Contact", icon: Mail },
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden flex items-center justify-center">
      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Animated 404 */}
        <div className="mb-8 animate-float">
          <Rocket className="w-24 h-24 md:w-32 md:h-32 mx-auto text-primary mb-6 animate-spin-slow" />
        </div>
        
        <h1 className="text-8xl md:text-9xl font-display font-bold gradient-text mb-6 animate-glow-pulse">
          404
        </h1>
        
        <p className="text-2xl md:text-3xl font-bold mb-4 animate-fade-in">
          Oops! You've drifted into the void
        </p>
        
        <p className="text-lg text-muted-foreground mb-12 max-w-md mx-auto animate-fade-in">
          This page doesn't exist in our universe. Let's get you back on track!
        </p>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className="group bg-card/30 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary hover:bg-card/50 hover:scale-105 transition-all duration-300 animate-slide-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Icon className="w-8 h-8 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
                <p className="font-medium">{link.label}</p>
              </Link>
            );
          })}
        </div>

        {/* Fun Quote */}
        <div className="bg-card/20 backdrop-blur-sm border border-primary/20 rounded-xl p-6 max-w-2xl mx-auto animate-fade-in">
          <p className="text-sm text-muted-foreground italic">
            "Not all who wander are lost... but you might be. 😅"
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
