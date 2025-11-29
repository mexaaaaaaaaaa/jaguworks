import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Download, Copy, QrCode, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function QRGenerator() {
  const [url, setUrl] = useState('https://jaguworks.online');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [size, setSize] = useState(200);

  const generateQR = async (text: string) => {
    if (!text) {
      setQrDataUrl('');
      return;
    }

    // Using QR Server API for simplicity
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&bgcolor=ffffff&color=000000&format=png`;
    setQrDataUrl(qrUrl);
  };

  useEffect(() => {
    generateQR(url);
  }, [url, size]);

  const downloadQR = () => {
    if (!qrDataUrl) return;
    
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `qr-code-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR code downloaded');
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied');
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <QrCode className="w-5 h-5" />
          QR Code Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>URL or Text</Label>
          <div className="flex gap-2">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL or text"
            />
            <Button variant="outline" size="icon" onClick={copyUrl}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Size: {size}px</Label>
          <input
            type="range"
            min="100"
            max="400"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {qrDataUrl && (
          <div className="flex flex-col items-center gap-4 p-4 bg-white rounded-lg">
            <img 
              src={qrDataUrl} 
              alt="QR Code" 
              className="max-w-full"
              style={{ width: size, height: size }}
            />
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={downloadQR} disabled={!qrDataUrl} className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download PNG
          </Button>
          <Button variant="outline" onClick={() => generateQR(url)}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
