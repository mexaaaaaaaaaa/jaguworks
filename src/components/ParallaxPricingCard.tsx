import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, MouseEvent } from 'react';
import { Check, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  delivery?: string;
  features: string[];
  description?: string;
}

interface ParallaxPricingCardProps {
  plan: PricingPlan;
  index: number;
  icon: React.ReactNode;
  onAddToCart: (plan: PricingPlan) => void;
  isAdding?: boolean;
  popular?: boolean;
}

const ParallaxPricingCard = ({
  plan,
  index,
  icon,
  onAddToCart,
  isAdding = false,
  popular = false,
}: ParallaxPricingCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Mouse position for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Spring animations for smooth movement
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 20 });
  const glowX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), { stiffness: 150, damping: 20 });
  const glowY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className="relative"
    >
      {/* Popular badge */}
      {popular && (
        <motion.div
          className="absolute -top-4 left-1/2 -translate-x-1/2 z-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + index * 0.1 }}
        >
          <span className="px-4 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-full shadow-lg">
            Most Popular
          </span>
        </motion.div>
      )}
      
      <Card className={`relative overflow-hidden bg-card/40 backdrop-blur-xl border-2 transition-all duration-500 h-full ${popular ? 'border-primary shadow-2xl shadow-primary/20' : 'border-border hover:border-primary/50'}`}>
        {/* Moving gradient glow */}
        <motion.div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glowX}% ${glowY}%, hsl(var(--primary) / 0.4), transparent 50%)`,
          }}
        />
        
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, hsl(var(--primary) / 0.1) 45%, hsl(var(--primary) / 0.2) 50%, hsl(var(--primary) / 0.1) 55%, transparent 60%)',
          }}
          animate={{
            x: ['-200%', '200%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        />
        
        <CardContent className="p-6 relative z-10" style={{ transform: 'translateZ(50px)' }}>
          {/* Icon with glow */}
          <motion.div 
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 relative"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl" />
            {icon}
          </motion.div>

          {/* Plan name */}
          <motion.h3 
            className="text-2xl font-bold mb-2 text-foreground"
            style={{ transform: 'translateZ(30px)' }}
          >
            {plan.name}
          </motion.h3>
          
          {/* Price with animation */}
          <motion.div 
            className="mb-4"
            style={{ transform: 'translateZ(40px)' }}
          >
            <span className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ₹{plan.price}
            </span>
          </motion.div>

          {/* Delivery time */}
          {plan.delivery && (
            <div className="mb-4 text-sm text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Delivery: {plan.delivery}
            </div>
          )}

          {/* Features */}
          <ul className="space-y-3 mb-6">
            {plan.features.map((feature, i) => (
              <motion.li 
                key={i} 
                className="flex items-start gap-3 text-sm"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i + index * 0.1 }}
              >
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-foreground/90">{feature}</span>
              </motion.li>
            ))}
          </ul>

          {/* Description */}
          {plan.description && (
            <p className="text-xs text-muted-foreground mb-4">{plan.description}</p>
          )}

          {/* Add to cart button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              className="w-full relative overflow-hidden group/btn"
              variant={popular ? 'default' : 'outline'}
              onClick={() => onAddToCart(plan)}
              disabled={isAdding}
            >
              {/* Button shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
              />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isAdding ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      ✓
                    </motion.span>
                    Added!
                  </>
                ) : (
                  <>
                    Add to Cart
                    <ShoppingCart className="w-4 h-4" />
                  </>
                )}
              </span>
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ParallaxPricingCard;
