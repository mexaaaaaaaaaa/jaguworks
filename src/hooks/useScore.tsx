import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

interface UserScore {
  id: string;
  user_id: string;
  score: number;
  total_earned: number;
  total_spent: number;
  tools_used: number;
  referral_code: string;
  referred_by: string | null;
  created_at: string;
  updated_at: string;
}

interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  score_awarded: number;
  created_at: string;
}

export const useScore = () => {
  const { user } = useAuth();
  const [userScore, setUserScore] = useState<UserScore | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserScore = useCallback(async () => {
    if (!user) {
      setUserScore(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("user_scores")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      setUserScore(data as UserScore);
    } catch (error) {
      console.error("Error fetching user score:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchReferrals = useCallback(async () => {
    if (!user) {
      setReferrals([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReferrals((data as Referral[]) || []);
    } catch (error) {
      console.error("Error fetching referrals:", error);
    }
  }, [user]);

  useEffect(() => {
    fetchUserScore();
    fetchReferrals();
  }, [fetchUserScore, fetchReferrals]);

  const useTool = useCallback(async (toolName: string): Promise<boolean> => {
    if (!user) {
      toast.error("Please login to use this tool");
      return false;
    }

    if (!userScore) {
      toast.error("Score data not loaded. Please refresh.");
      return false;
    }

    if (userScore.score < 5) {
      toast.error("Insufficient Score! Use Share & Earn to get more.", {
        action: {
          label: "Go to Share & Earn",
          onClick: () => window.location.hash = "#/share-and-earn"
        }
      });
      return false;
    }

    try {
      const { data, error } = await supabase.rpc("use_tool_score", {
        p_user_id: user.id,
        p_tool_name: toolName
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string; score?: number };
      
      if (!result.success) {
        toast.error(result.error || "Failed to use tool");
        return false;
      }

      // Update local state
      setUserScore(prev => prev ? {
        ...prev,
        score: result.score || prev.score - 5,
        total_spent: prev.total_spent + 5,
        tools_used: prev.tools_used + 1
      } : null);

      toast.success(`Tool used! -5 Score (Remaining: ${result.score})`);
      return true;
    } catch (error) {
      console.error("Error using tool:", error);
      toast.error("Failed to process score deduction");
      return false;
    }
  }, [user, userScore]);

  const getReferralLink = useCallback(() => {
    if (!userScore?.referral_code) return null;
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}#/auth?ref=${userScore.referral_code}`;
  }, [userScore]);

  const canUseTool = userScore ? userScore.score >= 5 : false;

  return {
    userScore,
    referrals,
    loading,
    useTool,
    getReferralLink,
    canUseTool,
    refetch: fetchUserScore
  };
};
