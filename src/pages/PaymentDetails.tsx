import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, ArrowLeft, CreditCard, Smartphone } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

export default function PaymentDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'bank' | null>(null);

  const orderId = searchParams.get('order_id');
  const amount = searchParams.get('amount');

  useEffect(() => {
    if (!orderId || !amount) {
      navigate('/cart');
    }
  }, [orderId, amount, navigate]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handlePaymentComplete = () => {
    clearCart();
    navigate(`/payment-return?status=success&order_id=${orderId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate('/cart')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Complete Your Payment</h1>
          <p className="text-muted-foreground">Choose your preferred payment method</p>
          <div className="mt-4 inline-block bg-primary/10 px-6 py-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Order ID: {orderId}</p>
            <p className="text-3xl font-bold text-primary">₹{amount}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card 
            className={`cursor-pointer transition-all hover:shadow-lg ${selectedMethod === 'upi' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedMethod('upi')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                UPI Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Pay using any UPI app (Google Pay, PhonePe, Paytm, etc.)
              </p>
              {selectedMethod === 'upi' && (
                <div className="space-y-3">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">UPI ID</p>
                    <div className="flex items-center justify-between">
                      <p className="font-mono font-semibold">your-upi@paytm</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard('your-upi@paytm', 'UPI ID');
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="bg-primary/5 p-3 rounded text-sm">
                    <p className="font-semibold mb-1">Instructions:</p>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                      <li>Copy the UPI ID above</li>
                      <li>Open your UPI app</li>
                      <li>Send ₹{amount} to the UPI ID</li>
                      <li>Click "I've Completed Payment" below</li>
                    </ol>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all hover:shadow-lg ${selectedMethod === 'bank' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedMethod('bank')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Bank Transfer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Direct bank transfer or NEFT/RTGS/IMPS
              </p>
              {selectedMethod === 'bank' && (
                <div className="space-y-3">
                  <div className="bg-muted p-4 rounded-lg space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Account Holder</p>
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">Your Name</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard('Your Name', 'Account Holder Name');
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Account Number</p>
                      <div className="flex items-center justify-between">
                        <p className="font-mono font-semibold">1234567890</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard('1234567890', 'Account Number');
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">IFSC Code</p>
                      <div className="flex items-center justify-between">
                        <p className="font-mono font-semibold">SBIN0001234</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard('SBIN0001234', 'IFSC Code');
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Bank Name</p>
                      <p className="font-semibold">State Bank of India</p>
                    </div>
                  </div>
                  <div className="bg-primary/5 p-3 rounded text-sm">
                    <p className="font-semibold mb-1">Instructions:</p>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                      <li>Use the bank details above</li>
                      <li>Transfer ₹{amount}</li>
                      <li>Note your transaction ID</li>
                      <li>Click "I've Completed Payment" below</li>
                    </ol>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {selectedMethod && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  After completing the payment using your chosen method, click the button below
                </p>
                <Button
                  size="lg"
                  onClick={handlePaymentComplete}
                  className="w-full md:w-auto"
                >
                  I've Completed Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
