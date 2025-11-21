import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Server, ShoppingCart, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import plansData from "@/data/minecraft-plans.json";
import SEO from "@/components/SEO";

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

  return (
    <>
      <SEO 
        title="Minecraft Server Setup Plans - Jagmohan | Professional SMP Developer"
        description="Professional Minecraft SMP server setup plans by Jagmohan. Choose from Starter (₹49), Standard (₹199), Pro (₹499), or Premium (₹999) plans. Fast delivery with custom features."
        keywords="minecraft server setup, minecraft smp, minecraft developer, custom minecraft server, minecraft server plans, professional minecraft setup"
      />
      <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold gradient-text">Minecraft Plans</h1>
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
              <span className="gradient-text">Minecraft Plans</span>
              <br />
              <span className="text-foreground">Developer SMP Setup Plans</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-4">
              Professional server setup — Fast & Professional Delivery
            </p>
            <p className="text-sm text-muted-foreground/80 max-w-2xl mx-auto">
              Note: Customers must provide their own hosting (server files or console access).
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {plansData.plans.map((plan, index) => (
              <Card
                key={plan.id}
                className="relative group bg-card/50 backdrop-blur-xl border-2 border-border hover:border-primary transition-all duration-500 animate-slide-in-up overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardContent className="p-6 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Server className="w-6 h-6 text-primary" />
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

          {/* Feature Comparison Table */}
          <Card className="bg-card/50 backdrop-blur-xl border-2 border-border">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-center gradient-text">Feature Comparison</h3>
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
                    <tr className="border-b border-border/50">
                      <td className="py-4 px-4">Basic SMP Setup</td>
                      {plansData.plans.map((plan) => (
                        <td key={plan.id} className="text-center py-4 px-4">
                          <Check className="w-5 h-5 text-primary mx-auto" />
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-4 px-4">Custom Ranks</td>
                      <td className="text-center py-4 px-4 text-muted-foreground">1 slot</td>
                      <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                      <td className="text-center py-4 px-4 text-muted-foreground">2 ranks</td>
                      <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-4 px-4">GUI Menus</td>
                      <td className="text-center py-4 px-4">—</td>
                      <td className="text-center py-4 px-4 text-muted-foreground">Basic</td>
                      <td className="text-center py-4 px-4 text-muted-foreground">Advanced</td>
                      <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-4 px-4">Economy Setup</td>
                      <td className="text-center py-4 px-4">—</td>
                      <td className="text-center py-4 px-4">—</td>
                      <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                      <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-4 px-4">Priority Support</td>
                      <td className="text-center py-4 px-4">—</td>
                      <td className="text-center py-4 px-4">—</td>
                      <td className="text-center py-4 px-4">—</td>
                      <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-8 text-center">
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

export default MinecraftPlans;
