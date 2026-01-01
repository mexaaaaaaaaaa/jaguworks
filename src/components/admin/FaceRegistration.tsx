import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Loader2, CheckCircle, AlertCircle, UserCircle } from 'lucide-react';
import { useFaceVerification } from '@/hooks/useFaceVerification';

interface FaceRegistrationProps {
  userId: string;
  onSuccess: () => void;
  onSkip?: () => void;
}

const FaceRegistration = ({ userId, onSuccess, onSkip }: FaceRegistrationProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const {
    modelsLoaded,
    startCamera,
    stopCamera,
    detectFace,
    registerFace
  } = useFaceVerification(userId);

  const handleStartCamera = async () => {
    if (videoRef.current) {
      const success = await startCamera(videoRef.current);
      if (success) {
        setCameraActive(true);
      }
    }
  };

  const handleStopCamera = () => {
    stopCamera();
    setCameraActive(false);
    setFaceDetected(false);
  };

  // Continuous face detection
  useEffect(() => {
    if (!cameraActive || !videoRef.current || !modelsLoaded) return;

    const interval = setInterval(async () => {
      if (videoRef.current && !isCapturing) {
        const detection = await detectFace(videoRef.current);
        setFaceDetected(!!detection);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [cameraActive, modelsLoaded, detectFace, isCapturing]);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsCapturing(true);

    try {
      const detection = await detectFace(videoRef.current);

      if (!detection) {
        setIsCapturing(false);
        return;
      }

      // Capture image for preview
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        setCapturedImage(canvas.toDataURL('image/jpeg'));
      }

      // Register face
      const success = await registerFace(detection.descriptor);
      
      if (success) {
        handleStopCamera();
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (error) {
      console.error('Capture error:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
      <Card className="w-full max-w-lg border-border/50 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <UserCircle className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Face Registration</CardTitle>
          <CardDescription>
            Register your face for secure admin access. This is a one-time setup.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Camera View */}
          <div className="relative aspect-[4/3] bg-muted rounded-xl overflow-hidden border-2 border-dashed border-border">
            {!cameraActive && !capturedImage && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <Camera className="w-16 h-16 text-muted-foreground/50" />
                <p className="text-muted-foreground text-sm">Camera preview will appear here</p>
              </div>
            )}

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${!cameraActive ? 'hidden' : ''}`}
            />

            {capturedImage && (
              <img 
                src={capturedImage} 
                alt="Captured face" 
                className="w-full h-full object-cover"
              />
            )}

            <canvas ref={canvasRef} className="hidden" />

            {/* Face detection indicator */}
            {cameraActive && !capturedImage && (
              <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all ${
                faceDetected 
                  ? 'bg-green-500/90 text-white' 
                  : 'bg-destructive/90 text-destructive-foreground'
              }`}>
                {faceDetected ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Face Detected
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    No Face Detected
                  </>
                )}
              </div>
            )}

            {/* Success overlay */}
            {capturedImage && (
              <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                <div className="bg-green-500 text-white px-6 py-3 rounded-full flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Face Registered!
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
          <div className="flex flex-col gap-3">
            {!cameraActive && !capturedImage && (
              <Button 
                onClick={handleStartCamera} 
                disabled={!modelsLoaded}
                className="w-full"
                size="lg"
              >
                <Camera className="w-4 h-4 mr-2" />
                Start Camera
              </Button>
            )}

            {cameraActive && (
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleStopCamera}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCapture}
                  disabled={!faceDetected || isCapturing}
                  className="flex-1"
                >
                  {isCapturing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    'Capture & Register'
                  )}
                </Button>
              </div>
            )}

            {onSkip && !cameraActive && !capturedImage && (
              <Button variant="ghost" onClick={onSkip} className="text-muted-foreground">
                Skip for now
              </Button>
            )}
          </div>

          {/* Instructions */}
          <div className="text-center text-xs text-muted-foreground space-y-1">
            <p>• Position your face clearly in the camera</p>
            <p>• Ensure good lighting for better accuracy</p>
            <p>• Look directly at the camera</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FaceRegistration;
