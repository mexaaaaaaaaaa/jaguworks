import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Search, MapPin, Building2, Clock, Shield, Loader2, CheckCircle2, X, Wifi, LocateFixed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

interface IpResult {
  ip: string;
  city: string;
  region: string;
  country: string;
  country_name: string;
  continent_code: string;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string;
  languages: string;
  asn: string;
  org: string;
}

export default function IpTracker() {
  const [ip, setIp] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IpResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (targetIp?: string) => {
    const ipToTrack = targetIp || ip;
    
    if (ipToTrack && !/^(\d{1,3}\.){3}\d{1,3}$/.test(ipToTrack)) {
      toast.error('Please enter a valid IP address');
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const url = ipToTrack 
        ? `https://ipapi.co/${ipToTrack}/json/`
        : 'https://ipapi.co/json/';
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        setError(data.reason || 'Failed to fetch IP information');
        toast.error('Failed to fetch IP data');
      } else {
        setResult(data);
        toast.success('IP information found!');
      }
    } catch (err) {
      setError('Error fetching data. Please try again.');
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTrack();
    }
  };

  const infoFields = [
    { key: 'ip', label: 'IP Address', icon: Globe },
    { key: 'city', label: 'City', icon: MapPin },
    { key: 'region', label: 'Region', icon: MapPin },
    { key: 'country_name', label: 'Country', icon: MapPin },
    { key: 'postal', label: 'Postal Code', icon: MapPin },
    { key: 'timezone', label: 'Timezone', icon: Clock },
    { key: 'utc_offset', label: 'UTC Offset', icon: Clock },
    { key: 'org', label: 'ISP / Organization', icon: Building2 },
    { key: 'asn', label: 'ASN', icon: Shield },
    { key: 'country_calling_code', label: 'Calling Code', icon: Wifi },
    { key: 'currency', label: 'Currency', icon: Building2 },
    { key: 'languages', label: 'Languages', icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
              <Globe className="w-4 h-4 text-cyan-500" />
              <span className="text-sm text-cyan-500 font-medium">IP Lookup Tool</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
              IP Address <span className="text-cyan-500">Tracker</span>
            </h1>
            <p className="text-muted-foreground">
              Get location, ISP, and network information for any IP address
            </p>
          </motion.div>

          {/* Search Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Search className="w-5 h-5 text-cyan-500" />
                  Track IP Address
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Enter IP address (e.g., 8.8.8.8)..."
                      value={ip}
                      onChange={(e) => setIp(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pl-10 h-12 bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <Button
                    onClick={() => handleTrack()}
                    disabled={loading}
                    className="h-12 px-6 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Track
                      </>
                    )}
                  </Button>
                </div>

                {/* Auto-detect button */}
                <Button
                  variant="outline"
                  onClick={() => handleTrack('')}
                  disabled={loading}
                  className="w-full h-10 border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/10"
                >
                  <LocateFixed className="w-4 h-4 mr-2" />
                  Detect My IP Address
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
                  <CardContent className="py-12 flex flex-col items-center justify-center">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-cyan-500/20 rounded-full" />
                      <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-cyan-500 rounded-full animate-spin" />
                    </div>
                    <p className="mt-4 text-muted-foreground">Locating IP address...</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error State */}
          <AnimatePresence>
            {error && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6"
              >
                <Card className="bg-destructive/10 border-destructive/30">
                  <CardContent className="py-6 flex items-center gap-3">
                    <div className="p-2 rounded-full bg-destructive/20">
                      <X className="w-5 h-5 text-destructive" />
                    </div>
                    <p className="text-destructive">{error}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence>
            {result && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6"
              >
                <Card className="bg-card/50 backdrop-blur-xl border-border/50 overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 p-4">
                    <div className="flex items-center justify-center gap-2 text-white">
                      <CheckCircle2 className="w-5 h-5" />
                      <h3 className="font-bold text-lg">IP Information Found</h3>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-3">
                    {/* Coordinates */}
                    {result.latitude && result.longitude && (
                      <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-cyan-500/20">
                            <MapPin className="w-5 h-5 text-cyan-500" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Coordinates</p>
                            <p className="text-foreground font-semibold">{result.latitude}, {result.longitude}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Info Fields */}
                    <div className="grid gap-3">
                      {infoFields.map(({ key, label, icon: Icon }) => {
                        const value = result[key as keyof IpResult];
                        if (!value) return null;
                        
                        return (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-4 rounded-xl bg-background/50 border border-border/50 hover:border-cyan-500/30 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-muted">
                                <Icon className="w-4 h-4 text-muted-foreground" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground">{label}</p>
                                <p className="text-foreground font-medium truncate">{String(value)}</p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Footer */}
                    <div className="mt-6 p-4 rounded-xl bg-muted/50 text-center">
                      <p className="text-sm text-muted-foreground">
                        ⚡ Powered by <span className="text-cyan-500 font-semibold">JaguWorks</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
