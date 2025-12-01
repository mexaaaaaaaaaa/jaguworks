import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Key, Copy, RefreshCw, CheckCircle2, Shield, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [history, setHistory] = useState<string[]>([]);

  const generatePassword = useCallback(() => {
    let chars = '';
    if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) {
      toast.error('Please select at least one character type');
      return;
    }

    let newPassword = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
      newPassword += chars[array[i] % chars.length];
    }

    setPassword(newPassword);
    setHistory(prev => [newPassword, ...prev.slice(0, 4)]);
    setCopied(false);
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const copyToClipboard = (text: string = password) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Password copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrength = () => {
    if (!password) return { label: 'None', color: 'bg-muted', textColor: 'text-muted-foreground', percentage: 0 };
    
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 2;

    if (score < 3) return { label: 'Weak', color: 'bg-red-500', textColor: 'text-red-500', percentage: 25 };
    if (score < 5) return { label: 'Medium', color: 'bg-yellow-500', textColor: 'text-yellow-500', percentage: 50 };
    if (score < 7) return { label: 'Strong', color: 'bg-green-500', textColor: 'text-green-500', percentage: 75 };
    return { label: 'Very Strong', color: 'bg-emerald-500', textColor: 'text-emerald-500', percentage: 100 };
  };

  const strength = getStrength();

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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
              <Key className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-emerald-500 font-medium">Security Tool</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
              Password <span className="text-emerald-500">Generator</span>
            </h1>
            <p className="text-muted-foreground">
              Generate secure, random passwords with custom options
            </p>
          </motion.div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-green-500/5 pointer-events-none" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  Generate Secure Password
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-6">
                {/* Password Display */}
                <div className="relative">
                  <div className="flex items-center gap-2 p-4 bg-background/50 border border-border/50 rounded-xl">
                    <code className={`flex-1 font-mono text-lg text-foreground break-all ${!showPassword ? 'blur-sm' : ''}`}>
                      {password || 'Click generate to create a password'}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPassword(!showPassword)}
                      className="shrink-0"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard()}
                      disabled={!password}
                      className="shrink-0"
                    >
                      {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Strength Meter */}
                {password && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Strength</span>
                      <span className={strength.textColor}>{strength.label}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${strength.percentage}%` }}
                        className={`h-full ${strength.color} transition-all duration-500`}
                      />
                    </div>
                  </div>
                )}

                {/* Length Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Password Length</span>
                    <span className="text-sm font-medium text-emerald-500">{length} characters</span>
                  </div>
                  <Slider
                    value={[length]}
                    onValueChange={(value) => setLength(value[0])}
                    min={8}
                    max={128}
                    step={1}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>8</span>
                    <span>128</span>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-foreground">Character Types</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50">
                      <span className="text-sm text-foreground">Uppercase (A-Z)</span>
                      <Switch checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50">
                      <span className="text-sm text-foreground">Lowercase (a-z)</span>
                      <Switch checked={includeLowercase} onCheckedChange={setIncludeLowercase} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50">
                      <span className="text-sm text-foreground">Numbers (0-9)</span>
                      <Switch checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50">
                      <span className="text-sm text-foreground">Symbols (!@#$)</span>
                      <Switch checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={generatePassword}
                  className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate Password
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* History */}
          {history.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6"
            >
              <Card className="bg-card/50 backdrop-blur-xl border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Recent Passwords</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {history.map((pwd, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50"
                    >
                      <code className="font-mono text-sm text-muted-foreground truncate flex-1 mr-2">
                        {pwd.slice(0, 30)}...
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(pwd)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
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
              🔒 Passwords are generated locally and never stored
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              ⚡ Powered by <span className="text-emerald-500 font-semibold">JaguWorks</span>
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
