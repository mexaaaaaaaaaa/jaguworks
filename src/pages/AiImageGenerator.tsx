import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wand2, Download, Loader2, ImageIcon, Copy, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const STYLE_PRESETS = [
  { value: 'realistic', label: '📷 Realistic' },
  { value: 'anime', label: '🎨 Anime' },
  { value: 'digital-art', label: '🖼️ Digital Art' },
  { value: 'oil-painting', label: '🎨 Oil Painting' },
  { value: 'watercolor', label: '💧 Watercolor' },
  { value: 'sketch', label: '✏️ Sketch' },
  { value: '3d-render', label: '🎮 3D Render' },
  { value: 'cyberpunk', label: '🌃 Cyberpunk' },
  { value: 'fantasy', label: '🧙 Fantasy' },
  { value: 'minimalist', label: '⬜ Minimalist' },
];

export default function AiImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [gallery, setGallery] = useState<{ prompt: string; image: string }[]>([]);

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setLoading(true);
    setGeneratedImage(null);

    try {
      const stylePrompt = style !== 'realistic' ? `, ${style} style` : '';
      const fullPrompt = `${prompt}${stylePrompt}, high quality, detailed`;

      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt: fullPrompt },
      });

      if (error) throw error;

      if (data?.image) {
        setGeneratedImage(data.image);
        setGallery(prev => [{ prompt: prompt, image: data.image }, ...prev.slice(0, 5)]);
        toast.success('Image generated successfully!');
      } else {
        throw new Error('No image returned');
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      toast.error('Failed to generate image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateImage();
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `jaguworks-ai-${Date.now()}.png`;
    link.click();
    toast.success('Image downloaded!');
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    toast.success('Prompt copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 mb-4">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span className="text-sm text-pink-500 font-medium">AI Image Tool</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
              AI Image <span className="text-pink-500">Generator</span>
            </h1>
            <p className="text-muted-foreground">
              Create stunning images from text descriptions using AI
            </p>
          </motion.div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-purple-500/5 pointer-events-none" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Wand2 className="w-5 h-5 text-pink-500" />
                  Create Your Image
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-4">
                {/* Prompt Input */}
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Describe your image</label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="A majestic dragon flying over a medieval castle at sunset..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="h-12 bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copyPrompt}
                      disabled={!prompt}
                      className="absolute right-1 top-1/2 -translate-y-1/2"
                    >
                      {copied ? <CheckCircle2 className="w-4 h-4 text-pink-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Style Select */}
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Art Style</label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger className="h-12 bg-background/50 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STYLE_PRESETS.map((preset) => (
                        <SelectItem key={preset.value} value={preset.value}>
                          {preset.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={generateImage}
                  disabled={loading || !prompt.trim()}
                  className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Image
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Loading State */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6"
              >
                <Card className="bg-card/50 backdrop-blur-xl border-border/50">
                  <CardContent className="py-16 flex flex-col items-center justify-center">
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-pink-500/20 rounded-full" />
                      <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-pink-500 rounded-full animate-spin" />
                      <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-pink-500 animate-pulse" />
                    </div>
                    <p className="mt-6 text-muted-foreground">Creating your masterpiece...</p>
                    <p className="text-sm text-muted-foreground/70">This may take 10-30 seconds</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generated Image */}
          <AnimatePresence>
            {generatedImage && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6"
              >
                <Card className="bg-card/50 backdrop-blur-xl border-border/50 overflow-hidden">
                  <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 p-4">
                    <div className="flex items-center justify-center gap-2 text-white">
                      <ImageIcon className="w-5 h-5" />
                      <h3 className="font-bold text-lg">Your Generated Image</h3>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="relative rounded-xl overflow-hidden bg-muted aspect-square max-w-md mx-auto">
                      <img
                        src={generatedImage}
                        alt="Generated AI art"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex justify-center gap-4 mt-6">
                      <Button
                        onClick={downloadImage}
                        className="bg-pink-500 hover:bg-pink-600 text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        onClick={generateImage}
                        className="border-pink-500/30 text-pink-500 hover:bg-pink-500/10"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Regenerate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Gallery */}
          {gallery.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">Recent Generations</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.slice(1).map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative rounded-xl overflow-hidden bg-muted aspect-square cursor-pointer hover:ring-2 ring-pink-500 transition-all"
                    onClick={() => setGeneratedImage(item.image)}
                  >
                    <img
                      src={item.image}
                      alt={item.prompt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-2">
                      <p className="text-xs text-white line-clamp-2">{item.prompt}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-muted-foreground">
              🎨 Powered by AI • Images are generated using Lovable AI
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              ⚡ Powered by <span className="text-pink-500 font-semibold">JaguWorks</span>
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
