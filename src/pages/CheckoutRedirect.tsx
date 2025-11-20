import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";

const CheckoutRedirect = () => {
  const navigate = useNavigate();
  const { getTotal, items } = useCart();
  const [stage, setStage] = useState<'verifying'>('verifying');
  const [error, setError] = useState<string | null>(null);
  const total = getTotal();

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    const initiatePayment = async () => {
      try {
        setStage('verifying');
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Navigate to payment details page with order info
        const orderId = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        navigate(`/payment-details?order_id=${orderId}&amount=${total}`);
      } catch (err: any) {
        console.error('Payment error:', err);
        setError(err.message || 'Failed to proceed to payment');
        setTimeout(() => navigate('/cart'), 3000);
      }
    };

    initiatePayment();
  }, [items, navigate, total]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-destructive/50">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-destructive text-2xl">✕</span>
            </div>
            <h2 className="text-2xl font-semibold mb-2">Payment Error</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <p className="text-sm text-muted-foreground">Redirecting to cart...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-12 text-center">
          {stage === 'verifying' && (
            <>
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6 mx-auto" />
              <h2 className="text-2xl font-semibold mb-2">Preparing Payment</h2>
              <p className="text-muted-foreground">Loading payment options...</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutRedirect;
