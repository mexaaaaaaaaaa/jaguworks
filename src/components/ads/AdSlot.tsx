import { useAds, Ad } from "@/hooks/useAds";
import { AdBanner } from "./AdBanner";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface AdSlotProps {
  placement: Ad["placement"];
  page?: string;
  className?: string;
  rotateInterval?: number; // in seconds
  maxAds?: number;
}

export const AdSlot = ({
  placement,
  page,
  className,
  rotateInterval = 30,
  maxAds = 1,
}: AdSlotProps) => {
  const { data: ads, isLoading } = useAds(placement, page);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Rotate ads
  useEffect(() => {
    if (!ads || ads.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, rotateInterval * 1000);

    return () => clearInterval(interval);
  }, [ads, rotateInterval]);

  if (isLoading || !ads?.length) return null;

  // Single ad rotation
  if (maxAds === 1) {
    return (
      <div className={cn("flex justify-center py-4", className)}>
        <AdBanner ad={ads[currentIndex]} />
      </div>
    );
  }

  // Multiple ads
  return (
    <div className={cn("flex flex-wrap justify-center gap-4 py-4", className)}>
      {ads.slice(0, maxAds).map((ad) => (
        <AdBanner key={ad.id} ad={ad} />
      ))}
    </div>
  );
};

export default AdSlot;
