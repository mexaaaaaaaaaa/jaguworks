import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, CreditCard } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import ReCAPTCHA from "react-google-recaptcha";

const RECAPTCHA_SITE_KEY = "6Le2cBIsAAAAAI6HKsBSH6nH8rijvcT9juIVnyGU";

const CheckoutRedirect = () => {
  const navigate = useNavigate();
  const { getTotal, items } = useCart();
  const [stage, setStage] = useState<'cloudflare' | 'redirect' | 'processing'>('cloudflare');
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const total = getTotal();

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    const initiatePayment = async () => {
      try {
        // Wait for reCAPTCHA verification
        if (!captchaToken) {
          console.log('Waiting for reCAPTCHA verification...');
          return;
        }

        // Stage 2: Redirect to Gateway
        setStage('redirect');
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Stage 3: Processing
        setStage('processing');
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

    if (captchaToken) {
      initiatePayment();
    }
  }, [items, navigate, total, captchaToken]);

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
      <Card className="max-w-md w-full glass-frost border-2 border-primary/20">
        <CardContent className="p-12 text-center">
          {stage === 'cloudflare' && (
            <>
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto animate-pulse">
                  <Shield className="w-10 h-10 text-primary" />
                </div>
                <div className="absolute inset-0 w-20 h-20 mx-auto">
                  <div className="w-full h-full border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold mb-3 gradient-text">Securing Your Transaction</h2>
              <p className="text-muted-foreground mb-2">Please verify you're human...</p>
              <p className="text-xs text-muted-foreground/70 mb-4">Complete the verification below</p>
              <div className="flex justify-center">
                <ReCAPTCHA
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={(token) => setCaptchaToken(token)}
                  onExpired={() => setCaptchaToken(null)}
                  onError={() => setError('Verification failed')}
                  theme="dark"
                />
              </div>
            </>
          )}
          
          {stage === 'redirect' && (
            <>
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto animate-pulse">
                  <Lock className="w-10 h-10 text-primary" />
                </div>
                <div className="absolute inset-0 w-20 h-20 mx-auto">
                  <div className="w-full h-full border-4 border-accent border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold mb-3 gradient-text">Redirecting to Payment Gateway</h2>
              <p className="text-muted-foreground mb-2">Connecting to secure payment processor...</p>
              <p className="text-xs text-muted-foreground/70">Payment handled by external secure gateway</p>
            </>
          )}

          {stage === 'processing' && (
            <>
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto animate-pulse">
                  <CreditCard className="w-10 h-10 text-primary" />
                </div>
                <div className="absolute inset-0 w-20 h-20 mx-auto">
                  <div className="w-full h-full border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold mb-3 gradient-text">Processing Payment</h2>
              <p className="text-muted-foreground mb-2">Finalizing your order...</p>
              <p className="text-xs text-muted-foreground/70">Just a moment</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutRedirect;
