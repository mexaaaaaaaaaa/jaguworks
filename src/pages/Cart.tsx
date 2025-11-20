import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, ShoppingCart, ArrowLeft, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import plansData from "@/data/minecraft-plans.json";

const Cart = () => {
  const navigate = useNavigate();
  const { items, removeItem, coupon, applyCoupon, removeCoupon, getSubtotal, getDiscount, getTotal } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const handleApplyCoupon = () => {
    const code = couponCode.toUpperCase();
    const couponData = plansData.coupons[code as keyof typeof plansData.coupons];
    
    if (!couponData) {
      toast.error("Invalid coupon code");
      return;
    }

    setApplyingCoupon(true);
    setTimeout(() => {
      applyCoupon({
        code,
        type: couponData.type as 'percentage' | 'fixed',
        value: couponData.value,
      });
      toast.success(`Coupon applied: ${couponData.description}`);
      setCouponCode("");
      setApplyingCoupon(false);
    }, 500);
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    navigate('/checkout-redirect');
  };

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const total = getTotal();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/minecraft-plans')}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Plans
          </Button>
          <h1 className="text-2xl font-bold gradient-text">Shopping Cart</h1>
          <div className="w-24" />
        </div>
      </header>

      <section className="py-12 px-4 md:px-8">
        <div className="container mx-auto max-w-4xl">
          {items.length === 0 ? (
            <Card className="bg-card/50 backdrop-blur-xl border-2 border-border">
              <CardContent className="p-12 text-center">
                <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">Add some plans to get started!</p>
                <Button onClick={() => navigate('/minecraft-plans')}>
                  Browse Plans
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Cart Items */}
              <Card className="bg-card/50 backdrop-blur-xl border-2 border-border">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-6">Cart Items</h2>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border group hover:border-primary transition-all duration-300"
                      >
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{item.name}</h3>
                          <p className="text-sm text-muted-foreground capitalize">{item.type}</p>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="font-bold text-lg">₹{item.price.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              removeItem(item.id);
                              toast.success("Item removed from cart");
                            }}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Coupon Code */}
              <Card className="bg-card/50 backdrop-blur-xl border-2 border-border">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    Apply Coupon
                  </h2>
                  <div className="flex gap-3">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      disabled={!!coupon}
                      className="flex-1"
                    />
                    {coupon ? (
                      <Button
                        variant="outline"
                        onClick={() => {
                          removeCoupon();
                          toast.success("Coupon removed");
                        }}
                      >
                        Remove
                      </Button>
                    ) : (
                      <Button
                        onClick={handleApplyCoupon}
                        disabled={!couponCode || applyingCoupon}
                      >
                        Apply
                      </Button>
                    )}
                  </div>
                  {coupon && (
                    <p className="mt-3 text-sm text-primary font-medium">
                      ✓ Coupon "{coupon.code}" applied
                    </p>
                  )}
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2 font-semibold">Demo Coupons:</p>
                    <div className="flex flex-wrap gap-2">
                      <code className="text-xs bg-background/50 px-2 py-1 rounded">WELCOME10 (10% off)</code>
                      <code className="text-xs bg-background/50 px-2 py-1 rounded">FLAT50 (₹50 off)</code>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card className="bg-card/50 backdrop-blur-xl border-2 border-primary">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal:</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-primary">
                        <span>Discount:</span>
                        <span>-₹{discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-border pt-3 flex justify-between text-xl font-bold">
                      <span>Total:</span>
                      <span className="text-primary">₹{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg mb-6 text-sm text-muted-foreground">
                    <p className="leading-relaxed">
                      After clicking Checkout you will be verified (Cloudflare). You will then be redirected to a secure payment page. After payment you'll return here to complete order details.
                    </p>
                  </div>

                  <Button
                    size="lg"
                    className="w-full group"
                    onClick={handleCheckout}
                  >
                    Checkout — Proceed to Payment
                    <ArrowLeft className="w-5 h-5 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Cart;
