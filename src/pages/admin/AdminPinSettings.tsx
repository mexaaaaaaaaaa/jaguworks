import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, Save, RotateCcw, Eye, EyeOff } from "lucide-react";

interface PinSettings {
  pin: string;
  lockout_until: string | null;
  failed_attempts: number;
}

export default function AdminPinSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPins, setShowPins] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin_pin_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "admin_pin")
        .maybeSingle();

      if (error) throw error;
      return data?.value as unknown as PinSettings | null;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (newPinValue: string) => {
      const { error } = await supabase
        .from("site_settings")
        .update({
          value: {
            pin: newPinValue,
            lockout_until: null,
            failed_attempts: 0,
          },
        })
        .eq("key", "admin_pin");

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_pin_settings"] });
      toast({ title: "PIN Updated", description: "Your admin PIN has been changed" });
      setCurrentPin("");
      setNewPin("");
      setConfirmPin("");
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update PIN", variant: "destructive" });
    },
  });

  const resetLockoutMutation = useMutation({
    mutationFn: async () => {
      if (!data) return;
      const { error } = await supabase
        .from("site_settings")
        .update({
          value: {
            ...data,
            lockout_until: null,
            failed_attempts: 0,
          },
        })
        .eq("key", "admin_pin");

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_pin_settings"] });
      toast({ title: "Lockout Reset", description: "Failed attempts have been cleared" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!data) return;

    if (currentPin !== data.pin) {
      toast({ title: "Error", description: "Current PIN is incorrect", variant: "destructive" });
      return;
    }

    if (newPin.length < 4 || newPin.length > 6) {
      toast({ title: "Error", description: "PIN must be 4-6 digits", variant: "destructive" });
      return;
    }

    if (newPin !== confirmPin) {
      toast({ title: "Error", description: "New PINs don't match", variant: "destructive" });
      return;
    }

    updateMutation.mutate(newPin);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin PIN Security</h1>
        <p className="text-muted-foreground">Manage your admin panel access PIN</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Change PIN
            </CardTitle>
            <CardDescription>Update your admin access PIN</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPin">Current PIN</Label>
                <div className="relative">
                  <Input
                    id="currentPin"
                    type={showPins ? "text" : "password"}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={currentPin}
                    onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter current PIN"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPin">New PIN</Label>
                <Input
                  id="newPin"
                  type={showPins ? "text" : "password"}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter new PIN (4-6 digits)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPin">Confirm New PIN</Label>
                <Input
                  id="confirmPin"
                  type={showPins ? "text" : "password"}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                  placeholder="Confirm new PIN"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPins(!showPins)}
                >
                  {showPins ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {showPins ? "Hide" : "Show"} PINs
                </Button>
              </div>

              <Button type="submit" className="w-full" disabled={updateMutation.isPending}>
                <Save className="w-4 h-4 mr-2" />
                {updateMutation.isPending ? "Updating..." : "Update PIN"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Status</CardTitle>
            <CardDescription>Current lockout and attempt information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Failed Attempts</p>
              <p className="text-2xl font-bold">{data?.failed_attempts || 0} / 5</p>
            </div>

            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Lockout Status</p>
              <p className="text-lg font-medium">
                {data?.lockout_until
                  ? `Locked until ${new Date(data.lockout_until).toLocaleString()}`
                  : "Not locked"}
              </p>
            </div>

            {(data?.failed_attempts || 0) > 0 && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => resetLockoutMutation.mutate()}
                disabled={resetLockoutMutation.isPending}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Failed Attempts
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
