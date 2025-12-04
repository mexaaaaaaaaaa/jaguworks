import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

const PersonalizedGreeting = () => {
  const [greeting, setGreeting] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [emoji, setEmoji] = useState('👋');

  useEffect(() => {
    // Check if greeting was shown recently (within 1 hour)
    const lastGreeting = localStorage.getItem('lastGreetingTime');
    const now = Date.now();
    
    if (lastGreeting && now - parseInt(lastGreeting) < 3600000) {
      return;
    }

    // Wait for cinematic intro to finish
    const timer = setTimeout(() => {
      const greetingData = generateGreeting();
      setGreeting(greetingData.text);
      setEmoji(greetingData.emoji);
      setIsVisible(true);
      localStorage.setItem('lastGreetingTime', now.toString());

      // Auto-hide after 5 seconds
      setTimeout(() => setIsVisible(false), 5000);
    }, 7500);

    return () => clearTimeout(timer);
  }, []);

  const generateGreeting = (): { text: string; emoji: string } => {
    const hour = new Date().getHours();
    const isReturning = localStorage.getItem('hasVisitedBefore') === 'true';
    const visitCount = parseInt(localStorage.getItem('visitCount') || '0') + 1;
    localStorage.setItem('visitCount', visitCount.toString());

    // Check for special days
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    // Special day greetings
    if (month === 10 && day >= 20 && day <= 30) {
      return { text: "Happy Diwali! May your life shine bright!", emoji: "🪔" };
    }
    if (month === 12 && day === 25) {
      return { text: "Merry Christmas! Hope you have a wonderful day!", emoji: "🎄" };
    }
    if (month === 1 && day === 1) {
      return { text: "Happy New Year! Welcome to a fresh start!", emoji: "🎉" };
    }
    if (month === 8 && day === 15) {
      return { text: "Happy Independence Day! Jai Hind!", emoji: "🇮🇳" };
    }
    if (month === 1 && day === 26) {
      return { text: "Happy Republic Day! Proud to be Indian!", emoji: "🇮🇳" };
    }
    if (month === 3 && day >= 1 && day <= 15) {
      return { text: "Happy Holi! May your life be colorful!", emoji: "🎨" };
    }

    // Time-based greetings
    let timeGreeting: string;
    let timeEmoji: string;

    if (hour >= 5 && hour < 12) {
      timeGreeting = "Good morning";
      timeEmoji = "☀️";
    } else if (hour >= 12 && hour < 17) {
      timeGreeting = "Good afternoon";
      timeEmoji = "🌤️";
    } else if (hour >= 17 && hour < 21) {
      timeGreeting = "Good evening";
      timeEmoji = "🌅";
    } else {
      timeGreeting = "Good night";
      timeEmoji = "🌙";
    }

    // Returning visitor greetings
    if (isReturning) {
      const returningGreetings = [
        { text: `${timeGreeting}! Welcome back to my universe!`, emoji: timeEmoji },
        { text: "Great to see you again! What brings you here?", emoji: "🎉" },
        { text: `${timeGreeting}! Missed you! Let's explore together.`, emoji: "🚀" },
        { text: "Welcome back, friend! Ready for more?", emoji: "✨" },
      ];
      
      if (visitCount > 5) {
        return { text: "You're becoming a regular! Thanks for visiting!", emoji: "💜" };
      }
      
      return returningGreetings[Math.floor(Math.random() * returningGreetings.length)];
    }

    // First-time visitor greetings
    const firstTimeGreetings = [
      { text: `${timeGreeting}! Welcome to my digital universe!`, emoji: timeEmoji },
      { text: "Hey there! Ready to explore something amazing?", emoji: "🚀" },
      { text: "Welcome! I'm Jagmohan, glad you're here!", emoji: "👋" },
      { text: `${timeGreeting}! Let's create something extraordinary!`, emoji: "✨" },
    ];

    return firstTimeGreetings[Math.floor(Math.random() * firstTimeGreetings.length)];
  };

  if (!greeting) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-24 left-1/2 -translate-x-1/2 z-50"
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          <div className="relative px-6 py-4 rounded-2xl bg-background/80 backdrop-blur-xl border border-border/50 shadow-xl shadow-primary/10">
            {/* Gradient border effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 -z-10 blur-sm" />
            
            <div className="flex items-center gap-3">
              <motion.span
                className="text-3xl"
                animate={{ 
                  rotate: [0, 14, -8, 14, -4, 10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                {emoji}
              </motion.span>
              
              <p className="text-foreground font-medium pr-8">
                {greeting}
              </p>

              <button
                onClick={() => setIsVisible(false)}
                className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sparkle decoration */}
            <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-primary animate-pulse" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PersonalizedGreeting;
