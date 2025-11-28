import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Addon {
  id: string;
  category: string;
  name: string;
  price: number;
  is_active: boolean;
  display_order: number;
}

export default function AdminAddons() {
  const [category, setCategory] = useState("all");
  const [editingItem, setEditingItem] = useState<Addon | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: "minecraft",
    name: "",
    price: 5,
    is_active: true,
  });
  const queryClient = useQueryClient();

  const { data: addons, isLoading } = useQuery({
    queryKey: ["adminAddons", category],
    queryFn: async () => {
      let query = supabase.from("addons").select("*").order("display_order");
      if (category !== "all") {
        query = query.eq("category", category);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as Addon[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("addons").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAddons"] });
      toast({ title: "Add-on created" });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from("addons").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAddons"] });
      toast({ title: "Add-on updated" });
      setIsDialogOpen(false);
      setEditingItem(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("addons").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAddons"] });
      toast({ title: "Add-on deleted" });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("addons").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAddons"] });
    },
  });

  const resetForm = () => {
    setFormData({
      category: "minecraft",
      name: "",
      price: 5,
      is_active: true,
    });
  };

  const openEditDialog = (item: Addon) => {
    setEditingItem(item);
    setFormData({
      category: item.category,
      name: item.name,
      price: item.price,
      is_active: item.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name) {
      toast({ title: "Name is required", variant: "destructive" });
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
          <h1 className="text-3xl font-bold">Add-ons</h1>
          <p className="text-muted-foreground">Manage extra features for plans</p>
        </div>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Add-on
        </Button>
      </div>

      {/* Category Filter */}
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="minecraft">Minecraft</SelectItem>
          <SelectItem value="discord">Discord</SelectItem>
        </SelectContent>
      </Select>

      {/* Addons Table */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>All Add-ons</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : addons && addons.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-medium">Name</th>
                    <th className="text-left p-4 font-medium">Category</th>
                    <th className="text-left p-4 font-medium">Price</th>
                    <th className="text-left p-4 font-medium">Active</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {addons.map((addon) => (
                    <tr key={addon.id} className="border-b border-border/50 hover:bg-muted/50">
                      <td className="p-4 font-medium">{addon.name}</td>
                      <td className="p-4">
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary capitalize">
                          {addon.category}
                        </span>
                      </td>
                      <td className="p-4">₹{addon.price}</td>
                      <td className="p-4">
                        <Switch
                          checked={addon.is_active}
                          onCheckedChange={(checked) =>
                            toggleActiveMutation.mutate({ id: addon.id, is_active: checked })
                          }
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(addon)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (confirm("Delete?")) deleteMutation.mutate(addon.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No add-ons yet</p>
          )}
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Add-on" : "Create Add-on"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Custom plugin development"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minecraft">Minecraft</SelectItem>
                    <SelectItem value="discord">Discord</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Price (₹)</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                />
              </div>
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
