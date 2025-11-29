-- Activity Log Table
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Policies for activity_logs
CREATE POLICY "Admins can manage activity logs"
ON public.activity_logs FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view all activity logs"
ON public.activity_logs FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- Notifications Table
CREATE TABLE public.admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Policies for admin_notifications
CREATE POLICY "Users can view own notifications"
ON public.admin_notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
ON public.admin_notifications FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all notifications"
ON public.admin_notifications FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trash/Recycle Bin Table
CREATE TABLE public.trash_bin (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_table TEXT NOT NULL,
  original_id UUID NOT NULL,
  data JSONB NOT NULL,
  deleted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT now() + INTERVAL '30 days'
);

-- Enable RLS
ALTER TABLE public.trash_bin ENABLE ROW LEVEL SECURITY;

-- Policies for trash_bin
CREATE POLICY "Admins can manage trash"
ON public.trash_bin FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- Scheduled Content Table
CREATE TABLE public.scheduled_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  action TEXT NOT NULL,
  scheduled_for TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scheduled_content ENABLE ROW LEVEL SECURITY;

-- Policies for scheduled_content
CREATE POLICY "Admins can manage scheduled content"
ON public.scheduled_content FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- Internal Notes Table
CREATE TABLE public.internal_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  note TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.internal_notes ENABLE ROW LEVEL SECURITY;

-- Policies for internal_notes
CREATE POLICY "Admins can manage internal notes"
ON public.internal_notes FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- Page Analytics Table
CREATE TABLE public.page_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(page_path, date)
);

-- Enable RLS
ALTER TABLE public.page_analytics ENABLE ROW LEVEL SECURITY;

-- Policies for page_analytics
CREATE POLICY "Anyone can insert analytics"
ON public.page_analytics FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view analytics"
ON public.page_analytics FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

CREATE POLICY "System can update analytics"
ON public.page_analytics FOR UPDATE
USING (true);

-- Create index for faster queries
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX idx_admin_notifications_user_id ON public.admin_notifications(user_id);
CREATE INDEX idx_page_analytics_date ON public.page_analytics(date DESC);
CREATE INDEX idx_trash_bin_expires_at ON public.trash_bin(expires_at);