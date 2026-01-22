-- Create ads table for managing advertisements
CREATE TABLE public.ads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  ad_type TEXT NOT NULL DEFAULT 'banner' CHECK (ad_type IN ('banner', 'adsense', 'affiliate', 'popup', 'native')),
  placement TEXT NOT NULL DEFAULT 'between-sections' CHECK (placement IN ('header', 'sidebar', 'between-sections', 'footer', 'popup', 'sticky-mobile', 'in-article')),
  image_url TEXT,
  html_content TEXT,
  adsense_slot TEXT,
  click_url TEXT,
  impressions INTEGER NOT NULL DEFAULT 0,
  clicks INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  priority INTEGER NOT NULL DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  target_pages TEXT[] DEFAULT '{}',
  size TEXT DEFAULT 'medium' CHECK (size IN ('small', 'medium', 'large', 'leaderboard', 'rectangle', 'skyscraper')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ad_clicks table for tracking
CREATE TABLE public.ad_clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ad_id UUID NOT NULL REFERENCES public.ads(id) ON DELETE CASCADE,
  page_url TEXT,
  user_agent TEXT,
  clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ad_impressions table for tracking
CREATE TABLE public.ad_impressions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ad_id UUID NOT NULL REFERENCES public.ads(id) ON DELETE CASCADE,
  page_url TEXT,
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_impressions ENABLE ROW LEVEL SECURITY;

-- Public can view active ads
CREATE POLICY "Anyone can view active ads" ON public.ads
  FOR SELECT USING (is_active = true AND (start_date IS NULL OR start_date <= now()) AND (end_date IS NULL OR end_date >= now()));

-- Admins can manage ads
CREATE POLICY "Admins can manage ads" ON public.ads
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Public can insert impressions and clicks (for tracking)
CREATE POLICY "Anyone can insert impressions" ON public.ad_impressions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can insert clicks" ON public.ad_clicks
  FOR INSERT WITH CHECK (true);

-- Admins can view all tracking data
CREATE POLICY "Admins can view impressions" ON public.ad_impressions
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view clicks" ON public.ad_clicks
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Create indexes for performance
CREATE INDEX idx_ads_active ON public.ads(is_active, placement);
CREATE INDEX idx_ads_dates ON public.ads(start_date, end_date);
CREATE INDEX idx_ad_impressions_ad_id ON public.ad_impressions(ad_id);
CREATE INDEX idx_ad_clicks_ad_id ON public.ad_clicks(ad_id);

-- Trigger for updated_at
CREATE TRIGGER update_ads_updated_at
  BEFORE UPDATE ON public.ads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();