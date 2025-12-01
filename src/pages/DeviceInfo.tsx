import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Monitor, Wifi, Battery, Cpu, HardDrive, Globe, Clock, Copy, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

interface DeviceData {
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  device: string;
  screenWidth: number;
  screenHeight: number;
  colorDepth: number;
  pixelRatio: number;
  timezone: string;
  language: string;
  languages: string[];
  cookiesEnabled: boolean;
  doNotTrack: boolean;
  online: boolean;
  platform: string;
  cores: number;
  memory: number | null;
  touchSupport: boolean;
  maxTouchPoints: number;
  batteryLevel: number | null;
  batteryCharging: boolean | null;
  webGL: string;
  vendor: string;
}

export default function DeviceInfo() {
  const [deviceData, setDeviceData] = useState<DeviceData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const detectDevice = async () => {
      const ua = navigator.userAgent;
      
      // Detect browser
      let browser = 'Unknown';
      let browserVersion = '';
      if (ua.includes('Firefox/')) {
        browser = 'Firefox';
        browserVersion = ua.split('Firefox/')[1]?.split(' ')[0] || '';
      } else if (ua.includes('Chrome/') && !ua.includes('Edg')) {
        browser = 'Chrome';
        browserVersion = ua.split('Chrome/')[1]?.split(' ')[0] || '';
      } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
        browser = 'Safari';
        browserVersion = ua.split('Version/')[1]?.split(' ')[0] || '';
      } else if (ua.includes('Edg/')) {
        browser = 'Edge';
        browserVersion = ua.split('Edg/')[1]?.split(' ')[0] || '';
      }

      // Detect OS
      let os = 'Unknown';
      let osVersion = '';
      if (ua.includes('Windows')) {
        os = 'Windows';
        if (ua.includes('Windows NT 10')) osVersion = '10/11';
        else if (ua.includes('Windows NT 6.3')) osVersion = '8.1';
        else if (ua.includes('Windows NT 6.1')) osVersion = '7';
      } else if (ua.includes('Mac OS X')) {
        os = 'macOS';
        osVersion = ua.split('Mac OS X ')[1]?.split(')')[0]?.replace(/_/g, '.') || '';
      } else if (ua.includes('Android')) {
        os = 'Android';
        osVersion = ua.split('Android ')[1]?.split(';')[0] || '';
      } else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) {
        os = 'iOS';
        osVersion = ua.split('OS ')[1]?.split(' ')[0]?.replace(/_/g, '.') || '';
      } else if (ua.includes('Linux')) {
        os = 'Linux';
      }

      // Detect device type
      let device = 'Desktop';
      if (/Mobi|Android/i.test(ua)) device = 'Mobile';
      else if (/Tablet|iPad/i.test(ua)) device = 'Tablet';

      // Get WebGL info
      let webGL = 'Not supported';
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
          const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
          if (debugInfo) {
            webGL = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          }
        }
      } catch (e) {
        webGL = 'Error detecting';
      }

      // Get battery info
      let batteryLevel: number | null = null;
      let batteryCharging: boolean | null = null;
      try {
        if ('getBattery' in navigator) {
          const battery = await (navigator as any).getBattery();
          batteryLevel = Math.round(battery.level * 100);
          batteryCharging = battery.charging;
        }
      } catch (e) {
        // Battery API not supported
      }

      setDeviceData({
        browser,
        browserVersion,
        os,
        osVersion,
        device,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        colorDepth: window.screen.colorDepth,
        pixelRatio: window.devicePixelRatio,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        languages: [...navigator.languages],
        cookiesEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack === '1',
        online: navigator.onLine,
        platform: navigator.platform,
        cores: navigator.hardwareConcurrency || 0,
        memory: (navigator as any).deviceMemory || null,
        touchSupport: 'ontouchstart' in window,
        maxTouchPoints: navigator.maxTouchPoints || 0,
        batteryLevel,
        batteryCharging,
        webGL,
        vendor: navigator.vendor,
      });
    };

    detectDevice();
  }, []);

  const copyToClipboard = () => {
    if (!deviceData) return;
    
    const text = Object.entries(deviceData)
      .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
      .join('\n');
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Device info copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const infoCards = deviceData ? [
    {
      title: 'Browser',
      icon: Globe,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      items: [
        { label: 'Browser', value: `${deviceData.browser} ${deviceData.browserVersion}` },
        { label: 'Vendor', value: deviceData.vendor },
        { label: 'Cookies', value: deviceData.cookiesEnabled ? 'Enabled' : 'Disabled' },
        { label: 'Do Not Track', value: deviceData.doNotTrack ? 'Enabled' : 'Disabled' },
      ],
    },
    {
      title: 'System',
      icon: Cpu,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      items: [
        { label: 'Operating System', value: `${deviceData.os} ${deviceData.osVersion}` },
        { label: 'Platform', value: deviceData.platform },
        { label: 'CPU Cores', value: `${deviceData.cores} cores` },
        { label: 'Device Memory', value: deviceData.memory ? `${deviceData.memory} GB` : 'N/A' },
      ],
    },
    {
      title: 'Display',
      icon: Monitor,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      items: [
        { label: 'Resolution', value: `${deviceData.screenWidth} × ${deviceData.screenHeight}` },
        { label: 'Pixel Ratio', value: `${deviceData.pixelRatio}x` },
        { label: 'Color Depth', value: `${deviceData.colorDepth}-bit` },
        { label: 'GPU', value: deviceData.webGL.slice(0, 40) + (deviceData.webGL.length > 40 ? '...' : '') },
      ],
    },
    {
      title: 'Device',
      icon: Smartphone,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
      items: [
        { label: 'Device Type', value: deviceData.device },
        { label: 'Touch Support', value: deviceData.touchSupport ? 'Yes' : 'No' },
        { label: 'Touch Points', value: `${deviceData.maxTouchPoints}` },
        { label: 'Online Status', value: deviceData.online ? '🟢 Online' : '🔴 Offline' },
      ],
    },
    {
      title: 'Location & Language',
      icon: Clock,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20',
      items: [
        { label: 'Timezone', value: deviceData.timezone },
        { label: 'Language', value: deviceData.language },
        { label: 'All Languages', value: deviceData.languages.slice(0, 3).join(', ') },
      ],
    },
    {
      title: 'Battery',
      icon: Battery,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
      items: deviceData.batteryLevel !== null ? [
        { label: 'Battery Level', value: `${deviceData.batteryLevel}%` },
        { label: 'Charging', value: deviceData.batteryCharging ? '⚡ Yes' : 'No' },
      ] : [
        { label: 'Status', value: 'Battery API not available' },
      ],
    },
  ] : [];

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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
              <Smartphone className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-orange-500 font-medium">Device Detection Tool</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
              Device <span className="text-orange-500">Info</span>
            </h1>
            <p className="text-muted-foreground">
              Comprehensive information about your device, browser, and system
            </p>
          </motion.div>

          {/* Copy Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mb-8"
          >
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="border-orange-500/30 text-orange-500 hover:bg-orange-500/10"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy All Info
                </>
              )}
            </Button>
          </motion.div>

          {/* Info Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {infoCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                <Card className={`bg-card/50 backdrop-blur-xl border-border/50 shadow-xl overflow-hidden h-full`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.bgColor} to-transparent opacity-50 pointer-events-none`} />
                  <CardHeader className="relative pb-2">
                    <CardTitle className={`flex items-center gap-2 ${card.color}`}>
                      <card.icon className="w-5 h-5" />
                      {card.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative space-y-3">
                    {card.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                        <span className="text-sm font-medium text-foreground text-right max-w-[150px] truncate">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-muted-foreground">
              ⚡ Powered by <span className="text-orange-500 font-semibold">JaguWorks</span>
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
