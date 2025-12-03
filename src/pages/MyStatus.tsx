import { useState } from "react";
import { motion } from "framer-motion";
import { Share2, Copy, Heart, MessageCircle, Send, Image, Video, Music, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Footer from "@/components/Footer";

const MyStatus = () => {
  const [statusText, setStatusText] = useState("");
  const [statusType, setStatusType] = useState<"text" | "image" | "video">("text");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const statusTemplates = [
    { emoji: "🔥", text: "Feeling motivated today!" },
    { emoji: "💼", text: "Busy with work, will reply later" },
    { emoji: "🎮", text: "Gaming mode: ON" },
    { emoji: "📚", text: "Learning something new" },
    { emoji: "🌙", text: "Do not disturb" },
    { emoji: "✈️", text: "Traveling, limited connectivity" },
    { emoji: "🎉", text: "Celebrating good times!" },
    { emoji: "💪", text: "Workout time!" },
  ];

  const generateShareLink = () => {
    if (!statusText.trim()) {
      toast.error("Please enter a status message");
      return;
    }
    const encodedStatus = encodeURIComponent(statusText);
    const link = `${window.location.origin}/#/status/view?text=${encodedStatus}`;
    setGeneratedLink(link);
    toast.success("Share link generated!");
  };

  const copyToClipboard = async () => {
    if (generatedLink) {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareToSocial = (platform: string) => {
    const text = encodeURIComponent(statusText);
    const url = encodeURIComponent(generatedLink || window.location.href);
    
    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
            >
              <Share2 className="w-10 h-10 text-primary" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              My Status
            </h1>
            <p className="text-muted-foreground text-lg">
              Create and share your status across all platforms
            </p>
          </div>

          {/* Status Creator */}
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Create Your Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Type Tabs */}
              <Tabs defaultValue="text" onValueChange={(v) => setStatusType(v as any)}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="text" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Text
                  </TabsTrigger>
                  <TabsTrigger value="image" className="flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    Image
                  </TabsTrigger>
                  <TabsTrigger value="video" className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Video
                  </TabsTrigger>
                  <TabsTrigger value="music" className="flex items-center gap-2">
                    <Music className="w-4 h-4" />
                    Music
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="space-y-4 mt-4">
                  <Textarea
                    placeholder="What's on your mind?"
                    value={statusText}
                    onChange={(e) => setStatusText(e.target.value)}
                    className="min-h-[120px] bg-background/50"
                    maxLength={280}
                  />
                  <div className="text-right text-sm text-muted-foreground">
                    {statusText.length}/280
                  </div>
                </TabsContent>

                <TabsContent value="image" className="mt-4">
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                    <Image className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">Drag & drop an image or click to upload</p>
                    <Input type="file" accept="image/*" className="hidden" id="image-upload" />
                    <Button variant="outline" onClick={() => document.getElementById("image-upload")?.click()}>
                      Choose Image
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="video" className="mt-4">
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                    <Video className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">Upload a video for your status</p>
                    <Input type="file" accept="video/*" className="hidden" id="video-upload" />
                    <Button variant="outline" onClick={() => document.getElementById("video-upload")?.click()}>
                      Choose Video
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="music" className="mt-4">
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                    <Music className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">Add music to your status</p>
                    <Input type="file" accept="audio/*" className="hidden" id="music-upload" />
                    <Button variant="outline" onClick={() => document.getElementById("music-upload")?.click()}>
                      Choose Audio
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Quick Templates */}
              <div>
                <h4 className="text-sm font-medium mb-3">Quick Templates</h4>
                <div className="flex flex-wrap gap-2">
                  {statusTemplates.map((template, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setStatusText(template.emoji + " " + template.text)}
                      className="px-3 py-2 rounded-full bg-accent/50 hover:bg-accent text-sm transition-colors"
                    >
                      {template.emoji} {template.text}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Generate Link Button */}
              <Button onClick={generateShareLink} className="w-full" size="lg">
                <Send className="w-4 h-4 mr-2" />
                Generate Share Link
              </Button>

              {/* Generated Link */}
              {generatedLink && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-accent/30 border border-border"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Input value={generatedLink} readOnly className="bg-background/50" />
                    <Button variant="outline" size="icon" onClick={copyToClipboard}>
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  
                  {/* Social Share Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => shareToSocial("whatsapp")} className="bg-green-500/10 hover:bg-green-500/20 border-green-500/30">
                      WhatsApp
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => shareToSocial("telegram")} className="bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30">
                      Telegram
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => shareToSocial("twitter")} className="bg-sky-500/10 hover:bg-sky-500/20 border-sky-500/30">
                      Twitter
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => shareToSocial("facebook")} className="bg-blue-600/10 hover:bg-blue-600/20 border-blue-600/30">
                      Facebook
                    </Button>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Heart, label: "Likes", value: "0" },
              { icon: Share2, label: "Shares", value: "0" },
              { icon: MessageCircle, label: "Views", value: "0" },
              { icon: Send, label: "Sent", value: "0" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="glass-card text-center">
                  <CardContent className="pt-6">
                    <stat.icon className="w-8 h-8 mx-auto text-primary mb-2" />
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default MyStatus;
