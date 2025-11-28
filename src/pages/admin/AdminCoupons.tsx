import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, Save, Ticket } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  description: string;
  is_active: boolean;
  usage_limit: number | null;
  used_count: number;
  expires_at: string | null;
}

export default function AdminCoupons() {
  const [editingItem, setEditingItem] = useState<Coupon | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    value: 10,
    description: "",
    is_active: true,
    usage_limit: null as number | null,
    expires_at: "",
  });
  const queryClient = useQueryClient();

  const { data: coupons, isLoading } = useQuery({
    queryKey: ["adminCoupons"],
    queryFn: async () => {
      const { data, error } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Coupon[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("coupons").insert({
        ...data,
        expires_at: data.expires_at || null,
        usage_limit: data.usage_limit || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCoupons"] });
      toast({ title: "Coupon created" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: "Failed to create coupon", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from("coupons").update({
        ...data,
        expires_at: data.expires_at || null,
        usage_limit: data.usage_limit || null,
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCoupons"] });
      toast({ title: "Coupon updated" });
      setIsDialogOpen(false);
      setEditingItem(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("coupons").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCoupons"] });
      toast({ title: "Coupon deleted" });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("coupons").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCoupons"] });
    },
  });

  const resetForm = () => {
    setFormData({
      code: "",
      type: "percentage",
      value: 10,
      description: "",
      is_active: true,
      usage_limit: null,
      expires_at: "",
    });
  };

  const openEditDialog = (item: Coupon) => {
    setEditingItem(item);
    setFormData({
      code: item.code,
      type: item.type,
      value: item.value,
      description: item.description || "",
      is_active: item.is_active,
      usage_limit: item.usage_limit,
      expires_at: item.expires_at ? item.expires_at.split("T")[0] : "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.code || !formData.value) {
      toast({ title: "Code and value are required", variant: "destructive" });
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
          <h1 className="text-3xl font-bold">Coupons</h1>
          <p className="text-muted-foreground">Manage discount codes</p>
        </div>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Coupon
        </Button>
      </div>

      {/* Coupons Table */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>All Coupons</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : coupons && coupons.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-medium">Code</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Value</th>
                    <th className="text-left p-4 font-medium">Usage</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => (
                    <tr key={coupon.id} className="border-b border-border/50 hover:bg-muted/50">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Ticket className="h-4 w-4 text-primary" />
                          <span className="font-mono font-bold">{coupon.code}</span>
                        </div>
                      </td>
                      <td className="p-4 capitalize">{coupon.type}</td>
                      <td className="p-4">
                        {coupon.type === "percentage" ? `${coupon.value}%` : `₹${coupon.value}`}
                      </td>
                      <td className="p-4">
                        {coupon.used_count} / {coupon.usage_limit || "∞"}
                      </td>
                      <td className="p-4">
                        <Switch
                          checked={coupon.is_active}
                          onCheckedChange={(checked) =>
                            toggleActiveMutation.mutate({ id: coupon.id, is_active: checked })
                          }
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(coupon)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (confirm("Delete this coupon?")) deleteMutation.mutate(coupon.id);
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
            <p className="text-center text-muted-foreground py-8">No coupons yet</p>
          )}
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Coupon" : "Create Coupon"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Code *</Label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="SAVE10"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Value *</Label>
                <Input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="10% off on all plans"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Usage Limit (empty = unlimited)</Label>
                <Input
                  type="number"
                  value={formData.usage_limit || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, usage_limit: e.target.value ? parseInt(e.target.value) : null })
                  }
                  placeholder="100"
                />
              </div>
              <div>
                <Label>Expires At</Label>
                <Input
                  type="date"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
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
