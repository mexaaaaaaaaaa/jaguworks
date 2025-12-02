import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, Check, Share2, Gift, Users, Coins, MessageCircle, Send, Twitter, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useScore } from "@/hooks/useScore";
import { useAuth } from "@/hooks/useAuth";

const ShareAndEarn = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { userScore, referrals, getReferralLink, loading } = useScore();
  const [copied, setCopied] = useState(false);

  const referralLink = getReferralLink();

  const copyToClipboard = async () => {
    if (!referralLink) return;
    
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success("Referral link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const shareToSocial = (platform: string) => {
    if (!referralLink) return;
    
    const message = encodeURIComponent(`🚀 Join JaguWorks and get FREE 50 Score! Use my link: ${referralLink}`);
    
    let url = "";
    switch (platform) {
      case "whatsapp":
        url = `https://wa.me/?text=${message}`;
        break;
      case "telegram":
        url = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent("🚀 Join JaguWorks and get FREE 50 Score!")}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${message}`;
        break;
    }
    
    if (url) window.open(url, "_blank");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <Gift className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">Login Required</h2>
          <p className="text-muted-foreground mb-6">Please login to access Share & Earn</p>
          <Button onClick={() => navigate("/auth")} className="w-full">
            Login / Sign Up
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500/20 via-primary/20 to-purple-500/20 py-8">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-green-500 via-primary to-purple-500 bg-clip-text text-transparent">
              Share & Earn
            </h1>
            <p className="text-muted-foreground">Invite friends and earn free scores!</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Current Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 mb-8 bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Coins className="w-12 h-12 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Your Current Score</p>
                  <p className="text-4xl font-bold text-primary">{userScore?.score || 0}</p>
                </div>
              </div>
              <Button onClick={() => navigate("/my-status")} variant="outline">
                View Status
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Referral Link Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-primary" />
              Your Referral Link
            </h3>
            
            <div className="flex gap-2 mb-4">
              <Input 
                value={referralLink || "Loading..."} 
                readOnly 
                className="font-mono text-sm"
              />
              <Button onClick={copyToClipboard} variant="outline" className="shrink-0">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={() => shareToSocial("whatsapp")} 
                className="bg-green-600 hover:bg-green-700"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
              <Button 
                onClick={() => shareToSocial("telegram")} 
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Send className="w-4 h-4 mr-2" />
                Telegram
              </Button>
              <Button 
                onClick={() => shareToSocial("twitter")} 
                className="bg-sky-500 hover:bg-sky-600"
              >
                <Twitter className="w-4 h-4 mr-2" />
                Twitter
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Your Referral Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 mb-8 text-center bg-gradient-to-br from-purple-500/10 to-cyan-500/10">
            <Crown className="w-12 h-12 mx-auto mb-4 text-purple-500" />
            <p className="text-sm text-muted-foreground mb-2">Your Unique Code</p>
            <p className="text-4xl font-bold font-mono tracking-wider text-purple-500">
              {userScore?.referral_code || "------"}
            </p>
          </Card>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-3xl font-bold">{referrals.length}</p>
              <p className="text-sm text-muted-foreground">Total Referrals</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 text-center">
              <Coins className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-3xl font-bold text-green-500">+{referrals.length * 20}</p>
              <p className="text-sm text-muted-foreground">Score Earned</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="col-span-2 md:col-span-1"
          >
            <Card className="p-6 text-center">
              <Gift className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <p className="text-3xl font-bold text-purple-500">+20</p>
              <p className="text-sm text-muted-foreground">Per Referral</p>
            </Card>
          </motion.div>
        </div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-6 mb-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              How It Works
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h4 className="font-semibold mb-2">Share Your Link</h4>
                <p className="text-sm text-muted-foreground">Copy and share your unique referral link with friends</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-500">2</span>
                </div>
                <h4 className="font-semibold mb-2">Friend Signs Up</h4>
                <p className="text-sm text-muted-foreground">When they register using your link, they get 50 Score</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-500">3</span>
                </div>
                <h4 className="font-semibold mb-2">You Earn +20</h4>
                <p className="text-sm text-muted-foreground">You automatically receive 20 Score as a reward!</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Referral History */}
        {referrals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Recent Referrals</h3>
              <div className="space-y-3">
                {referrals.slice(0, 5).map((ref, index) => (
                  <div key={ref.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">User #{index + 1}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(ref.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="text-green-500 font-bold">+20</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ShareAndEarn;
