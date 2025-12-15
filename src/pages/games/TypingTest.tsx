import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Trophy, Keyboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import Leaderboard from '@/components/Leaderboard';
import { useLeaderboard } from '@/hooks/useLeaderboard';

const SAMPLE_TEXTS = [
  "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet.",
  "Programming is the art of telling a computer what to do. Good code is its own best documentation.",
  "Success is not final, failure is not fatal. It is the courage to continue that counts.",
  "In the middle of difficulty lies opportunity. Every expert was once a beginner.",
  "The only way to do great work is to love what you do. Stay hungry, stay foolish.",
  "Code is like humor. When you have to explain it, it's bad. Keep it simple and elegant.",
];

const TypingTest = () => {
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [bestWpm, setBestWpm] = useState(() => {
    return parseInt(localStorage.getItem('typingBestWpm') || '0');
  });
  const [scoreSaved, setScoreSaved] = useState(false);
  const { scores, loading, saveScore } = useLeaderboard('typing');
  
  const inputRef = useRef<HTMLInputElement>(null);

  const initializeGame = useCallback(() => {
    const randomText = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
    setText(randomText);
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setIsActive(false);
    setCurrentIndex(0);
    setErrors(0);
    setWpm(0);
    setAccuracy(100);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    if (startTime && !endTime) {
      const interval = setInterval(() => {
        const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
        const wordsTyped = userInput.trim().split(/\s+/).filter(w => w).length;
        const currentWpm = Math.round(wordsTyped / timeElapsed) || 0;
        setWpm(currentWpm);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [startTime, endTime, userInput]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (!startTime) {
      setStartTime(Date.now());
      setIsActive(true);
    }

    // Count errors
    let errorCount = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== text[i]) {
        errorCount++;
      }
    }
    setErrors(errorCount);

    // Calculate accuracy
    const totalChars = value.length;
    const correctChars = totalChars - errorCount;
    const acc = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    setAccuracy(acc);

    setUserInput(value);
    setCurrentIndex(value.length);

    // Check if completed
    if (value.length === text.length) {
      setEndTime(Date.now());
      setIsActive(false);
      
      const timeElapsed = (Date.now() - (startTime || Date.now())) / 1000 / 60;
      const wordsTyped = value.trim().split(/\s+/).filter(w => w).length;
      const finalWpm = Math.round(wordsTyped / timeElapsed) || 0;
      setWpm(finalWpm);

      if (finalWpm > bestWpm && acc >= 90) {
        setBestWpm(finalWpm);
        localStorage.setItem('typingBestWpm', finalWpm.toString());
      }
    }
  };

  const getCharacterClass = (index: number) => {
    if (index >= userInput.length) {
      return 'text-muted-foreground';
    }
    if (userInput[index] === text[index]) {
      return 'text-primary';
    }
    return 'text-red-500 bg-red-500/20';
  };

  const isComplete = endTime !== null;

  return (
    <>
      <SEO title="Typing Speed Test | Jagmohan" description="Test your typing speed and accuracy!" />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-500/5 py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/games" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Games</span>
            </Link>
            {bestWpm > 0 && (
              <div className="flex items-center gap-2 text-yellow-500">
                <Trophy className="w-5 h-5" />
                <span className="font-bold">{bestWpm} WPM</span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <span className="text-4xl font-bold text-primary">{wpm}</span>
              <p className="text-sm text-muted-foreground">WPM</p>
            </div>
            <div className="text-center">
              <span className={`text-4xl font-bold ${accuracy >= 90 ? 'text-green-500' : accuracy >= 70 ? 'text-yellow-500' : 'text-red-500'}`}>
                {accuracy}%
              </span>
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </div>
            <div className="text-center">
              <span className="text-4xl font-bold text-red-500">{errors}</span>
              <p className="text-sm text-muted-foreground">Errors</p>
            </div>
          </div>

          {/* Text Display */}
          <motion.div
            className="relative p-6 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Keyboard className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Type the text below:</span>
            </div>
            
            <div className="text-xl md:text-2xl leading-relaxed font-mono">
              {text.split('').map((char, index) => (
                <span
                  key={index}
                  className={`${getCharacterClass(index)} ${
                    index === currentIndex ? 'border-l-2 border-primary animate-pulse' : ''
                  }`}
                >
                  {char}
                </span>
              ))}
            </div>

            {/* Hidden Input */}
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              className="absolute inset-0 opacity-0 cursor-text"
              disabled={isComplete}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
            />

            {/* Click to focus overlay */}
            {!isActive && !isComplete && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-2xl cursor-text"
                onClick={() => inputRef.current?.focus()}
              >
                <p className="text-muted-foreground">Click here and start typing...</p>
              </div>
            )}
          </motion.div>

          {/* Progress Bar */}
          <div className="h-2 bg-muted rounded-full overflow-hidden mb-8">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${(currentIndex / text.length) * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Controls */}
          <div className="flex justify-center">
            <Button variant="outline" onClick={initializeGame} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              New Text
            </Button>
          </div>

          {/* Complete Modal */}
          {isComplete && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="bg-card border border-border rounded-2xl p-8 text-center max-w-sm mx-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <h2 className="text-3xl font-bold text-primary mb-4">
                  {wpm >= 60 ? '🚀 Amazing!' : wpm >= 40 ? '👍 Good Job!' : '💪 Keep Practicing!'}
                </h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-muted-foreground">Speed</span>
                    <span className="text-2xl font-bold text-primary">{wpm} WPM</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-muted-foreground">Accuracy</span>
                    <span className={`text-2xl font-bold ${accuracy >= 90 ? 'text-green-500' : 'text-yellow-500'}`}>
                      {accuracy}%
                    </span>
                  </div>
                  {wpm > bestWpm && accuracy >= 90 && (
                    <p className="text-yellow-500 font-bold">🏆 New Personal Best!</p>
                  )}
                </div>
                {!scoreSaved && (
                  <Button 
                    onClick={async () => {
                      await saveScore(wpm);
                      setScoreSaved(true);
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
                  Try Again
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Leaderboard */}
          <motion.div
            className="mt-8 p-6 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Leaderboard scores={scores} loading={loading} currentScore={wpm} scoreLabel="WPM" />
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default TypingTest;
