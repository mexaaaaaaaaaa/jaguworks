import { useState, useEffect, useRef, useCallback } from 'react';
import * as faceapi from 'face-api.js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Use CDN for face-api models
const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';

interface FaceData {
  id: string;
  user_id: string;
  face_descriptor: number[];
  registered_at: string;
  last_verified_at: string | null;
  is_enabled: boolean;
}

export const useFaceVerification = (userId: string | undefined) => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [faceData, setFaceData] = useState<FaceData | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Load face-api models
  const loadModels = useCallback(async () => {
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      setModelsLoaded(true);
    } catch (error) {
      console.error('Error loading face-api models:', error);
      toast.error('Failed to load face recognition models');
    }
  }, []);

  // Fetch existing face data
  const fetchFaceData = useCallback(async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('admin_face_data')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching face data:', error);
      }
      
      if (data) {
        setFaceData({
          ...data,
          face_descriptor: data.face_descriptor as number[]
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadModels();
    fetchFaceData();
  }, [loadModels, fetchFaceData]);

  // Start camera
  const startCamera = useCallback(async (videoElement: HTMLVideoElement) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 }
      });
      videoElement.srcObject = stream;
      streamRef.current = stream;
      videoRef.current = videoElement;
      return true;
    } catch (error) {
      console.error('Camera access error:', error);
      toast.error('Camera access denied. Please allow camera permissions.');
      return false;
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Detect face and get descriptor
  const detectFace = useCallback(async (videoElement: HTMLVideoElement) => {
    if (!modelsLoaded) return null;

    const detection = await faceapi
      .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    return detection;
  }, [modelsLoaded]);

  // Register face
  const registerFace = useCallback(async (descriptor: Float32Array) => {
    if (!userId) return false;

    try {
      const descriptorArray = Array.from(descriptor);
      
      const { error } = await supabase
        .from('admin_face_data')
        .upsert({
          user_id: userId,
          face_descriptor: descriptorArray,
          registered_at: new Date().toISOString(),
          is_enabled: true
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      setFaceData({
        id: '',
        user_id: userId,
        face_descriptor: descriptorArray,
        registered_at: new Date().toISOString(),
        last_verified_at: null,
        is_enabled: true
      });

      toast.success('Face registered successfully!');
      return true;
    } catch (error) {
      console.error('Error registering face:', error);
      toast.error('Failed to register face');
      return false;
    }
  }, [userId]);

  // Verify face
  const verifyFace = useCallback(async (descriptor: Float32Array) => {
    if (!faceData?.face_descriptor) return false;

    const storedDescriptor = new Float32Array(faceData.face_descriptor);
    const distance = faceapi.euclideanDistance(descriptor, storedDescriptor);
    
    // Threshold: lower = stricter (0.6 is standard)
    const isMatch = distance < 0.6;

    if (isMatch) {
      // Update last verified timestamp
      await supabase
        .from('admin_face_data')
        .update({ last_verified_at: new Date().toISOString() })
        .eq('user_id', userId);

      setIsVerified(true);
      return true;
    }

    return false;
  }, [faceData, userId]);

  // Delete face data
  const deleteFaceData = useCallback(async () => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('admin_face_data')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      setFaceData(null);
      setIsVerified(false);
      toast.success('Face data deleted');
      return true;
    } catch (error) {
      console.error('Error deleting face data:', error);
      toast.error('Failed to delete face data');
      return false;
    }
  }, [userId]);

  // Toggle face verification
  const toggleFaceVerification = useCallback(async (enabled: boolean) => {
    if (!userId || !faceData) return false;

    try {
      const { error } = await supabase
        .from('admin_face_data')
        .update({ is_enabled: enabled })
        .eq('user_id', userId);

      if (error) throw error;

      setFaceData(prev => prev ? { ...prev, is_enabled: enabled } : null);
      toast.success(enabled ? 'Face verification enabled' : 'Face verification disabled');
      return true;
    } catch (error) {
      console.error('Error toggling face verification:', error);
      return false;
    }
  }, [userId, faceData]);

  return {
    modelsLoaded,
    isLoading,
    faceData,
    isVerified,
    setIsVerified,
    startCamera,
    stopCamera,
    detectFace,
    registerFace,
    verifyFace,
    deleteFaceData,
    toggleFaceVerification,
    refetchFaceData: fetchFaceData
  };
};
