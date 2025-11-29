import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Palette, Type, Layout, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface ThemeSettings {
  colors: {
    primary: string;
    accent: string;
    mode: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  layout: {
    cardStyle: string;
    buttonStyle: string;
    backgroundType: string;
  };
}

export default function AdminTheme() {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<ThemeSettings>({
    colors: { primary: "hsl(280, 100%, 70%)", accent: "hsl(180, 100%, 50%)", mode: "dark" },
    fonts: { heading: "Space Grotesk", body: "Inter" },
    layout: { cardStyle: "glass", buttonStyle: "glow", backgroundType: "gradient" },
  });

  const { data: themeData, isLoading } = useQuery({
    queryKey: ["admin-theme-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("theme_settings")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (themeData) {
      const newSettings = { ...settings };
      themeData.forEach((item) => {
        if (item.key === "colors") newSettings.colors = item.value as typeof settings.colors;
        if (item.key === "fonts") newSettings.fonts = item.value as typeof settings.fonts;
        if (item.key === "layout") newSettings.layout = item.value as typeof settings.layout;
      });
      setSettings(newSettings);
    }
  }, [themeData]);

  const updateMutation = useMutation({
    mutationFn: async (updates: { key: string; value: Record<string, unknown> }[]) => {
      for (const update of updates) {
        const { error } = await supabase
          .from("theme_settings")
          .update({ value: update.value as unknown as Record<string, never> })
          .eq("key", update.key);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-theme-settings"] });
      toast.success("Theme settings saved!");
    },
    onError: () => toast.error("Failed to save theme"),
  });

  const handleSave = () => {
    updateMutation.mutate([
      { key: "colors", value: settings.colors },
      { key: "fonts", value: settings.fonts },
      { key: "layout", value: settings.layout },
    ]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Theme Controller</h1>
          <p className="text-muted-foreground">Customize the look and feel of your portfolio</p>
        </div>
        <Button onClick={handleSave} disabled={updateMutation.isPending}>
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Colors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette size={20} />
              Colors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Theme Mode</Label>
              <Select
                value={settings.colors.mode}
                onValueChange={(value) =>
                  setSettings({
                    ...settings,
                    colors: { ...settings.colors, mode: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Primary Color</Label>
              <Input
                value={settings.colors.primary}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    colors: { ...settings.colors, primary: e.target.value },
                  })
                }
                placeholder="hsl(280, 100%, 70%)"
              />
            </div>
            <div>
              <Label>Accent Color</Label>
              <Input
                value={settings.colors.accent}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    colors: { ...settings.colors, accent: e.target.value },
                  })
                }
                placeholder="hsl(180, 100%, 50%)"
              />
            </div>
          </CardContent>
        </Card>

        {/* Fonts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type size={20} />
              Typography
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Heading Font</Label>
              <Select
                value={settings.fonts.heading}
                onValueChange={(value) =>
                  setSettings({
                    ...settings,
                    fonts: { ...settings.fonts, heading: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Space Grotesk">Space Grotesk</SelectItem>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Poppins">Poppins</SelectItem>
                  <SelectItem value="Outfit">Outfit</SelectItem>
                  <SelectItem value="Sora">Sora</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Body Font</Label>
              <Select
                value={settings.fonts.body}
                onValueChange={(value) =>
                  setSettings({
                    ...settings,
                    fonts: { ...settings.fonts, body: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Space Grotesk">Space Grotesk</SelectItem>
                  <SelectItem value="DM Sans">DM Sans</SelectItem>
                  <SelectItem value="Plus Jakarta Sans">Plus Jakarta Sans</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Layout */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout size={20} />
              Layout Style
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Card Style</Label>
              <Select
                value={settings.layout.cardStyle}
                onValueChange={(value) =>
                  setSettings({
                    ...settings,
                    layout: { ...settings.layout, cardStyle: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="glass">Glassmorphism</SelectItem>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                  <SelectItem value="gradient">Gradient</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Background Type</Label>
              <Select
                value={settings.layout.backgroundType}
                onValueChange={(value) =>
                  setSettings({
                    ...settings,
                    layout: { ...settings.layout, backgroundType: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gradient">Gradient</SelectItem>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="particles">Particles</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Effects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles size={20} />
              Effects & Animations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Button Style</Label>
              <Select
                value={settings.layout.buttonStyle}
                onValueChange={(value) =>
                  setSettings({
                    ...settings,
                    layout: { ...settings.layout, buttonStyle: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="glow">Glow</SelectItem>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                  <SelectItem value="gradient">Gradient</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="p-8 rounded-lg"
            style={{
              background: settings.layout.backgroundType === "gradient"
                ? `linear-gradient(135deg, ${settings.colors.primary}, ${settings.colors.accent})`
                : undefined,
            }}
          >
            <h2
              className="text-2xl font-bold mb-4"
              style={{ fontFamily: settings.fonts.heading }}
            >
              Sample Heading
            </h2>
            <p
              className="text-muted-foreground mb-4"
              style={{ fontFamily: settings.fonts.body }}
            >
              This is sample body text to preview your typography settings.
            </p>
            <Button
              className={settings.layout.buttonStyle === "glow" ? "shadow-lg shadow-primary/30" : ""}
            >
              Sample Button
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
