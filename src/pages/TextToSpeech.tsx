import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Volume2, Play, Pause, Download, Settings2, Mic2, Languages, Gauge, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Footer from "@/components/Footer";

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load voices
  useState(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !voice) {
        setVoice(availableVoices[0].name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  });

  const speak = () => {
    if (!text.trim()) {
      toast.error("Please enter some text to speak");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Set voice
    const selectedVoice = voices.find(v => v.name === voice);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Set properties
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    // Events
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => {
      setIsPlaying(false);
      toast.error("Speech synthesis error");
    };

    window.speechSynthesis.speak(utterance);
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setIsPlaying(false);
  };

  const resume = () => {
    window.speechSynthesis.resume();
    setIsPlaying(true);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (window.speechSynthesis.paused) {
      resume();
    } else if (isPlaying) {
      pause();
    } else {
      speak();
    }
  };

  const downloadAudio = async () => {
    toast.info("Audio download requires server-side processing. Coming soon!");
  };

  const sampleTexts = [
    "Hello! Welcome to JaguWorks. This is a text to speech demo.",
    "The quick brown fox jumps over the lazy dog.",
    "In a world full of noise, sometimes silence speaks the loudest.",
    "Technology is best when it brings people together.",
  ];

  const charCount = text.length;
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

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
              className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center"
            >
              <Volume2 className="w-10 h-10 text-violet-500" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Text to Speech
            </h1>
            <p className="text-muted-foreground text-lg">
              Convert your text into natural sounding speech
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Text Input */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Enter Text</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {wordCount} words | {charCount} chars
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type or paste your text here..."
                    className="min-h-[200px] bg-background/50 resize-none"
                    maxLength={5000}
                  />

                  {/* Quick Samples */}
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Quick samples:</p>
                    <div className="flex flex-wrap gap-2">
                      {sampleTexts.map((sample, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          onClick={() => setText(sample)}
                          className="text-xs"
                        >
                          Sample {i + 1}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Controls */}
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <Button
                      size="lg"
                      onClick={togglePlayPause}
                      className="min-w-[140px]"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-5 h-5 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5 mr-2" />
                          Play
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      onClick={stop}
                      disabled={!isPlaying}
                    >
                      Stop
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      onClick={downloadAudio}
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Settings */}
            <div className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings2 className="w-5 h-5 text-primary" />
                    Voice Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Voice Selection */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Mic2 className="w-4 h-4 text-muted-foreground" />
                      Voice
                    </Label>
                    <Select value={voice} onValueChange={setVoice}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select voice" />
                      </SelectTrigger>
                      <SelectContent>
                        {voices.map((v) => (
                          <SelectItem key={v.name} value={v.name}>
                            {v.name} ({v.lang})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Rate */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-muted-foreground" />
                        Speed
                      </Label>
                      <span className="text-sm text-muted-foreground">{rate}x</span>
                    </div>
                    <Slider
                      value={[rate]}
                      onValueChange={([v]) => setRate(v)}
                      min={0.5}
                      max={2}
                      step={0.1}
                    />
                  </div>

                  {/* Pitch */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Languages className="w-4 h-4 text-muted-foreground" />
                        Pitch
                      </Label>
                      <span className="text-sm text-muted-foreground">{pitch}</span>
                    </div>
                    <Slider
                      value={[pitch]}
                      onValueChange={([v]) => setPitch(v)}
                      min={0.5}
                      max={2}
                      step={0.1}
                    />
                  </div>

                  {/* Volume */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-muted-foreground" />
                        Volume
                      </Label>
                      <span className="text-sm text-muted-foreground">{Math.round(volume * 100)}%</span>
                    </div>
                    <Slider
                      value={[volume]}
                      onValueChange={([v]) => setVolume(v)}
                      min={0}
                      max={1}
                      step={0.1}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Info */}
              <Card className="glass-card">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    💡 <strong>Tip:</strong> Different voices support different languages. Try selecting a voice that matches your text language for best results.
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

export default TextToSpeech;
