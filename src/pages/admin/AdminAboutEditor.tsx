import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, Plus, Trash2, GripVertical, Quote, Clock } from "lucide-react";

interface TimelineItem {
  year: string;
  event: string;
  icon: string;
}

interface AboutContent {
  title: string;
  subtitle: string;
  bio: string;
  quote: string;
  timeline: TimelineItem[];
}

const defaultAboutContent: AboutContent = {
  title: "About Me",
  subtitle: "Who I Am",
  bio: "Hey, I'm Jagmohan — a developer, dreamer, and builder.",
  quote: "Dream it. Build it. Automate it.",
  timeline: []
};

const iconOptions = [
  "Code2", "MessageSquare", "Gamepad2", "Zap", "Rocket", "Star", 
  "Heart", "Globe", "Server", "Bot", "Sparkles", "Trophy"
];

const AdminAboutEditor = () => {
  const queryClient = useQueryClient();
  const [content, setContent] = useState<AboutContent>(defaultAboutContent);

  const { data: aboutData, isLoading } = useQuery({
    queryKey: ["site-content", "about"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("content")
        .eq("section_key", "about")
        .maybeSingle();
      if (error) throw error;
      return data?.content as unknown as AboutContent | null;
    }
  });

  useEffect(() => {
    if (aboutData) {
      setContent({ ...defaultAboutContent, ...aboutData });
    }
  }, [aboutData]);

  const saveMutation = useMutation({
    mutationFn: async (newContent: AboutContent) => {
      const { error } = await supabase
        .from("site_content")
        .update({ content: JSON.parse(JSON.stringify(newContent)), updated_at: new Date().toISOString() })
        .eq("section_key", "about");
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-content", "about"] });
      toast.success("About section saved!");
    },
    onError: () => toast.error("Failed to save")
  });

  const addTimelineItem = () => {
    setContent(prev => ({
      ...prev,
      timeline: [...prev.timeline, { year: new Date().getFullYear().toString(), event: "New event", icon: "Star" }]
    }));
  };

  const removeTimelineItem = (index: number) => {
    setContent(prev => ({
      ...prev,
      timeline: prev.timeline.filter((_, i) => i !== index)
    }));
  };

  const updateTimelineItem = (index: number, field: keyof TimelineItem, value: string) => {
    setContent(prev => ({
      ...prev,
      timeline: prev.timeline.map((item, i) => i === index ? { ...item, [field]: value } : item)
    }));
  };

  const moveTimelineItem = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= content.timeline.length) return;
    
    setContent(prev => {
      const newTimeline = [...prev.timeline];
      [newTimeline[index], newTimeline[newIndex]] = [newTimeline[newIndex], newTimeline[index]];
      return { ...prev, timeline: newTimeline };
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">About Section Editor</h1>
        <Button onClick={() => saveMutation.mutate(content)} disabled={saveMutation.isPending}>
          <Save className="w-4 h-4 mr-2" />
          {saveMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Section Header */}
        <Card className="glass-frost">
          <CardHeader>
            <CardTitle>Section Header</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={content.title}
                  onChange={(e) => setContent(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="About Me"
                />
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input
                  value={content.subtitle}
                  onChange={(e) => setContent(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Who I Am"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio */}
        <Card className="glass-frost">
          <CardHeader>
            <CardTitle>Bio Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Bio Text</Label>
              <Textarea
                value={content.bio}
                onChange={(e) => setContent(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Write your bio here..."
                rows={5}
              />
            </div>
          </CardContent>
        </Card>

        {/* Quote */}
        <Card className="glass-frost">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Quote className="w-5 h-5" /> Quote
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={content.quote}
              onChange={(e) => setContent(prev => ({ ...prev, quote: e.target.value }))}
              placeholder="Your inspirational quote..."
            />
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="glass-frost">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="w-5 h-5" /> Timeline
              </span>
              <Button size="sm" variant="outline" onClick={addTimelineItem}>
                <Plus className="w-4 h-4 mr-1" /> Add Event
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {content.timeline.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No timeline items. Click "Add Event" to create one.</p>
            ) : (
              content.timeline.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3 bg-background/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Event {index + 1}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => moveTimelineItem(index, "up")}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => moveTimelineItem(index, "down")}
                        disabled={index === content.timeline.length - 1}
                      >
                        ↓
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => removeTimelineItem(index)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Year</Label>
                      <Input
                        value={item.year}
                        onChange={(e) => updateTimelineItem(index, "year", e.target.value)}
                        placeholder="2024"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <Label className="text-xs">Event Description</Label>
                      <Input
                        value={item.event}
                        onChange={(e) => updateTimelineItem(index, "event", e.target.value)}
                        placeholder="What happened?"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Icon</Label>
                    <select
                      value={item.icon}
                      onChange={(e) => updateTimelineItem(index, "icon", e.target.value)}
                      className="w-full p-2 rounded-md border bg-background text-sm"
                    >
                      {iconOptions.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAboutEditor;
