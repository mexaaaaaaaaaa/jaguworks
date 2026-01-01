import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Loader2, CheckCircle, XCircle, ShieldCheck, KeyRound } from 'lucide-react';
import { useFaceVerification } from '@/hooks/useFaceVerification';

interface FaceVerificationProps {
  userId: string;
  onSuccess: () => void;
  onFallbackToPIN?: () => void;
}

const FaceVerification = ({ userId, onSuccess, onFallbackToPIN }: FaceVerificationProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'success' | 'failed' | null>(null);
  const [attempts, setAttempts] = useState(0);

  const {
    modelsLoaded,
    startCamera,
    stopCamera,
    detectFace,
    verifyFace
  } = useFaceVerification(userId);

  const handleStartCamera = useCallback(async () => {
    if (videoRef.current) {
      const success = await startCamera(videoRef.current);
      if (success) {
        setCameraActive(true);
        setVerificationResult(null);
      }
    }
  }, [startCamera]);

  const handleStopCamera = useCallback(() => {
    stopCamera();
    setCameraActive(false);
  }, [stopCamera]);

  // Auto-start camera when models are loaded
  useEffect(() => {
    if (modelsLoaded && !cameraActive) {
      handleStartCamera();
    }
    
    return () => {
      handleStopCamera();
    };
  }, [modelsLoaded]);

  // Continuous verification attempts
  useEffect(() => {
    if (!cameraActive || !videoRef.current || !modelsLoaded || isVerifying) return;

    const verifyLoop = async () => {
      if (!videoRef.current || verificationResult === 'success') return;

      setIsVerifying(true);

      try {
        const detection = await detectFace(videoRef.current);

        if (detection) {
          const isMatch = await verifyFace(detection.descriptor);
          
          if (isMatch) {
            setVerificationResult('success');
            handleStopCamera();
            setTimeout(() => {
              onSuccess();
            }, 1000);
          } else {
            setAttempts(prev => prev + 1);
            if (attempts >= 4) {
              setVerificationResult('failed');
            }
          }
        }
      } catch (error) {
        console.error('Verification error:', error);
      } finally {
        setIsVerifying(false);
      }
    };

    const interval = setInterval(verifyLoop, 1500);
    return () => clearInterval(interval);
  }, [cameraActive, modelsLoaded, isVerifying, detectFace, verifyFace, verificationResult, attempts, onSuccess, handleStopCamera]);

  const handleRetry = () => {
    setVerificationResult(null);
    setAttempts(0);
    handleStartCamera();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
      <Card className="w-full max-w-lg border-border/50 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Face Verification</CardTitle>
          <CardDescription>
            Look at the camera to verify your identity
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Camera View */}
          <div className="relative aspect-[4/3] bg-muted rounded-xl overflow-hidden">
            {!cameraActive && !verificationResult && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                <p className="text-muted-foreground text-sm">Starting camera...</p>
              </div>
            )}

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${!cameraActive ? 'hidden' : ''}`}
            />

            {/* Scanning overlay */}
            {cameraActive && verificationResult === null && (
              <>
                {/* Scanning animation */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 border-4 border-primary/50 rounded-xl animate-pulse" />
                  <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" 
                       style={{ 
                         animation: 'scan 2s linear infinite',
                         top: '0%' 
                       }} 
                  />
                </div>

                {/* Status indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-primary/90 text-primary-foreground text-sm font-medium flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying... ({attempts}/5 attempts)
                </div>
              </>
            )}

            {/* Success overlay */}
            {verificationResult === 'success' && (
              <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                <div className="bg-green-500 text-white px-6 py-3 rounded-full flex items-center gap-2 animate-pulse">
                  <CheckCircle className="w-5 h-5" />
                  Identity Verified!
                </div>
              </div>
            )}

            {/* Failed overlay */}
            {verificationResult === 'failed' && (
              <div className="absolute inset-0 bg-destructive/20 flex items-center justify-center">
                <div className="bg-destructive text-destructive-foreground px-6 py-3 rounded-full flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Verification Failed
                </div>
              </div>
            )}
          </div>

          {/* Loading models indicator */}
          {!modelsLoaded && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading face recognition models...</span>
            </div>
          )}

          {/* Action Buttons */}
          {verificationResult === 'failed' && (
            <div className="flex flex-col gap-3">
              <Button onClick={handleRetry} className="w-full">
                <Camera className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              
              {onFallbackToPIN && (
                <Button variant="outline" onClick={onFallbackToPIN} className="w-full">
                  <KeyRound className="w-4 h-4 mr-2" />
                  Use PIN Instead
                </Button>
              )}
            </div>
          )}

          {/* Help text */}
          <div className="text-center text-xs text-muted-foreground space-y-1">
            <p>• Keep your face centered in the frame</p>
            <p>• Ensure proper lighting</p>
            <p>• Remove glasses if verification fails</p>
          </div>
        </CardContent>
      </Card>

      {/* Custom animation style */}
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default FaceVerification;
