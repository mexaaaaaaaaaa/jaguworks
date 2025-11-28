import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, Save, Trophy } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  is_progress: boolean;
  current_value: number | null;
  target_value: number | null;
  display_order: number;
  is_active: boolean;
}

const colorOptions = [
  { label: "Purple", value: "from-purple-500 to-pink-500" },
  { label: "Blue", value: "from-blue-500 to-cyan-500" },
  { label: "Green", value: "from-green-500 to-emerald-500" },
  { label: "Yellow", value: "from-yellow-500 to-orange-500" },
  { label: "Red", value: "from-red-500 to-pink-500" },
];

export default function AdminAchievements() {
  const [editingItem, setEditingItem] = useState<Achievement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "Trophy",
    color: "from-purple-500 to-pink-500",
    is_progress: false,
    current_value: null as number | null,
    target_value: null as number | null,
    is_active: true,
  });
  const queryClient = useQueryClient();

  const { data: achievements, isLoading } = useQuery({
    queryKey: ["adminAchievements"],
    queryFn: async () => {
      const { data, error } = await supabase.from("achievements").select("*").order("display_order");
      if (error) throw error;
      return data as Achievement[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("achievements").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAchievements"] });
      toast({ title: "Achievement added" });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from("achievements").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAchievements"] });
      toast({ title: "Achievement updated" });
      setIsDialogOpen(false);
      setEditingItem(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("achievements").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAchievements"] });
      toast({ title: "Achievement deleted" });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("achievements").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAchievements"] });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      icon: "Trophy",
      color: "from-purple-500 to-pink-500",
      is_progress: false,
      current_value: null,
      target_value: null,
      is_active: true,
    });
  };

  const openEditDialog = (item: Achievement) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      icon: item.icon,
      color: item.color,
      is_progress: item.is_progress,
      current_value: item.current_value,
      target_value: item.target_value,
      is_active: item.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.title) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Achievements</h1>
          <p className="text-muted-foreground">Manage badges and milestones</p>
        </div>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Achievement
        </Button>
      </div>

      {/* Achievements Grid */}
      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements?.map((item) => (
            <Card key={item.id} className={`glass-card border-border/50 ${!item.is_active ? "opacity-50" : ""}`}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color}`}>
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <Switch
                  checked={item.is_active}
                  onCheckedChange={(checked) => toggleActiveMutation.mutate({ id: item.id, is_active: checked })}
                />
              </CardHeader>
              <CardContent>
                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                
                {item.is_progress && item.target_value && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{item.current_value || 0}</span>
                      <span>{item.target_value}</span>
                    </div>
                    <Progress value={((item.current_value || 0) / item.target_value) * 100} />
                  </div>
                )}
                
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}>
                    <Edit2 className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm("Delete?")) deleteMutation.mutate(item.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Achievement" : "Add Achievement"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="100+ Projects Completed"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Achievement description..."
                rows={2}
              />
            </div>
            <div>
              <Label>Color</Label>
              <select
                className="w-full p-2 rounded-md border border-border bg-background"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              >
                {colorOptions.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.is_progress}
                onCheckedChange={(checked) => setFormData({ ...formData, is_progress: checked })}
              />
              <Label>Progress-based achievement</Label>
            </div>
            {formData.is_progress && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Current Value</Label>
                  <Input
                    type="number"
                    value={formData.current_value || ""}
                    onChange={(e) => setFormData({ ...formData, current_value: parseInt(e.target.value) || null })}
                  />
                </div>
                <div>
                  <Label>Target Value</Label>
                  <Input
                    type="number"
                    value={formData.target_value || ""}
                    onChange={(e) => setFormData({ ...formData, target_value: parseInt(e.target.value) || null })}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}><Save className="h-4 w-4 mr-2" /> Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
