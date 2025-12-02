-- Create user_scores table
CREATE TABLE public.user_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  score integer NOT NULL DEFAULT 50,
  total_earned integer NOT NULL DEFAULT 0,
  total_spent integer NOT NULL DEFAULT 0,
  tools_used integer NOT NULL DEFAULT 0,
  referral_code text UNIQUE NOT NULL,
  referred_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create referrals tracking table
CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  referred_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  score_awarded integer NOT NULL DEFAULT 20,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(referred_id)
);

-- Enable RLS
ALTER TABLE public.user_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_scores
CREATE POLICY "Users can view own score"
ON public.user_scores FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own score"
ON public.user_scores FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "System can insert scores"
ON public.user_scores FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS policies for referrals
CREATE POLICY "Users can view own referrals"
ON public.referrals FOR SELECT
USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "System can insert referrals"
ON public.referrals FOR INSERT
WITH CHECK (true);

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result text := '';
  i integer;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$;

-- Function to initialize user score on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_score()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_code text;
  ref_code text;
  referrer_user_id uuid;
BEGIN
  -- Generate unique referral code
  LOOP
    new_code := generate_referral_code();
    EXIT WHEN NOT EXISTS (SELECT 1 FROM user_scores WHERE referral_code = new_code);
  END LOOP;
  
  -- Check if user was referred
  ref_code := NEW.raw_user_meta_data->>'referral_code';
  
  IF ref_code IS NOT NULL THEN
    SELECT user_id INTO referrer_user_id FROM user_scores WHERE referral_code = ref_code;
  END IF;
  
  -- Insert user score record
  INSERT INTO public.user_scores (user_id, referral_code, referred_by)
  VALUES (NEW.id, new_code, referrer_user_id);
  
  -- If referred, create referral record and award bonus
  IF referrer_user_id IS NOT NULL THEN
    INSERT INTO public.referrals (referrer_id, referred_id)
    VALUES (referrer_user_id, NEW.id);
    
    UPDATE public.user_scores 
    SET score = score + 20, total_earned = total_earned + 20
    WHERE user_id = referrer_user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user score initialization
CREATE TRIGGER on_auth_user_created_score
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_score();

-- Function to deduct score for tool usage
CREATE OR REPLACE FUNCTION public.use_tool_score(p_user_id uuid, p_tool_name text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_score integer;
  result jsonb;
BEGIN
  SELECT score INTO current_score FROM user_scores WHERE user_id = p_user_id;
  
  IF current_score IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'User not found');
  END IF;
  
  IF current_score < 5 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient Score! Use Share & Earn to get more.', 'score', current_score);
  END IF;
  
  UPDATE user_scores 
  SET score = score - 5, total_spent = total_spent + 5, tools_used = tools_used + 1, updated_at = now()
  WHERE user_id = p_user_id;
  
  RETURN jsonb_build_object('success', true, 'score', current_score - 5);
END;
$$;