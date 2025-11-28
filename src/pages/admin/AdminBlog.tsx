import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, Save, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  featured_image: string;
  is_featured: boolean;
  is_published: boolean;
  views: number;
  read_time: string;
  created_at: string;
}

export default function AdminBlog() {
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    category: "",
    author: "Jagmohan",
    featured_image: "",
    is_featured: false,
    is_published: false,
    read_time: "",
  });
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["adminBlogPosts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as BlogPost[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("blog_posts").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBlogPosts"] });
      toast({ title: "Post created successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: "Failed to create post", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from("blog_posts").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBlogPosts"] });
      toast({ title: "Post updated successfully" });
      setIsDialogOpen(false);
      setEditingPost(null);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to update post", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBlogPosts"] });
      toast({ title: "Post deleted successfully" });
    },
  });

  const resetForm = () => {
    setFormData({
      slug: "",
      title: "",
      excerpt: "",
      content: "",
      category: "",
      author: "Jagmohan",
      featured_image: "",
      is_featured: false,
      is_published: false,
      read_time: "",
    });
  };

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt || "",
      content: post.content,
      category: post.category || "",
      author: post.author,
      featured_image: post.featured_image || "",
      is_featured: post.is_featured,
      is_published: post.is_published,
      read_time: post.read_time || "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.slug || !formData.title || !formData.content) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setFormData({ ...formData, slug });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground">Create and manage blog content</p>
        </div>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> New Post
        </Button>
      </div>

      {/* Posts List */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>All Posts ({posts?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : posts && posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-muted/50 gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium">{post.title}</h3>
                      {post.is_featured && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-500">
                          Featured
                        </span>
                      )}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          post.is_published
                            ? "bg-green-500/20 text-green-500"
                            : "bg-gray-500/20 text-gray-500"
                        }`}
                      >
                        {post.is_published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {post.category} • {post.views} views • {post.read_time}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <a href={`/#/blog/${post.slug}`} target="_blank" rel="noopener">
                        <Eye className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(post)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm("Delete this post?")) deleteMutation.mutate(post.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No blog posts yet</p>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPost ? "Edit Post" : "Create New Post"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                onBlur={() => !editingPost && !formData.slug && generateSlug()}
                placeholder="Post title"
              />
            </div>
            <div>
              <Label>Slug *</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="post-slug"
                />
                <Button type="button" variant="outline" onClick={generateSlug}>
                  Generate
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Technology"
                />
              </div>
              <div>
                <Label>Read Time</Label>
                <Input
                  value={formData.read_time}
                  onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                  placeholder="5 min read"
                />
              </div>
            </div>
            <div>
              <Label>Excerpt</Label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Short description..."
                rows={2}
              />
            </div>
            <div>
              <Label>Content * (Markdown supported)</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your post content..."
                rows={10}
              />
            </div>
            <div>
              <Label>Featured Image URL</Label>
              <Input
                value={formData.featured_image}
                onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                />
                <Label>Published</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
                <Label>Featured</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsDialogOpen(false); setEditingPost(null); }}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              <Save className="h-4 w-4 mr-2" /> Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
