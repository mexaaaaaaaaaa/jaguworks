import { useEffect, useState, useRef, RefObject } from 'react';

interface ParallaxOptions {
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  easing?: number;
}

interface MouseParallaxOptions {
  intensity?: number;
  inverted?: boolean;
}

// Scroll-based parallax effect
export const useScrollParallax = (options: ParallaxOptions = {}) => {
  const { speed = 0.5, direction = 'up' } = options;
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
      
      setOffset(clampedProgress * 100 * speed);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  const getTransform = () => {
    switch (direction) {
      case 'up': return `translateY(-${offset}px)`;
      case 'down': return `translateY(${offset}px)`;
      case 'left': return `translateX(-${offset}px)`;
      case 'right': return `translateX(${offset}px)`;
      default: return `translateY(-${offset}px)`;
    }
  };

  return { ref, offset, transform: getTransform() };
};

// Mouse-based parallax effect
export const useMouseParallax = (options: MouseParallaxOptions = {}) => {
  const { intensity = 20, inverted = false } = options;
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) / rect.width;
      const deltaY = (e.clientY - centerY) / rect.height;
      
      const multiplier = inverted ? -1 : 1;
      
      setPosition({
        x: deltaX * intensity * multiplier,
        y: deltaY * intensity * multiplier,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [intensity, inverted]);

  return { 
    ref, 
    position,
    transform: `translate(${position.x}px, ${position.y}px)`,
    style: {
      transform: `translate(${position.x}px, ${position.y}px)`,
      transition: 'transform 0.15s ease-out',
    }
  };
};

// Layer-based parallax for multiple elements
export const useLayeredParallax = (layers: number = 3) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getLayerStyle = (layerIndex: number, baseIntensity: number = 30) => {
    const depth = (layerIndex + 1) / layers;
    const mouseIntensity = baseIntensity * depth;
    const scrollIntensity = 50 * depth;
    
    return {
      transform: `translate(${mousePosition.x * mouseIntensity}px, ${mousePosition.y * mouseIntensity + scrollY * 0.1 * depth}px)`,
      transition: 'transform 0.2s ease-out',
    };
  };

  return { mousePosition, scrollY, getLayerStyle };
};

// Floating animation with random movement
export const useFloatingElement = (seed: number = 0) => {
  const [offset, setOffset] = useState({ x: 0, y: 0, rotate: 0 });

  useEffect(() => {
    let animationId: number;
    const startTime = Date.now() + seed * 1000;
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      
      setOffset({
        x: Math.sin(elapsed * 0.5 + seed) * 10,
        y: Math.cos(elapsed * 0.7 + seed) * 15,
        rotate: Math.sin(elapsed * 0.3 + seed) * 5,
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => cancelAnimationFrame(animationId);
  }, [seed]);

  return {
    offset,
    style: {
      transform: `translate(${offset.x}px, ${offset.y}px) rotate(${offset.rotate}deg)`,
    }
  };
};
