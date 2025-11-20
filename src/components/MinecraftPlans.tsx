import { Server, Zap, Shield, Settings, Sparkles, ChevronRight, Check, Plus, Boxes, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const MinecraftPlans = () => {
  const plans = [
    {
      name: "BASIC PLAN",
      price: "₹199",
      delivery: "1 Day",
      icon: Server,
      features: [
        "Basic SMP Setup",
        "EssentialsX + Permissions",
        "Spawn Setup",
        "Optimization",
        "Basic Commands",
        "Free bug fixes for 24 hours"
      ],
      gradient: "from-neon-purple/20 to-neon-blue/20",
      glowColor: "neon-purple"
    },
    {
      name: "ADVANCED PLAN",
      price: "₹499",
      delivery: "2–3 Days",
      icon: Zap,
      popular: true,
      features: [
        "Everything in Basic +",
        "Full Rank System",
        "Custom Scoreboards",
        "Professional GUI Menus",
        "Kits Setup",
        "Anti-Lag Tweaks",
        "Security Setup"
      ],
      gradient: "from-neon-cyan/20 to-neon-blue/20",
      glowColor: "neon-cyan"
    },
    {
      name: "PREMIUM PLAN",
      price: "₹999",
      delivery: "3–5 Days",
      icon: Crown,
      features: [
        "Everything in Advanced +",
        "Completely custom ranks & tags",
        "Custom GUIs",
        "Crates setup",
        "Events system",
        "Custom worlds",
        "Cloudflare Security Optional",
        "Full optimization",
        "7 Days Free support"
      ],
      gradient: "from-neon-pink/20 to-neon-purple/20",
      glowColor: "neon-pink"
    }
  ];

  const addOns = [
    { icon: Settings, name: "Custom Ranks" },
    { icon: Boxes, name: "GUI Menus" },
    { icon: Plus, name: "New Plugins" },
    { icon: Sparkles, name: "Tweaks & Fixes" },
    { icon: Zap, name: "Extra Commands" },
    { icon: Server, name: "Crates" },
    { icon: Settings, name: "Shops" }
  ];

  const paymentMethods = ["UPI", "Paytm", "PhonePe", "Google Pay"];

  return (
    <section id="minecraft-plans" className="py-20 px-4 md:px-8 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 grid-background opacity-20" />
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-neon-purple/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Minecraft Server Development</span>
            <br />
            <span className="text-foreground">& Setup Plans</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Fast, professional SMP setup services with premium plugins, custom features, 
            clean optimization, and Cloudflare protection options.
          </p>
        </div>

        {/* Pricing Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <Card
                key={index}
                className={`relative group bg-card/50 backdrop-blur-xl border-2 border-border hover:border-${plan.glowColor} transition-all duration-500 animate-slide-in-up overflow-hidden`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Glow effect on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute top-4 right-4 bg-neon-cyan text-background px-3 py-1 rounded-full text-xs font-bold animate-glow-pulse">
                    POPULAR
                  </div>
                )}

                <CardContent className="p-8 relative z-10">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-6 glow-${plan.glowColor} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-foreground" />
                  </div>

                  {/* Plan name */}
                  <h3 className="text-2xl font-bold mb-2 text-foreground">{plan.name}</h3>
                  
                  {/* Price */}
                  <div className="mb-4">
                    <span className={`text-5xl font-bold text-${plan.glowColor}`}>{plan.price}</span>
                  </div>

                  {/* Delivery */}
                  <div className="flex items-center gap-2 mb-6 text-muted-foreground">
                    <Zap className="w-4 h-4" />
                    <span>Delivery: {plan.delivery}</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className={`w-5 h-5 text-${plan.glowColor} flex-shrink-0 mt-0.5`} />
                        <span className="text-foreground/90">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button 
                    className={`w-full group/btn bg-${plan.glowColor}/20 hover:bg-${plan.glowColor}/30 text-foreground border border-${plan.glowColor} relative overflow-hidden`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Order {plan.name.split(' ')[0]} Setup
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                    <div className={`absolute inset-0 bg-${plan.glowColor}/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300`} />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Extra Add-ons Section */}
        <Card className="mb-8 bg-card/50 backdrop-blur-xl border-2 border-border hover:border-primary transition-all duration-500 animate-slide-in-up">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 gradient-text">EXTRA ADD-ONS</h3>
                <p className="text-muted-foreground mb-4">
                  For custom additions beyond the plan.
                </p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-primary">₹99</span>
                  <span className="text-muted-foreground">per extra feature</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {addOns.map((addon, i) => {
                    const AddonIcon = addon.icon;
                    return (
                      <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border text-sm">
                        <AddonIcon className="w-3.5 h-3.5 text-primary" />
                        <span>{addon.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 group">
                Add-on Request
                <Plus className="w-4 h-4 ml-2 group-hover:rotate-90 transition-transform duration-300" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cloudflare Protection Card */}
        <Card className="mb-8 bg-gradient-to-br from-neon-cyan/10 to-neon-blue/10 backdrop-blur-xl border-2 border-neon-cyan hover:border-neon-cyan/80 transition-all duration-500 animate-slide-in-up glow-secondary">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-neon-cyan/20 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-neon-cyan" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Enable Cloudflare Protection</h3>
                </div>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center gap-2 text-foreground/90">
                    <Check className="w-4 h-4 text-neon-cyan" />
                    <span>DDoS Protection</span>
                  </li>
                  <li className="flex items-center gap-2 text-foreground/90">
                    <Check className="w-4 h-4 text-neon-cyan" />
                    <span>DNS Shield</span>
                  </li>
                  <li className="flex items-center gap-2 text-foreground/90">
                    <Check className="w-4 h-4 text-neon-cyan" />
                    <span>SSL Security</span>
                  </li>
                </ul>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-neon-cyan">₹149</span>
                </div>
              </div>
              <Button className="bg-neon-cyan hover:bg-neon-cyan/90 text-background h-12 px-8 group glow-secondary">
                Add Cloudflare Shield
                <Shield className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform duration-300" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Options & Hosting Note */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide-in-up">
          {/* Payment Methods */}
          <Card className="bg-card/50 backdrop-blur-xl border-2 border-border">
            <CardContent className="p-6">
              <h4 className="text-xl font-bold mb-4 text-foreground">Payment Options</h4>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {paymentMethods.map((method, i) => (
                  <div key={i} className="px-4 py-3 rounded-lg bg-muted/50 border border-border text-center font-medium">
                    {method}
                  </div>
                ))}
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 font-bold group">
                Pay Now
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* Hosting Note */}
          <Card className="bg-card/50 backdrop-blur-xl border-2 border-border">
            <CardContent className="p-6 flex flex-col justify-center h-full">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Server className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 text-foreground">Hosting Requirements</h4>
                  <p className="text-muted-foreground">
                    Customers must provide their own hosting panel or server console access for setup and configuration.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MinecraftPlans;
