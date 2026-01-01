import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface GameAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
  category: 'score' | 'games' | 'special';
  requirement: number;
  color: string;
}

const ACHIEVEMENTS: Omit<GameAchievement, 'isUnlocked' | 'unlockedAt'>[] = [
  // Score milestones
  { id: 'first_100', name: 'Getting Started', description: 'Score 100 points in any game', icon: '🎯', category: 'score', requirement: 100, color: 'from-green-500/20 to-emerald-500/20' },
  { id: 'first_500', name: 'Rising Star', description: 'Score 500 points in any game', icon: '⭐', category: 'score', requirement: 500, color: 'from-blue-500/20 to-cyan-500/20' },
  { id: 'first_1000', name: 'Pro Player', description: 'Score 1,000 points in any game', icon: '🏅', category: 'score', requirement: 1000, color: 'from-purple-500/20 to-violet-500/20' },
  { id: 'first_5000', name: 'Master Gamer', description: 'Score 5,000 points in any game', icon: '🏆', category: 'score', requirement: 5000, color: 'from-yellow-500/20 to-amber-500/20' },
  { id: 'first_10000', name: 'Legend', description: 'Score 10,000 points in any game', icon: '👑', category: 'score', requirement: 10000, color: 'from-orange-500/20 to-red-500/20' },
  
  // Games played milestones
  { id: 'games_5', name: 'Explorer', description: 'Play 5 games', icon: '🎮', category: 'games', requirement: 5, color: 'from-teal-500/20 to-green-500/20' },
  { id: 'games_25', name: 'Enthusiast', description: 'Play 25 games', icon: '🎲', category: 'games', requirement: 25, color: 'from-indigo-500/20 to-blue-500/20' },
  { id: 'games_100', name: 'Dedicated', description: 'Play 100 games', icon: '🔥', category: 'games', requirement: 100, color: 'from-pink-500/20 to-rose-500/20' },
  
  // Special achievements
  { id: 'perfect_memory', name: 'Perfect Memory', description: 'Complete Memory game with 0 wrong moves', icon: '🧠', category: 'special', requirement: 0, color: 'from-fuchsia-500/20 to-purple-500/20' },
  { id: 'speed_demon', name: 'Speed Demon', description: 'Score 100+ WPM in Typing Test', icon: '⚡', category: 'special', requirement: 100, color: 'from-yellow-500/20 to-orange-500/20' },
  { id: 'quiz_master', name: 'Quiz Master', description: 'Get all questions correct in Quiz', icon: '📚', category: 'special', requirement: 100, color: 'from-emerald-500/20 to-teal-500/20' },
];

