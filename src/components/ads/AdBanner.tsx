import { useEffect, useRef, useState } from "react";
import { Ad, useTrackClick, useTrackImpression } from "@/hooks/useAds";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdBannerProps {
  ad: Ad;
  className?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
}

const sizeClasses = {
  small: "max-w-[320px] h-[50px]",
  medium: "max-w-[468px] h-[60px]",
  large: "max-w-[728px] h-[90px]",
  leaderboard: "max-w-[728px] h-[90px]",
  rectangle: "max-w-[300px] h-[250px]",
  skyscraper: "max-w-[160px] h-[600px]",
};

export const AdBanner = ({ ad, className, showCloseButton, onClose }: AdBannerProps) => {
  const trackImpression = useTrackImpression();
  const trackClick = useTrackClick();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false);

  // Track impression when ad comes into view
  useEffect(() => {
    if (hasTrackedImpression) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTrackedImpression) {
            trackImpression.mutate(ad.id);
            setHasTrackedImpression(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [ad.id, hasTrackedImpression, trackImpression]);

  const handleClick = () => {
    trackClick.mutate(ad.id);
    if (ad.click_url) {
      window.open(ad.click_url, "_blank", "noopener,noreferrer");
    }
  };

  // Render AdSense
  if (ad.ad_type === "adsense" && ad.adsense_slot) {
    return (
      <div
        ref={containerRef}
        className={cn("relative flex items-center justify-center", className)}
      >
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={ad.adsense_slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Render HTML content
  if (ad.html_content) {
    return (
      <div
        ref={containerRef}
        className={cn("relative", className)}
        onClick={handleClick}
        dangerouslySetInnerHTML={{ __html: ad.html_content }}
      />
    );
  }

  // Render image banner
  return (
    <div
      ref={containerRef}
      className={cn(
        "relative group cursor-pointer overflow-hidden rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10",
        sizeClasses[ad.size],
        className
      )}
      onClick={handleClick}
    >
      {showCloseButton && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
          }}
          className="absolute top-1 right-1 z-10 p-1 rounded-full bg-background/80 hover:bg-background transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {ad.image_url ? (
        <img
          src={ad.image_url}
          alt={ad.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-primary/20 to-accent/20">
          <span className="text-sm text-muted-foreground">Ad Space</span>
        </div>
      )}

      {/* Sponsored label */}
      <div className="absolute bottom-1 left-1 px-1.5 py-0.5 text-[10px] bg-background/80 rounded text-muted-foreground">
        Sponsored
      </div>
    </div>
  );
};

export default AdBanner;
