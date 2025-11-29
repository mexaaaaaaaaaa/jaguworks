import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
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
} from "lucide-react";
import { toast } from "sonner";

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

export default function AdminSectionBuilder() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<DynamicSection | null>(null);
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
    mutationFn: async (section: typeof newSection) => {
      const maxOrder = sections?.length ? Math.max(...sections.map(s => s.order_index)) + 1 : 0;
      const { error } = await supabase.from("dynamic_sections").insert({
        section_name: section.section_name,
        slug: section.slug,
        layout_type: section.layout_type,
        page: section.page,
        content: getDefaultContent(section.layout_type) as unknown as Record<string, never>,
        order_index: maxOrder,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dynamic-sections"] });
      setIsCreateOpen(false);
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

  const handleCreateSection = () => {
    if (!newSection.section_name || !newSection.slug) {
      toast.error("Please fill in all required fields");
      return;
    }
    createMutation.mutate(newSection);
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

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
          <h1 className="text-3xl font-bold">Section Builder</h1>
          <p className="text-muted-foreground">Create and manage dynamic sections for your portfolio</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={20} />
              New Section
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Section</DialogTitle>
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

      {/* Sections Grid */}
      <div className="grid gap-4">
        {sections?.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No sections yet. Create your first section!</p>
          </Card>
        ) : (
          sections?.map((section) => (
            <Card key={section.id} className={`transition-all ${!section.is_visible ? "opacity-60" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="cursor-grab p-2 hover:bg-muted rounded">
                    <GripVertical size={20} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{section.section_name}</h3>
                      <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                        {LAYOUT_TYPES.find(t => t.value === section.layout_type)?.label}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-muted">
                        {section.page}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">/{section.slug}</p>
                  </div>
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

      case "text_image":
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
                rows={4}
              />
            </div>
            <div>
              <Label>Image URL</Label>
              <Input
                value={(content.image_url as string) || ""}
                onChange={(e) => updateContent("image_url", e.target.value)}
              />
            </div>
            <div>
              <Label>Image Position</Label>
              <Select
                value={(content.image_position as string) || "right"}
                onValueChange={(value) => updateContent("image_position", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "cards_grid":
        const cards = (content.cards as Array<{ title: string; description: string; icon: string; link: string }>) || [];
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
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
            <div className="space-y-4">
              <Label>Cards</Label>
              {cards.map((card, index) => (
                <Card key={index} className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Card {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newCards = cards.filter((_, i) => i !== index);
                        updateContent("cards", newCards);
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  <Input
                    placeholder="Title"
                    value={card.title}
                    onChange={(e) => {
                      const newCards = [...cards];
                      newCards[index] = { ...card, title: e.target.value };
                      updateContent("cards", newCards);
                    }}
                  />
                  <Textarea
                    placeholder="Description"
                    value={card.description}
                    onChange={(e) => {
                      const newCards = [...cards];
                      newCards[index] = { ...card, description: e.target.value };
                      updateContent("cards", newCards);
                    }}
                  />
                  <Input
                    placeholder="Icon (lucide icon name)"
                    value={card.icon}
                    onChange={(e) => {
                      const newCards = [...cards];
                      newCards[index] = { ...card, icon: e.target.value };
                      updateContent("cards", newCards);
                    }}
                  />
                  <Input
                    placeholder="Link URL"
                    value={card.link}
                    onChange={(e) => {
                      const newCards = [...cards];
                      newCards[index] = { ...card, link: e.target.value };
                      updateContent("cards", newCards);
                    }}
                  />
                </Card>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  updateContent("cards", [...cards, { title: "", description: "", icon: "", link: "" }]);
                }}
              >
                <Plus size={16} className="mr-2" /> Add Card
              </Button>
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
              <Textarea
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
              <Label>CTA Button Link</Label>
              <Input
                value={(content.cta_link as string) || ""}
                onChange={(e) => updateContent("cta_link", e.target.value)}
              />
            </div>
          </div>
        );

      case "faq":
        const faqs = (content.items as Array<{ question: string; answer: string }>) || [];
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input
                value={(content.title as string) || ""}
                onChange={(e) => updateContent("title", e.target.value)}
              />
            </div>
            <div className="space-y-4">
              <Label>FAQ Items</Label>
              {faqs.map((faq, index) => (
                <Card key={index} className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Question {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newFaqs = faqs.filter((_, i) => i !== index);
                        updateContent("items", newFaqs);
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  <Input
                    placeholder="Question"
                    value={faq.question}
                    onChange={(e) => {
                      const newFaqs = [...faqs];
                      newFaqs[index] = { ...faq, question: e.target.value };
                      updateContent("items", newFaqs);
                    }}
                  />
                  <Textarea
                    placeholder="Answer"
                    value={faq.answer}
                    onChange={(e) => {
                      const newFaqs = [...faqs];
                      newFaqs[index] = { ...faq, answer: e.target.value };
                      updateContent("items", newFaqs);
                    }}
                  />
                </Card>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  updateContent("items", [...faqs, { question: "", answer: "" }]);
                }}
              >
                <Plus size={16} className="mr-2" /> Add FAQ
              </Button>
            </div>
          </div>
        );

      case "custom_html":
        return (
          <div className="space-y-4">
            <div>
              <Label>HTML Content</Label>
              <Textarea
                value={(content.html as string) || ""}
                onChange={(e) => updateContent("html", e.target.value)}
                rows={10}
                className="font-mono text-sm"
                placeholder="<div>Your custom HTML here...</div>"
              />
            </div>
            <div>
              <Label>Custom CSS</Label>
              <Textarea
                value={(content.css as string) || ""}
                onChange={(e) => updateContent("css", e.target.value)}
                rows={6}
                className="font-mono text-sm"
                placeholder=".custom-class { color: red; }"
              />
            </div>
          </div>
        );

      default:
        return (
          <div>
            <Label>Raw JSON Content</Label>
            <Textarea
              value={JSON.stringify(content, null, 2)}
              onChange={(e) => {
                try {
                  setContent(JSON.parse(e.target.value));
                } catch {}
              }}
              rows={15}
              className="font-mono text-sm"
            />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {renderEditor()}
      <div className="flex gap-4 justify-end">
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
