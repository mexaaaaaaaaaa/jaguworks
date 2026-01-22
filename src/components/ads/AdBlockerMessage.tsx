import { useState, useEffect } from "react";
import { Heart, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const AdBlockerMessage = () => {
  const [hasAdBlocker, setHasAdBlocker] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Simple ad blocker detection
    const testAd = document.createElement("div");
    testAd.innerHTML = "&nbsp;";
    testAd.className = "adsbox";
    testAd.style.cssText = "position: absolute; left: -9999px; width: 1px; height: 1px;";
    document.body.appendChild(testAd);

    setTimeout(() => {
      if (testAd.offsetHeight === 0) {
        setHasAdBlocker(true);
      }
      testAd.remove();
    }, 100);
  }, []);

  if (!hasAdBlocker || isDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-4 right-4 z-50 max-w-sm"
      >
        <div className="relative p-4 rounded-xl bg-card border border-border shadow-lg">
          <button
            onClick={() => setIsDismissed(true)}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-sm">Support My Work</h4>
              <p className="text-xs text-muted-foreground">
                I noticed you're using an ad blocker. Ads help keep this site free!
                Consider disabling it to support my content. 💖
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdBlockerMessage;
