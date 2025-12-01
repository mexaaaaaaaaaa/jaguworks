import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Wand2, Upload, Download, Sliders, RotateCcw, Sun, Contrast, Droplets, Sparkles, ZoomIn, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Footer from "@/components/Footer";

const ImageEnhancer = () => {
  const [image, setImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    sharpness: 0,
    hue: 0,
  });

  const presets = [
    { name: "Original", filters: { brightness: 100, contrast: 100, saturation: 100, blur: 0, sharpness: 0, hue: 0 } },
    { name: "Vivid", filters: { brightness: 110, contrast: 120, saturation: 130, blur: 0, sharpness: 0, hue: 0 } },
    { name: "Warm", filters: { brightness: 105, contrast: 105, saturation: 110, blur: 0, sharpness: 0, hue: 15 } },
    { name: "Cool", filters: { brightness: 100, contrast: 110, saturation: 90, blur: 0, sharpness: 0, hue: -15 } },
    { name: "B&W", filters: { brightness: 105, contrast: 120, saturation: 0, blur: 0, sharpness: 0, hue: 0 } },
    { name: "Vintage", filters: { brightness: 95, contrast: 90, saturation: 80, blur: 0, sharpness: 0, hue: 20 } },
    { name: "HDR", filters: { brightness: 110, contrast: 140, saturation: 120, blur: 0, sharpness: 50, hue: 0 } },
    { name: "Soft", filters: { brightness: 105, contrast: 90, saturation: 95, blur: 1, sharpness: 0, hue: 0 } },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image too large. Max 10MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setImage(dataUrl);
        setOriginalImage(dataUrl);
        setFilters({ brightness: 100, contrast: 100, saturation: 100, blur: 0, sharpness: 0, hue: 0 });
        toast.success("Image uploaded!");
      };
      reader.readAsDataURL(file);
    }
  };

  const getFilterStyle = () => {
    return {
      filter: `
        brightness(${filters.brightness}%)
        contrast(${filters.contrast}%)
        saturate(${filters.saturation}%)
        blur(${filters.blur}px)
        hue-rotate(${filters.hue}deg)
      `.trim(),
    };
  };

  const applyPreset = (preset: typeof presets[0]) => {
    setFilters(preset.filters);
    toast.success(`Applied "${preset.name}" preset`);
  };

  const resetFilters = () => {
    setFilters({ brightness: 100, contrast: 100, saturation: 100, blur: 0, sharpness: 0, hue: 0 });
    toast.info("Filters reset");
  };

  const downloadImage = async () => {
    if (!image) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new window.Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (ctx) {
        ctx.filter = `
          brightness(${filters.brightness}%)
          contrast(${filters.contrast}%)
          saturate(${filters.saturation}%)
          blur(${filters.blur}px)
          hue-rotate(${filters.hue}deg)
        `.trim();
        ctx.drawImage(img, 0, 0);
        
        const link = document.createElement('a');
        link.download = `enhanced-image-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        toast.success("Image downloaded!");
      }
    };
    
    img.src = image;
  };

  const filterControls = [
    { key: "brightness", label: "Brightness", icon: Sun, min: 0, max: 200, step: 1 },
    { key: "contrast", label: "Contrast", icon: Contrast, min: 0, max: 200, step: 1 },
    { key: "saturation", label: "Saturation", icon: Droplets, min: 0, max: 200, step: 1 },
    { key: "hue", label: "Hue Rotate", icon: Sparkles, min: -180, max: 180, step: 1 },
    { key: "blur", label: "Blur", icon: ZoomIn, min: 0, max: 10, step: 0.1 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center"
            >
              <Wand2 className="w-10 h-10 text-blue-500" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Image Enhancer
            </h1>
            <p className="text-muted-foreground text-lg">
              Enhance your photos with powerful editing tools
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Image Preview */}
            <div className="lg:col-span-2">
              <Card className="glass-card overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-video bg-gradient-to-br from-accent/20 to-background flex items-center justify-center">
                    {image ? (
                      <img
                        src={image}
                        alt="Preview"
                        className="max-w-full max-h-full object-contain"
                        style={getFilterStyle()}
                      />
                    ) : (
                      <div className="text-center p-8">
                        <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground mb-4">Upload an image to start editing</p>
                        <Button onClick={() => fileInputRef.current?.click()}>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Image
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              {image && (
                <div className="flex flex-wrap gap-3 mt-4">
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Change Image
                  </Button>
                  <Button onClick={resetFilters} variant="outline">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                  <Button onClick={downloadImage}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Controls */}
            <div className="space-y-6">
              {/* Presets */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Presets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {presets.map((preset) => (
                      <Button
                        key={preset.name}
                        variant="outline"
                        size="sm"
                        onClick={() => applyPreset(preset)}
                        className="w-full"
                      >
                        {preset.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Adjustments */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-primary" />
                    Adjustments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {filterControls.map((control) => (
                    <div key={control.key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2 text-sm">
                          <control.icon className="w-4 h-4 text-muted-foreground" />
                          {control.label}
                        </Label>
                        <span className="text-sm text-muted-foreground">
                          {filters[control.key as keyof typeof filters]}
                          {control.key === "hue" ? "°" : control.key === "blur" ? "px" : "%"}
                        </span>
                      </div>
                      <Slider
                        value={[filters[control.key as keyof typeof filters]]}
                        onValueChange={([value]) => setFilters(prev => ({ ...prev, [control.key]: value }))}
                        min={control.min}
                        max={control.max}
                        step={control.step}
                        className="w-full"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="glass-card">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    💡 <strong>Tip:</strong> Try the "HDR" preset for stunning landscape photos, or "Vintage" for a retro look!
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default ImageEnhancer;
