import { useState } from "react";
import {
  useAllAds,
  useAdStats,
  useCreateAd,
  useUpdateAd,
  useDeleteAd,
  Ad,
} from "@/hooks/useAds";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Trash2,
  Edit2,
  Eye,
  MousePointerClick,
  TrendingUp,
  BarChart3,
  Image,
  Code,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const defaultAd: Partial<Ad> = {
  title: "",
  ad_type: "banner",
  placement: "between-sections",
  size: "medium",
  is_active: true,
  priority: 0,
};

export default function AdminAds() {
  const { data: ads, isLoading } = useAllAds();
  const { data: stats } = useAdStats();
  const createAd = useCreateAd();
  const updateAd = useUpdateAd();
  const deleteAd = useDeleteAd();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Partial<Ad> | null>(null);
  const [formData, setFormData] = useState<Partial<Ad>>(defaultAd);

  const handleSubmit = async () => {
    if (!formData.title) {
      toast.error("Please enter an ad title");
      return;
    }

    try {
      if (editingAd?.id) {
        await updateAd.mutateAsync({ id: editingAd.id, ...formData });
        toast.success("Ad updated successfully");
      } else {
        await createAd.mutateAsync(formData);
        toast.success("Ad created successfully");
      }
      setIsDialogOpen(false);
      setEditingAd(null);
      setFormData(defaultAd);
    } catch (error) {
      toast.error("Failed to save ad");
    }
  };

  const handleEdit = (ad: Ad) => {
    setEditingAd(ad);
    setFormData(ad);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ad?")) return;
    try {
      await deleteAd.mutateAsync(id);
      toast.success("Ad deleted");
    } catch (error) {
      toast.error("Failed to delete ad");
    }
  };

  const handleToggleActive = async (ad: Ad) => {
    try {
      await updateAd.mutateAsync({ id: ad.id, is_active: !ad.is_active });
      toast.success(ad.is_active ? "Ad deactivated" : "Ad activated");
    } catch (error) {
      toast.error("Failed to update ad");
    }
  };

  const statCards = [
    {
      title: "Total Impressions",
      value: stats?.totalImpressions || 0,
      subtext: `${stats?.impressionsToday || 0} today`,
      icon: Eye,
      color: "text-blue-500",
    },
    {
      title: "Total Clicks",
      value: stats?.totalClicks || 0,
      subtext: `${stats?.clicksToday || 0} today`,
      icon: MousePointerClick,
      color: "text-green-500",
    },
    {
      title: "Click Rate (CTR)",
      value: `${stats?.ctr || 0}%`,
      subtext: "All time average",
      icon: TrendingUp,
      color: "text-purple-500",
    },
    {
      title: "Active Ads",
      value: ads?.filter((a) => a.is_active).length || 0,
      subtext: `${ads?.length || 0} total`,
      icon: BarChart3,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Ad Management</h1>
          <p className="text-muted-foreground">Manage advertisements and track performance</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingAd(null);
                setFormData(defaultAd);
              }}
            >
              <Plus className="w-4 h-4 mr-2" /> Create Ad
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingAd ? "Edit Ad" : "Create New Ad"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={formData.title || ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ad name for reference"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ad Type</Label>
                  <Select
                    value={formData.ad_type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, ad_type: value as Ad["ad_type"] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="banner">Image Banner</SelectItem>
                      <SelectItem value="adsense">Google AdSense</SelectItem>
                      <SelectItem value="affiliate">Affiliate Link</SelectItem>
                      <SelectItem value="native">Native Ad</SelectItem>
                      <SelectItem value="popup">Popup Ad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Placement</Label>
                  <Select
                    value={formData.placement}
                    onValueChange={(value) =>
                      setFormData({ ...formData, placement: value as Ad["placement"] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="header">Header</SelectItem>
                      <SelectItem value="between-sections">Between Sections</SelectItem>
                      <SelectItem value="sidebar">Sidebar</SelectItem>
                      <SelectItem value="footer">Footer</SelectItem>
                      <SelectItem value="in-article">In Article</SelectItem>
                      <SelectItem value="popup">Popup</SelectItem>
                      <SelectItem value="sticky-mobile">Sticky Mobile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Size</Label>
                  <Select
                    value={formData.size}
                    onValueChange={(value) =>
                      setFormData({ ...formData, size: value as Ad["size"] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (320x50)</SelectItem>
                      <SelectItem value="medium">Medium (468x60)</SelectItem>
                      <SelectItem value="large">Large (728x90)</SelectItem>
                      <SelectItem value="leaderboard">Leaderboard (728x90)</SelectItem>
                      <SelectItem value="rectangle">Rectangle (300x250)</SelectItem>
                      <SelectItem value="skyscraper">Skyscraper (160x600)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.ad_type === "banner" && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Image className="w-4 h-4" /> Image URL
                  </Label>
                  <Input
                    value={formData.image_url || ""}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://example.com/banner.jpg"
                  />
                </div>
              )}

              {formData.ad_type === "adsense" && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Code className="w-4 h-4" /> AdSense Slot ID
                  </Label>
                  <Input
                    value={formData.adsense_slot || ""}
                    onChange={(e) => setFormData({ ...formData, adsense_slot: e.target.value })}
                    placeholder="1234567890"
                  />
                </div>
              )}

              {(formData.ad_type === "native" || formData.ad_type === "popup") && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Code className="w-4 h-4" /> HTML Content
                  </Label>
                  <Textarea
                    value={formData.html_content || ""}
                    onChange={(e) => setFormData({ ...formData, html_content: e.target.value })}
                    placeholder="<div>Custom ad HTML...</div>"
                    rows={4}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" /> Click URL
                </Label>
                <Input
                  value={formData.click_url || ""}
                  onChange={(e) => setFormData({ ...formData, click_url: e.target.value })}
                  placeholder="https://example.com/landing-page"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority (higher = shown first)</Label>
                  <Input
                    type="number"
                    value={formData.priority || 0}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="flex items-center gap-4 pt-6">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label>Active</Label>
                </div>
              </div>

              <Button onClick={handleSubmit} disabled={createAd.isPending || updateAd.isPending}>
                {(createAd.isPending || updateAd.isPending) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {editingAd ? "Update Ad" : "Create Ad"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <Card key={i} className="glass-card border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{stat.subtext}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ads Table */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>All Advertisements</CardTitle>
          <CardDescription>Manage your ads across the site</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : !ads?.length ? (
            <div className="text-center py-8 text-muted-foreground">
              No ads created yet. Click "Create Ad" to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Placement</TableHead>
                  <TableHead>Impressions</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>CTR</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ads.map((ad) => (
                  <TableRow key={ad.id}>
                    <TableCell className="font-medium">{ad.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{ad.ad_type}</Badge>
                    </TableCell>
                    <TableCell>{ad.placement}</TableCell>
                    <TableCell>{ad.impressions.toLocaleString()}</TableCell>
                    <TableCell>{ad.clicks.toLocaleString()}</TableCell>
                    <TableCell>
                      {ad.impressions > 0
                        ? ((ad.clicks / ad.impressions) * 100).toFixed(2)
                        : "0"}
                      %
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={ad.is_active}
                        onCheckedChange={() => handleToggleActive(ad)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" onClick={() => handleEdit(ad)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(ad.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
