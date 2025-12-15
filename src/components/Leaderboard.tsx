import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, User } from 'lucide-react';
import { GameScore } from '@/hooks/useLeaderboard';
import ShareScore from './ShareScore';

interface LeaderboardProps {
  scores: GameScore[];
  loading: boolean;
  currentScore?: number;
  scoreLabel?: string;
  gameName?: string;
  showShare?: boolean;
}

const Leaderboard = ({ scores, loading, currentScore, scoreLabel = 'Score', gameName = 'Game', showShare = false }: LeaderboardProps) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-muted-foreground font-bold">{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-slate-400/20 border-gray-400/30';
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-600/30';
      default:
        return 'bg-card/50 border-border/50';
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-muted/30 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (scores.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No scores yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-foreground">Leaderboard</h3>
      </div>
      
      {scores.map((score, index) => (
        <motion.div
          key={score.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`flex items-center gap-3 p-3 rounded-lg border ${getRankBg(index + 1)}`}
        >
          <div className="flex-shrink-0">
            {getRankIcon(index + 1)}
          </div>
          
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-foreground truncate">
              {score.player_name || 'Anonymous'}
            </span>
          </div>
          
          <div className="text-right flex-shrink-0">
            <span className={`font-bold ${index < 3 ? 'text-primary' : 'text-foreground'}`}>
              {score.score.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground ml-1">{scoreLabel}</span>
          </div>
        </motion.div>
      ))}
      
      {currentScore !== undefined && (
        <div className="mt-4 pt-4 border-t border-border/50 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Your current score:</span>
            <span className="font-bold text-primary">{currentScore.toLocaleString()}</span>
          </div>
          
          {showShare && (
            <ShareScore 
              score={currentScore} 
              gameName={gameName}
              isHighScore={scores.length > 0 && currentScore >= scores[0]?.score}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
