import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Shuffle, Download, Share2, Heart, Loader2, Palette, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { ScoreGate } from "@/components/ScoreGate";

function RandomAiArtContent() {
  const [currentArt, setCurrentArt] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [liked, setLiked] = useState(false);

  const artStyles = [
    "cyberpunk neon city at night with flying cars",
    "fantasy dragon in crystal cave with glowing gems",
    "abstract geometric patterns with vibrant colors",
    "surreal floating islands in the sky with waterfalls",
    "steampunk clockwork machine with gears and pipes",
    "underwater ancient ruins with bioluminescent fish",
    "cosmic galaxy with colorful planets and nebulas",
    "mystical forest with glowing mushrooms and fireflies",
    "futuristic robot portrait with human emotions",
    "japanese cherry blossom garden in spring",
    "aurora borealis over snowy mountains",
    "retro synthwave sunset with palm trees",
    "biomechanical alien creature in organic spaceship",
    "enchanted castle floating in clouds",
    "post-apocalyptic overgrown city with nature reclaiming",
  ];

  const generateRandomArt = async () => {
    setIsLoading(true);
    setLiked(false);
    
    const randomPrompt = artStyles[Math.floor(Math.random() * artStyles.length)];
    setCurrentPrompt(randomPrompt);

    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt: `${randomPrompt}, highly detailed, 4k, masterpiece, beautiful lighting` },
      });

      if (error) throw error;

      if (data?.image) {
        setCurrentArt(data.image);
        toast.success("New art generated!");
      } else {
        throw new Error('No image returned');
      }
    } catch (error: any) {
      console.error("Generation error:", error);
      toast.error(error.message || "Failed to generate art. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadArt = async () => {
    if (!currentArt) return;
    
    try {
      const link = document.createElement("a");
      link.href = currentArt;
      link.download = `ai-art-${Date.now()}.png`;
      link.click();
      toast.success("Art downloaded!");
    } catch (error) {
      toast.error("Download failed");
    }
  };

  const shareArt = async () => {
    if (!currentArt) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "AI Generated Art",
          text: `Check out this AI art: "${currentPrompt}"`,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <>
      {/* Art Display */}
      <Card className="glass-card mb-8 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-square md:aspect-video bg-gradient-to-br from-accent/20 to-background min-h-[300px]">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center"
                >
                  <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
                  <p className="text-muted-foreground">Creating magic with AI...</p>
                  <p className="text-sm text-muted-foreground/70 mt-2 max-w-md text-center px-4">"{currentPrompt}"</p>
                  <p className="text-xs text-muted-foreground/50 mt-4">This may take 10-30 seconds</p>
                </motion.div>
              ) : currentArt ? (
                <motion.div
                  key="art"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative w-full h-full"
                >
                  <img
                    src={currentArt}
                    alt="AI Generated Art"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <Badge variant="secondary" className="mb-2">
                      <Wand2 className="w-3 h-3 mr-1" />
                      AI Generated
                    </Badge>
                    <p className="text-white text-sm">"{currentPrompt}"</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center"
                >
                  <Sparkles className="w-16 h-16 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Click generate to create art</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
        <Button
          size="lg"
          onClick={generateRandomArt}
          disabled={isLoading}
          className="min-w-[200px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Shuffle className="w-5 h-5 mr-2" />
              Generate Random Art
            </>
          )}
        </Button>

        {currentArt && (
          <>
            <Button variant="outline" size="lg" onClick={downloadArt}>
              <Download className="w-5 h-5 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="lg" onClick={shareArt}>
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
          </>
        )}
      </div>

      {/* Art Styles */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            Available Art Styles
          </h3>
          <div className="flex flex-wrap gap-2">
            {artStyles.map((style, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/10 transition-colors capitalize"
                  onClick={() => {
                    setCurrentPrompt(style);
                    toast.info(`Style "${style}" will be used in next generation`);
                  }}
                >
                  {style}
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>🎨 Powered by Lovable AI • Each generation is unique!</p>
      </div>
    </>
  );
}

const RandomAiArt = () => {
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
              className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center"
            >
              <Palette className="w-10 h-10 text-purple-500" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Random AI Art
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover unique AI-generated artwork with a single click
            </p>
          </div>

          {/* Score Gate */}
          <ScoreGate toolName="Random AI Art">
            <RandomAiArtContent />
          </ScoreGate>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default RandomAiArt;
