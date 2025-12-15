import { Twitter, MessageCircle, Copy, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ShareScoreProps {
  score: number;
  gameName: string;
  isHighScore?: boolean;
}

const ShareScore = ({ score, gameName, isHighScore = false }: ShareScoreProps) => {
  const { toast } = useToast();
  
  const shareText = isHighScore 
    ? `🏆 NEW HIGH SCORE! I just scored ${score.toLocaleString()} points in ${gameName} on Jaguworks! Can you beat me? 🎮`
    : `🎮 I just scored ${score.toLocaleString()} points in ${gameName} on Jaguworks! Try to beat my score!`;
  
  const websiteUrl = 'https://jaguworks.online/games';
  const fullShareText = `${shareText}\n\n${websiteUrl}`;
  
  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullShareText)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };
  
  const shareToDiscord = () => {
    // Discord doesn't have a direct share URL, so we copy to clipboard with Discord formatting
    const discordText = `**${isHighScore ? '🏆 NEW HIGH SCORE!' : '🎮 Game Score'}**\n\n${shareText}\n\n🔗 Play here: ${websiteUrl}`;
    navigator.clipboard.writeText(discordText);
    toast({
      title: "Copied for Discord!",
      description: "Paste this in any Discord channel to share your score.",
    });
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullShareText);
    toast({
      title: "Copied!",
      description: "Share link copied to clipboard.",
    });
  };
  
  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${gameName} Score - Jaguworks`,
          text: shareText,
          url: websiteUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground text-center">Share your score:</p>
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={shareToTwitter}
          className="flex items-center gap-2 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 border-[#1DA1F2]/30 text-[#1DA1F2]"
        >
          <Twitter className="w-4 h-4" />
          <span className="hidden sm:inline">Twitter</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={shareToDiscord}
          className="flex items-center gap-2 bg-[#5865F2]/10 hover:bg-[#5865F2]/20 border-[#5865F2]/30 text-[#5865F2]"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Discord</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          className="flex items-center gap-2"
        >
          <Copy className="w-4 h-4" />
          <span className="hidden sm:inline">Copy</span>
        </Button>
        
        {'share' in navigator && (
          <Button
            variant="outline"
            size="sm"
            onClick={nativeShare}
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ShareScore;
