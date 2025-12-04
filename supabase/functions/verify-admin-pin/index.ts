import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PinSettings {
  pin: string;
  lockout_until: string | null;
  failed_attempts: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Create admin client for database operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get the authorization header to verify the user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create user client to verify the JWT
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify the user is authenticated
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has admin or moderator role
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .in('role', ['admin', 'moderator'])
      .maybeSingle();

    if (roleError || !roleData) {
      return new Response(
        JSON.stringify({ success: false, error: 'Access denied - admin role required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { pin } = await req.json();

    if (!pin) {
      return new Response(
        JSON.stringify({ success: false, error: 'PIN is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get PIN settings from database
    const { data: settingsData, error: settingsError } = await supabaseAdmin
      .from('site_settings')
      .select('value')
      .eq('key', 'admin_pin')
      .maybeSingle();

    if (settingsError) {
      console.error('Error fetching PIN settings:', settingsError);
      return new Response(
        JSON.stringify({ success: false, error: 'Server error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!settingsData?.value) {
      return new Response(
        JSON.stringify({ success: false, error: 'PIN not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const settings = settingsData.value as unknown as PinSettings;

    // Check if account is locked
    if (settings.lockout_until) {
      const lockoutEnd = new Date(settings.lockout_until).getTime();
      const now = Date.now();
      if (lockoutEnd > now) {
        const remainingSeconds = Math.ceil((lockoutEnd - now) / 1000);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Account locked',
            lockout_remaining: remainingSeconds
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Verify PIN
    if (pin === settings.pin) {
      // Reset failed attempts on success
      await supabaseAdmin
        .from('site_settings')
        .update({
          value: { ...settings, failed_attempts: 0, lockout_until: null },
        })
        .eq('key', 'admin_pin');

      // Generate a secure session token (valid for 24 hours)
      const sessionToken = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      // Store the session token in the database
      await supabaseAdmin
        .from('site_settings')
        .upsert({
          key: `admin_pin_session_${user.id}`,
          value: { token: sessionToken, expires_at: expiresAt, user_id: user.id }
        }, { onConflict: 'key' });

      console.log('PIN verified successfully for user:', user.id);

      return new Response(
        JSON.stringify({ 
          success: true, 
          session_token: sessionToken,
          expires_at: expiresAt
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // Increment failed attempts
      const newAttempts = (settings.failed_attempts || 0) + 1;
      let newLockout = null;

      if (newAttempts >= 5) {
        // Lock for 30 minutes
        newLockout = new Date(Date.now() + 30 * 60 * 1000).toISOString();
      }

      await supabaseAdmin
        .from('site_settings')
        .update({
          value: {
            ...settings,
            failed_attempts: newAttempts,
            lockout_until: newLockout,
          },
        })
        .eq('key', 'admin_pin');

      console.log('PIN verification failed for user:', user.id, 'Attempts:', newAttempts);

      return new Response(
        JSON.stringify({ 
          success: false, 
          error: newAttempts >= 5 
            ? 'Too many attempts. Locked for 30 minutes.' 
            : `Incorrect PIN. ${5 - newAttempts} attempts remaining.`,
          attempts_remaining: 5 - newAttempts,
          is_locked: newAttempts >= 5
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Error in verify-admin-pin:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
