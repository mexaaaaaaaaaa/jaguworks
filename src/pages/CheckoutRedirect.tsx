import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutRedirect = () => {
  const navigate = useNavigate();
  const { getTotal, items, coupon } = useCart();
  const [stage, setStage] = useState<'verifying' | 'creating-order' | 'redirecting'>('verifying');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    const initiatePayment = async () => {
      try {
        // Stage 1: Cloudflare verification simulation (1.5 seconds)
        await new Promise(resolve => setTimeout(resolve, 1500));
        setStage('creating-order');

        // Stage 2: Create order via Supabase Edge Function
        console.log('Creating order with items:', items, 'coupon:', coupon, 'total:', getTotal());
        
        const { data, error } = await supabase.functions.invoke('create-order', {
          body: {
            items: items,
            coupon: coupon,
            total: getTotal(),
          },
        });

        if (error) {
          console.error('Order creation error:', error);
          throw new Error(error.message || 'Failed to create order');
        }

        console.log('Order created:', data);

        const { orderId, razorpayOrderId, amount, razorpayKeyId, isMockOrder } = data;

        // If using placeholder/mock keys, simulate success
        if (isMockOrder) {
          console.log('Mock order - simulating payment success');
          await new Promise(resolve => setTimeout(resolve, 2000));
          navigate(`/payment-return?status=success&order_id=${orderId}`);
          return;
        }

        // Stage 3: Load Razorpay script and open checkout
        setStage('redirecting');
        
        // Load Razorpay script dynamically
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
          // Initialize Razorpay checkout
          const options = {
            key: razorpayKeyId,
            amount: Math.round(amount * 100), // Amount in paise
            currency: 'INR',
            name: 'Minecraft Server Setup',
            description: 'Professional SMP Development',
            order_id: razorpayOrderId,
            handler: function (response: any) {
              // Payment successful
              console.log('Payment successful:', response);
              navigate(`/payment-return?status=success&order_id=${orderId}&payment_id=${response.razorpay_payment_id}`);
            },
            modal: {
              ondismiss: function () {
                // User closed the payment modal
                toast.error('Payment cancelled');
                navigate('/cart');
              }
            },
            prefill: {
              name: '',
              email: '',
              contact: '',
            },
            theme: {
              color: '#8B5CF6',
            },
            notes: {
              order_id: orderId,
            },
          };

          const rzp = new window.Razorpay(options);
          
          rzp.on('payment.failed', function (response: any) {
            console.error('Payment failed:', response);
            navigate(`/payment-return?status=failed&order_id=${orderId}&reason=${response.error.reason}`);
          });

          rzp.open();
        };
        
        script.onerror = () => {
          throw new Error('Failed to load Razorpay checkout');
        };
        
        document.body.appendChild(script);

      } catch (err: any) {
        console.error('Payment initiation error:', err);
        setError(err.message || 'Failed to initiate payment');
        toast.error(err.message || 'Failed to initiate payment');
        setTimeout(() => navigate('/cart'), 3000);
      }
    };

    initiatePayment();
  }, [navigate, getTotal, items, coupon]);

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-card/50 backdrop-blur-xl border-2 border-destructive animate-fade-in">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Payment Error</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <p className="text-sm text-muted-foreground">Redirecting back to cart...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-card/50 backdrop-blur-xl border-2 border-border animate-fade-in">
        <CardContent className="p-12 text-center">
          {stage === 'verifying' ? (
            <>
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Shield className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Security Verification</h2>
              <p className="text-muted-foreground mb-6">
                Verifying your connection security...
              </p>
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Please wait</span>
              </div>
            </>
          ) : stage === 'creating-order' ? (
            <>
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Creating Order</h2>
              <p className="text-muted-foreground mb-6">
                Preparing your secure payment...
              </p>
              <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary w-0 animate-[width_2s_ease-in-out_forwards]" />
              </div>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Opening Payment Gateway</h2>
              <p className="text-muted-foreground mb-6">
                Loading Razorpay secure checkout...
              </p>
              <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-pulse" />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutRedirect;
