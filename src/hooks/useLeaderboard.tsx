import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface GameScore {
  id: string;
  game_name: string;
  player_name: string | null;
  score: number;
  played_at: string;
  user_id: string | null;
}

export const useLeaderboard = (gameName: string) => {
  const [scores, setScores] = useState<GameScore[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchScores = async () => {
    try {
      const { data, error } = await supabase
        .from('game_scores')
        .select('*')
        .eq('game_name', gameName)
        .order('score', { ascending: false })
        .limit(10);

      if (error) throw error;
      setScores(data || []);
    } catch (error) {
      console.error('Error fetching scores:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveScore = async (score: number, playerName?: string) => {
    try {
      const { error } = await supabase
        .from('game_scores')
        .insert({
          game_name: gameName,
          score,
          player_name: playerName || user?.email?.split('@')[0] || 'Anonymous',
          user_id: user?.id || null,
        });

      if (error) throw error;
      
      // Refresh scores after saving
      await fetchScores();
      return true;
    } catch (error) {
      console.error('Error saving score:', error);
      return false;
    }
  };

  const getUserBestScore = async (): Promise<number | null> => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('game_scores')
        .select('score')
        .eq('game_name', gameName)
        .eq('user_id', user.id)
        .order('score', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data?.score || null;
    } catch (error) {
      console.error('Error fetching user best score:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchScores();
  }, [gameName]);

  return {
    scores,
    loading,
    saveScore,
    fetchScores,
    getUserBestScore,
  };
};
