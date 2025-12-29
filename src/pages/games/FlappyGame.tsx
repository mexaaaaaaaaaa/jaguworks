import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Trophy, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Leaderboard from '@/components/Leaderboard';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useGameAchievements } from '@/hooks/useGameAchievements';
import { AchievementNotifications } from '@/components/GameAchievements';

const GRAVITY = 0.5;
const JUMP_FORCE = -8;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;
const PIPE_SPEED = 3;
const BIRD_SIZE = 30;
const GAME_WIDTH = 400;
const GAME_HEIGHT = 500;

interface Pipe {
  x: number;
  topHeight: number;
  passed: boolean;
}

export default function FlappyGame() {
  const [birdY, setBirdY] = useState(GAME_HEIGHT / 2);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('flappy-highscore');
    return saved ? parseInt(saved) : 0;
  });
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready');
  const [scoreSaved, setScoreSaved] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);
  const { scores, loading, saveScore } = useLeaderboard('flappy');
  const { newUnlocks, checkScoreAchievements, incrementGamesPlayed, clearNewUnlocks } = useGameAchievements();

  const jump = useCallback(() => {
    if (gameState === 'ready') {
      setGameState('playing');
      setBirdVelocity(JUMP_FORCE);
    } else if (gameState === 'playing') {
      setBirdVelocity(JUMP_FORCE);
    }
  }, [gameState]);

  const resetGame = () => {
    setBirdY(GAME_HEIGHT / 2);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    setGameState('ready');
    setScoreSaved(false);
  };

  // Handle keyboard and touch input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      // Update bird position
      setBirdY(prev => {
        const newY = prev + birdVelocity;
        
        // Check boundaries
        if (newY < 0 || newY > GAME_HEIGHT - BIRD_SIZE) {
          setGameState('gameover');
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('flappy-highscore', score.toString());
          }
          return prev;
        }
        
        return newY;
      });

      setBirdVelocity(prev => prev + GRAVITY);

      // Update pipes
      setPipes(prevPipes => {
        let newPipes = prevPipes
          .map(pipe => ({ ...pipe, x: pipe.x - PIPE_SPEED }))
          .filter(pipe => pipe.x > -PIPE_WIDTH);

        // Add new pipe
        if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < GAME_WIDTH - 200) {
          const topHeight = Math.random() * (GAME_HEIGHT - PIPE_GAP - 100) + 50;
          newPipes.push({ x: GAME_WIDTH, topHeight, passed: false });
        }

        // Check collisions and scoring
        newPipes = newPipes.map(pipe => {
          const birdLeft = 50;
          const birdRight = 50 + BIRD_SIZE;
          const birdTop = birdY;
          const birdBottom = birdY + BIRD_SIZE;

          const pipeLeft = pipe.x;
          const pipeRight = pipe.x + PIPE_WIDTH;

          // Check collision
          if (birdRight > pipeLeft && birdLeft < pipeRight) {
            if (birdTop < pipe.topHeight || birdBottom > pipe.topHeight + PIPE_GAP) {
              setGameState('gameover');
              if (score > highScore) {
                setHighScore(score);
                localStorage.setItem('flappy-highscore', score.toString());
              }
            }
          }

          // Check scoring
          if (!pipe.passed && pipe.x + PIPE_WIDTH < 50) {
            setScore(s => s + 1);
            return { ...pipe, passed: true };
          }

          return pipe;
        });

        return newPipes;
      });
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [gameState, birdVelocity, birdY, score, highScore]);

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4">
      <div className="max-w-lg mx-auto">
        <Link to="/games" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Games
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-card/50 backdrop-blur-xl border-border/50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-foreground">
                🐦 Flappy Bird
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                Tap or press Space to fly!
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Score Display */}
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  Score: {score}
                </div>
                <div className="text-muted-foreground">
                  Best: {highScore}
                </div>
              </div>

              {/* Game Canvas */}
              <div
                ref={gameRef}
                onClick={jump}
                onTouchStart={jump}
                className="relative mx-auto overflow-hidden rounded-xl cursor-pointer select-none"
                style={{
                  width: GAME_WIDTH,
                  height: GAME_HEIGHT,
                  background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                  maxWidth: '100%'
                }}
              >
                {/* Stars */}
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full opacity-50"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 60}%`,
                    }}
                  />
                ))}

                {/* Bird */}
                <motion.div
                  className="absolute"
                  style={{
                    left: 50,
                    top: birdY,
                    width: BIRD_SIZE,
                    height: BIRD_SIZE,
                  }}
                  animate={{
                    rotate: Math.min(Math.max(birdVelocity * 3, -30), 90)
                  }}
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg relative">
                    {/* Eye */}
                    <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-white rounded-full">
                      <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-black rounded-full" />
                    </div>
                    {/* Beak */}
                    <div className="absolute top-1/2 -right-1 w-2 h-1.5 bg-orange-600 rounded-r" />
                  </div>
                </motion.div>

                {/* Pipes */}
                {pipes.map((pipe, index) => (
                  <div key={index}>
                    {/* Top Pipe */}
                    <div
                      className="absolute bg-gradient-to-b from-green-600 to-green-500 border-2 border-green-700"
                      style={{
                        left: pipe.x,
                        top: 0,
                        width: PIPE_WIDTH,
                        height: pipe.topHeight,
                        borderRadius: '0 0 8px 8px',
                      }}
                    >
                      <div 
                        className="absolute -left-1 bottom-0 bg-green-600 border-2 border-green-700"
                        style={{ width: PIPE_WIDTH + 8, height: 20, borderRadius: 4 }}
                      />
                    </div>
                    {/* Bottom Pipe */}
                    <div
                      className="absolute bg-gradient-to-t from-green-600 to-green-500 border-2 border-green-700"
                      style={{
                        left: pipe.x,
                        top: pipe.topHeight + PIPE_GAP,
                        width: PIPE_WIDTH,
                        height: GAME_HEIGHT - pipe.topHeight - PIPE_GAP,
                        borderRadius: '8px 8px 0 0',
                      }}
                    >
                      <div 
                        className="absolute -left-1 top-0 bg-green-600 border-2 border-green-700"
                        style={{ width: PIPE_WIDTH + 8, height: 20, borderRadius: 4 }}
                      />
                    </div>
                  </div>
                ))}

                {/* Ground */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-green-800 to-green-600"
                />

                {/* Ready Screen */}
                {gameState === 'ready' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-center"
                    >
                      <Play className="w-16 h-16 text-white mx-auto mb-4" />
                      <p className="text-white text-xl font-bold">Tap to Start</p>
                      <p className="text-white/70 text-sm mt-2">Press Space or Tap</p>
                    </motion.div>
                  </div>
                )}

                {/* Game Over Screen */}
                {gameState === 'gameover' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-center"
                    >
                      <p className="text-4xl mb-2">💀</p>
                      <p className="text-white text-2xl font-bold mb-2">Game Over!</p>
                      <p className="text-yellow-400 text-xl mb-4">Score: {score}</p>
                      {score === highScore && score > 0 && (
                        <p className="text-green-400 text-sm mb-2">🎉 New High Score!</p>
                      )}
                       {!scoreSaved && score > 0 && (
                         <Button 
                           onClick={async () => {
                             await saveScore(score);
                             setScoreSaved(true);
                             checkScoreAchievements(score);
                             incrementGamesPlayed();
                           }} 
                           className="gap-2 mb-2"
                           variant="outline"
                           size="sm"
                         >
                           <Trophy className="w-4 h-4" />
                           Save Score
                         </Button>
                       )}
                      {scoreSaved && <p className="text-green-400 text-sm mb-2">✓ Score saved!</p>}
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Controls */}
              {gameState === 'gameover' && (
                <div className="flex justify-center">
                  <Button 
                    onClick={resetGame}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Play Again
                  </Button>
                </div>
              )}

              <p className="text-center text-xs text-muted-foreground">
                💡 Tip: Don't hit the pipes or the ground!
              </p>

               {/* Leaderboard */}
               <div className="mt-4 pt-4 border-t border-border/50">
                 <Leaderboard
                   scores={scores}
                   loading={loading}
                   currentScore={score}
                   scoreLabel="pts"
                   gameName="Flappy Bird"
                   showShare={gameState === 'gameover' && score > 0}
                 />
               </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <AchievementNotifications newUnlocks={newUnlocks} onClear={clearNewUnlocks} />
    </div>
  );
}
