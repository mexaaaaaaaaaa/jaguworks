import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  Copy,
  LayoutGrid,
  Type,
  Image,
  CreditCard,
  HelpCircle,
  Code,
  Columns,
  List,
  ImageIcon,
  Blocks,
  Search,
  ArrowUp,
  ArrowDown,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { COMPONENT_LIBRARY, COMPONENT_CATEGORIES, getTemplatesByCategory, type ComponentTemplate } from "@/data/component-library";

const LAYOUT_TYPES = [
  { value: "text", label: "Text Only", icon: Type },
  { value: "text_image", label: "Text + Image", icon: Image },
  { value: "cards_grid", label: "Cards Grid", icon: LayoutGrid },
  { value: "pricing_table", label: "Pricing Table", icon: CreditCard },
  { value: "image_gallery", label: "Image Gallery", icon: ImageIcon },
  { value: "faq", label: "FAQ Accordion", icon: HelpCircle },
  { value: "custom_html", label: "Custom HTML", icon: Code },
  { value: "hero_banner", label: "Hero Banner", icon: Columns },
  { value: "two_column", label: "Two Column", icon: Columns },
  { value: "feature_list", label: "Feature List", icon: List },
];

interface DynamicSection {
  id: string;
  section_name: string;
  slug: string;
  layout_type: string;
  content: Record<string, unknown>;
  order_index: number;
  is_visible: boolean;
  page: string;
}

