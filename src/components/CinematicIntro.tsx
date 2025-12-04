import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicIntroProps {
  onComplete: () => void;
}

const CinematicIntro = ({ onComplete }: CinematicIntroProps) => {
  const [phase, setPhase] = useState(0);
  const [showSkip, setShowSkip] = useState(false);

  const loadingMessages = [
    "Initializing systems...",
    "Loading creativity...",
    "Preparing awesomeness...",
    "Entering the universe..."
  ];

  useEffect(() => {
    // Check if user has seen intro before
    const hasSeenIntro = localStorage.getItem('hasSeenCinematicIntro');
    if (hasSeenIntro) {
      onComplete();
      return;
    }

    // Show skip button after 1.5 seconds
    const skipTimer = setTimeout(() => setShowSkip(true), 1500);

    // Phase transitions
    const phase1 = setTimeout(() => setPhase(1), 500); // Show J
    const phase2 = setTimeout(() => setPhase(2), 1200); // Full name
    const phase3 = setTimeout(() => setPhase(3), 2500); // Subtitle
    const phase4 = setTimeout(() => setPhase(4), 3500); // Loading
    const phase5 = setTimeout(() => {
      localStorage.setItem('hasSeenCinematicIntro', 'true');
      onComplete();
    }, 6000);

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(phase1);
      clearTimeout(phase2);
      clearTimeout(phase3);
      clearTimeout(phase4);
      clearTimeout(phase5);
    };
  }, [onComplete]);

  const handleSkip = () => {
    localStorage.setItem('hasSeenCinematicIntro', 'true');
    onComplete();
  };

  const nameLetters = "JAGMOHAN".split('');

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] bg-black flex items-center justify-center overflow-hidden"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 157, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 157, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite'
          }} />
        </div>

        {/* Glowing orbs */}
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-primary/20 blur-3xl"
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -50, 100, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-accent/20 blur-3xl"
          animate={{
            x: [0, -100, 50, 0],
            y: [0, 50, -100, 0],
            scale: [1, 0.8, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        {/* Main content */}
        <div className="relative z-10 text-center">
          {/* Name with glitch effect */}
          <div className="relative mb-8">
            <motion.div
              className="text-6xl md:text-8xl font-bold tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 1 ? 1 : 0 }}
            >
              {nameLetters.map((letter, index) => (
                <motion.span
                  key={index}
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary"
                  initial={{ opacity: 0, y: 50, rotateX: -90 }}
                  animate={phase >= 2 ? {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                  } : phase >= 1 && index === 0 ? {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                  } : {}}
                  transition={{
                    duration: 0.5,
                    delay: phase >= 2 ? index * 0.1 : 0,
                    type: 'spring',
                    damping: 15,
                  }}
                  style={{
                    textShadow: '0 0 40px hsl(var(--primary) / 0.5)',
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>

            {/* Glitch overlay */}
            <motion.div
              className="absolute inset-0 text-6xl md:text-8xl font-bold tracking-wider text-red-500/30"
              animate={{
                x: phase >= 2 ? [0, -2, 2, 0] : 0,
                opacity: phase >= 2 ? [0, 0.5, 0] : 0,
              }}
              transition={{
                duration: 0.2,
                repeat: phase >= 2 ? 3 : 0,
                repeatDelay: 2,
              }}
            >
              {nameLetters.join('')}
            </motion.div>
          </div>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground tracking-widest mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            FULL STACK DEVELOPER
          </motion.p>

          {/* Loading bar */}
          <motion.div
            className="w-64 mx-auto"
            initial={{ opacity: 0 }}
            animate={phase >= 4 ? { opacity: 1 } : {}}
          >
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent"
                initial={{ width: '0%' }}
                animate={phase >= 4 ? { width: '100%' } : {}}
                transition={{ duration: 2, ease: 'easeInOut' }}
              />
            </div>
            <motion.p
              className="text-sm text-muted-foreground mt-4 h-6"
              initial={{ opacity: 0 }}
              animate={phase >= 4 ? { opacity: 1 } : {}}
            >
              {phase >= 4 && (
                <TypewriterText 
                  texts={loadingMessages} 
                  delay={500}
                />
              )}
            </motion.p>
          </motion.div>
        </div>

        {/* Skip button */}
        <AnimatePresence>
          {showSkip && (
            <motion.button
              className="absolute bottom-8 right-8 px-4 py-2 text-sm text-muted-foreground hover:text-foreground border border-border/50 rounded-full transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleSkip}
            >
              Skip Intro →
            </motion.button>
          )}
        </AnimatePresence>

        {/* Scanline effect */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
          }}
        />

        <style>{`
          @keyframes gridMove {
            0% { transform: translate(0, 0); }
            100% { transform: translate(50px, 50px); }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
};

// Typewriter component for loading messages
const TypewriterText = ({ texts, delay }: { texts: string[]; delay: number }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % texts.length);
    }, delay);
    return () => clearInterval(interval);
  }, [texts, delay]);

  return (
    <motion.span
      key={currentIndex}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {texts[currentIndex]}
    </motion.span>
  );
};

export default CinematicIntro;
