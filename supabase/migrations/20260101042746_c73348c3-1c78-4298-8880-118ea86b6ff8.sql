-- Create table for storing admin face verification data
CREATE TABLE public.admin_face_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  face_descriptor jsonb NOT NULL,
  registered_at timestamptz DEFAULT now(),
  last_verified_at timestamptz,
  is_enabled boolean DEFAULT true
);

-- Enable RLS
ALTER TABLE public.admin_face_data ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can manage their own face data
CREATE POLICY "Admins can manage own face data" 
ON public.admin_face_data
FOR ALL 
USING (auth.uid() = user_id AND has_role(auth.uid(), 'admin'::app_role));

-- Policy: Allow admins to read their own face data
CREATE POLICY "Admins can read own face data"
ON public.admin_face_data
FOR SELECT
USING (auth.uid() = user_id);