export const useGameAchievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<GameAchievement[]>([]);
  const [newUnlocks, setNewUnlocks] = useState<GameAchievement[]>([]);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load achievements from Supabase for logged-in users, localStorage for guests
  useEffect(() => {
    const loadAchievements = async () => {
      setIsLoading(true);
      
      if (user) {
        // Fetch from Supabase
        const { data: unlockedAchievements } = await supabase
          .from('game_achievements')
          .select('achievement_id, unlocked_at')
          .eq('user_id', user.id);
        
        const { data: statsData } = await supabase
          .from('user_game_stats')
          .select('games_played')
          .eq('user_id', user.id)
          .maybeSingle();
        
        const unlockedMap: Record<string, string> = {};
        unlockedAchievements?.forEach(a => {
          unlockedMap[a.achievement_id] = a.unlocked_at;
        });
        
        const loadedAchievements = ACHIEVEMENTS.map(a => ({
          ...a,
          isUnlocked: !!unlockedMap[a.id],
          unlockedAt: unlockedMap[a.id],
        }));
        
        setAchievements(loadedAchievements);
        setGamesPlayed(statsData?.games_played || 0);
      } else {
        // Fallback to localStorage for guests
        const stored = localStorage.getItem('jaguworks_game_achievements');
        const unlockedIds: Record<string, string> = stored ? JSON.parse(stored) : {};
        
        const loadedAchievements = ACHIEVEMENTS.map(a => ({
          ...a,
          isUnlocked: !!unlockedIds[a.id],
          unlockedAt: unlockedIds[a.id],
        }));
        
        setAchievements(loadedAchievements);
        setGamesPlayed(parseInt(localStorage.getItem('jaguworks_games_played') || '0', 10));
      }
      
      setIsLoading(false);
    };
    
    loadAchievements();
  }, [user]);

  // Save achievement to Supabase or localStorage
  const saveAchievement = useCallback(async (achievementId: string, unlockedAt: string) => {
    if (user) {
      await supabase
        .from('game_achievements')
        .upsert({
          user_id: user.id,
          achievement_id: achievementId,
          unlocked_at: unlockedAt,
        }, { onConflict: 'user_id,achievement_id' });
    } else {
      // Fallback to localStorage
      const stored = localStorage.getItem('jaguworks_game_achievements');
      const unlockedIds: Record<string, string> = stored ? JSON.parse(stored) : {};
      unlockedIds[achievementId] = unlockedAt;
      localStorage.setItem('jaguworks_game_achievements', JSON.stringify(unlockedIds));
    }
  }, [user]);

  // Check and unlock achievements based on score
  const checkScoreAchievements = useCallback(async (score: number) => {
    const newlyUnlocked: GameAchievement[] = [];
    const now = new Date().toISOString();
    
    const updated = achievements.map(a => {
      if (a.isUnlocked) return a;
      
      if (a.category === 'score' && score >= a.requirement) {
        const unlocked = { ...a, isUnlocked: true, unlockedAt: now };
        newlyUnlocked.push(unlocked);
        return unlocked;
      }
      
      return a;
    });
    
    if (newlyUnlocked.length > 0) {
      setAchievements(updated);
      setNewUnlocks(prev => [...prev, ...newlyUnlocked]);
      
      // Save each new achievement
      for (const achievement of newlyUnlocked) {
        await saveAchievement(achievement.id, achievement.unlockedAt!);
      }
    }
    
    return newlyUnlocked;
  }, [achievements, saveAchievement]);

  // Check special achievements
  const unlockSpecialAchievement = useCallback(async (achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement || achievement.isUnlocked) return null;
    
    const now = new Date().toISOString();
    const unlocked = { ...achievement, isUnlocked: true, unlockedAt: now };
    const updated = achievements.map(a => a.id === achievementId ? unlocked : a);
    
    setAchievements(updated);
    setNewUnlocks(prev => [...prev, unlocked]);
    
    await saveAchievement(achievementId, now);
    
    return unlocked;
  }, [achievements, saveAchievement]);

  // Increment games played and check achievements
  const incrementGamesPlayed = useCallback(async () => {
    const newCount = gamesPlayed + 1;
    setGamesPlayed(newCount);
    
    if (user) {
      // Upsert to Supabase
      await supabase
        .from('user_game_stats')
        .upsert({
          user_id: user.id,
          games_played: newCount,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });
    } else {
      localStorage.setItem('jaguworks_games_played', newCount.toString());
    }
    
    const newlyUnlocked: GameAchievement[] = [];
    const now = new Date().toISOString();
    
    const updated = achievements.map(a => {
      if (a.isUnlocked) return a;
      
      if (a.category === 'games' && newCount >= a.requirement) {
        const unlocked = { ...a, isUnlocked: true, unlockedAt: now };
        newlyUnlocked.push(unlocked);
        return unlocked;
      }
      
      return a;
    });
    
    if (newlyUnlocked.length > 0) {
      setAchievements(updated);
      setNewUnlocks(prev => [...prev, ...newlyUnlocked]);
      
      for (const achievement of newlyUnlocked) {
        await saveAchievement(achievement.id, achievement.unlockedAt!);
      }
    }
    
    return newCount;
  }, [achievements, gamesPlayed, saveAchievement, user]);

  // Clear new unlocks notification
  const clearNewUnlocks = useCallback(() => {
    setNewUnlocks([]);
  }, []);

  const getUnlockedCount = () => achievements.filter(a => a.isUnlocked).length;
  const getTotalCount = () => achievements.length;

  return {
    achievements,
    newUnlocks,
    isLoading,
    gamesPlayed,
    checkScoreAchievements,
    unlockSpecialAchievement,
    incrementGamesPlayed,
    clearNewUnlocks,
    getUnlockedCount,
    getTotalCount,
  };
};
