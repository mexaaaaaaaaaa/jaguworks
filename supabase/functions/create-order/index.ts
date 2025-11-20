import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateOrderRequest {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    type: 'plan' | 'addon';
  }>;
  coupon?: {
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
  } | null;
  total: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { items, coupon, total }: CreateOrderRequest = await req.json();

    console.log('Creating order:', { items, coupon, total });

    // Server-side validation: Recalculate total
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discount = 0;
    
    if (coupon) {
      if (coupon.type === 'percentage') {
        discount = (subtotal * coupon.value) / 100;
      } else {
        discount = coupon.value;
      }
    }
    
    const calculatedTotal = Math.max(0, subtotal - discount);
    
    // Validate that frontend total matches server calculation (allow 1 rupee variance for rounding)
    if (Math.abs(calculatedTotal - total) > 1) {
      console.error('Total mismatch:', { calculatedTotal, sentTotal: total });
      throw new Error('Price validation failed. Please refresh and try again.');
    }

    // Generate unique order ID
    const orderId = `ORD_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    // Get plan details (assuming first item is the main plan)
    const mainPlan = items.find(item => item.type === 'plan') || items[0];
    const addons = items.filter(item => item.type === 'addon');

    // Insert order into database
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_id: orderId,
        plan_name: mainPlan.name,
        plan_price: mainPlan.price,
        total_amount: calculatedTotal,
        addons: addons.length > 0 ? addons : null,
        currency: 'INR',
        status: 'pending',
        buyer_name: '',
        buyer_email: '',
      })
      .select()
      .single();

    if (orderError) {
      console.error('Database error:', orderError);
      throw new Error('Failed to create order');
    }

    console.log('Order created in database:', orderData);

    // PLACEHOLDER: Razorpay API integration
    // Replace ⟪RAZORPAY_KEY_ID⟫ and ⟪RAZORPAY_KEY_SECRET⟫ with actual keys
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID') || '⟪RAZORPAY_KEY_ID⟫';
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET') || '⟪RAZORPAY_KEY_SECRET⟫';

    // Create Razorpay order
    const razorpayOrderData = {
      amount: Math.round(calculatedTotal * 100), // Amount in paise (smallest currency unit)
      currency: 'INR',
      receipt: orderId,
      notes: {
        plan_name: mainPlan.name,
        order_id: orderId,
      },
    };

    console.log('Creating Razorpay order:', razorpayOrderData);

    // Call Razorpay API to create order
    // Docs: https://razorpay.com/docs/api/orders/
    // Use proper UTF-8 encoding for credentials
    const credentials = `${razorpayKeyId}:${razorpayKeySecret}`;
    const encodedCredentials = btoa(
      Array.from(new TextEncoder().encode(credentials))
        .map(byte => String.fromCharCode(byte))
        .join('')
    );
    
    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + encodedCredentials,
      },
      body: JSON.stringify(razorpayOrderData),
    });

    if (!razorpayResponse.ok) {
      const errorText = await razorpayResponse.text();
      console.error('Razorpay API error:', errorText);
      
      // If using placeholder keys, return mock data for testing
      if (razorpayKeyId.includes('⟪') || razorpayKeySecret.includes('⟪')) {
        console.log('Using placeholder keys - returning mock order for testing');
        return new Response(
          JSON.stringify({
            success: true,
            orderId: orderId,
            razorpayOrderId: 'order_mock_' + Date.now(),
            amount: calculatedTotal,
            currency: 'INR',
            razorpayKeyId: razorpayKeyId,
            isMockOrder: true, // Flag to indicate this is a test order
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      throw new Error(`Razorpay order creation failed: ${errorText}`);
    }

    const razorpayOrder = await razorpayResponse.json();
    console.log('Razorpay order created:', razorpayOrder);

    // Update order with Razorpay order ID
    await supabase
      .from('orders')
      .update({ payment_txn_id: razorpayOrder.id })
      .eq('order_id', orderId);

    return new Response(
      JSON.stringify({
        success: true,
        orderId: orderId,
        razorpayOrderId: razorpayOrder.id,
        amount: calculatedTotal,
        currency: 'INR',
        razorpayKeyId: razorpayKeyId,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in create-order:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
