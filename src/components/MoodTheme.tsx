import { useEffect, useState, createContext, useContext } from 'react';

type MoodTheme = 'morning' | 'afternoon' | 'evening' | 'night';

interface MoodThemeContextType {
  currentMood: MoodTheme;
  isAutoMode: boolean;
  setAutoMode: (auto: boolean) => void;
  setManualMood: (mood: MoodTheme) => void;
}

const MoodThemeContext = createContext<MoodThemeContextType | null>(null);

export const useMoodTheme = () => {
  const context = useContext(MoodThemeContext);
  if (!context) {
    throw new Error('useMoodTheme must be used within MoodThemeProvider');
  }
  return context;
};

const getMoodFromTime = (): MoodTheme => {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

const moodStyles: Record<MoodTheme, string> = {
  morning: `
    --mood-primary: 200 80% 50%;
    --mood-accent: 40 90% 60%;
    --mood-glow: 200 80% 50%;
  `,
  afternoon: `
    --mood-primary: 35 90% 55%;
    --mood-accent: 20 85% 50%;
    --mood-glow: 35 90% 55%;
  `,
  evening: `
    --mood-primary: 280 70% 60%;
    --mood-accent: 340 80% 60%;
    --mood-glow: 280 70% 60%;
  `,
  night: `
    --mood-primary: 160 100% 40%;
    --mood-accent: 190 100% 50%;
    --mood-glow: 160 100% 40%;
  `,
};

export const MoodThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentMood, setCurrentMood] = useState<MoodTheme>(getMoodFromTime);
  const [isAutoMode, setIsAutoMode] = useState(true);

  useEffect(() => {
    // Load saved preference
    const savedAuto = localStorage.getItem('moodAutoMode');
    const savedMood = localStorage.getItem('manualMood') as MoodTheme;
    
    if (savedAuto === 'false' && savedMood) {
      setIsAutoMode(false);
      setCurrentMood(savedMood);
    }
  }, []);

  useEffect(() => {
    if (!isAutoMode) return;

    // Update mood based on time
    const updateMood = () => {
      setCurrentMood(getMoodFromTime());
    };

    updateMood();
    
    // Check every minute
    const interval = setInterval(updateMood, 60000);
    return () => clearInterval(interval);
  }, [isAutoMode]);

  useEffect(() => {
    // Apply mood styles
    const styleId = 'mood-theme-styles';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = `
      :root {
        ${moodStyles[currentMood]}
      }
    `;

    // Add mood class to body for additional styling
    document.body.setAttribute('data-mood', currentMood);
  }, [currentMood]);

  const setAutoMode = (auto: boolean) => {
    setIsAutoMode(auto);
    localStorage.setItem('moodAutoMode', auto.toString());
    
    if (auto) {
      setCurrentMood(getMoodFromTime());
      localStorage.removeItem('manualMood');
    }
  };

  const setManualMood = (mood: MoodTheme) => {
    setCurrentMood(mood);
    setIsAutoMode(false);
    localStorage.setItem('moodAutoMode', 'false');
    localStorage.setItem('manualMood', mood);
  };

  return (
    <MoodThemeContext.Provider value={{ currentMood, isAutoMode, setAutoMode, setManualMood }}>
      {children}
    </MoodThemeContext.Provider>
  );
};

export default MoodThemeProvider;
