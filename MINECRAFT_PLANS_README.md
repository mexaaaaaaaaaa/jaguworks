# Minecraft Plans Storefront - Setup & Deployment Guide

## Overview
This is a complete Minecraft server setup plans storefront with cart, checkout flow, and payment integration. The system uses client-side cart management with localStorage and simulates payment gateway integration.

## Pages Structure

### 1. `/minecraft-plans` - Landing Page
- Displays all pricing plans (Starter, Standard, Pro, Premium)
- Shows extra add-ons section
- Feature comparison table
- "Add to Cart" functionality

### 2. `/cart` - Shopping Cart
- View cart items
- Apply coupon codes
- See order summary with discounts
- Proceed to checkout

### 3. `/checkout-redirect` - Checkout Flow
- Simulates Cloudflare verification (2-3 seconds)
- Redirects to payment gateway
- In demo mode, automatically proceeds to success page

### 4. `/payment-return` - Payment Success & Order Details
- Shows payment confirmation
- Collects customer information
- Sends order notifications

## Payment Gateway Integration

This storefront uses **Razorpay** as the payment gateway with Supabase Edge Functions for secure server-side processing.

### Setup Instructions

1. **Read the Razorpay Setup Guide**: See `RAZORPAY_SETUP.md` for complete setup instructions
2. **Get Razorpay Credentials**: Sign up at https://razorpay.com and get API keys
3. **Add Secrets to Lovable Cloud**:
   - `RAZORPAY_KEY_ID`: Your Razorpay Key ID
   - `RAZORPAY_KEY_SECRET`: Your Razorpay Key Secret  
   - `RAZORPAY_WEBHOOK_SECRET`: Your Webhook Secret
4. **Configure Webhook**: Point to `https://fpldktahnurxdfnnhubn.supabase.co/functions/v1/razorpay-webhook`
5. **Test with Test Mode**: Use Razorpay test cards before going live

### Edge Functions

**`create-order`** (`supabase/functions/create-order/index.ts`)
- Validates cart items and total server-side
- Creates order in database
- Calls Razorpay API to create payment order
- Returns order details to frontend

**`razorpay-webhook`** (`supabase/functions/razorpay-webhook/index.ts`)
- Receives payment confirmation from Razorpay
- Verifies webhook signature for security
- Updates order status in database
- Sends notifications (optional)

### Optional Notifications

You can configure additional notifications in the webhook handler:

**Email Notifications** (Optional)
- Uncomment notification code in `supabase/functions/razorpay-webhook/index.ts`
- Add `ORDER_NOTIFICATION_ENDPOINT` secret
- Add `YOUR_EMAIL_PLACEHOLDER` secret

**Telegram Notifications** (Optional)  
- Add `YOUR_TELEGRAM_BOT_ENDPOINT` secret
- Uncomment Telegram notification code in webhook handler

## Features

### Coupon Codes
Two demo coupons are pre-configured in `src/data/minecraft-plans.json`:
- **WELCOME10**: 10% off
- **FLAT50**: ₹50 off

To add more coupons, edit the `coupons` section in `minecraft-plans.json`.

### Pricing
All prices are in INR (₹):
- **Starter**: ₹49
- **Standard**: ₹199
- **Pro**: ₹499
- **Premium**: ₹999
- **Add-ons**: ₹50,000 each

### Cart Management
- Uses `zustand` for state management
- Persists cart to localStorage
- Automatic subtotal/discount/total calculations

## Testing the Flow

### 1. Local Development
```bash
npm run dev
```

### 2. Test Cart
1. Navigate to `/minecraft-plans`
2. Click "Add to Cart" on any plan
3. Add some add-ons if desired
4. Click cart icon in header

### 3. Test Coupon
1. In cart, enter `WELCOME10` or `FLAT50`
2. Click "Apply"
3. Verify discount is applied

### 4. Test Checkout Flow
1. Click "Checkout — Proceed to Payment"
2. Watch Cloudflare verification animation
3. Automatic redirect to payment (simulated)
4. Land on success page

### 5. Test Order Form
1. Fill in all required fields
2. Click "Send Details & Notify Me"
3. Check console for order data
4. See success message

## Production Deployment

### Going Live with Razorpay

1. **Complete KYC**: Verify your Razorpay account
2. **Switch to Live Keys**: 
   - Generate Live API keys in Razorpay Dashboard
   - Update secrets in Lovable Cloud with live credentials
3. **Update Webhook**: Configure live webhook URL
4. **Test Small Transaction**: Make a small real payment to verify
5. **Monitor**: Check webhook logs and payment status

### Security in Production

The integration already includes:
- ✅ Server-side price validation
- ✅ Webhook signature verification  
- ✅ Secure secret storage
- ✅ HTTPS for all communications
- ✅ Input validation

Additional recommendations:
- Implement rate limiting
- Add CSRF protection
- Set up payment monitoring alerts
- Configure refund workflow if needed

## Order Notification Payload

When a customer submits the order form, this JSON is sent to your notification endpoint:

```json
{
  "order_id": "ORD_1234567890",
  "items": [
    {
      "id": "pro",
      "name": "Pro",
      "price": 499,
      "quantity": 1,
      "type": "plan"
    }
  ],
  "total": 449.10,
  "customer": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "contact": "@johndoe",
    "hostingType": "panel",
    "serverFilesProvided": "yes",
    "additionalNotes": "Please set up economy system"
  },
  "timestamp": "2025-01-20T10:30:00.000Z"
}
```

## Security Considerations

### Client-Side (Already Implemented)
- ✅ Input validation on forms
- ✅ Price calculations client-side
- ✅ Coupon code validation

### Server-Side (You Must Implement)
- ⚠️ Verify all prices server-side (never trust client)
- ⚠️ Validate webhook signatures from payment gateway
- ⚠️ Use CSRF tokens for form submissions
- ⚠️ Rate limit API endpoints
- ⚠️ Sanitize all user inputs
- ⚠️ Store payment secrets securely (environment variables)

## Mobile Testing Checklist

Tested at these widths:
- ✅ 360px (Small phones)
- ✅ 412px (Medium phones)
- ✅ 768px (Tablets)
- ✅ 1024px (Desktop)

## File Structure
```
src/
├── data/
│   └── minecraft-plans.json          # Plans, add-ons, coupons data
├── hooks/
│   └── useCart.tsx                    # Cart state management
├── pages/
│   ├── MinecraftPlans.tsx             # Landing page
│   ├── Cart.tsx                       # Cart page
│   ├── CheckoutRedirect.tsx           # Checkout flow
│   └── PaymentReturn.tsx              # Success & order form
└── App.tsx                            # Routes configuration
```

## Deployment Steps

1. **Update placeholders** (payment URL, notification endpoints)
2. **Configure payment gateway** (webhook URL, return URL)
3. **Set up server webhook** to handle payment confirmations
4. **Configure email/Telegram** notification services
5. **Test in sandbox mode** with payment gateway test credentials
6. **Deploy to production**
7. **Monitor order notifications** and test end-to-end flow

## Support

For issues or questions:
- Check console logs for debugging info
- Verify all placeholders are replaced
- Test payment gateway in sandbox mode first
- Ensure webhook endpoints are accessible

## Notes

- **Demo mode**: Currently simulates payment success automatically
- **Production**: Uncomment actual payment redirect code
- **Minimum order**: ₹49 (enforced by plans)
- **Currency**: INR (₹)
- **Cart persistence**: Uses localStorage
- **Accessibility**: All forms are keyboard accessible with proper labels

---

**Last Updated**: January 2025
**Version**: 1.0.0
