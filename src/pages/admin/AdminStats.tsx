import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Stat {
  id: string;
  label: string;
  value: number;
  suffix: string;
  icon: string;
  color: string;
  display_order: number;
  is_active: boolean;
}

const iconOptions = ["Trophy", "Users", "Code", "Star", "Heart", "Rocket", "Globe", "Zap"];
const colorOptions = [
  { label: "Primary", value: "text-primary" },
  { label: "Yellow", value: "text-yellow-500" },
  { label: "Green", value: "text-green-500" },
  { label: "Blue", value: "text-blue-500" },
  { label: "Purple", value: "text-purple-500" },
  { label: "Pink", value: "text-pink-500" },
];

export default function AdminStats() {
  const [editingItem, setEditingItem] = useState<Stat | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    label: "",
    value: 0,
    suffix: "+",
    icon: "Trophy",
    color: "text-primary",
    is_active: true,
  });
  const queryClient = useQueryClient();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const { data, error } = await supabase.from("stats").select("*").order("display_order");
      if (error) throw error;
      return data as Stat[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("stats").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      toast({ title: "Stat added" });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from("stats").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      toast({ title: "Stat updated" });
      setIsDialogOpen(false);
      setEditingItem(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("stats").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      toast({ title: "Stat deleted" });
    },
  });

  const resetForm = () => {
    setFormData({
      label: "",
      value: 0,
      suffix: "+",
      icon: "Trophy",
      color: "text-primary",
      is_active: true,
    });
  };

  const openEditDialog = (item: Stat) => {
    setEditingItem(item);
    setFormData({
      label: item.label,
      value: item.value,
      suffix: item.suffix || "+",
      icon: item.icon,
      color: item.color,
      is_active: item.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.label) {
      toast({ title: "Label is required", variant: "destructive" });
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
          <h1 className="text-3xl font-bold">Stats Counter</h1>
          <p className="text-muted-foreground">Manage homepage statistics</p>
        </div>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Stat
        </Button>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats?.map((item) => (
            <Card key={item.id} className={`glass-card border-border/50 ${!item.is_active ? "opacity-50" : ""}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className={`text-3xl ${item.color}`}>{item.icon}</span>
                  <Switch
                    checked={item.is_active}
                    onCheckedChange={(checked) =>
                      updateMutation.mutate({ id: item.id, data: { ...formData, is_active: checked } })
                    }
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {item.value.toLocaleString()}{item.suffix}
                </p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}>
                    <Edit2 className="h-4 w-4" />
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
            <DialogTitle>{editingItem ? "Edit Stat" : "Add Stat"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Label *</Label>
              <Input
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="Projects Completed"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Value</Label>
                <Input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label>Suffix</Label>
                <Input
                  value={formData.suffix}
                  onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
                  placeholder="+"
                />
              </div>
            </div>
            <div>
              <Label>Icon</Label>
              <select
                className="w-full p-2 rounded-md border border-border bg-background"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              >
                {iconOptions.map((icon) => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
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
