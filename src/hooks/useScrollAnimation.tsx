import { useEffect, useRef, useState } from 'react';

type AnimationType = 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'rotate';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  animationType?: AnimationType;
  delay?: number;
  stagger?: number;
  index?: number;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
    animationType = 'fade',
    delay = 0,
    stagger = 0,
    index = 0,
  } = options;

  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const totalDelay = delay + (index * stagger);
          setTimeout(() => {
            setIsVisible(true);
          }, totalDelay);
          
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, delay, stagger, index]);

  const getAnimationClass = () => {
    if (!isVisible) return 'opacity-0';
    
    switch (animationType) {
      case 'fade':
        return 'animate-fade-in-up';
      case 'slide-up':
        return 'animate-slide-in-up';
      case 'slide-down':
        return 'animate-fade-in-down';
      case 'slide-left':
        return 'animate-fade-in-left';
      case 'slide-right':
        return 'animate-fade-in-right';
      case 'scale':
        return 'animate-scale-in';
      case 'rotate':
        return 'animate-rotate-in';
      default:
        return 'animate-fade-in-up';
    }
  };

  return { ref, isVisible, animationClass: getAnimationClass() };
};
