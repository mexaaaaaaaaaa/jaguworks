import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AtSign, Search, CheckCircle2, XCircle, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

interface PlatformResult {
  name: string;
  url: string;
  icon: string;
  available: boolean | null;
  checking: boolean;
}

const PLATFORMS = [
  { name: 'GitHub', url: 'https://github.com/', icon: '🐙' },
  { name: 'Twitter/X', url: 'https://x.com/', icon: '🐦' },
  { name: 'Instagram', url: 'https://instagram.com/', icon: '📸' },
  { name: 'TikTok', url: 'https://tiktok.com/@', icon: '🎵' },
  { name: 'YouTube', url: 'https://youtube.com/@', icon: '📺' },
  { name: 'Twitch', url: 'https://twitch.tv/', icon: '🎮' },
  { name: 'Reddit', url: 'https://reddit.com/user/', icon: '🤖' },
  { name: 'Pinterest', url: 'https://pinterest.com/', icon: '📌' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/', icon: '💼' },
  { name: 'Discord', url: 'https://discord.com/users/', icon: '💬' },
  { name: 'Telegram', url: 'https://t.me/', icon: '✈️' },
  { name: 'Medium', url: 'https://medium.com/@', icon: '📝' },
  { name: 'Dev.to', url: 'https://dev.to/', icon: '👨‍💻' },
  { name: 'Dribbble', url: 'https://dribbble.com/', icon: '🏀' },
  { name: 'Behance', url: 'https://behance.net/', icon: '🎨' },
  { name: 'Spotify', url: 'https://open.spotify.com/user/', icon: '🎧' },
  { name: 'SoundCloud', url: 'https://soundcloud.com/', icon: '🔊' },
  { name: 'Steam', url: 'https://steamcommunity.com/id/', icon: '🎲' },
  { name: 'Patreon', url: 'https://patreon.com/', icon: '❤️' },
  { name: 'Snapchat', url: 'https://snapchat.com/add/', icon: '👻' },
];

export default function UsernameChecker() {
  const [username, setUsername] = useState('');
  const [results, setResults] = useState<PlatformResult[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const checkUsername = async () => {
    if (!username.trim()) {
      toast.error('Please enter a username');
      return;
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
      toast.error('Username can only contain letters, numbers, dots, dashes, and underscores');
      return;
    }

    setIsChecking(true);
    const initialResults: PlatformResult[] = PLATFORMS.map(p => ({
      ...p,
      available: null,
      checking: true,
    }));
    setResults(initialResults);

    // Simulate checking with random results (real implementation would need CORS proxies)
    for (let i = 0; i < PLATFORMS.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
      
      setResults(prev => prev.map((r, index) => {
        if (index === i) {
          // Simulate random availability (in real app, would check actual availability)
          const isAvailable = Math.random() > 0.5;
          return { ...r, available: isAvailable, checking: false };
        }
        return r;
      }));
    }

    setIsChecking(false);
    toast.success('Username check complete!');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkUsername();
    }
  };

  const availableCount = results.filter(r => r.available === true).length;
  const takenCount = results.filter(r => r.available === false).length;

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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
              <AtSign className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-purple-500 font-medium">Username OSINT Tool</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
              Username <span className="text-purple-500">Checker</span>
            </h1>
            <p className="text-muted-foreground">
              Check username availability across 20+ social platforms
            </p>
          </motion.div>

          {/* Search Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 pointer-events-none" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Search className="w-5 h-5 text-purple-500" />
                  Check Username Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Enter username to check..."
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase())}
                      onKeyPress={handleKeyPress}
                      className="pl-10 h-12 bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <Button
                    onClick={checkUsername}
                    disabled={isChecking}
                    className="h-12 px-6 bg-purple-500 hover:bg-purple-600 text-white font-semibold"
                  >
                    {isChecking ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Check
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Supports letters, numbers, dots, dashes, and underscores
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats */}
          <AnimatePresence>
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 grid grid-cols-2 gap-4"
              >
                <Card className="bg-green-500/10 border-green-500/30">
                  <CardContent className="py-4 flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-green-500 font-bold text-lg">{availableCount}</span>
                    <span className="text-green-500/70">Available</span>
                  </CardContent>
                </Card>
                <Card className="bg-red-500/10 border-red-500/30">
                  <CardContent className="py-4 flex items-center justify-center gap-2">
                    <XCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-500 font-bold text-lg">{takenCount}</span>
                    <span className="text-red-500/70">Taken</span>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Grid */}
          <AnimatePresence>
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {results.map((platform, index) => (
                  <motion.div
                    key={platform.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`bg-card/50 backdrop-blur-xl border-border/50 overflow-hidden transition-all duration-300 ${
                      platform.available === true ? 'border-green-500/50 hover:border-green-500' :
                      platform.available === false ? 'border-red-500/50 hover:border-red-500' :
                      'border-border/50'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{platform.icon}</span>
                            <div>
                              <p className="font-medium text-foreground">{platform.name}</p>
                              <p className="text-xs text-muted-foreground">@{username}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {platform.checking ? (
                              <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                            ) : platform.available === true ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : platform.available === false ? (
                              <XCircle className="w-5 h-5 text-red-500" />
                            ) : null}
                            <a
                              href={`${platform.url}${username}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4 text-muted-foreground" />
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer info */}
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 text-center"
            >
              <p className="text-sm text-muted-foreground">
                ⚠️ Results are simulated for demo. Click links to verify manually.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                ⚡ Powered by <span className="text-purple-500 font-semibold">JaguWorks</span>
              </p>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
