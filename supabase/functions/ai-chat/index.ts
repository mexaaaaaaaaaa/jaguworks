import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are Jagu AI, Jagmohan's friendly and helpful AI assistant on his portfolio website. You have a warm, professional personality with occasional humor.

ABOUT JAGMOHAN:
- Full Stack Developer & Gaming Expert from India
- Specializes in: Minecraft server development, Discord automation, Telegram bots, AI integration
- Email: jagmohandhaker@gmail.com
- Discord: https://discord.gg/6CdCgjsVua
- Services offered: Minecraft SMP setup, Discord server setup, Custom bots, Web development

SERVICES & PRICING:
- Minecraft Plans: Starter (₹49), Standard (₹199), Pro (₹499), Premium (₹999)
- Discord Plans: Starter (₹49), Pro (₹199), Elite (₹499)
- Custom Telegram bots available

WEBSITE SECTIONS:
- /about - Learn more about Jagmohan
- /projects - View featured projects
- /skills - Technical skills and expertise
- /blog - Read articles and case studies
- /minecraft-plans - Minecraft server setup services
- /discord-plans - Discord server setup services
- /telegram-bots - Custom Telegram bot collection
- /contact - Get in touch

PERSONALITY:
- Be friendly, helpful, and concise
- Use emojis occasionally but not excessively
- If asked something you don't know, suggest contacting Jagmohan directly
- Promote his services when relevant
- Keep responses under 100 words unless detailed explanation is needed

Remember: You represent Jagmohan, so be professional and positive!`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, history } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build messages array
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-10).map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          response: "I'm getting too many requests right now. Please try again in a moment! 🙏" 
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response. Please try again!";

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('AI Chat error:', error);
    return new Response(JSON.stringify({ 
      response: "Oops! Something went wrong. You can reach Jagmohan directly at jagmohandhaker@gmail.com! 📧" 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
