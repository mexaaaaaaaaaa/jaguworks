import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const LoadingScreen = ({ onLoadingComplete }: { onLoadingComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const duration = 2000;
    const interval = 20;
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsVisible(false);
            onLoadingComplete();
          }, 300);
          return 100;
        }
        return Math.min(prev + increment, 100);
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      style={{ 
        opacity: progress === 100 ? 0 : 1,
        transition: 'opacity 0.3s ease-out'
      }}
    >
      <div className="absolute inset-0 grid-background opacity-30"></div>
      
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="relative">
          <h1 className="text-5xl md:text-7xl font-bold gradient-text animate-pulse-glow">
            Jagmohan
          </h1>
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 blur-2xl -z-10 animate-pulse"></div>
        </div>

        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <p className="text-muted-foreground text-lg">Loading your digital universe...</p>
        </div>

        <div className="w-64 h-1.5 bg-muted/30 rounded-full overflow-hidden backdrop-blur-sm">
          <div 
            className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-200 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
          </div>
        </div>

        <div className="text-primary font-mono text-sm">
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
