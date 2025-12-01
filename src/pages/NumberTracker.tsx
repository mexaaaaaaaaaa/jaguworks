import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Search, User, Mail, MapPin, Building2, Shield, Loader2, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

interface TrackerResult {
  name?: string;
  father_name?: string;
  mobile?: string;
  alt_mobile?: string;
  email?: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  id_number?: string;
  circle?: string;
  id?: string;
}

export default function NumberTracker() {
  const [number, setNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackerResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDisclaimer(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleTrack = async () => {
    if (number.length !== 10 || isNaN(Number(number))) {
      toast.error('Please enter a valid 10 digit mobile number');
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch(`https://splexxo-bhai.vercel.app/api/seller?mobile=${number}&key=SPLEXXO`);
      const data = await response.json();

      if (data.success && data.data) {
        const userData = data.data;
        if (hasValidData(userData)) {
          setResult(userData);
          toast.success('Information found successfully!');
        } else {
          setError('No valid information found for this number');
        }
      } else if (data.data && hasValidData(data.data)) {
        setResult(data.data);
        toast.success('Information found successfully!');
      } else {
        setError(data.message || 'No information found for this mobile number');
      }
    } catch (err) {
      setError('Error fetching data. Please try again.');
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const hasValidData = (data: TrackerResult) => {
    if (!data) return false;
    const fields: (keyof TrackerResult)[] = ['name', 'mobile', 'email', 'address', 'city', 'state', 'company'];
    return fields.some(field => data[field] && data[field] !== 'N/A' && data[field] !== 'null');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTrack();
    }
  };

  const infoFields = [
    { key: 'name', label: 'Name', icon: User },
    { key: 'father_name', label: 'Father Name', icon: User },
    { key: 'mobile', label: 'Mobile', icon: Phone },
    { key: 'alt_mobile', label: 'Alternate Mobile', icon: Phone },
    { key: 'email', label: 'Email', icon: Mail },
    { key: 'company', label: 'Company', icon: Building2 },
    { key: 'address', label: 'Address', icon: MapPin },
    { key: 'city', label: 'City', icon: MapPin },
    { key: 'state', label: 'State', icon: MapPin },
    { key: 'pincode', label: 'Pincode', icon: MapPin },
    { key: 'id_number', label: 'Aadhar Number', icon: Shield },
    { key: 'circle', label: 'Circle', icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Disclaimer Popup */}
      <AnimatePresence>
        {showDisclaimer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-lg w-full bg-card/80 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-yellow-500/20">
                  <AlertTriangle className="w-6 h-6 text-yellow-500" />
                </div>
                <h2 className="text-xl font-bold text-foreground">⚠️ Disclaimer</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm">
                This tool is created for <span className="text-primary font-semibold">educational and legal purposes only</span>. 
                All information shown is based on publicly available sources. 
                Using this tool to harass, stalk, threaten, harm, or engage in any illegal activity is strictly prohibited. 
                The developer is not responsible for any misuse or illegal actions by users.
                If you do not agree to these terms, please do not use this tool.
              </p>
              <Button 
                onClick={() => setShowDisclaimer(false)}
                className="w-full mt-4 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500 border border-yellow-500/30"
              >
                I Understand & Agree
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Phone className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Mobile Tracker Tool</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
              Number <span className="text-primary">Tracker</span>
            </h1>
            <p className="text-muted-foreground">
              Get publicly available information about any mobile number
            </p>
          </motion.div>

          {/* Search Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Search className="w-5 h-5 text-primary" />
                  Track Mobile Number
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder="Enter 10 digit mobile number..."
                      value={number}
                      onChange={(e) => setNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      onKeyPress={handleKeyPress}
                      className="pl-10 h-12 bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground"
                      maxLength={10}
                    />
                  </div>
                  <Button
                    onClick={handleTrack}
                    disabled={loading || number.length !== 10}
                    className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
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

                {/* Character count */}
                <p className="text-xs text-muted-foreground text-right">
                  {number.length}/10 digits
                </p>
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
                      <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
                      <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full animate-spin" />
                    </div>
                    <p className="mt-4 text-muted-foreground">Searching database...</p>
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
                  <div className="bg-gradient-to-r from-primary via-accent to-primary p-4">
                    <div className="flex items-center justify-center gap-2 text-primary-foreground">
                      <CheckCircle2 className="w-5 h-5" />
                      <h3 className="font-bold text-lg">Information Found</h3>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-3">
                    {/* Target Number */}
                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/20">
                          <Phone className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Target Number</p>
                          <p className="text-foreground font-semibold">+91 {number}</p>
                        </div>
                      </div>
                    </div>

                    {/* Info Fields */}
                    <div className="grid gap-3">
                      {infoFields.map(({ key, label, icon: Icon }) => {
                        const value = result[key as keyof TrackerResult];
                        if (!value || value === 'N/A' || value === 'null') return null;
                        
                        return (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-muted">
                                <Icon className="w-4 h-4 text-muted-foreground" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground">{label}</p>
                                <p className="text-foreground font-medium truncate">{value}</p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Footer */}
                    <div className="mt-6 p-4 rounded-xl bg-muted/50 text-center">
                      <p className="text-sm text-muted-foreground">
                        ⚡ Powered by <span className="text-primary font-semibold">JaguWorks</span>
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
