import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ShoppingCart, ArrowLeft, Copy } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";

const DiscordPlans = () => {
  const navigate = useNavigate();
  const { addItem, items } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'protection' | 'redirect' | 'complete'>('protection');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: 49,
      description: "Basic Discord server setup",
      features: [
        "Channel structure setup",
        "Basic role configuration",
        "Welcome message setup",
        "Server icon & banner",
        "Basic permissions"
      ]
    },
    {
      id: "pro",
      name: "Pro",
      price: 199,
      description: "Advanced server with bots & automation",
      popular: true,
      features: [
        "Everything in Starter",
        "Custom roles & hierarchy",
        "Reaction role GUI setup",
        "Bot setup (Carl-bot, MEE6, Dyno)",
        "Zira & Embed Bot configuration",
        "Custom emoji pack",
        "Moderation commands"
      ]
    },
    {
      id: "elite",
      name: "Elite",
      price: 499,
      description: "Complete professional setup with priority delivery",
      features: [
        "Everything in Pro",
        "Priority 24h delivery",
        "Advanced automations",
        "Full moderation system",
        "Custom bot commands",
        "Dashboard integration",
        "Auto-backup setup",
        "Dedicated support"
      ]
    }
  ];

  const addons = [
    { id: "custom-roles", name: "Custom roles & permissions", price: 5 },
    { id: "reaction-gui", name: "Reaction role GUI", price: 5 },
    { id: "custom-bots", name: "Custom bots / commands", price: 5 },
    { id: "auto-birthday", name: "Auto birthday & welcome system", price: 5 },
    { id: "dashboard", name: "Server dashboard (webpanel)", price: 5 },
    { id: "cloudflare", name: "Cloudflare-protected payment & backups", price: 5 }
  ];

  const handleBuyNow = (plan: any) => {
    setSelectedPlan(plan);
    setCheckoutStep('protection');
    setShowCheckout(true);

    // Simulate Cloudflare protection
    setTimeout(() => {
      setCheckoutStep('redirect');
      setTimeout(() => {
        setCheckoutStep('complete');
        // Add to cart
        addItem({
          id: plan.id,
          name: `Discord ${plan.name} Plan`,
          price: plan.price,
          type: 'plan'
        });
      }, 2000);
    }, 1500);
  };

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const copyOrderPayload = () => {
    const payload = {
      plan: selectedPlan?.name,
      price: selectedPlan?.price,
      addons: selectedAddons.map(id => addons.find(a => a.id === id)?.name),
      discord_invite: "PLACEHOLDER_INVITE_LINK",
      admin_email: "jagmohandhaker@gmail.com",
      timestamp: new Date().toISOString()
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    toast.success("Order payload copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Portfolio
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Discord Plans — Developer Server Setup
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Professional Discord server setup | Fast delivery | Real-money pricing (India ready)
          </p>
          <p className="text-sm text-muted-foreground mt-4 max-w-2xl mx-auto">
            Developer Discord server setup services — custom roles, bots, automations, moderation, Cloudflare ready.
          </p>
        </div>

        {/* Important Note */}
        <div className="bg-card border border-border rounded-lg p-4 mb-8 max-w-4xl mx-auto">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Customers must provide Manage Server / Owner access or invite link with required permissions. 
            Admin/Manage Server access required for full setup; partial setup is possible via invite with correct permissions.
          </p>
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₹{plan.price}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full hover:scale-105 transition-all duration-300"
                  onClick={() => handleBuyNow(plan)}
                >
                  Order Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Add-ons Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4 text-center">Extra Features & Add-ons</h2>
          <p className="text-center text-muted-foreground mb-8">
            Add-on charge: <strong className="text-foreground">₹5 per extra feature</strong>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addons.map((addon) => (
              <Card 
                key={addon.id}
                className={`cursor-pointer transition-all duration-300 ${
                  selectedAddons.includes(addon.id) ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => toggleAddon(addon.id)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{addon.name}</h3>
                    <p className="text-sm text-muted-foreground">₹{addon.price.toLocaleString('en-IN')}</p>
                  </div>
                  {selectedAddons.includes(addon.id) && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bots Information */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Included Bot Setup</CardTitle>
              <CardDescription>Professional bot configuration and customization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['Carl-bot', 'MEE6', 'Dyno', 'Zira', 'Embed Bot'].map((bot) => (
                  <Badge key={bot} variant="secondary" className="justify-center py-2">
                    {bot}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Custom bot options available in add-ons section
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Cart Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button 
            size="lg"
            className="rounded-full shadow-lg"
            onClick={() => navigate('/cart')}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Cart ({items.length})
          </Button>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {checkoutStep === 'protection' && 'Security Check'}
                {checkoutStep === 'redirect' && 'Processing Payment'}
                {checkoutStep === 'complete' && 'Order Confirmed!'}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {checkoutStep === 'protection' && (
                <div className="py-8">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Applying Cloudflare protection...</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Securing your transaction
                  </p>
                </div>
              )}
              {checkoutStep === 'redirect' && (
                <div className="py-8">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Redirecting to secure payment gateway...</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Payment handled by external gateway
                  </p>
                </div>
              )}
              {checkoutStep === 'complete' && (
                <div className="py-4">
                  <div className="bg-primary/10 rounded-full h-16 w-16 mx-auto mb-4 flex items-center justify-center">
                    <Check className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Added to Cart!</h3>
                  <p className="text-muted-foreground mb-4">
                    {selectedPlan?.name} Plan - ₹{selectedPlan?.price}
                  </p>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Required for setup:
                    </p>
                    <ul className="text-sm text-left space-y-2">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        Server invite link
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        Preferred role names
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        Channel list
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        Bot token (if custom bot)
                      </li>
                    </ul>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={copyOrderPayload}
                      className="w-full"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Order Details
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            {checkoutStep === 'complete' && (
              <CardFooter className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowCheckout(false)}
                >
                  Continue Shopping
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => navigate('/cart')}
                >
                  View Cart
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      )}

      {/* Contact Section */}
      <div className="container mx-auto px-4 pb-16">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Need Custom Setup?</CardTitle>
            <CardDescription>Contact us for custom requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                For custom Discord server setups, advanced automation, or bulk orders, reach out directly:
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = 'mailto:jagmohandhaker@gmail.com'}
              >
                Email: jagmohandhaker@gmail.com
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Confirmation URL: CONFIRMATION_URL_HERE
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DiscordPlans;
