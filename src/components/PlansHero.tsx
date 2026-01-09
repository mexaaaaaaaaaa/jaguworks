import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { GeometricFloat, MouseGlow } from './ParallaxElements';

interface PlansHeroProps {
  title: string;
  subtitle: string;
  description?: string;
  note?: string;
  backgroundImage?: string;
  variant?: 'minecraft' | 'discord';
}

const PlansHero = ({ 
  title, 
  subtitle, 
  description, 
  note,
  backgroundImage,
  variant = 'minecraft' 
}: PlansHeroProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const gradientColors = variant === 'minecraft' 
    ? 'from-green-500/20 via-emerald-500/10 to-transparent'
    : 'from-indigo-500/20 via-purple-500/10 to-transparent';

  const accentColor = variant === 'minecraft' ? 'green' : 'indigo';

  return (
    <div 
      ref={containerRef}
      className="relative min-h-[70vh] overflow-hidden flex items-center justify-center"
    >
      {/* Animated background gradient */}
      <motion.div 
        className={`absolute inset-0 bg-gradient-to-b ${gradientColors}`}
        style={{ y: backgroundY }}
      />
      
      {/* Mouse-following glow */}
      <MouseGlow />
      
      {/* Animated grid pattern */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--primary) / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--primary) / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          y: backgroundY,
        }}
      />
      
      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <GeometricFloat variant="cube" size={80} color="primary" className="absolute top-20 left-[10%]" index={0} />
        <GeometricFloat variant="sphere" size={50} color="accent" className="absolute top-40 right-[15%]" index={1} />
        <GeometricFloat variant="ring" size={100} color="secondary" className="absolute bottom-32 left-[20%]" index={2} />
        <GeometricFloat variant="diamond" size={60} color="primary" className="absolute top-60 left-[70%]" index={3} />
        <GeometricFloat variant="cube" size={40} color="accent" className="absolute bottom-20 right-[25%]" index={4} />
        <GeometricFloat variant="sphere" size={70} color="secondary" className="absolute top-32 left-[40%]" index={5} />
        <GeometricFloat variant="pyramid" size={55} color="primary" className="absolute bottom-40 right-[10%]" index={6} />
      </div>
      
      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      {/* Main content with parallax */}
      <motion.div 
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        style={{ y: textY, opacity, scale }}
      >
        {/* Glowing border card */}
        <motion.div
          className="relative p-8 md:p-12 rounded-3xl backdrop-blur-xl bg-background/40 border border-primary/20 overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`,
          }}
        >
          {/* Animated border glow */}
          <motion.div
            className="absolute inset-0 rounded-3xl opacity-50"
            style={{
              background: `linear-gradient(90deg, transparent, hsl(var(--primary) / 0.3), transparent)`,
              backgroundSize: '200% 100%',
            }}
            animate={{
              backgroundPosition: ['200% 0%', '-200% 0%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          
          {/* Content */}
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="gradient-text">{title}</span>
            <br />
            <span className="text-foreground text-3xl md:text-4xl lg:text-5xl">{subtitle}</span>
          </motion.h1>
          
          {description && (
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {description}
            </motion.p>
          )}
          
          {note && (
            <motion.p 
              className="text-sm text-muted-foreground/70 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {note}
            </motion.p>
          )}
          
          {/* Scroll indicator */}
          <motion.div
            className="mt-8 flex justify-center"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 rounded-full border-2 border-primary/40 flex justify-center pt-2">
              <motion.div
                className="w-1.5 h-3 rounded-full bg-primary/60"
                animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PlansHero;
