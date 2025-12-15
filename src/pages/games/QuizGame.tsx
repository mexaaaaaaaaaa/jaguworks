import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Trophy, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import Leaderboard from '@/components/Leaderboard';
import { useLeaderboard } from '@/hooks/useLeaderboard';

interface Question {
  question: string;
  options: string[];
  correct: number;
  category: string;
}

const QUESTIONS: Question[] = [
  {
    question: "What does HTML stand for?",
    options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks Text Mark Language"],
    correct: 0,
    category: "Web Dev"
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correct: 1,
    category: "Science"
  },
  {
    question: "What is the capital of Japan?",
    options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
    correct: 2,
    category: "Geography"
  },
  {
    question: "Which programming language is known as the 'language of the web'?",
    options: ["Python", "Java", "JavaScript", "C++"],
    correct: 2,
    category: "Programming"
  },
  {
    question: "What year was the first iPhone released?",
    options: ["2005", "2006", "2007", "2008"],
    correct: 2,
    category: "Tech"
  },
  {
    question: "Which element has the chemical symbol 'O'?",
    options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
    correct: 1,
    category: "Science"
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Michelangelo", "Raphael", "Leonardo da Vinci", "Donatello"],
    correct: 2,
    category: "Art"
  },
  {
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correct: 1,
    category: "Nature"
  },
  {
    question: "Which company created Minecraft?",
    options: ["Mojang", "Epic Games", "Valve", "Activision"],
    correct: 0,
    category: "Gaming"
  },
  {
    question: "What does CSS stand for?",
    options: ["Computer Style Sheets", "Creative Style System", "Cascading Style Sheets", "Colorful Style Sheets"],
    correct: 2,
    category: "Web Dev"
  }
];

export default function QuizGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [scoreSaved, setScoreSaved] = useState(false);
  const { scores, loading, saveScore } = useLeaderboard('quiz');

  const resetGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(15);
    setGameOver(false);
    setAnswers([]);
    setScoreSaved(false);
  };

  useEffect(() => {
    if (gameOver || showResult) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAnswer(-1);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, gameOver, showResult]);

  const handleAnswer = (answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = answerIndex === QUESTIONS[currentQuestion].correct;
    setAnswers([...answers, isCorrect]);
    
    if (isCorrect) {
      setScore(s => s + 1);
      toast.success('Correct! 🎉');
    } else {
      toast.error('Wrong answer!');
    }

    setTimeout(() => {
      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion(c => c + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setTimeLeft(15);
      } else {
        setGameOver(true);
      }
    }, 1500);
  };

  const question = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <Link to="/games" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Games
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-card/50 backdrop-blur-xl border-border/50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-foreground">
                🧠 Quiz Challenge
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!gameOver ? (
                <>
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Question {currentQuestion + 1}/{QUESTIONS.length}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {timeLeft}s
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {/* Category Badge */}
                  <div className="flex justify-center">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                      {question.category}
                    </span>
                  </div>

                  {/* Question */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentQuestion}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-semibold text-foreground text-center">
                        {question.question}
                      </h3>

                      {/* Options */}
                      <div className="grid gap-3">
                        {question.options.map((option, index) => {
                          const isSelected = selectedAnswer === index;
                          const isCorrect = index === question.correct;
                          
                          let bgClass = 'bg-background/50 hover:bg-background/80 border-border/50';
                          if (showResult) {
                            if (isCorrect) bgClass = 'bg-green-500/20 border-green-500/50';
                            else if (isSelected) bgClass = 'bg-red-500/20 border-red-500/50';
                          }

                          return (
                            <motion.button
                              key={index}
                              onClick={() => handleAnswer(index)}
                              disabled={showResult}
                              className={`
                                p-4 rounded-xl border text-left transition-all
                                ${bgClass}
                                ${!showResult && 'hover:scale-[1.02]'}
                              `}
                              whileTap={{ scale: showResult ? 1 : 0.98 }}
                            >
                              <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                                  {String.fromCharCode(65 + index)}
                                </span>
                                <span className="text-foreground">{option}</span>
                                {showResult && isCorrect && (
                                  <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                                )}
                                {showResult && isSelected && !isCorrect && (
                                  <XCircle className="w-5 h-5 text-red-500 ml-auto" />
                                )}
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Score */}
                  <div className="flex justify-center">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      Score: {score}/{currentQuestion + (showResult ? 1 : 0)}
                    </div>
                  </div>
                </>
              ) : (
                /* Game Over */
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center space-y-6 py-8"
                >
                  <div className="text-6xl">
                    {score >= 8 ? '🏆' : score >= 5 ? '🎉' : '💪'}
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Quiz Complete!</h3>
                  <div className="text-4xl font-bold text-purple-400">
                    {score}/{QUESTIONS.length}
                  </div>
                  <p className="text-muted-foreground">
                    {score >= 8 ? 'Excellent! You\'re a genius!' : 
                     score >= 5 ? 'Great job! Keep learning!' : 
                     'Good try! Practice makes perfect!'}
                  </p>
                  
                  {/* Answer Summary */}
                  <div className="flex justify-center gap-2 flex-wrap">
                    {answers.map((correct, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                          ${correct ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
                        `}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>

                  {!scoreSaved && (
                    <Button 
                      onClick={async () => {
                        await saveScore(score * 10);
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

                  <Button 
                    onClick={resetGame}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Play Again
                  </Button>
                </motion.div>
              )}

              {/* Leaderboard */}
              <div className="mt-4 pt-4 border-t border-border/50">
                <Leaderboard scores={scores} loading={loading} currentScore={score * 10} scoreLabel="pts" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
