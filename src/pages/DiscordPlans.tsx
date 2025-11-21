import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, ShoppingCart, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import plansData from "@/data/discord-plans.json";
import SEO from "@/components/SEO";

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

  return (
    <>
      <SEO 
        title="Discord Server Setup Plans - Jagmohan | Professional Discord Developer"
        description="Professional Discord server setup services by Jagmohan. Choose from Starter (₹49), Pro (₹199), or Elite (₹499) plans. Custom bots, moderation, and automation included."
        keywords="discord server setup, discord developer, custom discord server, discord bot setup, discord moderation, professional discord setup"
      />
      <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold gradient-text">Discord Plans</h1>
          <Button
            variant="outline"
            className="relative"
            onClick={() => navigate('/cart')}
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {cartItemCount}
              </span>
            )}
          </Button>
        </div>
      </header>

      <section className="py-20 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-slide-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Discord Plans</span>
              <br />
              <span className="text-foreground">Developer Server Setup</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-4">
              Professional Discord server setup — Fast & Professional Delivery
            </p>
            <p className="text-sm text-muted-foreground/80 max-w-2xl mx-auto">
              Developer Discord server setup services — custom roles, bots, automations, moderation, Cloudflare ready.
            </p>
          </div>

          {/* Important Note */}
          <Card className="mb-12 bg-card/50 backdrop-blur-xl border-2 border-border max-w-4xl mx-auto">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Note:</strong> Customers must provide Manage Server / Owner access or invite link with required permissions. 
                Admin/Manage Server access required for full setup; partial setup is possible via invite with correct permissions.
              </p>
            </CardContent>
          </Card>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {plansData.plans.map((plan, index) => (
              <Card
                key={plan.id}
                className="relative group bg-card/50 backdrop-blur-xl border-2 border-border hover:border-primary transition-all duration-500 animate-slide-in-up overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardContent className="p-6 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>

                  <h3 className="text-2xl font-bold mb-2 text-foreground">{plan.name}</h3>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-primary">₹{plan.price}</span>
                  </div>

                  <div className="mb-4 text-sm text-muted-foreground">
                    Delivery: {plan.delivery}
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground/90">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="text-xs text-muted-foreground mb-4">{plan.description}</p>

                  <Button
                    className="w-full group/btn transition-all duration-300"
                    variant="outline"
                    onClick={() => handleAddToCart(plan)}
                    disabled={addingPlan === plan.id}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {addingPlan === plan.id ? "Added!" : "Add to Cart"}
                      <ShoppingCart className="w-4 h-4" />
                    </span>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Included Bots Section */}
          <Card className="mb-16 bg-card/50 backdrop-blur-xl border-2 border-border hover:border-accent transition-all duration-500">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 gradient-text">Included Bot Setup</h3>
              <p className="text-muted-foreground mb-6">
                Professional bot configuration and customization
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {bots.map((bot) => (
                  <Badge 
                    key={bot} 
                    variant="secondary" 
                    className="justify-center py-2 text-sm"
                  >
                    {bot}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Custom bot options available in add-ons section
              </p>
            </CardContent>
          </Card>

          {/* Extra Features & Add-ons */}
          <Card className="mb-16 bg-card/50 backdrop-blur-xl border-2 border-border hover:border-accent transition-all duration-500">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 gradient-text">Extra Features & Custom Add-ons</h3>
              <p className="text-muted-foreground mb-6">
                Add-on Charge: <span className="text-accent font-bold text-xl">₹5 per extra feature</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {plansData.addons.map((addon) => (
                  <div
                    key={addon.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <Plus className="w-5 h-5 text-accent" />
                      <span className="font-medium">{addon.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* View Cart CTA */}
          <Card className="bg-card/50 backdrop-blur-xl border-2 border-border">
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4 gradient-text">Ready to Get Started?</h3>
                <p className="text-muted-foreground mb-6">
                  Add plans to your cart and proceed to checkout
                </p>
                <Button
                  size="lg"
                  onClick={() => navigate('/cart')}
                  className="group"
                >
                  View Cart & Checkout
                  <ShoppingCart className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      </div>
    </>
  );
};

export default DiscordPlans;
