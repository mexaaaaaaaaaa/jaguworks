import { useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

// Custom hook for celebration effects
export const useCelebration = () => {
  const fireConfetti = useCallback((options?: confetti.Options) => {
    const defaults: confetti.Options = {
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00ff9d', '#00d9ff', '#ff006e', '#ffbe0b', '#8338ec'],
    };

    confetti({
      ...defaults,
      ...options,
    });
  }, []);

  const fireFireworks = useCallback(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#00ff9d', '#00d9ff', '#ff006e'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#ffbe0b', '#8338ec', '#00ff9d'],
      });
    }, 250);
  }, []);

  const fireSideCanons = useCallback(() => {
    const end = Date.now() + 1000;
    const colors = ['#00ff9d', '#00d9ff', '#ff006e', '#ffbe0b'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  const fireStars = useCallback(() => {
    const defaults = {
      spread: 360,
      ticks: 100,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      colors: ['#00ff9d', '#00d9ff', '#ff006e', '#ffbe0b', '#8338ec'],
    };

    const shoot = () => {
      confetti({
        ...defaults,
        particleCount: 40,
        scalar: 1.2,
        shapes: ['star'],
      });

      confetti({
        ...defaults,
        particleCount: 10,
        scalar: 0.75,
        shapes: ['circle'],
      });
    };

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
  }, []);

  const fireEmoji = useCallback((emoji: string = '🎉') => {
    const scalar = 2;
    const unicorn = confetti.shapeFromText({ text: emoji, scalar });

    const defaults = {
      spread: 360,
      ticks: 60,
      gravity: 0.5,
      decay: 0.96,
      startVelocity: 20,
      shapes: [unicorn],
      scalar,
    };

    const shoot = () => {
      confetti({
        ...defaults,
        particleCount: 30,
      });

      confetti({
        ...defaults,
        particleCount: 5,
        flat: true,
      });
    };

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
  }, []);

  return {
    fireConfetti,
    fireFireworks,
    fireSideCanons,
    fireStars,
    fireEmoji,
  };
};

// Component that listens for celebration events
const CelebrationEffects = () => {
  const { fireConfetti, fireFireworks, fireStars, fireEmoji } = useCelebration();

  useEffect(() => {
    // Listen for custom celebration events
    const handleCelebration = (e: CustomEvent<{ type: string; emoji?: string }>) => {
      switch (e.detail.type) {
        case 'confetti':
          fireConfetti();
          break;
        case 'fireworks':
          fireFireworks();
          break;
        case 'stars':
          fireStars();
          break;
        case 'emoji':
          fireEmoji(e.detail.emoji);
          break;
        default:
          fireConfetti();
      }
    };

    window.addEventListener('celebrate', handleCelebration as EventListener);

    // Check for first visit
    const isFirstVisit = !localStorage.getItem('hasVisitedBefore');
    if (isFirstVisit) {
      localStorage.setItem('hasVisitedBefore', 'true');
      // Small welcome confetti after intro
      setTimeout(() => {
        fireConfetti({ particleCount: 50, spread: 60 });
      }, 7000);
    }

    return () => {
      window.removeEventListener('celebrate', handleCelebration as EventListener);
    };
  }, [fireConfetti, fireFireworks, fireStars, fireEmoji]);

  return null; // This component doesn't render anything
};

// Helper function to trigger celebrations from anywhere
export const triggerCelebration = (type: 'confetti' | 'fireworks' | 'stars' | 'emoji' = 'confetti', emoji?: string) => {
  window.dispatchEvent(new CustomEvent('celebrate', { detail: { type, emoji } }));
};

export default CelebrationEffects;
