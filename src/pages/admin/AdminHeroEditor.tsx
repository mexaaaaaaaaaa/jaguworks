import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, Upload, Plus, Trash2, Image, Type, Link2 } from "lucide-react";

interface HeroContent {
  bg_image_url: string;
  profile_image_url: string;
  title: string;
  badge_text: string;
  subtitle: string;
  skills: string[];
  buttons: { text: string; link: string; variant: string }[];
}

const defaultHeroContent: HeroContent = {
  bg_image_url: "",
  profile_image_url: "",
  title: "JAGMOHAN",
  badge_text: "Digital Creator & Developer",
  subtitle: "Building Digital Worlds",
  skills: ["Minecraft Developer", "Discord Dev", "App & Website Builder", "Entrepreneur"],
  buttons: [
    { text: "Explore My Universe", link: "/projects", variant: "hero" },
    { text: "Join My Discord", link: "https://discord.gg/6CdCgjsVua", variant: "outline" }
  ]
};

const AdminHeroEditor = () => {
  const queryClient = useQueryClient();
  const [content, setContent] = useState<HeroContent>(defaultHeroContent);
  const [uploading, setUploading] = useState(false);

  const { data: heroData, isLoading } = useQuery({
    queryKey: ["site-content", "hero"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("content")
        .eq("section_key", "hero")
        .maybeSingle();
      if (error) throw error;
      return data?.content as unknown as HeroContent | null;
    }
  });

  useEffect(() => {
    if (heroData) {
      setContent({ ...defaultHeroContent, ...heroData });
    }
  }, [heroData]);

  const saveMutation = useMutation({
    mutationFn: async (newContent: HeroContent) => {
      const { error } = await supabase
        .from("site_content")
        .update({ content: JSON.parse(JSON.stringify(newContent)), updated_at: new Date().toISOString() })
        .eq("section_key", "hero");
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-content", "hero"] });
      toast.success("Hero section saved!");
    },
    onError: () => toast.error("Failed to save")
  });

  const uploadImage = async (file: File, type: "bg" | "profile") => {
    setUploading(true);
    try {
      const fileName = `${type}-${Date.now()}.${file.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage
        .from("site-images")
        .upload(fileName, file, { upsert: true });
      
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("site-images")
        .getPublicUrl(fileName);

      setContent(prev => ({
        ...prev,
        [type === "bg" ? "bg_image_url" : "profile_image_url"]: publicUrl
      }));
      toast.success("Image uploaded!");
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const addSkill = () => {
    setContent(prev => ({ ...prev, skills: [...prev.skills, "New Skill"] }));
  };

  const removeSkill = (index: number) => {
    setContent(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const updateSkill = (index: number, value: string) => {
    setContent(prev => ({
      ...prev,
      skills: prev.skills.map((s, i) => i === index ? value : s)
    }));
  };

  const addButton = () => {
    setContent(prev => ({
      ...prev,
      buttons: [...prev.buttons, { text: "New Button", link: "#", variant: "outline" }]
    }));
  };

  const removeButton = (index: number) => {
    setContent(prev => ({
      ...prev,
      buttons: prev.buttons.filter((_, i) => i !== index)
    }));
  };

  const updateButton = (index: number, field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      buttons: prev.buttons.map((b, i) => i === index ? { ...b, [field]: value } : b)
    }));
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Hero Section Editor</h1>
        <Button onClick={() => saveMutation.mutate(content)} disabled={saveMutation.isPending}>
          <Save className="w-4 h-4 mr-2" />
          {saveMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Background Image */}
        <Card className="glass-frost">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="w-5 h-5" /> Background Image
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {content.bg_image_url && (
              <img src={content.bg_image_url} alt="Background Preview" className="w-full h-32 object-cover rounded-lg" />
            )}
            <div className="space-y-2">
              <Label>Upload New Background</Label>
              <Input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], "bg")}
              />
            </div>
            <div className="space-y-2">
              <Label>Or Enter URL</Label>
              <Input
                value={content.bg_image_url}
                onChange={(e) => setContent(prev => ({ ...prev, bg_image_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Profile Image */}
        <Card className="glass-frost">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="w-5 h-5" /> Profile Image
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {content.profile_image_url && (
              <img src={content.profile_image_url} alt="Profile Preview" className="w-32 h-32 object-cover rounded-full mx-auto" />
            )}
            <div className="space-y-2">
              <Label>Upload New Profile</Label>
              <Input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], "profile")}
              />
            </div>
            <div className="space-y-2">
              <Label>Or Enter URL</Label>
              <Input
                value={content.profile_image_url}
                onChange={(e) => setContent(prev => ({ ...prev, profile_image_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Text Content */}
        <Card className="glass-frost md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="w-5 h-5" /> Text Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Main Title</Label>
                <Input
                  value={content.title}
                  onChange={(e) => setContent(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="JAGMOHAN"
                />
              </div>
              <div className="space-y-2">
                <Label>Badge Text</Label>
                <Input
                  value={content.badge_text}
                  onChange={(e) => setContent(prev => ({ ...prev, badge_text: e.target.value }))}
                  placeholder="Digital Creator & Developer"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Input
                value={content.subtitle}
                onChange={(e) => setContent(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="Building Digital Worlds"
              />
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="glass-frost">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Skills / Tags</span>
              <Button size="sm" variant="outline" onClick={addSkill}>
                <Plus className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {content.skills.map((skill, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={skill}
                  onChange={(e) => updateSkill(index, e.target.value)}
                />
                <Button size="icon" variant="destructive" onClick={() => removeSkill(index)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Buttons */}
        <Card className="glass-frost">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Link2 className="w-5 h-5" /> Buttons
              </span>
              <Button size="sm" variant="outline" onClick={addButton}>
                <Plus className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {content.buttons.map((button, index) => (
              <div key={index} className="p-3 border rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Button {index + 1}</span>
                  <Button size="icon" variant="ghost" onClick={() => removeButton(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  value={button.text}
                  onChange={(e) => updateButton(index, "text", e.target.value)}
                  placeholder="Button Text"
                />
                <Input
                  value={button.link}
                  onChange={(e) => updateButton(index, "link", e.target.value)}
                  placeholder="Link URL"
                />
                <select
                  value={button.variant}
                  onChange={(e) => updateButton(index, "variant", e.target.value)}
                  className="w-full p-2 rounded-md border bg-background"
                >
                  <option value="hero">Hero (Primary)</option>
                  <option value="neon">Neon</option>
                  <option value="outline">Outline</option>
                </select>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminHeroEditor;
