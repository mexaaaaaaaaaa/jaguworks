import { useState, useEffect } from "react";
import { useAds } from "@/hooks/useAds";
import { AdBanner } from "./AdBanner";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PopupAdProps {
  delay?: number; // seconds before showing
  page?: string;
}

export const PopupAd = ({ delay = 10, page }: PopupAdProps) => {
  const { data: ads } = useAds("popup", page);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if already shown this session
    const shown = sessionStorage.getItem("popup-ad-shown");
    if (shown) {
      setIsDismissed(true);
      return;
    }

    const timer = setTimeout(() => {
      if (ads?.length) {
        setIsVisible(true);
      }
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [ads, delay]);

  const handleClose = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem("popup-ad-shown", "true");
  };

  if (isDismissed || !ads?.length) return null;

  const ad = ads[0];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute -top-3 -right-3 z-10 p-2 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="rounded-xl overflow-hidden border border-primary/30 shadow-2xl shadow-primary/20">
              <AdBanner ad={ad} className="!max-w-none !h-auto" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PopupAd;
