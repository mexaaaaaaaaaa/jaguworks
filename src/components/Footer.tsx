import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 px-4 border-t border-primary/20 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm text-center md:text-left">
            © 2025 <span className="text-primary font-semibold">JAGMOHAN</span> — Crafting the Future
          </p>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Built with</span>
            <Heart className="w-4 h-4 text-red-500 animate-pulse" />
            <span>and JavaScript</span>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <div className="inline-block">
            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
