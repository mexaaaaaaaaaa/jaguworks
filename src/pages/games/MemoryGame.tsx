import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Trophy, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import Leaderboard from '@/components/Leaderboard';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useGameAchievements } from '@/hooks/useGameAchievements';
import { AchievementNotifications } from '@/components/GameAchievements';

const EMOJIS = ['🎮', '🎯', '🎨', '🎵', '🚀', '💎', '⚡', '🔥'];
const GRID_SIZE = 16;

type Card = {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const MemoryGame = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [bestTime, setBestTime] = useState(() => {
    return parseInt(localStorage.getItem('memoryBestTime') || '0');
  });
  const [scoreSaved, setScoreSaved] = useState(false);
  const [wrongMoves, setWrongMoves] = useState(0);
  const { scores, loading, saveScore } = useLeaderboard('memory');
  const { newUnlocks, checkScoreAchievements, incrementGamesPlayed, unlockSpecialAchievement, clearNewUnlocks } = useGameAchievements();

  const initializeGame = () => {
    const shuffledEmojis = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledEmojis);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameComplete(false);
    setStartTime(null);
    setElapsedTime(0);
    setIsLocked(false);
    setWrongMoves(0);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startTime && !gameComplete) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, gameComplete]);

  useEffect(() => {
    if (matches === EMOJIS.length && matches > 0) {
      setGameComplete(true);
      if (bestTime === 0 || elapsedTime < bestTime) {
        setBestTime(elapsedTime);
        localStorage.setItem('memoryBestTime', elapsedTime.toString());
      }
    }
  }, [matches, bestTime, elapsedTime]);

  const handleCardClick = (cardId: number) => {
    if (isLocked) return;
    if (flippedCards.includes(cardId)) return;
    if (cards[cardId].isMatched) return;

    if (!startTime) {
      setStartTime(Date.now());
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    setCards(prev =>
      prev.map(card =>
        card.id === cardId ? { ...card, isFlipped: true } : card
      )
    );

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      setIsLocked(true);

      const [firstId, secondId] = newFlippedCards;
      if (cards[firstId].emoji === cards[secondId].emoji) {
        // Match found
        setCards(prev =>
          prev.map(card =>
            card.id === firstId || card.id === secondId
              ? { ...card, isMatched: true }
              : card
          )
        );
        setMatches(prev => prev + 1);
        setFlippedCards([]);
        setIsLocked(false);
      } else {
        // No match - track wrong moves
        setWrongMoves(prev => prev + 1);
        setTimeout(() => {
          setCards(prev =>
            prev.map(card =>
              card.id === firstId || card.id === secondId
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <SEO title="Memory Game | Jagmohan" description="Test your memory by matching pairs of cards!" />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-500/5 py-20 px-4">
        <div className="container mx-auto max-w-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/games" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Games</span>
            </Link>
            {bestTime > 0 && (
              <div className="flex items-center gap-2 text-yellow-500">
                <Trophy className="w-5 h-5" />
                <span className="font-bold">{formatTime(bestTime)}</span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <span className="text-3xl font-bold text-primary">{moves}</span>
              <p className="text-sm text-muted-foreground">Moves</p>
            </div>
            <div className="text-center">
              <span className="text-3xl font-bold text-primary">{matches}/{EMOJIS.length}</span>
              <p className="text-sm text-muted-foreground">Matches</p>
            </div>
            <div className="text-center flex flex-col items-center">
              <div className="flex items-center gap-1">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-3xl font-bold text-primary">{formatTime(elapsedTime)}</span>
              </div>
              <p className="text-sm text-muted-foreground">Time</p>
            </div>
          </div>

          {/* Game Grid */}
          <motion.div
            className="grid grid-cols-4 gap-3 p-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {cards.map((card) => (
              <motion.button
                key={card.id}
                className={`aspect-square rounded-xl text-4xl flex items-center justify-center transition-all duration-300 ${
                  card.isFlipped || card.isMatched
                    ? 'bg-primary/20 border-primary/50'
                    : 'bg-muted/50 border-border/50 hover:bg-muted hover:border-primary/30'
                } border-2`}
                onClick={() => handleCardClick(card.id)}
                whileHover={{ scale: card.isFlipped || card.isMatched ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {(card.isFlipped || card.isMatched) ? (
                    <motion.span
                      key="emoji"
                      initial={{ rotateY: 90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={card.isMatched ? 'opacity-70' : ''}
                    >
                      {card.emoji}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="hidden"
                      initial={{ rotateY: -90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-2xl text-muted-foreground"
                    >
                      ?
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </motion.div>

          {/* Controls */}
          <div className="flex justify-center mt-8">
            <Button variant="outline" onClick={initializeGame} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              New Game
            </Button>
          </div>

          {/* Game Complete Modal */}
          <AnimatePresence>
            {gameComplete && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-card border border-border rounded-2xl p-8 text-center max-w-sm mx-4"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <h2 className="text-3xl font-bold text-primary mb-2">🎉 Congratulations!</h2>
                  <p className="text-foreground mb-4">You completed the game!</p>
                  <div className="space-y-2 mb-6">
                    <p className="text-muted-foreground">Moves: <span className="text-foreground font-bold">{moves}</span></p>
                    <p className="text-muted-foreground">Time: <span className="text-foreground font-bold">{formatTime(elapsedTime)}</span></p>
                    {elapsedTime <= bestTime && (
                      <p className="text-yellow-500 font-bold">🏆 New Best Time!</p>
                    )}
                  </div>
                  {!scoreSaved && (
                    <Button 
                      onClick={async () => {
                        const scoreValue = Math.max(1000 - elapsedTime * 10 - moves * 5, 100);
                        await saveScore(scoreValue);
                        setScoreSaved(true);
                        checkScoreAchievements(scoreValue);
                        incrementGamesPlayed();
                        if (wrongMoves === 0) {
                          unlockSpecialAchievement('perfect_memory');
                        }
                      }} 
                      className="gap-2 mb-2"
                      variant="outline"
                    >
                      <Trophy className="w-4 h-4" />
                      Save to Leaderboard
                    </Button>
                  )}
                  {scoreSaved && <p className="text-green-500 text-sm mb-2">✓ Score saved!</p>}
                  <Button onClick={() => { initializeGame(); setScoreSaved(false); }} className="gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Play Again
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Leaderboard */}
          <motion.div
            className="mt-8 p-6 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Leaderboard scores={scores} loading={loading} scoreLabel="pts" gameName="Memory" showShare={gameComplete} currentScore={gameComplete ? Math.max(1000 - elapsedTime * 10 - moves * 5, 100) : undefined} />
          </motion.div>
        </div>
      </div>
      
      <AchievementNotifications newUnlocks={newUnlocks} onClear={clearNewUnlocks} />
    </>
  );
};

export default MemoryGame;
