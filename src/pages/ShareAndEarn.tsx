import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Copy, Users, Coins, Trophy, Share2, Check, Zap, Star, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import Footer from "@/components/Footer";

const ShareAndEarn = () => {
  const [referralCode] = useState("JAG" + Math.random().toString(36).substring(2, 8).toUpperCase());
  const [copied, setCopied] = useState(false);

  const referralLink = `${window.location.origin}/#/?ref=${referralCode}`;

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToSocial = (platform: string) => {
    const text = encodeURIComponent("Join me on JaguWorks and earn rewards! Use my referral code: " + referralCode);
    const url = encodeURIComponent(referralLink);
    
    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], "_blank");
    }
  };

  const rewards = [
    { milestone: 5, reward: "Bronze Badge", icon: Star, color: "text-amber-600", unlocked: false },
    { milestone: 15, reward: "Silver Badge", icon: Trophy, color: "text-gray-400", unlocked: false },
    { milestone: 30, reward: "Gold Badge", icon: Crown, color: "text-yellow-500", unlocked: false },
    { milestone: 50, reward: "Premium Access", icon: Zap, color: "text-purple-500", unlocked: false },
  ];

  const leaderboard = [
    { rank: 1, name: "Alex", referrals: 156, badge: "👑" },
    { rank: 2, name: "Sarah", referrals: 134, badge: "🥈" },
    { rank: 3, name: "Mike", referrals: 98, badge: "🥉" },
    { rank: 4, name: "Emma", referrals: 87, badge: "" },
    { rank: 5, name: "John", referrals: 76, badge: "" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center"
            >
              <Gift className="w-10 h-10 text-yellow-500" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Share & Earn
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Invite friends and earn rewards! The more you share, the more you earn.
            </p>
          </div>

          {/* Referral Card */}
          <Card className="glass-card mb-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-primary" />
                Your Referral Link
              </CardTitle>
              <CardDescription>
                Share this link with friends to earn rewards
              </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-6">
              {/* Referral Code */}
              <div className="p-4 rounded-xl bg-accent/30 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Your Code</span>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(referralCode)}>
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-2xl font-mono font-bold gradient-text">{referralCode}</p>
              </div>

              {/* Referral Link */}
              <div className="flex gap-2">
                <Input value={referralLink} readOnly className="bg-background/50 font-mono text-sm" />
                <Button onClick={() => copyToClipboard(referralLink)} variant="outline">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              {/* Share Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => shareToSocial("whatsapp")} className="bg-green-600 hover:bg-green-700">
                  <Share2 className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
                <Button onClick={() => shareToSocial("telegram")} className="bg-blue-500 hover:bg-blue-600">
                  <Share2 className="w-4 h-4 mr-2" />
                  Telegram
                </Button>
                <Button onClick={() => shareToSocial("twitter")} className="bg-sky-500 hover:bg-sky-600">
                  <Share2 className="w-4 h-4 mr-2" />
                  Twitter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Users, label: "Total Referrals", value: "0", color: "text-blue-500" },
              { icon: Coins, label: "Earnings", value: "₹0", color: "text-green-500" },
              { icon: Trophy, label: "Your Rank", value: "#--", color: "text-yellow-500" },
              { icon: Zap, label: "Pending", value: "0", color: "text-purple-500" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="glass-card">
                  <CardContent className="pt-6 text-center">
                    <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Rewards Milestones */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-primary" />
                  Reward Milestones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {rewards.map((reward, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-4 rounded-xl border ${reward.unlocked ? 'bg-primary/10 border-primary/30' : 'bg-accent/30 border-border'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <reward.icon className={`w-6 h-6 ${reward.color}`} />
                        <div>
                          <p className="font-medium">{reward.reward}</p>
                          <p className="text-sm text-muted-foreground">{reward.milestone} referrals</p>
                        </div>
                      </div>
                      {reward.unlocked && <Check className="w-5 h-5 text-green-500" />}
                    </div>
                    <Progress value={0} className="h-2" />
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Top Referrers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((user, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`flex items-center justify-between p-3 rounded-xl ${
                        user.rank <= 3 ? 'bg-gradient-to-r from-primary/10 to-accent/10' : 'bg-accent/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{user.badge || `#${user.rank}`}</span>
                        <span className="font-medium">{user.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{user.referrals} referrals</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* How it Works */}
          <Card className="glass-card mt-8">
            <CardHeader>
              <CardTitle>How it Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { step: 1, title: "Share Your Link", desc: "Copy your unique referral link and share it with friends" },
                  { step: 2, title: "Friends Join", desc: "When your friends sign up using your link, they get bonuses too" },
                  { step: 3, title: "Earn Rewards", desc: "Get rewards for every successful referral you make" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="text-center"
                  >
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold text-primary">
                      {item.step}
                    </div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default ShareAndEarn;
