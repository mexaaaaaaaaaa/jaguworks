import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useFaceVerification } from '@/hooks/useFaceVerification';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  ScanFace, 
  Trash2, 
  RefreshCw, 
  ShieldCheck, 
  Camera,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import FaceRegistration from '@/components/admin/FaceRegistration';

const AdminFaceSettings = () => {
  const { user } = useAuth();
  const [showRegistration, setShowRegistration] = useState(false);
  
  const { 
    isLoading, 
    faceData, 
    deleteFaceData, 
    toggleFaceVerification,
    refetchFaceData
  } = useFaceVerification(user?.id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (showRegistration && user?.id) {
    return (
      <div className="max-w-2xl mx-auto">
        <FaceRegistration 
          userId={user.id} 
          onSuccess={() => {
            setShowRegistration(false);
            refetchFaceData();
          }}
          onSkip={() => setShowRegistration(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <ScanFace className="w-8 h-8 text-primary" />
          Face Verification
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage face recognition settings for admin access
        </p>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Face Verification Status</span>
            {faceData ? (
              <Badge variant="default" className="bg-green-500">
                <CheckCircle className="w-3 h-3 mr-1" />
                Registered
              </Badge>
            ) : (
              <Badge variant="secondary">
                <AlertCircle className="w-3 h-3 mr-1" />
                Not Registered
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {faceData 
              ? 'Your face is registered for admin authentication'
              : 'Register your face for an additional layer of security'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {faceData ? (
            <>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Registered On</p>
                  <p className="font-medium">
                    {format(new Date(faceData.registered_at), 'PPP')}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Verified</p>
                  <p className="font-medium">
                    {faceData.last_verified_at 
                      ? format(new Date(faceData.last_verified_at), 'PPp')
                      : 'Never'
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="space-y-0.5">
                  <Label htmlFor="face-enabled">Enable Face Verification</Label>
                  <p className="text-xs text-muted-foreground">
                    Require face verification on admin login
                  </p>
                </div>
                <Switch
                  id="face-enabled"
                  checked={faceData.is_enabled}
                  onCheckedChange={toggleFaceVerification}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-primary" />
              </div>
              <p className="text-muted-foreground mb-4">
                No face data registered. Register your face for secure admin access.
              </p>
              <Button onClick={() => setShowRegistration(true)}>
                <ScanFace className="w-4 h-4 mr-2" />
                Register Face
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions Card */}
      {faceData && (
        <Card>
          <CardHeader>
            <CardTitle>Manage Face Data</CardTitle>
            <CardDescription>
              Re-register or delete your face data
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowRegistration(true)}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Re-register Face
            </Button>
            <Button 
              variant="destructive" 
              onClick={async () => {
                if (confirm('Are you sure you want to delete your face data?')) {
                  await deleteFaceData();
                }
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Face Data
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Security Info */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Security Information
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• Face data is stored as mathematical descriptors, not images</p>
          <p>• Your face data is encrypted and only accessible by you</p>
          <p>• Face verification happens locally in your browser</p>
          <p>• You can always use PIN as a fallback if camera fails</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFaceSettings;
