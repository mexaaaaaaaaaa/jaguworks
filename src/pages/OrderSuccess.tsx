import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft, Copy, Mail, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface OrderDetails {
  order_id: string;
  buyer_name: string;
  buyer_email: string;
  buyer_discord?: string;
  plan_name: string;
  plan_price: number;
  cloudflare_enabled: boolean;
  total_amount: number;
  status: string;
  created_at: string;
}

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!orderId) {
      navigate("/");
      return;
    }

    const fetchOrder = async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("order_id", orderId)
          .single();

        if (error) throw error;
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
        toast({
          title: "Error",
          description: "Failed to load order details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate, toast]);

  const copyOrderId = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      toast({
        title: "Copied!",
        description: "Order ID copied to clipboard"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Order Not Found</CardTitle>
            <CardDescription>The order you're looking for doesn't exist</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-20 px-4">
      <div className="container max-w-3xl mx-auto">
        <Card className="glass-card border-primary/20 mb-6">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-3xl">Order Placed Successfully!</CardTitle>
            <CardDescription className="text-base">
              Thank you for your purchase. We'll get started on your server setup right away.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Order ID</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyOrderId}
                  className="h-8 px-2"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <p className="font-mono text-lg font-bold">{order.order_id}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Plan</p>
                <p className="font-semibold">{order.plan_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                <p className="font-semibold text-primary text-xl">₹{order.total_amount}</p>
              </div>
              {order.cloudflare_enabled && (
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground mb-1">Add-ons</p>
                  <p className="font-semibold text-secondary">✓ Cloudflare Protection</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Next Steps
              </h3>
              <ol className="text-sm space-y-2 ml-6 list-decimal">
                <li>Check your email ({order.buyer_email}) for order confirmation</li>
                <li>Provide your server hosting panel/console access</li>
                <li>We'll start working on your server setup immediately</li>
                <li>You'll receive updates via email</li>
              </ol>
            </div>

            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-sm">
                <strong>Important:</strong> Please send your server hosting details to complete the setup.
                {order.buyer_discord && ` We'll contact you on Discord: ${order.buyer_discord}`}
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => navigate("/")} variant="outline" className="flex-1">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
              <Button
                variant="default"
                className="flex-1 glow-primary"
                onClick={() => window.open("https://discord.gg/6CdCgjsVua", "_blank")}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact on Discord
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-secondary/20">
          <CardHeader>
            <CardTitle className="text-xl">Payment Instructions</CardTitle>
            <CardDescription>Complete your payment using any of these methods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-card border border-border rounded-lg text-center">
                <p className="font-semibold text-sm">UPI</p>
              </div>
              <div className="p-3 bg-card border border-border rounded-lg text-center">
                <p className="font-semibold text-sm">PhonePe</p>
              </div>
              <div className="p-3 bg-card border border-border rounded-lg text-center">
                <p className="font-semibold text-sm">Paytm</p>
              </div>
              <div className="p-3 bg-card border border-border rounded-lg text-center">
                <p className="font-semibold text-sm">Google Pay</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Contact us on Discord for payment details and confirmation
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderSuccess;