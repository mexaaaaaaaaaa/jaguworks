-- Create dynamic_sections table for the Section Builder
CREATE TABLE public.dynamic_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  layout_type TEXT NOT NULL DEFAULT 'text',
  content JSONB NOT NULL DEFAULT '{}',
  order_index INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  page TEXT NOT NULL DEFAULT 'home',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create site_content table for all editable content
CREATE TABLE public.site_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create social_links table
CREATE TABLE public.social_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true
);

-- Create theme_settings table
CREATE TABLE public.theme_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create media_library table
CREATE TABLE public.media_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'image',
  size INTEGER,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.dynamic_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theme_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

-- RLS Policies for dynamic_sections
CREATE POLICY "Anyone can read visible sections" ON public.dynamic_sections
  FOR SELECT USING (is_visible = true);

CREATE POLICY "Admins can manage sections" ON public.dynamic_sections
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'moderator'));

-- RLS Policies for site_content
CREATE POLICY "Anyone can read site content" ON public.site_content
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage site content" ON public.site_content
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'moderator'));

-- RLS Policies for social_links
CREATE POLICY "Anyone can read visible social links" ON public.social_links
  FOR SELECT USING (is_visible = true);

CREATE POLICY "Admins can manage social links" ON public.social_links
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'moderator'));

-- RLS Policies for theme_settings
CREATE POLICY "Anyone can read theme settings" ON public.theme_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage theme settings" ON public.theme_settings
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for media_library
CREATE POLICY "Anyone can read media" ON public.media_library
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage media" ON public.media_library
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'moderator'));

-- Insert default theme settings
INSERT INTO public.theme_settings (key, value) VALUES
  ('colors', '{"primary": "hsl(280, 100%, 70%)", "accent": "hsl(180, 100%, 50%)", "mode": "dark"}'),
  ('fonts', '{"heading": "Space Grotesk", "body": "Inter"}'),
  ('layout', '{"cardStyle": "glass", "buttonStyle": "glow", "backgroundType": "gradient"}');

-- Insert default social links
INSERT INTO public.social_links (platform, url, icon, display_order) VALUES
  ('YouTube', 'https://www.youtube.com/@D4dirtyGaming', 'Youtube', 1),
  ('Instagram', 'https://www.instagram.com/dkd_jagmohan_', 'Instagram', 2),
  ('Discord', 'https://discord.gg/6CdCgjsVua', 'MessageCircle', 3),
  ('GitHub', 'https://github.com/theghoxt69-creator/FIRECRAFTX', 'Github', 4);

-- Create trigger for updated_at
CREATE TRIGGER update_dynamic_sections_updated_at
  BEFORE UPDATE ON public.dynamic_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_theme_settings_updated_at
  BEFORE UPDATE ON public.theme_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();