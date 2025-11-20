import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import emailjs from '@emailjs/browser';

const PaymentReturn = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items, clearCart, getTotal } = useCart();
  
  const status = searchParams.get('status');
  const orderId = searchParams.get('order_id');
  const paymentId = searchParams.get('payment_id');
  const failureReason = searchParams.get('reason');
  
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '', // Will be used for Transaction ID
    hostingType: 'panel',
    serverFilesProvided: 'yes',
    additionalNotes: '',
  });

  useEffect(() => {
    if (status === 'success') {
      // Clear cart on successful payment
      clearCart();
    }
  }, [status, clearCart]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Save to Supabase orders table
      const { error: dbError } = await supabase.from('orders').insert({
        order_id: orderId || `ORD_${Date.now()}`,
        buyer_name: formData.name,
        buyer_email: formData.email,
        buyer_phone: formData.contact,
        plan_name: items.length > 0 ? items[0].name : 'Manual Payment',
        plan_price: getTotal(),
        total_amount: getTotal(),
        payment_txn_id: formData.contact, // Transaction ID stored in contact field
        status: 'pending',
        server_access_details: `Hosting: ${formData.hostingType}, Server Files: ${formData.serverFilesProvided}. Notes: ${formData.additionalNotes}`,
        paid_at: new Date().toISOString(),
      });

      if (dbError) {
        console.error("Database error:", dbError);
        toast.error("Failed to save order. Please contact support.");
        return;
      }

      // Send EmailJS notification
      const emailParams = {
        order_id: orderId || `ORD_${Date.now()}`,
        buyer_name: formData.name,
        buyer_email: formData.email,
        transaction_id: formData.contact,
        plan_name: items.length > 0 ? items[0].name : 'Manual Payment',
        total_amount: `₹${getTotal()}`,
        hosting_type: formData.hostingType,
        server_files: formData.serverFilesProvided,
        additional_notes: formData.additionalNotes || 'None',
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      };

      await emailjs.send(
        'service_z9tpweb',
        'template_tcx82vr',
        emailParams,
        'kvWIKwv_Y8XNUAiK2'
      );

      setSubmitted(true);
      toast.success("Order saved and notification sent!");
      
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error("Failed to submit order details. Please try again.");
    }
  };

  if (status !== 'success') {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-card/50 backdrop-blur-xl border-2 border-destructive">
          <CardContent className="p-12 text-center">
            <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">Payment Failed</h2>
            <p className="text-muted-foreground mb-4">
              There was an issue processing your payment.
            </p>
            {failureReason && (
              <p className="text-sm text-muted-foreground mb-6 font-mono bg-muted/50 p-3 rounded">
                Reason: {failureReason}
              </p>
            )}
            {orderId && (
              <p className="text-sm text-muted-foreground mb-6">
                Order ID: <span className="font-mono text-foreground">{orderId}</span>
              </p>
            )}
            <Button onClick={() => navigate('/cart')}>
              Return to Cart
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-card/50 backdrop-blur-xl border-2 border-primary animate-fade-in">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Thank You!</h2>
            <p className="text-muted-foreground mb-6">
              Thanks — your request has been received. We'll build your server and message you when done.
            </p>
            <Button onClick={() => navigate('/minecraft-plans')}>
              Return to Plans
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <Card className="bg-card/50 backdrop-blur-xl border-2 border-primary mb-8 animate-fade-in">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-3">✅ Payment Successful</h1>
            <p className="text-muted-foreground mb-2">
              Order ID: <span className="font-mono text-primary">{orderId}</span>
            </p>
            {paymentId && (
              <p className="text-sm text-muted-foreground mb-4">
                Payment ID: <span className="font-mono">{paymentId}</span>
              </p>
            )}
            <p className="text-muted-foreground">
              Total Paid: <span className="font-bold text-foreground">₹{getTotal().toFixed(2)}</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-xl border-2 border-border animate-slide-in-up">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6">Complete Your Order Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Transaction ID / UPI Reference *</Label>
                <Input
                  id="contact"
                  required
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder="Enter your payment transaction ID"
                />
                <p className="text-xs text-muted-foreground">This helps us verify your payment</p>
              </div>

              <div className="space-y-3">
                <Label>Hosting Type *</Label>
                <RadioGroup
                  value={formData.hostingType}
                  onValueChange={(value) => setFormData({ ...formData, hostingType: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="panel" id="panel" />
                    <Label htmlFor="panel" className="font-normal cursor-pointer">Control Panel</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="console" id="console" />
                    <Label htmlFor="console" className="font-normal cursor-pointer">Direct Console Access</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>Server Files Provided? *</Label>
                <RadioGroup
                  value={formData.serverFilesProvided}
                  onValueChange={(value) => setFormData({ ...formData, serverFilesProvided: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="yes" />
                    <Label htmlFor="yes" className="font-normal cursor-pointer">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no" />
                    <Label htmlFor="no" className="font-normal cursor-pointer">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                  placeholder="Any special requirements or instructions..."
                  rows={4}
                />
              </div>

              <Button type="submit" size="lg" className="w-full group">
                Send Details & Notify Me
                <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentReturn;
