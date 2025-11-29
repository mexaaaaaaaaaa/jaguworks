import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string | null;
  display_order: number;
  is_visible: boolean;
}

export default function AdminSocialLinks() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [newLink, setNewLink] = useState({
    platform: "",
    url: "",
    icon: "",
  });

  const { data: links, isLoading } = useQuery({
    queryKey: ["admin-social-links"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_links")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as SocialLink[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (link: typeof newLink) => {
      const maxOrder = links?.length ? Math.max(...links.map((l) => l.display_order)) + 1 : 0;
      const { error } = await supabase.from("social_links").insert({
        ...link,
        display_order: maxOrder,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-social-links"] });
      setIsCreateOpen(false);
      setNewLink({ platform: "", url: "", icon: "" });
      toast.success("Social link added!");
    },
    onError: () => toast.error("Failed to add link"),
  });

  const updateMutation = useMutation({
    mutationFn: async (link: SocialLink) => {
      const { error } = await supabase
        .from("social_links")
        .update({
          platform: link.platform,
          url: link.url,
          icon: link.icon,
          is_visible: link.is_visible,
        })
        .eq("id", link.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-social-links"] });
      setEditingLink(null);
      toast.success("Link updated!");
    },
    onError: () => toast.error("Failed to update link"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("social_links").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-social-links"] });
      toast.success("Link deleted!");
    },
    onError: () => toast.error("Failed to delete link"),
  });

  const toggleVisibility = useMutation({
    mutationFn: async ({ id, is_visible }: { id: string; is_visible: boolean }) => {
      const { error } = await supabase
        .from("social_links")
        .update({ is_visible })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-social-links"] });
    },
  });

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
          <h1 className="text-3xl font-bold">Social Links</h1>
          <p className="text-muted-foreground">Manage your social media links</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={20} />
              Add Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Social Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Platform Name *</Label>
                <Input
                  value={newLink.platform}
                  onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                  placeholder="e.g., YouTube, Discord"
                />
              </div>
              <div>
                <Label>URL *</Label>
                <Input
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label>Icon Name (Lucide)</Label>
                <Input
                  value={newLink.icon}
                  onChange={(e) => setNewLink({ ...newLink, icon: e.target.value })}
                  placeholder="e.g., Youtube, Instagram"
                />
              </div>
              <Button
                onClick={() => createMutation.mutate(newLink)}
                className="w-full"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Adding..." : "Add Link"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {links?.map((link) => (
          <Card key={link.id} className={!link.is_visible ? "opacity-60" : ""}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="cursor-grab p-2 hover:bg-muted rounded">
                  <GripVertical size={20} className="text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{link.platform}</h3>
                  <p className="text-sm text-muted-foreground truncate">{link.url}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={link.is_visible}
                    onCheckedChange={(checked) =>
                      toggleVisibility.mutate({ id: link.id, is_visible: checked })
                    }
                  />
                  <Button variant="ghost" size="icon" onClick={() => setEditingLink(link)}>
                    <Edit size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => {
                      if (confirm("Delete this link?")) {
                        deleteMutation.mutate(link.id);
                      }
                    }}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingLink} onOpenChange={() => setEditingLink(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Social Link</DialogTitle>
          </DialogHeader>
          {editingLink && (
            <div className="space-y-4 mt-4">
              <div>
                <Label>Platform Name</Label>
                <Input
                  value={editingLink.platform}
                  onChange={(e) =>
                    setEditingLink({ ...editingLink, platform: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>URL</Label>
                <Input
                  value={editingLink.url}
                  onChange={(e) =>
                    setEditingLink({ ...editingLink, url: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Icon Name</Label>
                <Input
                  value={editingLink.icon || ""}
                  onChange={(e) =>
                    setEditingLink({ ...editingLink, icon: e.target.value })
                  }
                />
              </div>
              <Button
                onClick={() => updateMutation.mutate(editingLink)}
                className="w-full"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
