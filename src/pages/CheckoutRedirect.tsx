import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";

const CheckoutRedirect = () => {
  const navigate = useNavigate();
  const { getTotal, items } = useCart();
  const [stage, setStage] = useState<'verifying' | 'redirecting'>('verifying');

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    // Simulate Cloudflare verification (2-3 seconds)
    const verifyTimer = setTimeout(() => {
      setStage('redirecting');
    }, 2500);

    // Simulate redirect to payment gateway (after 4 seconds total)
    const redirectTimer = setTimeout(() => {
      const orderId = `ORD_${Date.now()}`;
      const amount = getTotal();
      const returnUrl = encodeURIComponent(`${window.location.origin}/payment-return`);
      
      // PLACEHOLDER: Replace ⟪EXTERNAL_PAYMENT_URL⟫ with your actual payment gateway URL
      // Example: https://payment-gateway.example.com/checkout
      const paymentUrl = `⟪EXTERNAL_PAYMENT_URL⟫?order_id=${orderId}&amount=${amount}&return_url=${returnUrl}`;
      
      // For demo purposes, we'll simulate success and redirect to payment-return
      // In production, this would redirect to the actual payment gateway
      console.log('Payment URL:', paymentUrl);
      console.log('Order ID:', orderId);
      console.log('Amount:', amount);
      
      // Simulate payment success (remove this in production)
      navigate(`/payment-return?status=success&order_id=${orderId}`);
      
      // In production, uncomment this line to redirect to actual payment gateway:
      // window.location.href = paymentUrl;
    }, 4000);

    return () => {
      clearTimeout(verifyTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate, getTotal, items]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-card/50 backdrop-blur-xl border-2 border-border animate-fade-in">
        <CardContent className="p-12 text-center">
          {stage === 'verifying' ? (
            <>
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Shield className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Cloudflare Verification</h2>
              <p className="text-muted-foreground mb-6">
                Verifying your connection security...
              </p>
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Please wait</span>
              </div>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Redirecting to Payment</h2>
              <p className="text-muted-foreground mb-6">
                Taking you to the secure payment gateway...
              </p>
              <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary w-0 animate-[width_2s_ease-in-out_forwards]" />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutRedirect;
