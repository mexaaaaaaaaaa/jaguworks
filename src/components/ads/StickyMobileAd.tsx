import { useState, useEffect } from "react";
import { useAds } from "@/hooks/useAds";
import { AdBanner } from "./AdBanner";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface StickyMobileAdProps {
  page?: string;
}

export const StickyMobileAd = ({ page }: StickyMobileAdProps) => {
  const isMobile = useIsMobile();
  const { data: ads } = useAds("sticky-mobile", page);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after scrolling a bit
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Only show on mobile
  if (!isMobile || isDismissed || !ads?.length || !isVisible) return null;

  const ad = ads[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-40 p-2 bg-background/95 backdrop-blur-md border-t border-border safe-area-inset-bottom"
      >
        <div className="relative">
          <button
            onClick={() => setIsDismissed(true)}
            className="absolute -top-2 right-0 z-10 p-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>

          <AdBanner ad={ad} className="!max-w-full !h-[50px] mx-auto" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StickyMobileAd;
