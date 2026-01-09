import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, ShoppingCart, Check, Plus, Bot, Zap, Shield, Crown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import plansData from "@/data/discord-plans.json";
import SEO from "@/components/SEO";
import PlansHero from "@/components/PlansHero";
import ParallaxPricingCard from "@/components/ParallaxPricingCard";
import { StaggerContainer, StaggerItem, ScaleOnScroll, GeometricFloat, MouseGlow } from "@/components/ParallaxElements";
import Footer from "@/components/Footer";

const DiscordPlans = () => {
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

  const bots = ['Carl-bot', 'MEE6', 'Dyno', 'Zira', 'Embed Bot'];
  
  const planIcons = [
    <Zap className="w-7 h-7 text-primary" />,
    <Shield className="w-7 h-7 text-primary" />,
    <Crown className="w-7 h-7 text-primary" />,
  ];

  return (
    <>
      <SEO 
        title="Discord Server Setup Plans - Jagmohan | Professional Discord Developer"
        description="Professional Discord server setup services by Jagmohan. Choose from Starter (₹49), Pro (₹199), or Elite (₹499) plans. Custom bots, moderation, and automation included."
        keywords="discord server setup, discord developer, custom discord server, discord bot setup, discord moderation, professional discord setup"
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
              Discord Plans
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
          title="Discord Plans"
          subtitle="Developer Server Setup"
          description="Professional Discord server setup — Fast & Professional Delivery"
          note="Developer Discord server setup services — custom roles, bots, automations, moderation, Cloudflare ready."
          variant="discord"
        />

        <section className="py-20 px-4 md:px-8 relative">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <GeometricFloat variant="sphere" size={120} color="primary" className="absolute top-40 -right-20 opacity-30" index={0} />
            <GeometricFloat variant="diamond" size={90} color="accent" className="absolute bottom-60 -left-10 opacity-30" index={1} />
          </div>
          
          <div className="container mx-auto max-w-7xl relative z-10">
            {/* Important Note */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <Card className="bg-card/40 backdrop-blur-xl border-2 border-border max-w-4xl mx-auto overflow-hidden relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5"
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  style={{ backgroundSize: '200% 100%' }}
                />
                <CardContent className="p-6 relative z-10">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Note:</strong> Customers must provide Manage Server / Owner access or invite link with required permissions. 
                    Admin/Manage Server access required for full setup; partial setup is possible via invite with correct permissions.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pricing Cards Grid */}
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {plansData.plans.map((plan, index) => (
                <StaggerItem key={plan.id}>
                  <ParallaxPricingCard
                    plan={plan}
                    index={index}
                    icon={planIcons[index] || <MessageSquare className="w-7 h-7 text-primary" />}
                    onAddToCart={handleAddToCart}
                    isAdding={addingPlan === plan.id}
                    popular={index === 1}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Included Bots Section */}
            <ScaleOnScroll>
              <motion.div className="mb-20">
                <Card className="relative overflow-hidden bg-card/40 backdrop-blur-xl border-2 border-border hover:border-accent transition-all duration-500">
                  {/* Animated gradient background */}
                  <motion.div
                    className="absolute inset-0 opacity-20"
                    style={{
                      background: 'radial-gradient(ellipse at 50% 50%, hsl(var(--primary) / 0.3), transparent 70%)',
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  
                  <CardContent className="p-8 relative z-10">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      <h3 className="text-3xl font-bold mb-4 gradient-text flex items-center gap-3">
                        <Bot className="w-8 h-8" />
                        Included Bot Setup
                      </h3>
                      <p className="text-muted-foreground mb-8 text-lg">
                        Professional bot configuration and customization
                      </p>
                    </motion.div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {bots.map((bot, index) => (
                        <motion.div
                          key={bot}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.1, y: -5 }}
                        >
                          <Badge 
                            variant="secondary" 
                            className="w-full justify-center py-3 text-sm bg-muted/50 border border-border/50 hover:bg-primary/20 hover:border-primary/50 transition-all duration-300"
                          >
                            {bot}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                    <motion.p 
                      className="text-sm text-muted-foreground mt-6 flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 }}
                    >
                      <Sparkles className="w-4 h-4 text-accent" />
                      Custom bot options available in add-ons section
                    </motion.p>
                  </CardContent>
                </Card>
              </motion.div>
            </ScaleOnScroll>

            {/* Extra Features & Add-ons */}
            <ScaleOnScroll>
              <motion.div className="mb-20">
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

            {/* View Cart CTA */}
            <ScaleOnScroll>
              <Card className="relative overflow-hidden bg-card/40 backdrop-blur-xl border-2 border-border">
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: 'radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.3), transparent 60%)',
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
                
                <CardContent className="p-12 relative z-10">
                  <motion.div 
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-3xl font-bold mb-4 gradient-text">Ready to Get Started?</h3>
                    <p className="text-muted-foreground mb-8 text-lg">
                      Add plans to your cart and proceed to checkout
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="lg"
                        onClick={() => navigate('/cart')}
                        className="group relative overflow-hidden text-lg px-8 py-6"
                      >
                        <motion.span
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                        />
                        <span className="relative z-10 flex items-center gap-3">
                          View Cart & Checkout
                          <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
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

export default DiscordPlans;