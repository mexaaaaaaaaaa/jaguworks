import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg-new.jpg";
import profileImg from "@/assets/profile.jpg";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Hero = () => {
  const navigate = useNavigate();
  const { ref: profileRef, isVisible: profileVisible } = useScrollAnimation({ threshold: 0.3, animationType: 'scale' });
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation({ threshold: 0.3, animationType: 'fade', delay: 200 });
  const { ref: buttonRef, isVisible: buttonVisible } = useScrollAnimation({ threshold: 0.3, animationType: 'slide-up', delay: 400 });
  
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
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div>
          {/* Profile Image */}
          <div ref={profileRef as any} className="mb-8 flex justify-center">
            <div className={`relative ${profileVisible ? 'animate-bounce-in' : 'opacity-0'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-2xl opacity-60 animate-pulse"></div>
              <img 
                src={profileImg} 
                alt="Jagmohan" 
                className="relative w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-primary/30 shadow-2xl glow-primary transform hover:scale-105 transition-transform duration-500"
                loading="eager"
              />
            </div>
          </div>
          
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 glass-frost mb-6 animate-glow-pulse ${titleVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">Digital Creator & Developer</span>
          </div>
          
          <div ref={titleRef as any}>
            <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-6 tracking-tight font-display ${titleVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <span className="gradient-text text-glow-primary shimmer">JAGMOHAN</span>
            </h1>
          </div>
          
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-4 text-foreground/90 font-light font-mono tracking-wide">
            Building Digital Worlds
          </p>
          
          <div className="h-1 w-32 bg-gradient-to-r from-primary via-accent to-secondary mx-auto rounded-full mb-6 animate-pulse-glow"></div>
          
          <p className={`text-sm sm:text-base md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto px-4 font-mono ${titleVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
            Minecraft Developer <span className="text-primary">•</span> Discord Dev <span className="text-secondary">•</span> App & Website Builder <span className="text-accent">•</span> Entrepreneur
          </p>
          
          <div ref={buttonRef as any} className={`flex flex-col sm:flex-row gap-4 justify-center items-center ${buttonVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <Button 
              variant="hero" 
              size="lg"
              className="group ripple hover-brightness"
              onClick={() => navigate('/projects')}
            >
              Explore My Universe
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
            
            <Button 
              variant="neon" 
              size="lg"
              className="ripple hover-brightness"
              onClick={() => window.open('https://discord.gg/6CdCgjsVua', '_blank')}
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
