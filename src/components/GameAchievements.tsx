import { motion, AnimatePresence } from 'framer-motion';
import { Award, Lock, X } from 'lucide-react';
import { GameAchievement } from '@/hooks/useGameAchievements';
import { Button } from '@/components/ui/button';

interface GameAchievementsProps {
  achievements: GameAchievement[];
  unlockedCount: number;
  totalCount: number;
}

export const GameAchievements = ({ achievements, unlockedCount, totalCount }: GameAchievementsProps) => {
  const categories = [
    { key: 'score', label: 'Score Milestones', icon: '🎯' },
    { key: 'games', label: 'Games Played', icon: '🎮' },
    { key: 'special', label: 'Special', icon: '✨' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Achievements</h2>
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="text-primary font-bold">{unlockedCount}</span> / {totalCount} unlocked
        </div>
      </div>
      
      <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      
      {categories.map(category => {
        const categoryAchievements = achievements.filter(a => a.category === category.key);
        
        return (
          <div key={category.key} className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <span>{category.icon}</span>
              {category.label}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categoryAchievements.map(achievement => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`relative p-4 rounded-xl border ${
                    achievement.isUnlocked 
                      ? `bg-gradient-to-br ${achievement.color} border-primary/30` 
                      : 'bg-muted/20 border-border/50 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`text-2xl ${!achievement.isUnlocked ? 'grayscale opacity-50' : ''}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground truncate">
                          {achievement.name}
                        </h4>
                        {!achievement.isUnlocked && (
                          <Lock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {achievement.description}
                      </p>
                      {achievement.isUnlocked && achievement.unlockedAt && (
                        <p className="text-xs text-primary mt-2">
                          Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface AchievementToastProps {
  achievement: GameAchievement;
  onClose: () => void;
}

export const AchievementToast = ({ achievement, onClose }: AchievementToastProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-gradient-to-br ${achievement.color} backdrop-blur-xl border border-primary/30 rounded-2xl p-4 shadow-2xl max-w-sm`}
    >
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 h-6 w-6 p-0"
        onClick={onClose}
      >
        <X className="w-4 h-4" />
      </Button>
      
      <div className="flex items-center gap-4">
        <div className="text-4xl animate-bounce">
          {achievement.icon}
        </div>
        <div>
          <p className="text-xs text-primary font-semibold uppercase tracking-wide">
            Achievement Unlocked!
          </p>
          <h4 className="font-bold text-foreground text-lg">
            {achievement.name}
          </h4>
          <p className="text-sm text-muted-foreground">
            {achievement.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

interface AchievementNotificationsProps {
  newUnlocks: GameAchievement[];
  onClear: () => void;
}

export const AchievementNotifications = ({ newUnlocks, onClear }: AchievementNotificationsProps) => {
  if (newUnlocks.length === 0) return null;
  
  return (
    <AnimatePresence>
      <AchievementToast 
        achievement={newUnlocks[0]} 
        onClose={onClear}
      />
    </AnimatePresence>
  );
};
