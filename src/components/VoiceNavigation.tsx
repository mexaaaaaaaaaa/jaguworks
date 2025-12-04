import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const VoiceNavigation = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const navigate = useNavigate();

  const commands: Record<string, () => void> = {
    // English commands
    'go to home': () => navigate('/'),
    'go home': () => navigate('/'),
    'home': () => navigate('/'),
    'go to about': () => navigate('/about'),
    'about': () => navigate('/about'),
    'about me': () => navigate('/about'),
    'go to projects': () => navigate('/projects'),
    'projects': () => navigate('/projects'),
    'show projects': () => navigate('/projects'),
    'go to skills': () => navigate('/skills'),
    'skills': () => navigate('/skills'),
    'go to contact': () => navigate('/contact'),
    'contact': () => navigate('/contact'),
    'contact me': () => navigate('/contact'),
    'go to blog': () => navigate('/blog'),
    'blog': () => navigate('/blog'),
    'go to games': () => navigate('/games'),
    'games': () => navigate('/games'),
    'play games': () => navigate('/games'),
    'open discord': () => window.open('https://discord.gg/6CdCgjsVua', '_blank'),
    'discord': () => window.open('https://discord.gg/6CdCgjsVua', '_blank'),
    'dark mode': () => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      toast({ title: "Dark mode enabled", description: "Theme changed to dark" });
    },
    'light mode': () => {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      toast({ title: "Light mode enabled", description: "Theme changed to light" });
    },
    'scroll up': () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    'scroll down': () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }),
    // Hindi commands
    'projects dikhao': () => navigate('/projects'),
    'contact karo': () => navigate('/contact'),
    'ghar jao': () => navigate('/'),
    'home jao': () => navigate('/'),
  };

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const text = result[0].transcript.toLowerCase().trim();
      setTranscript(text);

      if (result.isFinal) {
        processCommand(text);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'not-allowed') {
        toast({
          title: "Microphone Access Denied",
          description: "Please allow microphone access to use voice navigation",
          variant: "destructive",
        });
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setTranscript('');
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const processCommand = useCallback((text: string) => {
    // Find matching command
    for (const [command, action] of Object.entries(commands)) {
      if (text.includes(command)) {
        toast({
          title: "Voice Command",
          description: `Executing: "${command}"`,
        });
        action();
        return;
      }
    }

    // No matching command found
    toast({
      title: "Command Not Recognized",
      description: `"${text}" - Try saying "go to projects" or "contact"`,
    });
  }, [navigate]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  };

  if (!isSupported) return null;

  return (
    <>
      {/* Floating mic button */}
      <motion.button
        className={`fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors ${
          isListening 
            ? 'bg-red-500 shadow-red-500/30' 
            : 'bg-gradient-to-r from-primary to-accent shadow-primary/30'
        }`}
        onClick={toggleListening}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Voice Navigation - Click to speak"
      >
        {isListening ? (
          <MicOff className="w-5 h-5 text-white" />
        ) : (
          <Mic className="w-5 h-5 text-primary-foreground" />
        )}
        
        {/* Pulse animation when listening */}
        {isListening && (
          <>
            <motion.span
              className="absolute inset-0 rounded-full bg-red-500"
              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <motion.span
              className="absolute inset-0 rounded-full bg-red-500"
              animate={{ scale: [1, 2], opacity: [0.3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </>
        )}
      </motion.button>

      {/* Transcript display */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            className="fixed bottom-20 left-6 z-50 px-4 py-3 rounded-xl bg-background/90 backdrop-blur-xl border border-border/50 shadow-xl max-w-xs"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-foreground">Listening...</span>
            </div>
            
            {transcript ? (
              <p className="text-sm text-muted-foreground italic">"{transcript}"</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Try: "Go to projects" or "Dark mode"
              </p>
            )}

            {/* Voice waveform animation */}
            <div className="flex items-center justify-center gap-1 mt-3">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-primary rounded-full"
                  animate={{
                    height: [8, 20, 8],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceNavigation;
