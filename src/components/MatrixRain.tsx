import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MatrixRainProps {
  duration?: number;
}

const MatrixRain = ({ duration = 5000 }: MatrixRainProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Matrix characters
    const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charArray = chars.split('');

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    // Animation
    const draw = () => {
      // Semi-transparent black for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Green text
      ctx.fillStyle = '#00ff9d';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = charArray[Math.floor(Math.random() * charArray.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(char, x, y);

        // Random brightness variation
        if (Math.random() > 0.975) {
          ctx.fillStyle = '#ffffff';
          ctx.fillText(char, x, y);
          ctx.fillStyle = '#00ff9d';
        }

        // Reset drop to top randomly
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    const animationId = setInterval(draw, 33);

    // Auto-disable after duration
    const timeout = setTimeout(() => setIsActive(false), duration);

    return () => {
      clearInterval(animationId);
      clearTimeout(timeout);
      window.removeEventListener('resize', resize);
    };
  }, [duration]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[150] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ background: 'black' }}
          />
          
          {/* Click to close */}
          <motion.button
            className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 border border-green-500/50 rounded-lg text-green-400 text-sm pointer-events-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            onClick={() => setIsActive(false)}
          >
            Exit the Matrix
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook to trigger Matrix effect
export const useMatrixEffect = () => {
  const [showMatrix, setShowMatrix] = useState(false);

  const triggerMatrix = () => setShowMatrix(true);
  const hideMatrix = () => setShowMatrix(false);

  return { showMatrix, triggerMatrix, hideMatrix, MatrixComponent: showMatrix ? MatrixRain : null };
};

export default MatrixRain;
