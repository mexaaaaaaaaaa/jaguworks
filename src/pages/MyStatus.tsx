import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Coins, TrendingUp, TrendingDown, Wrench, Users, Gift, Sparkles, Crown, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useScore } from "@/hooks/useScore";
import { useAuth } from "@/hooks/useAuth";

const MyStatus = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { userScore, referrals, loading } = useScore();

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
          <Crown className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">Login Required</h2>
          <p className="text-muted-foreground mb-6">Please login to view your status and scores</p>
          <Button onClick={() => navigate("/auth")} className="w-full">
            Login / Sign Up
          </Button>
        </Card>
      </div>
    );
  }

  const scorePercentage = userScore ? Math.min((userScore.score / 200) * 100, 100) : 0;
  const level = userScore ? Math.floor(userScore.tools_used / 10) + 1 : 1;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 via-purple-500/20 to-cyan-500/20 py-8">
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
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary via-purple-500 to-cyan-500 bg-clip-text text-transparent">
              My Status
            </h1>
            <p className="text-muted-foreground">Track your scores, usage & rewards</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Main Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-8 mb-8 bg-gradient-to-br from-primary/10 via-purple-500/10 to-cyan-500/10 border-primary/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                  <Coins className="w-10 h-10 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Score</p>
                  <h2 className="text-5xl font-bold text-primary">{userScore?.score || 0}</h2>
                  <p className="text-sm text-muted-foreground">Level {level} User</p>
                </div>
              </div>
              
              <div className="w-full md:w-1/2">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress to next level</span>
                  <span>{userScore?.tools_used || 0} / {level * 10} tools</span>
                </div>
                <Progress value={(userScore?.tools_used || 0) % 10 * 10} className="h-3" />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 text-center hover:border-green-500/50 transition-colors">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold text-green-500">{userScore?.total_earned || 0}</p>
              <p className="text-sm text-muted-foreground">Total Earned</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 text-center hover:border-red-500/50 transition-colors">
              <TrendingDown className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <p className="text-2xl font-bold text-red-500">{userScore?.total_spent || 0}</p>
              <p className="text-sm text-muted-foreground">Total Spent</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 text-center hover:border-blue-500/50 transition-colors">
              <Wrench className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold text-blue-500">{userScore?.tools_used || 0}</p>
              <p className="text-sm text-muted-foreground">Tools Used</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 text-center hover:border-purple-500/50 transition-colors">
              <Users className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-bold text-purple-500">{referrals.length}</p>
              <p className="text-sm text-muted-foreground">Referrals</p>
            </Card>
          </motion.div>
        </div>

        {/* How Scores Work */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              How Scores Work
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <Gift className="w-6 h-6 text-green-500 mb-2" />
                <p className="font-semibold text-green-500">+50 Score</p>
                <p className="text-sm text-muted-foreground">New user signup bonus</p>
              </div>
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                <Users className="w-6 h-6 text-purple-500 mb-2" />
                <p className="font-semibold text-purple-500">+20 Score</p>
                <p className="text-sm text-muted-foreground">Per referral who joins</p>
              </div>
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                <Wrench className="w-6 h-6 text-red-500 mb-2" />
                <p className="font-semibold text-red-500">-5 Score</p>
                <p className="text-sm text-muted-foreground">Per tool usage</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <Card className="p-8 bg-gradient-to-r from-primary/20 to-purple-500/20 border-primary/30">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-2xl font-bold mb-2">Need More Scores?</h3>
            <p className="text-muted-foreground mb-6">Share your referral link and earn 20 points for each friend who joins!</p>
            <Button onClick={() => navigate("/share-and-earn")} size="lg" className="bg-gradient-to-r from-primary to-purple-600">
              <Gift className="w-5 h-5 mr-2" />
              Go to Share & Earn
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default MyStatus;
