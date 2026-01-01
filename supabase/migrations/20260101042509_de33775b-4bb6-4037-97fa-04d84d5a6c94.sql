-- Create table for user game achievements
CREATE TABLE public.game_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create table for user game stats (games played tracking)
CREATE TABLE public.user_game_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  games_played INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.game_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_game_stats ENABLE ROW LEVEL SECURITY;

-- RLS policies for game_achievements: users can only see/manage their own
CREATE POLICY "Users can view own achievements"
ON public.game_achievements FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
ON public.game_achievements FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own achievements"
ON public.game_achievements FOR DELETE
USING (auth.uid() = user_id);

-- RLS policies for user_game_stats
CREATE POLICY "Users can view own stats"
ON public.user_game_stats FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats"
ON public.user_game_stats FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
ON public.user_game_stats FOR UPDATE
USING (auth.uid() = user_id);