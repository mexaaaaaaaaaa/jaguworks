import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Gamepad2, Brain, Keyboard, Trophy, Puzzle, HelpCircle, Bird, Award } from 'lucide-react';
import SEO from '@/components/SEO';
import { GameAchievements, AchievementNotifications } from '@/components/GameAchievements';
import { useGameAchievements } from '@/hooks/useGameAchievements';

const games = [
  {
    id: 'snake',
    title: 'Snake Game',
    description: 'Classic snake game with neon graphics. Eat food, grow longer, don\'t hit walls!',
    icon: Gamepad2,
    color: 'from-green-500 to-emerald-600',
    path: '/games/snake'
  },
  {
    id: 'memory',
    title: 'Memory Cards',
    description: 'Test your memory by matching pairs of cards. Beat your best time!',
    icon: Brain,
    color: 'from-purple-500 to-pink-600',
    path: '/games/memory'
  },
  {
    id: 'typing',
    title: 'Typing Speed Test',
    description: 'How fast can you type? Test your WPM and accuracy!',
    icon: Keyboard,
    color: 'from-blue-500 to-cyan-600',
    path: '/games/typing'
  },
  {
    id: 'puzzle',
    title: 'Sliding Puzzle',
    description: 'Arrange the numbers in order. A classic brain teaser!',
    icon: Puzzle,
    color: 'from-orange-500 to-amber-600',
    path: '/games/puzzle'
  },
  {
    id: 'quiz',
    title: 'Quiz Challenge',
    description: 'Test your knowledge with fun trivia questions!',
    icon: HelpCircle,
    color: 'from-indigo-500 to-violet-600',
    path: '/games/quiz'
  },
  {
    id: 'flappy',
    title: 'Flappy Bird',
    description: 'Tap to fly! Avoid pipes and get the highest score!',
    icon: Bird,
    color: 'from-yellow-500 to-orange-600',
    path: '/games/flappy'
  }
];

const Games = () => {
  const { achievements, newUnlocks, clearNewUnlocks, getUnlockedCount, getTotalCount } = useGameAchievements();
  return (
    <>
      <SEO 
        title="Mini Games | Jagmohan"
        description="Play fun mini games - Snake, Memory Cards, and Typing Speed Test. Challenge yourself!"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary">Fun Zone</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Mini Games
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Take a break and have some fun! Play classic games with a modern neon twist.
            </p>
          </motion.div>

          {/* Games Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={game.path}>
                  <div className="group relative h-full">
                    {/* Glow effect */}
                    <div className={`absolute -inset-1 bg-gradient-to-r ${game.color} rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-500`} />
                    
                    {/* Card */}
                    <div className="relative h-full bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-8 transition-all duration-300 group-hover:scale-[1.02] group-hover:border-primary/50">
                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <game.icon className="w-8 h-8 text-white" />
                      </div>
                      
                      {/* Content */}
                      <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {game.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {game.description}
                      </p>
                      
                      {/* Play button */}
                      <div className="mt-6 flex items-center gap-2 text-primary font-medium">
                        <span>Play Now</span>
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Leaderboard CTA */}
          <motion.div
            className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link to="/games/leaderboard">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-full hover:from-yellow-500/30 hover:to-amber-500/30 transition-all cursor-pointer">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="text-foreground font-medium">View Global Leaderboard</span>
                <span className="text-muted-foreground">→</span>
              </div>
            </Link>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">
                <span className="font-bold text-primary">{getUnlockedCount()}</span>/{getTotalCount()} Achievements
              </span>
            </div>
          </motion.div>
          
          {/* Achievements Section */}
          <motion.div
            className="mt-16 p-6 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GameAchievements 
              achievements={achievements} 
              unlockedCount={getUnlockedCount()} 
              totalCount={getTotalCount()} 
            />
          </motion.div>
        </div>
      </div>
      
      {/* Achievement Notifications */}
      <AchievementNotifications newUnlocks={newUnlocks} onClear={clearNewUnlocks} />
    </>
  );
};

export default Games;
