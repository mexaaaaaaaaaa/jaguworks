import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, RotateCcw, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

type Position = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const SnakeGame = () => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('snakeHighScore') || '0');
  });
  
  const directionRef = useRef(direction);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((snakeBody: Position[]) => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (snakeBody.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    const initialSnake = [{ x: 10, y: 10 }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setScore(0);
    setGameOver(false);
    setIsPlaying(false);
  }, [generateFood]);

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };
      const currentDirection = directionRef.current;

      switch (currentDirection) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => {
          const newScore = prev + 10;
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('snakeHighScore', newScore.toString());
          }
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, highScore, generateFood]);

  useEffect(() => {
    if (isPlaying && !gameOver) {
      gameLoopRef.current = setInterval(moveSnake, INITIAL_SPEED - Math.min(score, 100));
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPlaying, gameOver, moveSnake, score]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      
      const key = e.key;
      const currentDir = directionRef.current;

      if ((key === 'ArrowUp' || key === 'w') && currentDir !== 'DOWN') {
        directionRef.current = 'UP';
        setDirection('UP');
      } else if ((key === 'ArrowDown' || key === 's') && currentDir !== 'UP') {
        directionRef.current = 'DOWN';
        setDirection('DOWN');
      } else if ((key === 'ArrowLeft' || key === 'a') && currentDir !== 'RIGHT') {
        directionRef.current = 'LEFT';
        setDirection('LEFT');
      } else if ((key === 'ArrowRight' || key === 'd') && currentDir !== 'LEFT') {
        directionRef.current = 'RIGHT';
        setDirection('RIGHT');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  return (
    <>
      <SEO title="Snake Game | Jagmohan" description="Play the classic Snake game with neon graphics!" />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-500/5 py-20 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/games" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Games</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-yellow-500">
                <Trophy className="w-5 h-5" />
                <span className="font-bold">{highScore}</span>
              </div>
            </div>
          </div>

          {/* Game Container */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {/* Score */}
            <div className="text-center mb-4">
              <span className="text-4xl font-bold text-primary">{score}</span>
              <p className="text-muted-foreground">Score</p>
            </div>

            {/* Game Board */}
            <div 
              className="relative mx-auto border-2 border-primary/50 rounded-lg overflow-hidden bg-background/50 backdrop-blur-sm"
              style={{ 
                width: GRID_SIZE * CELL_SIZE, 
                height: GRID_SIZE * CELL_SIZE 
              }}
            >
              {/* Grid background */}
              <div className="absolute inset-0 opacity-10">
                {Array.from({ length: GRID_SIZE }).map((_, i) => (
                  <div key={i} className="flex">
                    {Array.from({ length: GRID_SIZE }).map((_, j) => (
                      <div
                        key={j}
                        className="border border-primary/20"
                        style={{ width: CELL_SIZE, height: CELL_SIZE }}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* Snake */}
              {snake.map((segment, index) => (
                <motion.div
                  key={index}
                  className={`absolute rounded-sm ${index === 0 ? 'bg-primary shadow-lg shadow-primary/50' : 'bg-primary/70'}`}
                  style={{
                    width: CELL_SIZE - 2,
                    height: CELL_SIZE - 2,
                    left: segment.x * CELL_SIZE + 1,
                    top: segment.y * CELL_SIZE + 1,
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.1 }}
                />
              ))}

              {/* Food */}
              <motion.div
                className="absolute bg-red-500 rounded-full shadow-lg shadow-red-500/50"
                style={{
                  width: CELL_SIZE - 4,
                  height: CELL_SIZE - 4,
                  left: food.x * CELL_SIZE + 2,
                  top: food.y * CELL_SIZE + 2,
                }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />

              {/* Game Over Overlay */}
              {gameOver && (
                <motion.div
                  className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h2 className="text-3xl font-bold text-red-500 mb-2">Game Over!</h2>
                  <p className="text-xl text-foreground mb-4">Score: {score}</p>
                  {score >= highScore && score > 0 && (
                    <p className="text-yellow-500 font-bold mb-4">🎉 New High Score!</p>
                  )}
                  <Button onClick={resetGame} className="gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Play Again
                  </Button>
                </motion.div>
              )}

              {/* Start Overlay */}
              {!isPlaying && !gameOver && (
                <motion.div
                  className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h2 className="text-2xl font-bold text-foreground mb-4">Snake Game</h2>
                  <p className="text-muted-foreground mb-4">Use arrow keys or WASD to move</p>
                  <Button onClick={() => setIsPlaying(true)} className="gap-2">
                    <Play className="w-4 h-4" />
                    Start Game
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4 mt-6">
              {isPlaying ? (
                <Button variant="outline" onClick={() => setIsPlaying(false)} className="gap-2">
                  <Pause className="w-4 h-4" />
                  Pause
                </Button>
              ) : (
                !gameOver && (
                  <Button onClick={() => setIsPlaying(true)} className="gap-2">
                    <Play className="w-4 h-4" />
                    {score > 0 ? 'Resume' : 'Start'}
                  </Button>
                )
              )}
              <Button variant="outline" onClick={resetGame} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>

            {/* Mobile Controls */}
            <div className="mt-8 grid grid-cols-3 gap-2 max-w-[200px] mx-auto md:hidden">
              <div />
              <Button
                variant="outline"
                size="lg"
                onClick={() => { directionRef.current = 'UP'; setDirection('UP'); }}
                disabled={!isPlaying || direction === 'DOWN'}
              >
                ↑
              </Button>
              <div />
              <Button
                variant="outline"
                size="lg"
                onClick={() => { directionRef.current = 'LEFT'; setDirection('LEFT'); }}
                disabled={!isPlaying || direction === 'RIGHT'}
              >
                ←
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => { directionRef.current = 'DOWN'; setDirection('DOWN'); }}
                disabled={!isPlaying || direction === 'UP'}
              >
                ↓
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => { directionRef.current = 'RIGHT'; setDirection('RIGHT'); }}
                disabled={!isPlaying || direction === 'LEFT'}
              >
                →
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SnakeGame;
