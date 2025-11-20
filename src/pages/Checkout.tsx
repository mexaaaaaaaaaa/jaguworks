import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, ArrowLeft, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CartItem {
  planName: string;
  planPrice: number;
  delivery: string;
  features: string[];
}

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [cart, setCart] = useState<CartItem | null>(null);
  const [cloudflareEnabled, setCloudflareEnabled] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    discord: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const CLOUDFLARE_PRICE = 149;

  useEffect(() => {
    const planName = searchParams.get("plan");
    const planPrice = searchParams.get("price");
    const delivery = searchParams.get("delivery");
    
    if (planName && planPrice) {
      setCart({
        planName,
        planPrice: parseFloat(planPrice),
        delivery: delivery || "1-3 Days",
        features: []
      });
    } else {
      navigate("/");
    }
  }, [searchParams, navigate]);

  const totalAmount = cart ? cart.planPrice + (cloudflareEnabled ? CLOUDFLARE_PRICE : 0) : 0;

  const handleCheckout = async () => {
    if (!buyerInfo.name || !buyerInfo.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and email",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create order in database
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      const { data, error } = await supabase
        .from("orders")
        .insert({
          order_id: orderId,
          buyer_name: buyerInfo.name,
          buyer_email: buyerInfo.email,
          buyer_phone: buyerInfo.phone,
          buyer_discord: buyerInfo.discord,
          plan_name: cart!.planName,
          plan_price: cart!.planPrice,
          cloudflare_enabled: cloudflareEnabled,
          total_amount: totalAmount,
          status: "pending"
        })
        .select()
        .single();

      if (error) throw error;

      // For now, redirect to a payment instruction page
      // In production, integrate with Razorpay/PayU/Instamojo
      navigate(`/order-success?orderId=${orderId}`);
      
      toast({
        title: "Order Created!",
        description: `Order ID: ${orderId}. Redirecting to payment...`,
      });
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process order",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cart) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-20 px-4">
      <div className="container max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Plans
        </Button>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Order Summary */}
          <Card className="glass-card border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Order Summary</CardTitle>
              <CardDescription>Review your purchase</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h3 className="font-bold text-lg mb-1">{cart.planName}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Delivery: {cart.delivery}
                </p>
                <p className="text-2xl font-bold text-primary">₹{cart.planPrice}</p>
              </div>

              <div className="flex items-start space-x-3 p-4 border border-secondary/30 rounded-lg bg-secondary/5 hover:bg-secondary/10 transition-colors cursor-pointer"
                   onClick={() => setCloudflareEnabled(!cloudflareEnabled)}>
                <Checkbox
                  checked={cloudflareEnabled}
                  onCheckedChange={(checked) => setCloudflareEnabled(checked === true)}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-secondary" />
                    <Label className="font-semibold cursor-pointer">Cloudflare Protection</Label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    DDoS protection, DNS shield, SSL security
                  </p>
                  <p className="text-sm font-bold text-secondary mt-1">+ ₹{CLOUDFLARE_PRICE}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex justify-between text-sm mb-2">
                  <span>Plan Price</span>
                  <span>₹{cart.planPrice}</span>
                </div>
                {cloudflareEnabled && (
                  <div className="flex justify-between text-sm mb-2">
                    <span>Cloudflare Protection</span>
                    <span>₹{CLOUDFLARE_PRICE}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold mt-3 pt-3 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">₹{totalAmount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Buyer Information */}
          <Card className="glass-card border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Your Details</CardTitle>
              <CardDescription>We'll send order confirmation here</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Jagmohan"
                  value={buyerInfo.name}
                  onChange={(e) => setBuyerInfo({ ...buyerInfo, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={buyerInfo.email}
                  onChange={(e) => setBuyerInfo({ ...buyerInfo, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={buyerInfo.phone}
                  onChange={(e) => setBuyerInfo({ ...buyerInfo, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discord">Discord Username (Optional)</Label>
                <Input
                  id="discord"
                  placeholder="username#1234"
                  value={buyerInfo.discord}
                  onChange={(e) => setBuyerInfo({ ...buyerInfo, discord: e.target.value })}
                />
              </div>

              <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-xs text-yellow-600 dark:text-yellow-400">
                  <strong>Note:</strong> You must provide server hosting access after payment.
                </p>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full glow-primary"
                size="lg"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {isProcessing ? "Processing..." : `Proceed to Pay ₹${totalAmount}`}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;