export default function AdminSectionBuilder() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<DynamicSection | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newSection, setNewSection] = useState({
    section_name: "",
    slug: "",
    layout_type: "text",
    page: "home",
  });

  const { data: sections, isLoading } = useQuery({
    queryKey: ["admin-dynamic-sections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dynamic_sections")
        .select("*")
        .order("order_index", { ascending: true });
      if (error) throw error;
      return data as DynamicSection[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (section: { section_name: string; slug: string; layout_type: string; page: string; content: Record<string, unknown> }) => {
      const maxOrder = sections?.length ? Math.max(...sections.map(s => s.order_index)) + 1 : 0;
      const { error } = await supabase.from("dynamic_sections").insert({
        section_name: section.section_name,
        slug: section.slug,
        layout_type: section.layout_type,
        page: section.page,
        content: section.content as unknown as Record<string, never>,
        order_index: maxOrder,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dynamic-sections"] });
      setIsCreateOpen(false);
      setIsTemplateOpen(false);
      setNewSection({ section_name: "", slug: "", layout_type: "text", page: "home" });
      toast.success("Section created successfully!");
    },
    onError: () => toast.error("Failed to create section"),
  });

  const updateMutation = useMutation({
    mutationFn: async (section: DynamicSection) => {
      const { error } = await supabase
        .from("dynamic_sections")
        .update({
          section_name: section.section_name,
          layout_type: section.layout_type,
          content: section.content as unknown as Record<string, never>,
          is_visible: section.is_visible,
          page: section.page,
        })
        .eq("id", section.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dynamic-sections"] });
      setEditingSection(null);
      toast.success("Section updated!");
    },
    onError: () => toast.error("Failed to update section"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("dynamic_sections").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dynamic-sections"] });
      toast.success("Section deleted!");
    },
    onError: () => toast.error("Failed to delete section"),
  });

  const duplicateMutation = useMutation({
    mutationFn: async (section: DynamicSection) => {
      const maxOrder = sections?.length ? Math.max(...sections.map(s => s.order_index)) + 1 : 0;
      const { error } = await supabase.from("dynamic_sections").insert({
        section_name: `${section.section_name} (Copy)`,
        slug: `${section.slug}-copy-${Date.now()}`,
        layout_type: section.layout_type,
        content: section.content as unknown as Record<string, never>,
        order_index: maxOrder,
        page: section.page,
        is_visible: false,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dynamic-sections"] });
      toast.success("Section duplicated!");
    },
    onError: () => toast.error("Failed to duplicate section"),
  });

  const toggleVisibility = useMutation({
    mutationFn: async ({ id, is_visible }: { id: string; is_visible: boolean }) => {
      const { error } = await supabase
        .from("dynamic_sections")
        .update({ is_visible })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dynamic-sections"] });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async ({ id, newIndex }: { id: string; newIndex: number }) => {
      const { error } = await supabase
        .from("dynamic_sections")
        .update({ order_index: newIndex })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dynamic-sections"] });
    },
  });

  const moveSection = (index: number, direction: "up" | "down") => {
    if (!sections) return;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const currentSection = sections[index];
    const swapSection = sections[newIndex];

    reorderMutation.mutate({ id: currentSection.id, newIndex: swapSection.order_index });
    reorderMutation.mutate({ id: swapSection.id, newIndex: currentSection.order_index });
  };

  const handleCreateFromTemplate = (template: ComponentTemplate) => {
    createMutation.mutate({
      section_name: template.name,
      slug: template.id + "-" + Date.now(),
      layout_type: template.layout_type,
      page: "home",
      content: template.default_content,
    });
  };

  const handleCreateSection = () => {
    if (!newSection.section_name || !newSection.slug) {
      toast.error("Please fill in all required fields");
      return;
    }
    const defaultContent = getDefaultContent(newSection.layout_type);
    createMutation.mutate({ ...newSection, content: defaultContent });
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  const filteredTemplates = COMPONENT_LIBRARY.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Section Builder</h1>
          <p className="text-muted-foreground">Create and manage dynamic sections</p>
        </div>
        <div className="flex gap-2">
          {/* Template Library Button */}
          <Dialog open={isTemplateOpen} onOpenChange={setIsTemplateOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Blocks size={20} />
                Component Library
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center gap-2">
                  <Blocks className="text-primary" />
                  Component Library
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Search & Filter */}
                <div className="flex gap-4 flex-wrap">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      placeholder="Search components..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {COMPONENT_CATEGORIES.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>
                          <div className="flex items-center gap-2">
                            <cat.icon size={14} />
                            {cat.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Templates Grid */}
                <ScrollArea className="h-[500px] pr-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTemplates.map((template) => {
                      const IconComponent = template.icon;
                      return (
                        <Card
                          key={template.id}
                          className="cursor-pointer hover:border-primary hover:shadow-lg transition-all group"
                          onClick={() => handleCreateFromTemplate(template)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <IconComponent size={20} className="text-primary" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-sm">{template.name}</h3>
                                <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                                <span className="text-xs px-2 py-0.5 rounded bg-muted mt-2 inline-block">
                                  {COMPONENT_CATEGORIES.find(c => c.id === template.category)?.label}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                  {filteredTemplates.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      No components found matching your search.
                    </div>
                  )}
                </ScrollArea>

                <div className="flex justify-between items-center pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    {filteredTemplates.length} of {COMPONENT_LIBRARY.length} components
                  </p>
                  <Button variant="ghost" onClick={() => setIsTemplateOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Manual Create Button */}
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={20} />
                New Section
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Custom Section</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Section Name *</Label>
                  <Input
                    value={newSection.section_name}
                    onChange={(e) => {
                      setNewSection({
                        ...newSection,
                        section_name: e.target.value,
                        slug: generateSlug(e.target.value),
                      });
                    }}
                    placeholder="e.g., Featured Projects"
                  />
                </div>
                <div>
                  <Label>URL Slug *</Label>
                  <Input
                    value={newSection.slug}
                    onChange={(e) => setNewSection({ ...newSection, slug: e.target.value })}
                    placeholder="e.g., featured-projects"
                  />
                </div>
                <div>
                  <Label>Page</Label>
                  <Select
                    value={newSection.page}
                    onValueChange={(value) => setNewSection({ ...newSection, page: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="about">About</SelectItem>
                      <SelectItem value="projects">Projects</SelectItem>
                      <SelectItem value="contact">Contact</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="pricing">Pricing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Layout Type</Label>
                  <Select
                    value={newSection.layout_type}
                    onValueChange={(value) => setNewSection({ ...newSection, layout_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LAYOUT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon size={16} />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCreateSection} className="w-full" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create Section"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{sections?.length || 0}</p>
            <p className="text-sm text-muted-foreground">Total Sections</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-500">{sections?.filter(s => s.is_visible).length || 0}</p>
            <p className="text-sm text-muted-foreground">Visible</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-yellow-500">{sections?.filter(s => !s.is_visible).length || 0}</p>
            <p className="text-sm text-muted-foreground">Hidden</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-secondary">{COMPONENT_LIBRARY.length}</p>
            <p className="text-sm text-muted-foreground">Templates</p>
          </CardContent>
        </Card>
      </div>

      {/* Sections List */}
      <div className="grid gap-3">
        {sections?.length === 0 ? (
          <Card className="p-12 text-center">
            <Blocks className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No sections yet</h3>
            <p className="text-muted-foreground mb-4">Create your first section using the Component Library or manually.</p>
            <Button onClick={() => setIsTemplateOpen(true)} className="gap-2">
              <Blocks size={18} />
              Browse Component Library
            </Button>
          </Card>
        ) : (
          sections?.map((section, index) => (
            <Card key={section.id} className={`transition-all hover:shadow-md ${!section.is_visible ? "opacity-60" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Reorder Buttons */}
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => moveSection(index, "up")}
                      disabled={index === 0}
                    >
                      <ArrowUp size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => moveSection(index, "down")}
                      disabled={index === sections.length - 1}
                    >
                      <ArrowDown size={14} />
                    </Button>
                  </div>

                  {/* Drag Handle */}
                  <div className="cursor-grab p-2 hover:bg-muted rounded">
                    <GripVertical size={20} className="text-muted-foreground" />
                  </div>

                  {/* Section Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{section.section_name}</h3>
                      <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                        {LAYOUT_TYPES.find(t => t.value === section.layout_type)?.label}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-muted">
                        {section.page}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-muted">
                        #{section.order_index}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">/{section.slug}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={section.is_visible}
                      onCheckedChange={(checked) =>
                        toggleVisibility.mutate({ id: section.id, is_visible: checked })
                      }
                    />
                    <span className="text-sm text-muted-foreground">
                      {section.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingSection(section)}
                    >
                      <Edit size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => duplicateMutation.mutate(section)}
                    >
                      <Copy size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        if (confirm("Delete this section?")) {
                          deleteMutation.mutate(section.id);
                        }
                      }}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Section Dialog */}
      <Dialog open={!!editingSection} onOpenChange={() => setEditingSection(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Section: {editingSection?.section_name}</DialogTitle>
          </DialogHeader>
          {editingSection && (
            <SectionContentEditor
              section={editingSection}
              onSave={(updated) => updateMutation.mutate(updated)}
              onCancel={() => setEditingSection(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

const getDefaultContent = (layoutType: string) => {
  switch (layoutType) {
    case "text":
      return { title: "", subtitle: "", paragraphs: [""], buttons: [] };
    case "text_image":
      return { title: "", subtitle: "", paragraphs: [""], image_url: "", image_position: "right", buttons: [] };
    case "cards_grid":
      return { title: "", subtitle: "", cards: [{ title: "", description: "", icon: "", link: "" }] };
    case "pricing_table":
      return { title: "", subtitle: "", plans: [{ name: "", price: "", features: [], cta_text: "", cta_link: "" }] };
    case "image_gallery":
      return { title: "", subtitle: "", images: [{ url: "", caption: "" }] };
    case "faq":
      return { title: "", subtitle: "", items: [{ question: "", answer: "" }] };
    case "custom_html":
      return { html: "", css: "" };
    case "hero_banner":
      return { title: "", subtitle: "", background_image: "", cta_text: "", cta_link: "", overlay_opacity: 0.5 };
    case "two_column":
      return { title: "", left_content: "", right_content: "", left_image: "", right_image: "" };
    case "feature_list":
      return { title: "", subtitle: "", features: [{ icon: "", title: "", description: "" }] };
    default:
      return {};
  }
};

function SectionContentEditor({
  section,
  onSave,
  onCancel,
}: {
  section: DynamicSection;
  onSave: (section: DynamicSection) => void;
  onCancel: () => void;
}) {
  const [content, setContent] = useState<Record<string, unknown>>(section.content);

  const updateContent = (key: string, value: unknown) => {
    setContent({ ...content, [key]: value });
  };

  const renderEditor = () => {
    switch (section.layout_type) {
      case "text":
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={(content.title as string) || ""}
                onChange={(e) => updateContent("title", e.target.value)}
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={(content.subtitle as string) || ""}
                onChange={(e) => updateContent("subtitle", e.target.value)}
              />
            </div>
            <div>
              <Label>Content</Label>
              <Textarea
                value={((content.paragraphs as string[]) || []).join("\n\n")}
                onChange={(e) => updateContent("paragraphs", e.target.value.split("\n\n"))}
                rows={6}
              />
            </div>
          </div>
        );

      case "hero_banner":
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={(content.title as string) || ""}
                onChange={(e) => updateContent("title", e.target.value)}
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={(content.subtitle as string) || ""}
                onChange={(e) => updateContent("subtitle", e.target.value)}
              />
            </div>
            <div>
              <Label>Background Image URL</Label>
              <Input
                value={(content.background_image as string) || ""}
                onChange={(e) => updateContent("background_image", e.target.value)}
              />
            </div>
            <div>
              <Label>CTA Button Text</Label>
              <Input
                value={(content.cta_text as string) || ""}
                onChange={(e) => updateContent("cta_text", e.target.value)}
              />
            </div>
            <div>
              <Label>CTA Link</Label>
              <Input
                value={(content.cta_link as string) || ""}
                onChange={(e) => updateContent("cta_link", e.target.value)}
              />
            </div>
          </div>
        );

      case "cards_grid":
        const cards = (content.cards as Array<{ title: string; description: string; icon: string; link: string }>) || [];
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={(content.title as string) || ""}
                onChange={(e) => updateContent("title", e.target.value)}
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={(content.subtitle as string) || ""}
                onChange={(e) => updateContent("subtitle", e.target.value)}
              />
            </div>
            <div>
              <Label>Cards</Label>
              {cards.map((card, index) => (
                <Card key={index} className="p-4 mt-2">
                  <div className="space-y-2">
                    <Input
                      placeholder="Card Title"
                      value={card.title}
                      onChange={(e) => {
                        const newCards = [...cards];
                        newCards[index] = { ...card, title: e.target.value };
                        updateContent("cards", newCards);
                      }}
                    />
                    <Textarea
                      placeholder="Card Description"
                      value={card.description}
                      onChange={(e) => {
                        const newCards = [...cards];
                        newCards[index] = { ...card, description: e.target.value };
                        updateContent("cards", newCards);
                      }}
                    />
                    <Input
                      placeholder="Icon (e.g., Code, Star)"
                      value={card.icon}
                      onChange={(e) => {
                        const newCards = [...cards];
                        newCards[index] = { ...card, icon: e.target.value };
                        updateContent("cards", newCards);
                      }}
                    />
                    <div className="flex gap-2">
                      <Input
                        placeholder="Link (optional)"
                        value={card.link}
                        onChange={(e) => {
                          const newCards = [...cards];
                          newCards[index] = { ...card, link: e.target.value };
                          updateContent("cards", newCards);
                        }}
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const newCards = cards.filter((_, i) => i !== index);
                          updateContent("cards", newCards);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => {
                  updateContent("cards", [...cards, { title: "", description: "", icon: "", link: "" }]);
                }}
              >
                <Plus size={16} className="mr-2" />
                Add Card
              </Button>
            </div>
          </div>
        );

      case "faq":
        const faqItems = (content.items as Array<{ question: string; answer: string }>) || [];
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={(content.title as string) || ""}
                onChange={(e) => updateContent("title", e.target.value)}
              />
            </div>
            <div>
              <Label>FAQ Items</Label>
              {faqItems.map((item, index) => (
                <Card key={index} className="p-4 mt-2">
                  <div className="space-y-2">
                    <Input
                      placeholder="Question"
                      value={item.question}
                      onChange={(e) => {
                        const newItems = [...faqItems];
                        newItems[index] = { ...item, question: e.target.value };
                        updateContent("items", newItems);
                      }}
                    />
                    <Textarea
                      placeholder="Answer"
                      value={item.answer}
                      onChange={(e) => {
                        const newItems = [...faqItems];
                        newItems[index] = { ...item, answer: e.target.value };
                        updateContent("items", newItems);
                      }}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        const newItems = faqItems.filter((_, i) => i !== index);
                        updateContent("items", newItems);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </Card>
              ))}
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => {
                  updateContent("items", [...faqItems, { question: "", answer: "" }]);
                }}
              >
                <Plus size={16} className="mr-2" />
                Add FAQ
              </Button>
            </div>
          </div>
        );

      case "custom_html":
        return (
          <div className="space-y-4">
            <div>
              <Label>Custom HTML</Label>
              <Textarea
                value={(content.html as string) || ""}
                onChange={(e) => updateContent("html", e.target.value)}
                rows={10}
                className="font-mono text-sm"
              />
            </div>
            <div>
              <Label>Custom CSS</Label>
              <Textarea
                value={(content.css as string) || ""}
                onChange={(e) => updateContent("css", e.target.value)}
                rows={6}
                className="font-mono text-sm"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div>
              <Label>Raw JSON Content</Label>
              <Textarea
                value={JSON.stringify(content, null, 2)}
                onChange={(e) => {
                  try {
                    setContent(JSON.parse(e.target.value));
                  } catch {
                    // Invalid JSON, don't update
                  }
                }}
                rows={15}
                className="font-mono text-sm"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="content" className="mt-4">
          {renderEditor()}
        </TabsContent>
        <TabsContent value="settings" className="mt-4">
          <div className="space-y-4">
            <div>
              <Label>Section Name</Label>
              <Input
                value={section.section_name}
                onChange={(e) => {
                  section.section_name = e.target.value;
                }}
              />
            </div>
            <div>
              <Label>Page</Label>
              <Select
                value={section.page}
                onValueChange={(value) => {
                  section.page = value;
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="about">About</SelectItem>
                  <SelectItem value="projects">Projects</SelectItem>
                  <SelectItem value="contact">Contact</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={section.is_visible}
                onCheckedChange={(checked) => {
                  section.is_visible = checked;
                }}
              />
              <Label>Visible on site</Label>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onSave({ ...section, content })}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
