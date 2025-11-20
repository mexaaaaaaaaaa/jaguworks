import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { crypto } from "https://deno.land/std@0.190.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-razorpay-signature',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const signature = req.headers.get('x-razorpay-signature');
    const body = await req.text();
    
    console.log('Webhook received:', { signature, bodyLength: body.length });

    // PLACEHOLDER: Razorpay webhook secret
    // Replace ⟪RAZORPAY_WEBHOOK_SECRET⟫ with actual webhook secret from Razorpay dashboard
    const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET') || '⟪RAZORPAY_WEBHOOK_SECRET⟫';

    // Verify webhook signature
    // Docs: https://razorpay.com/docs/webhooks/validate/
    if (!webhookSecret.includes('⟪')) {
      const expectedSignature = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(body + webhookSecret)
      );
      const expectedSignatureHex = Array.from(new Uint8Array(expectedSignature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      if (signature !== expectedSignatureHex) {
        console.error('Invalid webhook signature');
        return new Response(
          JSON.stringify({ error: 'Invalid signature' }),
          {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    } else {
      console.log('Using placeholder webhook secret - skipping signature verification');
    }

    const payload = JSON.parse(body);
    console.log('Webhook payload:', payload);

    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;
    const orderEntity = payload.payload?.order?.entity;

    // Handle payment.captured event
    if (event === 'payment.captured' && paymentEntity) {
      const razorpayOrderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;
      const amount = paymentEntity.amount / 100; // Convert paise to rupees

      console.log('Payment captured:', { razorpayOrderId, paymentId, amount });

      // Find order by Razorpay order ID
      const { data: order, error: findError } = await supabase
        .from('orders')
        .select('*')
        .eq('payment_txn_id', razorpayOrderId)
        .single();

      if (findError || !order) {
        console.error('Order not found:', razorpayOrderId);
        throw new Error('Order not found');
      }

      // Update order status
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'paid',
          paid_at: new Date().toISOString(),
          cloudflare_txn_id: paymentId,
        })
        .eq('id', order.id);

      if (updateError) {
        console.error('Failed to update order:', updateError);
        throw new Error('Failed to update order');
      }

      console.log('Order marked as paid:', order.order_id);

      // PLACEHOLDER: Send notifications
      // Replace ⟪ORDER_NOTIFICATION_ENDPOINT⟫ with your notification webhook
      // Replace ⟪YOUR_EMAIL_PLACEHOLDER⟫ with your email
      // Replace ⟪YOUR_TELEGRAM_BOT_ENDPOINT⟫ with your Telegram bot endpoint

      const notificationPayload = {
        order_id: order.order_id,
        plan_name: order.plan_name,
        total_amount: order.total_amount,
        payment_id: paymentId,
        status: 'paid',
        paid_at: order.paid_at,
        buyer_name: order.buyer_name,
        buyer_email: order.buyer_email,
        buyer_phone: order.buyer_phone,
        buyer_discord: order.buyer_discord,
      };

      console.log('Would send notification:', notificationPayload);
      console.log('Notification endpoint: ⟪ORDER_NOTIFICATION_ENDPOINT⟫');
      console.log('Email notification to: ⟪YOUR_EMAIL_PLACEHOLDER⟫');
      console.log('Telegram notification to: ⟪YOUR_TELEGRAM_BOT_ENDPOINT⟫');

      // Uncomment to send actual notifications:
      /*
      const notificationEndpoint = Deno.env.get('ORDER_NOTIFICATION_ENDPOINT') || '⟪ORDER_NOTIFICATION_ENDPOINT⟫';
      if (!notificationEndpoint.includes('⟪')) {
        await fetch(notificationEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(notificationPayload),
        });
      }
      */
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
