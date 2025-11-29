import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Save, Eye, EyeOff, Globe, Briefcase, Home, FileText } from "lucide-react";
import type { SectionVisibility } from "@/hooks/useSectionVisibility";

const sectionGroups = [
  {
    title: "Main Navigation Pages",
    icon: Globe,
    sections: [
      { key: "about", label: "About Page", description: "Your about/bio page" },
      { key: "projects", label: "Projects Page", description: "Featured projects showcase" },
      { key: "skills", label: "Skills Page", description: "Skills & expertise" },
      { key: "achievements", label: "Achievements Page", description: "Your achievements" },
      { key: "future_goals", label: "Goals Page", description: "Future goals & aspirations" },
      { key: "contact", label: "Contact Page", description: "Contact form page" },
      { key: "blog", label: "Blog", description: "Blog posts & articles" },
    ],
  },
  {
    title: "Service Pages",
    icon: Briefcase,
    sections: [
      { key: "minecraft_plans", label: "Minecraft Plans", description: "Minecraft server setup services" },
      { key: "discord_plans", label: "Discord Plans", description: "Discord server setup services" },
      { key: "minecraft_server", label: "Minecraft Server", description: "Your Minecraft server showcase" },
      { key: "telegram_bots", label: "Telegram Bots", description: "Telegram bots showcase" },
      { key: "cinematic_reel", label: "Cinematic Reel", description: "Video editing showcase" },
      { key: "discord_automation", label: "Discord Automation", description: "Discord automation showcase" },
    ],
  },
  {
    title: "Homepage Sections",
    icon: Home,
    sections: [
      { key: "testimonials", label: "Testimonials", description: "Client testimonials carousel" },
      { key: "stats_counter", label: "Stats Counter", description: "Animated stats section" },
    ],
  },
];

export default function AdminSectionVisibility() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [visibility, setVisibility] = useState<SectionVisibility | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["section_visibility_admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("key", "section_visibility")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (data?.value) {
      setVisibility(data.value as unknown as SectionVisibility);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (newVisibility: SectionVisibility) => {
      const { error } = await supabase
        .from("site_settings")
        .update({ value: JSON.parse(JSON.stringify(newVisibility)) })
        .eq("key", "section_visibility");

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["section_visibility"] });
      queryClient.invalidateQueries({ queryKey: ["section_visibility_admin"] });
      toast({ title: "Saved!", description: "Section visibility updated" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save", variant: "destructive" });
    },
  });

  const handleToggle = (key: string, value: boolean) => {
    if (!visibility) return;
    setVisibility({ ...visibility, [key]: value });
  };

  const handleSave = () => {
    if (visibility) {
      mutation.mutate(visibility);
    }
  };

  const enableAll = () => {
    if (!visibility) return;
    const allEnabled = Object.keys(visibility).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {} as SectionVisibility
    );
    setVisibility(allEnabled);
  };

  const disableAll = () => {
    if (!visibility) return;
    const allDisabled = Object.keys(visibility).reduce(
      (acc, key) => ({ ...acc, [key]: false }),
      {} as SectionVisibility
    );
    setVisibility(allDisabled);
  };

  if (isLoading || !visibility) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Section Visibility</h1>
          <p className="text-muted-foreground">Toggle sections ON/OFF across your website</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={enableAll}>
            <Eye className="w-4 h-4 mr-2" /> Enable All
          </Button>
          <Button variant="outline" size="sm" onClick={disableAll}>
            <EyeOff className="w-4 h-4 mr-2" /> Disable All
          </Button>
          <Button onClick={handleSave} disabled={mutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {sectionGroups.map((group) => (
          <Card key={group.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <group.icon className="w-5 h-5 text-primary" />
                {group.title}
              </CardTitle>
              <CardDescription>
                Control visibility of these sections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.sections.map((section) => (
                  <div
                    key={section.key}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                      visibility[section.key as keyof SectionVisibility]
                        ? "bg-primary/5 border-primary/20"
                        : "bg-muted/50 border-border"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <Label htmlFor={section.key} className="text-base font-medium cursor-pointer">
                        {section.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">{section.description}</p>
                    </div>
                    <Switch
                      id={section.key}
                      checked={visibility[section.key as keyof SectionVisibility]}
                      onCheckedChange={(checked) => handleToggle(section.key, checked)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-amber-500 mt-0.5" />
            <div>
              <p className="font-medium text-amber-500">Note</p>
              <p className="text-sm text-muted-foreground">
                Disabled sections will be hidden from navigation and return a 404 page if accessed directly.
                Changes take effect immediately after saving.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
