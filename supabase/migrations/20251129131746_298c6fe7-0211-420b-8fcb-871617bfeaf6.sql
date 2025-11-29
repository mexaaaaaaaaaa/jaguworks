
-- Create storage bucket for site images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for site-images bucket
CREATE POLICY "Anyone can view site images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'site-images');

CREATE POLICY "Admins can upload site images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'site-images' AND (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'moderator')));

CREATE POLICY "Admins can update site images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'site-images' AND (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'moderator')));

CREATE POLICY "Admins can delete site images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'site-images' AND (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'moderator')));

-- Insert default hero content
INSERT INTO site_content (section_key, content) VALUES 
('hero', '{
  "bg_image_url": "",
  "profile_image_url": "",
  "title": "JAGMOHAN",
  "badge_text": "Digital Creator & Developer",
  "subtitle": "Building Digital Worlds",
  "skills": ["Minecraft Developer", "Discord Dev", "App & Website Builder", "Entrepreneur"],
  "buttons": [
    {"text": "Explore My Universe", "link": "/projects", "variant": "hero"},
    {"text": "Join My Discord", "link": "https://discord.gg/6CdCgjsVua", "variant": "outline"}
  ]
}'::jsonb)
ON CONFLICT (section_key) DO UPDATE SET content = EXCLUDED.content;

-- Insert default about content
INSERT INTO site_content (section_key, content) VALUES 
('about', '{
  "title": "About Me",
  "subtitle": "Who I Am",
  "bio": "Hey, I am Jagmohan — a developer, dreamer, and builder. I have built Minecraft servers, automated Discord communities, created Telegram bots, and designed websites that stand out.",
  "quote": "Dream it. Build it. Automate it.",
  "timeline": [
    {"year": "2020", "event": "Started coding journey", "icon": "Code2"},
    {"year": "2021", "event": "Built first Discord bot", "icon": "MessageSquare"},
    {"year": "2022", "event": "Launched Minecraft servers", "icon": "Gamepad2"},
    {"year": "2023", "event": "Started automation services", "icon": "Zap"},
    {"year": "2024", "event": "Full-stack development", "icon": "Rocket"}
  ]
}'::jsonb)
ON CONFLICT (section_key) DO UPDATE SET content = EXCLUDED.content;
