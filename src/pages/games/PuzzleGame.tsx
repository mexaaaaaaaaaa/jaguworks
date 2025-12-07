import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Trophy, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const GRID_SIZE = 3;
const TILE_COUNT = GRID_SIZE * GRID_SIZE;

export default function PuzzleGame() {
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWon, setIsWon] = useState(false);

  const initGame = () => {
    let shuffled: number[];
    do {
      shuffled = [...Array(TILE_COUNT - 1).keys()].map(i => i + 1);
      shuffled.push(0);
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
    } while (!isSolvable(shuffled));
    
    setTiles(shuffled);
    setMoves(0);
    setTime(0);
    setIsPlaying(true);
    setIsWon(false);
  };

  const isSolvable = (puzzle: number[]) => {
    let inversions = 0;
    for (let i = 0; i < puzzle.length - 1; i++) {
      for (let j = i + 1; j < puzzle.length; j++) {
        if (puzzle[i] && puzzle[j] && puzzle[i] > puzzle[j]) {
          inversions++;
        }
      }
    }
    return inversions % 2 === 0;
  };

  const checkWin = (currentTiles: number[]) => {
    for (let i = 0; i < TILE_COUNT - 1; i++) {
      if (currentTiles[i] !== i + 1) return false;
    }
    return currentTiles[TILE_COUNT - 1] === 0;
  };

  const moveTile = (index: number) => {
    if (!isPlaying || isWon) return;
    
    const emptyIndex = tiles.indexOf(0);
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    const emptyRow = Math.floor(emptyIndex / GRID_SIZE);
    const emptyCol = emptyIndex % GRID_SIZE;

    const isAdjacent = 
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setMoves(m => m + 1);

      if (checkWin(newTiles)) {
        setIsWon(true);
        setIsPlaying(false);
        toast.success(`🎉 Puzzle Solved in ${moves + 1} moves!`);
      }
    }
  };

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isWon) {
      interval = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isWon]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
                🧩 Sliding Puzzle
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                Arrange numbers 1-8 in order
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Stats */}
              <div className="flex justify-center gap-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span>Moves: {moves}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4 text-cyan-500" />
                  <span>{formatTime(time)}</span>
                </div>
              </div>

              {/* Puzzle Grid */}
              <div 
                className="grid gap-2 mx-auto"
                style={{ 
                  gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                  maxWidth: '280px'
                }}
              >
                {tiles.map((tile, index) => (
                  <motion.button
                    key={index}
                    onClick={() => moveTile(index)}
                    className={`
                      aspect-square rounded-lg text-2xl font-bold transition-all
                      ${tile === 0 
                        ? 'bg-transparent' 
                        : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg hover:scale-105 cursor-pointer'
                      }
                    `}
                    whileTap={{ scale: tile !== 0 ? 0.95 : 1 }}
                    layout
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    {tile !== 0 && tile}
                  </motion.button>
                ))}
              </div>

              {/* Win Message */}
              {isWon && (
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }}
                  className="text-center p-4 bg-green-500/20 rounded-xl border border-green-500/30"
                >
                  <p className="text-xl font-bold text-green-400">🎉 Congratulations!</p>
                  <p className="text-muted-foreground">
                    Solved in {moves} moves • {formatTime(time)}
                  </p>
                </motion.div>
              )}

              {/* Controls */}
              <div className="flex justify-center">
                <Button 
                  onClick={initGame}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New Game
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
