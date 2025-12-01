import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Save, Loader2, Bell, BellOff } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function AdminSettings() {
  const [heroSettings, setHeroSettings] = useState({
    title: "",
    subtitle: "",
    cta_text: "",
  });
  const [socialLinks, setSocialLinks] = useState({
    youtube: "",
    instagram: "",
    discord: "",
    github: "",
  });
  const [promoEnabled, setPromoEnabled] = useState(true);
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["siteSettings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*");
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (settings) {
      const hero = settings.find((s) => s.key === "hero");
      const social = settings.find((s) => s.key === "social_links");
      const promo = settings.find((s) => s.key === "promo_notifications");
      if (hero?.value) {
        setHeroSettings(hero.value as typeof heroSettings);
      }
      if (social?.value) {
        setSocialLinks(social.value as typeof socialLinks);
      }
      if (promo?.value) {
        setPromoEnabled((promo.value as { enabled: boolean })?.enabled ?? true);
      }
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const { error } = await supabase
        .from("site_settings")
        .update({ value, updated_at: new Date().toISOString() })
        .eq("key", key);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["siteSettings"] });
      toast({ title: "Settings saved" });
    },
    onError: () => {
      toast({ title: "Failed to save settings", variant: "destructive" });
    },
  });

  const saveHeroSettings = () => {
    updateMutation.mutate({ key: "hero", value: heroSettings });
  };

  const saveSocialLinks = () => {
    updateMutation.mutate({ key: "social_links", value: socialLinks });
  };

  const togglePromoNotifications = async (enabled: boolean) => {
    setPromoEnabled(enabled);
    // Check if setting exists first
    const existing = settings?.find(s => s.key === "promo_notifications");
    if (existing) {
      await supabase
        .from("site_settings")
        .update({ value: { enabled }, updated_at: new Date().toISOString() })
        .eq("key", "promo_notifications");
    } else {
      await supabase
        .from("site_settings")
        .insert({ key: "promo_notifications", value: { enabled } });
    }
    queryClient.invalidateQueries({ queryKey: ["siteSettings"] });
    toast({ title: enabled ? "Promo notifications enabled" : "Promo notifications disabled" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Site Settings</h1>
        <p className="text-muted-foreground">Manage global site content</p>
      </div>

      {/* Hero Section Settings */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
          <CardDescription>Edit the main hero section content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={heroSettings.title}
              onChange={(e) => setHeroSettings({ ...heroSettings, title: e.target.value })}
              placeholder="Hey, I'm Jagmohan"
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={heroSettings.subtitle}
              onChange={(e) => setHeroSettings({ ...heroSettings, subtitle: e.target.value })}
              placeholder="Full-Stack Developer • Content Creator"
            />
          </div>
          <div>
            <Label>CTA Button Text</Label>
            <Input
              value={heroSettings.cta_text}
              onChange={(e) => setHeroSettings({ ...heroSettings, cta_text: e.target.value })}
              placeholder="Explore my universe"
            />
          </div>
          <Button onClick={saveHeroSettings} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Hero Settings
          </Button>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
          <CardDescription>Update your social media links</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>YouTube</Label>
            <Input
              value={socialLinks.youtube}
              onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
              placeholder="https://youtube.com/@..."
            />
          </div>
          <div>
            <Label>Instagram</Label>
            <Input
              value={socialLinks.instagram}
              onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
              placeholder="https://instagram.com/..."
            />
          </div>
          <div>
            <Label>Discord</Label>
            <Input
              value={socialLinks.discord}
              onChange={(e) => setSocialLinks({ ...socialLinks, discord: e.target.value })}
              placeholder="https://discord.gg/..."
            />
          </div>
          <div>
            <Label>GitHub</Label>
            <Input
              value={socialLinks.github}
              onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
              placeholder="https://github.com/..."
            />
          </div>
          <Button onClick={saveSocialLinks} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Social Links
          </Button>
        </CardContent>
      </Card>

      {/* Promo Notifications Toggle */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {promoEnabled ? <Bell className="h-5 w-5 text-primary" /> : <BellOff className="h-5 w-5 text-muted-foreground" />}
            Promo Notifications
          </CardTitle>
          <CardDescription>Toggle promotional popups across the site</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div>
              <p className="font-medium">Show Promo Notifications</p>
              <p className="text-sm text-muted-foreground">
                When enabled, promotional popups will appear on the website
              </p>
            </div>
            <Switch
              checked={promoEnabled}
              onCheckedChange={togglePromoNotifications}
            />
          </div>
          <div className="mt-4 p-4 rounded-lg border border-dashed">
            <p className="text-sm text-muted-foreground">
              <strong>Current Status:</strong>{" "}
              <span className={promoEnabled ? "text-green-500" : "text-red-500"}>
                {promoEnabled ? "Enabled" : "Disabled"}
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Promos include: Minecraft Plans, Discord Plans, Telegram Bots, Projects, About, Achievements
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
