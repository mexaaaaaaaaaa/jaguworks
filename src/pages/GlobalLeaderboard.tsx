import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Trophy, Crown, Medal, User, Gamepad2, Brain, Keyboard, 
  Puzzle, HelpCircle, Bird, ArrowLeft, RefreshCw 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';

interface GameScore {
  id: string;
  game_name: string;
  player_name: string | null;
  score: number;
  played_at: string;
  user_id: string | null;
}

const games = [
  { id: 'all', name: 'All Games', icon: Trophy, color: 'from-yellow-500 to-amber-500' },
  { id: 'snake', name: 'Snake', icon: Gamepad2, color: 'from-green-500 to-emerald-500' },
  { id: 'memory', name: 'Memory', icon: Brain, color: 'from-purple-500 to-pink-500' },
  { id: 'typing', name: 'Typing', icon: Keyboard, color: 'from-blue-500 to-cyan-500' },
  { id: 'puzzle', name: 'Puzzle', icon: Puzzle, color: 'from-orange-500 to-amber-500' },
  { id: 'quiz', name: 'Quiz', icon: HelpCircle, color: 'from-indigo-500 to-violet-500' },
  { id: 'flappy', name: 'Flappy', icon: Bird, color: 'from-yellow-500 to-orange-500' },
];

const GlobalLeaderboard = () => {
  const [scores, setScores] = useState<GameScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState('all');

  const fetchScores = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('game_scores')
        .select('*')
        .order('score', { ascending: false })
        .limit(50);

      if (selectedGame !== 'all') {
        query = query.eq('game_name', selectedGame);
      }

      const { data, error } = await query;
      if (error) throw error;
      setScores(data || []);
    } catch (error) {
      console.error('Error fetching scores:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, [selectedGame]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-muted-foreground font-bold">{rank}</span>;
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

  const getGameInfo = (gameName: string) => {
    return games.find(g => g.id === gameName) || games[0];
  };

  const getScoreLabel = (gameName: string) => {
    if (gameName === 'typing') return 'WPM';
    return 'pts';
  };

  // Calculate top players across all games
  const topPlayers = scores.reduce((acc, score) => {
    const playerName = score.player_name || 'Anonymous';
    if (!acc[playerName]) {
      acc[playerName] = { totalScore: 0, gamesPlayed: 0, bestGame: '', bestScore: 0 };
    }
    acc[playerName].totalScore += score.score;
    acc[playerName].gamesPlayed += 1;
    if (score.score > acc[playerName].bestScore) {
      acc[playerName].bestScore = score.score;
      acc[playerName].bestGame = score.game_name;
    }
    return acc;
  }, {} as Record<string, { totalScore: number; gamesPlayed: number; bestGame: string; bestScore: number }>);

  const sortedTopPlayers = Object.entries(topPlayers)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 10);

  return (
    <>
      <SEO
        title="Global Leaderboard | Jagmohan"
        description="View top scores across all mini games. Compete for the highest rankings!"
      />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/games"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Games</span>
            </Link>
            <Button variant="outline" size="sm" onClick={fetchScores} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Title */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-primary font-medium">Hall of Fame</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Global Leaderboard
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The best players across all mini games. Can you make it to the top?
            </p>
          </motion.div>

          {/* Top Players Summary */}
          {selectedGame === 'all' && sortedTopPlayers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                Top Players (Combined Score)
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {sortedTopPlayers.slice(0, 3).map((player, index) => (
                  <Card key={player.name} className={`${getRankBg(index + 1)} border`}>
                    <CardContent className="p-6 text-center">
                      <div className="mb-2">{getRankIcon(index + 1)}</div>
                      <h3 className="text-xl font-bold text-foreground mb-1">{player.name}</h3>
                      <p className="text-3xl font-bold text-primary mb-2">{player.totalScore.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {player.gamesPlayed} games played
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Game Tabs */}
          <Tabs value={selectedGame} onValueChange={setSelectedGame} className="w-full">
            <TabsList className="flex flex-wrap justify-center gap-2 bg-transparent h-auto mb-8">
              {games.map((game) => {
                const Icon = game.icon;
                return (
                  <TabsTrigger
                    key={game.id}
                    value={game.id}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:${game.color} data-[state=active]:text-white data-[state=active]:border-transparent`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{game.name}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {games.map((game) => (
              <TabsContent key={game.id} value={game.id}>
                <Card className="bg-card/50 backdrop-blur-xl border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${game.color} flex items-center justify-center`}>
                        <game.icon className="w-5 h-5 text-white" />
                      </div>
                      <span>{game.name} Leaderboard</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="h-16 bg-muted/30 rounded-lg animate-pulse" />
                        ))}
                      </div>
                    ) : scores.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Trophy className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg">No scores yet</p>
                        <p className="text-sm">Be the first to submit a score!</p>
                        <Link to="/games">
                          <Button className="mt-4">Play Games</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {scores.map((score, index) => {
                          const gameInfo = getGameInfo(score.game_name);
                          const GameIcon = gameInfo.icon;
                          
                          return (
                            <motion.div
                              key={score.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.03 }}
                              className={`flex items-center gap-4 p-4 rounded-xl border ${getRankBg(index + 1)}`}
                            >
                              <div className="flex-shrink-0 w-8">
                                {getRankIcon(index + 1)}
                              </div>
                              
                              {selectedGame === 'all' && (
                                <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${gameInfo.color} flex items-center justify-center`}>
                                  <GameIcon className="w-5 h-5 text-white" />
                                </div>
                              )}
                              
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <span className="text-foreground font-medium truncate">
                                  {score.player_name || 'Anonymous'}
                                </span>
                              </div>
                              
                              {selectedGame === 'all' && (
                                <span className="text-xs text-muted-foreground hidden sm:block">
                                  {gameInfo.name}
                                </span>
                              )}
                              
                              <div className="text-right flex-shrink-0">
                                <span className={`text-xl font-bold ${index < 3 ? 'text-primary' : 'text-foreground'}`}>
                                  {score.score.toLocaleString()}
                                </span>
                                <span className="text-xs text-muted-foreground ml-1">
                                  {getScoreLabel(score.game_name)}
                                </span>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          {/* CTA */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link to="/games">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                <Gamepad2 className="w-5 h-5 mr-2" />
                Play Games & Climb the Ranks
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default GlobalLeaderboard;
