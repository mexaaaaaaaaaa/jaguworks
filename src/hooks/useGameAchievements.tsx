import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

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

const STORAGE_KEY = 'jaguworks_game_achievements';

export const useGameAchievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<GameAchievement[]>([]);
  const [newUnlocks, setNewUnlocks] = useState<GameAchievement[]>([]);

  // Load achievements from localStorage
  useEffect(() => {
    const storageKey = user ? `${STORAGE_KEY}_${user.id}` : STORAGE_KEY;
    const stored = localStorage.getItem(storageKey);
    const unlockedIds: Record<string, string> = stored ? JSON.parse(stored) : {};
    
    const loadedAchievements = ACHIEVEMENTS.map(a => ({
      ...a,
      isUnlocked: !!unlockedIds[a.id],
      unlockedAt: unlockedIds[a.id],
    }));
    
    setAchievements(loadedAchievements);
  }, [user]);

  // Save achievements to localStorage
  const saveAchievements = useCallback((updated: GameAchievement[]) => {
    const storageKey = user ? `${STORAGE_KEY}_${user.id}` : STORAGE_KEY;
    const unlockedIds: Record<string, string> = {};
    updated.forEach(a => {
      if (a.isUnlocked && a.unlockedAt) {
        unlockedIds[a.id] = a.unlockedAt;
      }
    });
    localStorage.setItem(storageKey, JSON.stringify(unlockedIds));
  }, [user]);

  // Check and unlock achievements based on score
  const checkScoreAchievements = useCallback((score: number) => {
    const newlyUnlocked: GameAchievement[] = [];
    
    const updated = achievements.map(a => {
      if (a.isUnlocked) return a;
      
      if (a.category === 'score' && score >= a.requirement) {
        const unlocked = { ...a, isUnlocked: true, unlockedAt: new Date().toISOString() };
        newlyUnlocked.push(unlocked);
        return unlocked;
      }
      
      return a;
    });
    
    if (newlyUnlocked.length > 0) {
      setAchievements(updated);
      saveAchievements(updated);
      setNewUnlocks(prev => [...prev, ...newlyUnlocked]);
    }
    
    return newlyUnlocked;
  }, [achievements, saveAchievements]);

  // Check special achievements
  const unlockSpecialAchievement = useCallback((achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement || achievement.isUnlocked) return null;
    
    const unlocked = { ...achievement, isUnlocked: true, unlockedAt: new Date().toISOString() };
    const updated = achievements.map(a => a.id === achievementId ? unlocked : a);
    
    setAchievements(updated);
    saveAchievements(updated);
    setNewUnlocks(prev => [...prev, unlocked]);
    
    return unlocked;
  }, [achievements, saveAchievements]);

  // Increment games played and check achievements
  const incrementGamesPlayed = useCallback(() => {
    const storageKey = user ? `jaguworks_games_played_${user.id}` : 'jaguworks_games_played';
    const current = parseInt(localStorage.getItem(storageKey) || '0', 10);
    const newCount = current + 1;
    localStorage.setItem(storageKey, newCount.toString());
    
    const newlyUnlocked: GameAchievement[] = [];
    
    const updated = achievements.map(a => {
      if (a.isUnlocked) return a;
      
      if (a.category === 'games' && newCount >= a.requirement) {
        const unlocked = { ...a, isUnlocked: true, unlockedAt: new Date().toISOString() };
        newlyUnlocked.push(unlocked);
        return unlocked;
      }
      
      return a;
    });
    
    if (newlyUnlocked.length > 0) {
      setAchievements(updated);
      saveAchievements(updated);
      setNewUnlocks(prev => [...prev, ...newlyUnlocked]);
    }
    
    return newCount;
  }, [achievements, saveAchievements, user]);

  // Clear new unlocks notification
  const clearNewUnlocks = useCallback(() => {
    setNewUnlocks([]);
  }, []);

  const getUnlockedCount = () => achievements.filter(a => a.isUnlocked).length;
  const getTotalCount = () => achievements.length;

  return {
    achievements,
    newUnlocks,
    checkScoreAchievements,
    unlockSpecialAchievement,
    incrementGamesPlayed,
    clearNewUnlocks,
    getUnlockedCount,
    getTotalCount,
  };
};
