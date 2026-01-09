import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

// Floating 3D shapes that react to mouse
export const FloatingShape = ({ 
  children, 
  depth = 1, 
  className = '',
  delay = 0 
}: { 
  children?: React.ReactNode;
  depth?: number;
  className?: string;
  delay?: number;
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      className={`pointer-events-none ${className}`}
      animate={{
        x: mousePosition.x * 30 * depth,
        y: mousePosition.y * 30 * depth,
      }}
      transition={{ type: 'spring', stiffness: 100, damping: 30, delay: delay * 0.1 }}
    >
      {children}
    </motion.div>
  );
};

// Parallax image that moves on scroll
export const ParallaxImage = ({
  src,
  alt,
  speed = 0.5,
  className = '',
}: {
  src: string;
  alt: string;
  speed?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y: smoothY }}
        className="w-full h-[120%] object-cover"
      />
    </div>
  );
};

// Scroll-triggered reveal with parallax
export const ParallaxReveal = ({
  children,
  className = '',
  direction = 'up',
}: {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center']
  });
  
  const getInitial = () => {
    switch (direction) {
      case 'up': return { y: 100, opacity: 0 };
      case 'down': return { y: -100, opacity: 0 };
      case 'left': return { x: 100, opacity: 0 };
      case 'right': return { x: -100, opacity: 0 };
    }
  };

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [50, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Canvas-style floating geometric shapes
export const GeometricFloat = ({
  variant = 'cube',
  size = 60,
  color = 'primary',
  className = '',
  index = 0,
}: {
  variant?: 'cube' | 'sphere' | 'pyramid' | 'ring' | 'diamond';
  size?: number;
  color?: 'primary' | 'accent' | 'secondary';
  className?: string;
  index?: number;
}) => {
  const colorMap = {
    primary: 'from-primary/30 to-primary/10 border-primary/40',
    accent: 'from-accent/30 to-accent/10 border-accent/40',
    secondary: 'from-secondary/30 to-secondary/10 border-secondary/40',
  };

  const shapes = {
    cube: (
      <div 
        className={`relative bg-gradient-to-br ${colorMap[color]} border backdrop-blur-sm`}
        style={{ width: size, height: size, transform: 'rotate(45deg)' }}
      />
    ),
    sphere: (
      <div 
        className={`rounded-full bg-gradient-to-br ${colorMap[color]} border backdrop-blur-sm`}
        style={{ width: size, height: size }}
      />
    ),
    pyramid: (
      <div 
        className={`bg-gradient-to-br ${colorMap[color]} border backdrop-blur-sm`}
        style={{ 
          width: 0, 
          height: 0, 
          borderLeft: `${size/2}px solid transparent`,
          borderRight: `${size/2}px solid transparent`,
          borderBottom: `${size}px solid hsl(var(--primary) / 0.3)`,
          background: 'none',
          border: 'none',
        }}
      />
    ),
    ring: (
      <div 
        className={`rounded-full border-4 border-primary/30`}
        style={{ width: size, height: size }}
      />
    ),
    diamond: (
      <div 
        className={`bg-gradient-to-br ${colorMap[color]} border backdrop-blur-sm`}
        style={{ 
          width: size * 0.7, 
          height: size * 0.7, 
          transform: 'rotate(45deg)',
        }}
      />
    ),
  };

  return (
    <FloatingShape depth={0.5 + index * 0.3} delay={index} className={className}>
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 6 + index,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: index * 0.5,
        }}
      >
        {shapes[variant]}
      </motion.div>
    </FloatingShape>
  );
};

// Mouse follower glow effect
export const MouseGlow = ({ className = '' }: { className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y]);

  return (
    <motion.div
      className={`fixed pointer-events-none z-0 w-96 h-96 rounded-full bg-gradient-radial from-primary/20 to-transparent blur-3xl ${className}`}
      style={{
        x,
        y,
        translateX: '-50%',
        translateY: '-50%',
      }}
    />
  );
};

// Scroll-based scale effect
export const ScaleOnScroll = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center']
  });
  
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Staggered children animation
export const StaggerContainer = ({
  children,
  className = '',
  staggerDelay = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.9 },
        visible: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: {
            type: 'spring',
            stiffness: 100,
            damping: 15,
          }
        },
      }}
    >
      {children}
    </motion.div>
  );
};
