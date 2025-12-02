import { useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Coins, Lock, Gift, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useScore } from "@/hooks/useScore";
import { useAuth } from "@/hooks/useAuth";

interface ScoreGateProps {
  children: ReactNode;
  toolName: string;
  onSuccess?: () => void;
}

export const ScoreGate = ({ children, toolName, onSuccess }: ScoreGateProps) => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { userScore, useTool, loading, canUseTool } = useScore();
  const [hasUsed, setHasUsed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUseTool = async () => {
    setIsProcessing(true);
    const success = await useTool(toolName);
    setIsProcessing(false);
    
    if (success) {
      setHasUsed(true);
      onSuccess?.();
    }
  };

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <Card className="p-8 text-center max-w-md mx-auto my-8">
        <LogIn className="w-16 h-16 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-bold mb-2">Login Required</h2>
        <p className="text-muted-foreground mb-6">
          Please login to use this tool. New users get 50 FREE Score!
        </p>
        <Button onClick={() => navigate("/auth")} className="w-full">
          Login / Sign Up
        </Button>
      </Card>
    );
  }

  // Already used the tool in this session
  if (hasUsed) {
    return <>{children}</>;
  }

  // Not enough score
  if (!canUseTool) {
    return (
      <Card className="p-8 text-center max-w-md mx-auto my-8">
        <Lock className="w-16 h-16 mx-auto mb-4 text-red-500" />
        <h2 className="text-2xl font-bold mb-2 text-red-500">Insufficient Score!</h2>
        <p className="text-muted-foreground mb-2">
          You need at least 5 Score to use this tool.
        </p>
        <p className="text-lg font-semibold mb-6">
          Current Score: <span className="text-red-500">{userScore?.score || 0}</span>
        </p>
        <Button 
          onClick={() => navigate("/share-and-earn")} 
          className="w-full bg-gradient-to-r from-green-500 to-primary"
        >
          <Gift className="w-4 h-4 mr-2" />
          Go to Share & Earn
        </Button>
      </Card>
    );
  }

  // Show confirmation to use tool
  return (
    <Card className="p-8 text-center max-w-md mx-auto my-8">
      <Coins className="w-16 h-16 mx-auto mb-4 text-primary" />
      <h2 className="text-2xl font-bold mb-2">Use {toolName}</h2>
      <p className="text-muted-foreground mb-4">
        This will cost <span className="font-bold text-primary">5 Score</span>
      </p>
      <div className="bg-muted/50 rounded-lg p-4 mb-6">
        <p className="text-sm text-muted-foreground">Your Balance</p>
        <p className="text-3xl font-bold text-primary">{userScore?.score || 0} Score</p>
        <p className="text-sm text-muted-foreground">After use: {(userScore?.score || 0) - 5} Score</p>
      </div>
      <Button 
        onClick={handleUseTool} 
        disabled={isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
            Processing...
          </>
        ) : (
          <>
            <Coins className="w-4 h-4 mr-2" />
            Use Tool (-5 Score)
          </>
        )}
      </Button>
    </Card>
  );
};
