import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Shuffle, Copy, Share2, Heart, Twitter, Bookmark, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Footer from "@/components/Footer";

interface QuoteData {
  text: string;
  author: string;
  category: string;
}

const RandomQuote = () => {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedQuotes, setSavedQuotes] = useState<QuoteData[]>([]);

  const quotes: QuoteData[] = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "Motivation" },
    { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs", category: "Leadership" },
    { text: "Stay hungry, stay foolish.", author: "Steve Jobs", category: "Life" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "Dreams" },
    { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle", category: "Wisdom" },
    { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins", category: "Motivation" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "Success" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "Belief" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", category: "Wisdom" },
    { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs", category: "Life" },
    { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt", category: "Future" },
    { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt", category: "Action" },
    { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair", category: "Courage" },
    { text: "The mind is everything. What you think you become.", author: "Buddha", category: "Mindset" },
    { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "Life" },
  ];

  const categories = [...new Set(quotes.map(q => q.category))];

  const generateQuote = (category?: string) => {
    setIsLoading(true);
    setLiked(false);
    setCopied(false);
    setSaved(false);

    setTimeout(() => {
      let filteredQuotes = category ? quotes.filter(q => q.category === category) : quotes;
      const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
      setQuote(randomQuote);
      setIsLoading(false);
    }, 500);
  };

  const copyQuote = async () => {
    if (!quote) return;
    await navigator.clipboard.writeText(`"${quote.text}" - ${quote.author}`);
    setCopied(true);
    toast.success("Quote copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToTwitter = () => {
    if (!quote) return;
    const tweetText = encodeURIComponent(`"${quote.text}" - ${quote.author}`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, "_blank");
  };

  const shareQuote = async () => {
    if (!quote) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Inspirational Quote",
          text: `"${quote.text}" - ${quote.author}`,
        });
      } catch (error) {
        // User cancelled
      }
    } else {
      copyQuote();
    }
  };

  const saveQuote = () => {
    if (!quote) return;
    if (!saved) {
      setSavedQuotes(prev => [...prev, quote]);
      toast.success("Quote saved to collection!");
    } else {
      setSavedQuotes(prev => prev.filter(q => q.text !== quote.text));
      toast.info("Quote removed from collection");
    }
    setSaved(!saved);
  };

  useEffect(() => {
    generateQuote();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center"
            >
              <Quote className="w-10 h-10 text-amber-500" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Random Quote
            </h1>
            <p className="text-muted-foreground text-lg">
              Get inspired with beautiful quotes from great minds
            </p>
          </div>

          {/* Quote Display */}
          <Card className="glass-card mb-8 overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <Sparkles className="w-12 h-12 mx-auto text-primary animate-pulse mb-4" />
                    <p className="text-muted-foreground">Finding wisdom...</p>
                  </motion.div>
                ) : quote ? (
                  <motion.div
                    key={quote.text}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center"
                  >
                    <Quote className="w-12 h-12 mx-auto text-primary/30 mb-6" />
                    <blockquote className="text-2xl md:text-3xl font-medium leading-relaxed mb-6 italic">
                      "{quote.text}"
                    </blockquote>
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-lg text-muted-foreground">— {quote.author}</span>
                      <Badge variant="secondary">{quote.category}</Badge>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <Button size="lg" onClick={() => generateQuote()} disabled={isLoading}>
              <Shuffle className="w-5 h-5 mr-2" />
              New Quote
            </Button>
            
            {quote && (
              <>
                <Button variant="outline" size="lg" onClick={copyQuote}>
                  {copied ? <Check className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button variant="outline" size="lg" onClick={shareToTwitter}>
                  <Twitter className="w-5 h-5 mr-2" />
                  Tweet
                </Button>
                <Button variant="outline" size="lg" onClick={shareQuote}>
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setLiked(!liked)}
                  className={liked ? "text-red-500 border-red-500/50" : ""}
                >
                  <Heart className={`w-5 h-5 mr-2 ${liked ? "fill-current" : ""}`} />
                  {liked ? "Liked" : "Like"}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={saveQuote}
                  className={saved ? "text-yellow-500 border-yellow-500/50" : ""}
                >
                  <Bookmark className={`w-5 h-5 mr-2 ${saved ? "fill-current" : ""}`} />
                  {saved ? "Saved" : "Save"}
                </Button>
              </>
            )}
          </div>

          {/* Categories */}
          <Card className="glass-card mb-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Browse by Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category, i) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateQuote(category)}
                      className="hover:bg-primary/10"
                    >
                      {category}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Saved Quotes */}
          {savedQuotes.length > 0 && (
            <Card className="glass-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-yellow-500" />
                  Saved Quotes ({savedQuotes.length})
                </h3>
                <div className="space-y-4">
                  {savedQuotes.map((q, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 rounded-xl bg-accent/30 border border-border"
                    >
                      <p className="italic mb-2">"{q.text}"</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">— {q.author}</span>
                        <Badge variant="outline" className="text-xs">{q.category}</Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default RandomQuote;
