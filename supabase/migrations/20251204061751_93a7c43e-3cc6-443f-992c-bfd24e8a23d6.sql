
-- Visitor locations for 3D globe
CREATE TABLE public.visitor_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country TEXT,
  country_code TEXT,
  city TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.visitor_locations ENABLE ROW LEVEL SECURITY;

-- Anyone can insert visitor locations (anonymous tracking)
CREATE POLICY "Anyone can insert visitor locations"
ON public.visitor_locations
FOR INSERT
WITH CHECK (true);

-- Admins can view all visitor locations
CREATE POLICY "Admins can view visitor locations"
ON public.visitor_locations
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- Easter eggs discovered by users
CREATE TABLE public.easter_eggs_discovered (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  egg_name TEXT NOT NULL,
  discovered_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, egg_name)
);

-- Enable RLS
ALTER TABLE public.easter_eggs_discovered ENABLE ROW LEVEL SECURITY;

-- Users can insert their own discoveries
CREATE POLICY "Users can insert own easter eggs"
ON public.easter_eggs_discovered
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can view their own discoveries
CREATE POLICY "Users can view own easter eggs"
ON public.easter_eggs_discovered
FOR SELECT
USING (auth.uid() = user_id);

-- Game high scores
CREATE TABLE public.game_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  player_name TEXT,
  played_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;

-- Anyone can insert game scores
CREATE POLICY "Anyone can insert game scores"
ON public.game_scores
FOR INSERT
WITH CHECK (true);

-- Anyone can view game scores (leaderboard)
CREATE POLICY "Anyone can view game scores"
ON public.game_scores
FOR SELECT
USING (true);

-- Chat conversations for AI assistant
CREATE TABLE public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  messages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

-- Anyone can manage their own conversations (by session_id)
CREATE POLICY "Anyone can insert conversations"
ON public.chat_conversations
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view conversations"
ON public.chat_conversations
FOR SELECT
USING (true);

CREATE POLICY "Anyone can update conversations"
ON public.chat_conversations
FOR UPDATE
USING (true);
