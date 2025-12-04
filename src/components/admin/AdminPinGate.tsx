import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminPinGateProps {
  onSuccess: () => void;
}

const PIN_SESSION_KEY = "admin_pin_session_token";

export default function AdminPinGate({ onSuccess }: AdminPinGateProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<number>(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const { toast } = useToast();

  // Check if already verified this session (server-side validation)
  useEffect(() => {
    const validateExistingSession = async () => {
      const storedToken = localStorage.getItem(PIN_SESSION_KEY);
      
      if (!storedToken) {
        setIsCheckingSession(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          localStorage.removeItem(PIN_SESSION_KEY);
          setIsCheckingSession(false);
          return;
        }

        // Validate token with server
        const { data, error } = await supabase.functions.invoke('validate-admin-session', {
          body: { session_token: storedToken }
        });

        if (error || !data?.valid) {
          localStorage.removeItem(PIN_SESSION_KEY);
          setIsCheckingSession(false);
          return;
        }

        // Session is valid
        onSuccess();
      } catch (err) {
        console.error('Session validation error:', err);
        localStorage.removeItem(PIN_SESSION_KEY);
        setIsCheckingSession(false);
      }
    };

    validateExistingSession();
  }, [onSuccess]);

  // Countdown timer for lockout
  useEffect(() => {
    if (lockoutTime > 0) {
      const timer = setInterval(() => {
        setLockoutTime((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockoutTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked || isVerifying) return;

    setIsVerifying(true);
    setError("");

    try {
      const { data, error } = await supabase.functions.invoke('verify-admin-pin', {
        body: { pin }
      });

      if (error) {
        setError("Failed to verify PIN");
        setPin("");
        return;
      }

      if (data.success) {
        // Store the session token securely
        localStorage.setItem(PIN_SESSION_KEY, data.session_token);
        toast({ title: "Access granted", description: "Welcome to admin panel" });
        onSuccess();
      } else {
        if (data.is_locked) {
          setIsLocked(true);
          setLockoutTime(data.lockout_remaining || 30 * 60);
        }
        setError(data.error || "Incorrect PIN");
        setPin("");
      }
    } catch (err) {
      console.error('PIN verification error:', err);
      setError("Failed to verify PIN");
      setPin("");
    } finally {
      setIsVerifying(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Validating session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary" />
          </div>

          <h1 className="text-2xl font-bold mb-2">Admin Access</h1>
          <p className="text-muted-foreground mb-6">Enter your PIN to continue</p>

          {isLocked ? (
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <p className="text-destructive font-medium mb-2">Account Locked</p>
              <p className="text-muted-foreground">
                Try again in {formatTime(lockoutTime)}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="Enter PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  className="text-center text-2xl tracking-widest h-14"
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-destructive text-sm">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={pin.length < 4 || isVerifying}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Unlock"
                )}
              </Button>
            </form>
          )}

          <p className="text-xs text-muted-foreground mt-6">
            Default PIN: 1234 (change in Settings)
          </p>
        </div>
      </div>
    </div>
  );
}
