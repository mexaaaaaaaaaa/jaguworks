import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Server, ShoppingCart, Check, Plus, Sparkles, Zap, Shield, Crown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import plansData from "@/data/minecraft-plans.json";
import SEO from "@/components/SEO";
import PlansHero from "@/components/PlansHero";
import ParallaxPricingCard from "@/components/ParallaxPricingCard";
import { StaggerContainer, StaggerItem, ScaleOnScroll, GeometricFloat, MouseGlow } from "@/components/ParallaxElements";
import Footer from "@/components/Footer";

const MinecraftPlans = () => {
  const navigate = useNavigate();
  const { addItem, items } = useCart();
  const [addingPlan, setAddingPlan] = useState<string | null>(null);

  const handleAddToCart = (plan: typeof plansData.plans[0]) => {
    setAddingPlan(plan.id);
    addItem({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      type: 'plan',
    });
    toast.success(`${plan.name} added to cart!`);
    setTimeout(() => setAddingPlan(null), 500);
  };

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const planIcons = [
    <Zap className="w-7 h-7 text-primary" />,
    <Sparkles className="w-7 h-7 text-primary" />,
    <Shield className="w-7 h-7 text-primary" />,
    <Crown className="w-7 h-7 text-primary" />,
  ];

  return (
    <>
      <SEO 
        title="Minecraft Server Setup Plans - Jagmohan | Professional SMP Developer"
        description="Professional Minecraft SMP server setup plans by Jagmohan. Choose from Starter (₹49), Standard (₹199), Pro (₹499), or Premium (₹999) plans. Fast delivery with custom features."
        keywords="minecraft server setup, minecraft smp, minecraft developer, custom minecraft server, minecraft server plans, professional minecraft setup"
      />
      <div className="min-h-screen bg-background text-foreground overflow-hidden">
        {/* Mouse glow effect */}
        <MouseGlow className="hidden md:block" />
        
        {/* Floating Header */}
        <motion.header 
          className="sticky top-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-border/50"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <motion.h1 
              className="text-2xl font-bold gradient-text"
              whileHover={{ scale: 1.05 }}
            >
              Minecraft Plans
            </motion.h1>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="relative group"
                onClick={() => navigate('/cart')}
              >
                <ShoppingCart className="w-5 h-5" />
                <AnimatePresence>
                  {cartItemCount > 0 && (
                    <motion.span 
                      className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      {cartItemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </motion.header>

        {/* Parallax Hero Section */}
        <PlansHero
          title="Minecraft Plans"
          subtitle="Developer SMP Setup Plans"
          description="Professional server setup — Fast & Professional Delivery"
          note="Note: Customers must provide their own hosting (server files or console access)."
          variant="minecraft"
        />

        <section className="py-20 px-4 md:px-8 relative">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <GeometricFloat variant="ring" size={150} color="primary" className="absolute top-20 -left-20 opacity-30" index={0} />
            <GeometricFloat variant="cube" size={80} color="accent" className="absolute bottom-40 -right-10 opacity-30" index={1} />
          </div>
          
          <div className="container mx-auto max-w-7xl relative z-10">
            {/* Pricing Cards Grid */}
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              {plansData.plans.map((plan, index) => (
                <StaggerItem key={plan.id}>
                  <ParallaxPricingCard
                    plan={plan}
                    index={index}
                    icon={planIcons[index] || <Server className="w-7 h-7 text-primary" />}
                    onAddToCart={handleAddToCart}
                    isAdding={addingPlan === plan.id}
                    popular={index === 2}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Extra Features & Add-ons with parallax */}
            <ScaleOnScroll>
              <motion.div
                className="mb-20"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <Card className="relative overflow-hidden bg-card/40 backdrop-blur-xl border-2 border-border hover:border-accent transition-all duration-500">
                  {/* Animated border */}
                  <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                      background: 'linear-gradient(90deg, transparent, hsl(var(--accent) / 0.3), transparent)',
                      backgroundSize: '200% 100%',
                    }}
                    animate={{
                      backgroundPosition: ['200% 0%', '-200% 0%'],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  />
                  
                  <CardContent className="p-8 relative z-10">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      <h3 className="text-3xl font-bold mb-4 gradient-text flex items-center gap-3">
                        <Sparkles className="w-8 h-8" />
                        Extra Features & Custom Add-ons
                      </h3>
                      <p className="text-muted-foreground mb-8 text-lg">
                        Add-on Charge: <span className="text-accent font-bold text-2xl">₹5 per extra feature</span>
                      </p>
                    </motion.div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {plansData.addons.map((addon, index) => (
                        <motion.div
                          key={addon.id}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02, x: 10 }}
                          className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50 backdrop-blur-sm hover:bg-muted/50 hover:border-accent/50 transition-all duration-300"
                        >
                          <div className="flex items-center gap-3">
                            <motion.div
                              className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center"
                              whileHover={{ rotate: 180 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Plus className="w-5 h-5 text-accent" />
                            </motion.div>
                            <span className="font-medium text-foreground">{addon.name}</span>
                          </div>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-accent/20"
                              onClick={() => {
                                addItem({
                                  id: addon.id,
                                  name: addon.name,
                                  price: addon.price,
                                  type: 'addon',
                                });
                                toast.success(`${addon.name} added to cart!`);
                              }}
                            >
                              <ShoppingCart className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </ScaleOnScroll>

            {/* Feature Comparison Table */}
            <ScaleOnScroll>
              <Card className="relative overflow-hidden bg-card/40 backdrop-blur-xl border-2 border-border">
                <CardContent className="p-8">
                  <motion.h3 
                    className="text-3xl font-bold mb-8 text-center gradient-text"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    Feature Comparison
                  </motion.h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-4 px-4 font-bold">Feature</th>
                          {plansData.plans.map((plan) => (
                            <th key={plan.id} className="text-center py-4 px-4 font-bold">{plan.name}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { feature: 'Basic SMP Setup', values: [true, true, true, true] },
                          { feature: 'Custom Ranks', values: ['1 slot', true, '2 ranks', true] },
                          { feature: 'GUI Menus', values: ['—', 'Basic', 'Advanced', true] },
                          { feature: 'Economy Setup', values: ['—', '—', true, true] },
                          { feature: 'Priority Support', values: ['—', '—', '—', true] },
                        ].map((row, rowIndex) => (
                          <motion.tr 
                            key={row.feature}
                            className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: rowIndex * 0.1 }}
                          >
                            <td className="py-4 px-4 font-medium">{row.feature}</td>
                            {row.values.map((value, colIndex) => (
                              <td key={colIndex} className="text-center py-4 px-4">
                                {value === true ? (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + rowIndex * 0.1 }}
                                    className="inline-flex"
                                  >
                                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                      <Check className="w-4 h-4 text-primary" />
                                    </div>
                                  </motion.div>
                                ) : (
                                  <span className="text-muted-foreground">{value}</span>
                                )}
                              </td>
                            ))}
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <motion.div 
                    className="mt-10 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="lg"
                        onClick={() => navigate('/cart')}
                        className="group relative overflow-hidden"
                      >
                        <motion.span
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                        />
                        <span className="relative z-10 flex items-center gap-2">
                          View Cart & Checkout
                          <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </span>
                      </Button>
                    </motion.div>
                  </motion.div>
                </CardContent>
              </Card>
            </ScaleOnScroll>
          </div>
        </section>
        
        <Footer />
      </div>
    </>
  );
};

export default MinecraftPlans;