import { useEffect, useState } from 'react';

export const useKonamiCode = (callback: () => void) => {
  const [keys, setKeys] = useState<string[]>([]);
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => [...prev.slice(-9), e.key]);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (keys.join(',').includes(konamiCode.join(','))) {
      callback();
      setKeys([]);
    }
  }, [keys, callback, konamiCode]);
};

export const useConsoleMessage = () => {
  useEffect(() => {
    console.log(
      `%c👋 Hey there, fellow developer!`,
      'font-size: 20px; font-weight: bold; color: #00ff9d;'
    );
    console.log(
      `%c🚀 Impressed by the code? Let's connect!`,
      'font-size: 14px; color: #fff;'
    );
    console.log(
      `%c📧 jagmohandhaker@gmail.com`,
      'font-size: 14px; color: #ff006e; font-weight: bold;'
    );
    console.log(
      `%c💡 Try the Konami code: ↑ ↑ ↓ ↓ ← → ← → B A`,
      'font-size: 12px; color: #00d9ff; font-style: italic;'
    );
  }, []);
};
