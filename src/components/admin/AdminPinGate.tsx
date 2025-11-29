import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminPinGateProps {
  onSuccess: () => void;
}

interface PinSettings {
  pin: string;
  lockout_until: string | null;
  failed_attempts: number;
}

export default function AdminPinGate({ onSuccess }: AdminPinGateProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<number>(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  // Check if already verified this session
  useEffect(() => {
    const verified = sessionStorage.getItem("admin_pin_verified");
    if (verified === "true") {
      onSuccess();
    }
  }, [onSuccess]);

  // Check lockout status
  useEffect(() => {
    const checkLockout = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "admin_pin")
        .maybeSingle();

      if (data?.value) {
        const settings = data.value as unknown as PinSettings;
        if (settings.lockout_until) {
          const lockoutEnd = new Date(settings.lockout_until).getTime();
          const now = Date.now();
          if (lockoutEnd > now) {
            setIsLocked(true);
            setLockoutTime(Math.ceil((lockoutEnd - now) / 1000));
          }
        }
      }
    };
    checkLockout();
  }, []);

  // Countdown timer
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
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "admin_pin")
        .maybeSingle();

      if (!data?.value) {
        setError("PIN not configured");
        return;
      }

      const settings = data.value as unknown as PinSettings;

      if (pin === settings.pin) {
        // Reset failed attempts on success
        await supabase
          .from("site_settings")
          .update({
            value: { ...settings, failed_attempts: 0, lockout_until: null },
          })
          .eq("key", "admin_pin");

        sessionStorage.setItem("admin_pin_verified", "true");
        toast({ title: "Access granted", description: "Welcome to admin panel" });
        onSuccess();
      } else {
        const newAttempts = (settings.failed_attempts || 0) + 1;
        let newLockout = null;

        if (newAttempts >= 5) {
          // Lock for 30 minutes
          newLockout = new Date(Date.now() + 30 * 60 * 1000).toISOString();
          setIsLocked(true);
          setLockoutTime(30 * 60);
        }

        await supabase
          .from("site_settings")
          .update({
            value: {
              ...settings,
              failed_attempts: newAttempts,
              lockout_until: newLockout,
            },
          })
          .eq("key", "admin_pin");

        setError(
          newAttempts >= 5
            ? "Too many attempts. Locked for 30 minutes."
            : `Incorrect PIN. ${5 - newAttempts} attempts remaining.`
        );
        setPin("");
      }
    } catch (err) {
      setError("Failed to verify PIN");
    } finally {
      setIsVerifying(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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
                {isVerifying ? "Verifying..." : "Unlock"}
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
