import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroBg from "@/assets/hero-bg-new.jpg";
import profileImg from "@/assets/profile.jpg";
import ParticleBackground from "./ParticleBackground";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="Futuristic background" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background"></div>
        <div className="absolute inset-0 grid-background"></div>
        <ParticleBackground />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="animate-slide-in-up">
          {/* Profile Image */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-xl opacity-50 animate-pulse"></div>
              <img 
                src={profileImg} 
                alt="Jagmohan" 
                className="relative w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-primary/30 shadow-2xl glow-primary"
              />
            </div>
          </div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-card/50 backdrop-blur-sm mb-6 animate-glow-pulse">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Digital Creator & Developer</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-6 tracking-tight font-display">
            <span className="gradient-text text-glow-primary">JAGMOHAN</span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-4 text-foreground/90 font-light font-mono tracking-wide">
            Building Digital Worlds
          </p>
          
          <div className="h-1 w-32 bg-gradient-to-r from-primary via-accent to-secondary mx-auto rounded-full mb-6 animate-pulse-glow"></div>
          
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto px-4 font-mono">
            Minecraft Developer <span className="text-primary">•</span> Discord Dev <span className="text-secondary">•</span> App & Website Builder <span className="text-accent">•</span> Entrepreneur
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="hero" 
              size="lg"
              className="group"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore My Universe
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="neon" 
              size="lg"
              onClick={() => window.open('https://discord.gg/your-discord', '_blank')}
            >
              Join My Discord
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/50 rounded-full p-1">
            <div className="w-1 h-3 bg-primary rounded-full mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
