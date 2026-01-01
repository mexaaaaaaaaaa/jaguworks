import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useFaceVerification } from '@/hooks/useFaceVerification';
import FaceRegistration from './FaceRegistration';
import FaceVerification from './FaceVerification';

interface FaceVerificationGateProps {
  userId: string;
  children: React.ReactNode;
  onFallbackToPIN?: () => void;
}

const FaceVerificationGate = ({ userId, children, onFallbackToPIN }: FaceVerificationGateProps) => {
  const { isLoading, faceData, isVerified, setIsVerified } = useFaceVerification(userId);
  const [skipRegistration, setSkipRegistration] = useState(false);

  // Check session storage for face verification
  useEffect(() => {
    const faceVerified = sessionStorage.getItem('admin_face_verified');
    if (faceVerified === 'true') {
      setIsVerified(true);
    }
  }, [setIsVerified]);

  // Save verification to session
  const handleVerificationSuccess = () => {
    sessionStorage.setItem('admin_face_verified', 'true');
    setIsVerified(true);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading security settings...</p>
        </div>
      </div>
    );
  }

  // If already verified this session, show children
  if (isVerified) {
    return <>{children}</>;
  }

  // If face data exists and is enabled, show verification
  if (faceData && faceData.is_enabled) {
    return (
      <FaceVerification 
        userId={userId} 
        onSuccess={handleVerificationSuccess}
        onFallbackToPIN={onFallbackToPIN}
      />
    );
  }

  // If no face data and not skipping, show registration
  if (!faceData && !skipRegistration) {
    return (
      <FaceRegistration 
        userId={userId} 
        onSuccess={handleVerificationSuccess}
        onSkip={() => {
          setSkipRegistration(true);
          handleVerificationSuccess();
        }}
      />
    );
  }

  // If face verification is disabled or skipped, allow access
  return <>{children}</>;
};

export default FaceVerificationGate;
