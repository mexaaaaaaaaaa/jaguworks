# Razorpay Payment Gateway Setup Guide

## Overview
This guide walks you through setting up Razorpay payment gateway for the Minecraft Plans storefront. The integration uses Supabase Edge Functions for secure server-side order creation and webhook handling.

## Prerequisites
1. A Razorpay account (https://razorpay.com)
2. Razorpay API keys (Key ID and Key Secret)
3. Access to Lovable Cloud backend (already configured)

## Step 1: Get Razorpay Credentials

### 1.1 Create Razorpay Account
1. Go to https://razorpay.com and sign up
2. Complete KYC verification (required for live mode)
3. For testing, you can use Test Mode without KYC

### 1.2 Get API Keys
1. Log in to Razorpay Dashboard
2. Go to Settings → API Keys
3. Generate Keys (Test Mode for testing, Live Mode for production)
4. Note down:
   - **Key ID** (starts with `rzp_test_` or `rzp_live_`)
   - **Key Secret** (keep this secret!)

### 1.3 Get Webhook Secret
1. Go to Settings → Webhooks
2. Create a new webhook with URL: `https://fpldktahnurxdfnnhubn.supabase.co/functions/v1/razorpay-webhook`
3. Select events: `payment.captured`, `payment.failed`
4. Note down the **Webhook Secret**

## Step 2: Configure Secrets in Lovable Cloud

You need to add three secrets to Lovable Cloud:

1. **RAZORPAY_KEY_ID**: Your Razorpay Key ID
2. **RAZORPAY_KEY_SECRET**: Your Razorpay Key Secret
3. **RAZORPAY_WEBHOOK_SECRET**: Your Webhook Secret

### How to Add Secrets:
The AI will help you add these secrets securely. When prompted, enter:
- Secret Name: `RAZORPAY_KEY_ID`
- Secret Value: Your actual Razorpay Key ID

Repeat for the other two secrets.

## Step 3: Test the Integration

### 3.1 Test Mode Testing
Razorpay provides test cards for testing:

**Successful Payment:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date
- Name: Any name

**Failed Payment:**
- Card Number: `4000 0000 0000 0002`
- This will simulate a payment failure

### 3.2 Test Flow
1. Go to `/minecraft-plans`
2. Add a plan to cart
3. Optionally apply coupon: `WELCOME10` or `FLAT50`
4. Click "Checkout"
5. Complete Razorpay checkout with test card
6. Verify redirect to success page
7. Fill in order details form
8. Check backend for order status

## Step 4: Webhook Verification

### 4.1 Test Webhook Locally
You can test webhooks using Razorpay's webhook simulator:
1. Go to Razorpay Dashboard → Webhooks
2. Click on your webhook
3. Use "Send Test Webhook" feature

### 4.2 Verify Webhook Signature
The webhook handler automatically verifies Razorpay signatures for security. The verification happens in `supabase/functions/razorpay-webhook/index.ts`.

## Step 5: Go Live

### 5.1 Switch to Live Mode
1. Complete KYC verification in Razorpay
2. Activate your account
3. Generate Live API Keys
4. Update secrets with Live keys (replace Test keys)
5. Update webhook URL to use Live mode

### 5.2 Live Mode Checklist
- [ ] KYC completed and approved
- [ ] Live API keys generated
- [ ] Live webhook configured
- [ ] Secrets updated with live credentials
- [ ] Test a small transaction
- [ ] Monitor webhook logs

## Architecture Overview

### Payment Flow
```
1. User clicks Checkout
   ↓
2. Frontend calls create-order Edge Function
   ↓
3. Edge Function:
   - Validates cart items & total server-side
   - Creates order in database
   - Calls Razorpay API to create payment order
   - Returns order details to frontend
   ↓
4. Frontend opens Razorpay Checkout modal
   ↓
5. User completes payment
   ↓
6. Razorpay sends webhook to razorpay-webhook Edge Function
   ↓
7. Edge Function:
   - Verifies webhook signature
   - Updates order status in database
   - Sends notifications (email/telegram)
   ↓
8. User redirected to success page
   ↓
9. User fills order details form
   ↓
10. Order complete!
```

### Database Schema
The `orders` table stores:
- `order_id`: Unique order identifier
- `plan_name`: Selected plan name
- `plan_price`: Plan price
- `total_amount`: Total after discounts
- `addons`: JSON array of add-ons
- `status`: Order status (pending/paid/failed)
- `payment_txn_id`: Razorpay order ID
- `cloudflare_txn_id`: Razorpay payment ID
- `buyer_name`, `buyer_email`, `buyer_phone`, `buyer_discord`: Customer details
- `paid_at`: Payment timestamp

## Security Best Practices

### ✅ Implemented
- Server-side price validation (never trust client)
- Webhook signature verification
- Secure secret storage in Lovable Cloud
- HTTPS for all communications
- Order ID generation with timestamp + random

### ⚠️ Additional Recommendations
1. **Rate Limiting**: Add rate limiting to prevent abuse
2. **CSRF Protection**: Implement CSRF tokens for forms
3. **Input Sanitization**: Sanitize all user inputs
4. **Monitoring**: Set up alerts for failed payments
5. **Refund Policy**: Implement refund workflow if needed

## Troubleshooting

### Common Issues

**Issue: "Failed to create order"**
- Check if RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set correctly
- Verify API keys are for the correct mode (Test/Live)
- Check network connectivity

**Issue: "Webhook signature mismatch"**
- Verify RAZORPAY_WEBHOOK_SECRET matches Razorpay dashboard
- Check if webhook URL is correct
- Ensure webhook is enabled in Razorpay

**Issue: "Payment successful but order not updated"**
- Check webhook logs in Lovable Cloud backend
- Verify webhook events are enabled for `payment.captured`
- Check database for order status

**Issue: "Razorpay checkout not opening"**
- Check browser console for errors
- Verify Razorpay script is loading
- Check if RAZORPAY_KEY_ID is correct

### Debug Mode
Enable detailed logging by checking:
1. Supabase Edge Function logs
2. Browser console logs
3. Razorpay Dashboard → Payments → View payment details

## Notification Setup (Optional)

### Email Notifications
To enable email notifications on successful payment:

1. Uncomment notification code in `supabase/functions/razorpay-webhook/index.ts`
2. Set up email service (Resend recommended)
3. Add `ORDER_NOTIFICATION_ENDPOINT` secret with your email webhook URL
4. Add `YOUR_EMAIL_PLACEHOLDER` for recipient email

### Telegram Notifications
To enable Telegram notifications:

1. Create a Telegram bot via @BotFather
2. Get bot token
3. Create Telegram webhook endpoint
4. Add `YOUR_TELEGRAM_BOT_ENDPOINT` secret

## Sample Webhook Payload

### Payment Captured Event
```json
{
  "event": "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_xxxxxxxxxxxx",
        "order_id": "order_xxxxxxxxxxxx",
        "amount": 49900,
        "currency": "INR",
        "status": "captured",
        "method": "card",
        "email": "customer@example.com",
        "contact": "+919876543210"
      }
    }
  }
}
```

## Testing Checklist

Before going live, test:
- [ ] Add plan to cart
- [ ] Apply valid coupon
- [ ] Apply invalid coupon
- [ ] Checkout with test card (success)
- [ ] Checkout with test card (failure)
- [ ] Verify order created in database
- [ ] Verify webhook received and processed
- [ ] Verify order status updated to "paid"
- [ ] Complete order details form
- [ ] Check notifications sent (if configured)
- [ ] Test mobile responsive design
- [ ] Test different browsers

## Support & Resources

- **Razorpay Docs**: https://razorpay.com/docs/
- **API Reference**: https://razorpay.com/docs/api/
- **Webhook Docs**: https://razorpay.com/docs/webhooks/
- **Test Cards**: https://razorpay.com/docs/payments/payments/test-card-details/
- **Support**: support@razorpay.com

## Current Status

**Integration Status**: ✅ Implemented with placeholder credentials

**Next Steps**:
1. Add actual Razorpay credentials via Lovable Cloud secrets
2. Test with Razorpay test mode
3. Configure notifications (optional)
4. Switch to live mode when ready

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Gateway**: Razorpay
**Integration Type**: Standard Checkout with Server-side Order Creation
