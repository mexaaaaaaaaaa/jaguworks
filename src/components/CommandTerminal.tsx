import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Command {
  input: string;
  output: string | JSX.Element;
}

const CommandTerminal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Command[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const commands: Record<string, () => string | JSX.Element> = {
    help: () => `
Available Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  help          Show this help message
  about         Go to About page
  projects      Go to Projects page
  skills        Go to Skills page
  contact       Go to Contact page
  blog          Go to Blog page
  discord       Open Discord invite
  github        Open GitHub profile
  email         Copy email address
  
  matrix        🔴 Enter the Matrix
  hack          🔴 Hack the mainframe
  whoami        Display user info
  clear         Clear terminal
  exit          Close terminal
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tip: Press Tab for autocomplete
    `,
    about: () => { navigate('/about'); setIsOpen(false); return 'Navigating to About...'; },
    projects: () => { navigate('/projects'); setIsOpen(false); return 'Navigating to Projects...'; },
    skills: () => { navigate('/skills'); setIsOpen(false); return 'Navigating to Skills...'; },
    contact: () => { navigate('/contact'); setIsOpen(false); return 'Navigating to Contact...'; },
    blog: () => { navigate('/blog'); setIsOpen(false); return 'Navigating to Blog...'; },
    games: () => { navigate('/games'); setIsOpen(false); return 'Navigating to Mini Games...'; },
    discord: () => { window.open('https://discord.gg/6CdCgjsVua', '_blank'); return 'Opening Discord...'; },
    github: () => { window.open('https://github.com/theghoxt69-creator', '_blank'); return 'Opening GitHub...'; },
    email: () => { navigator.clipboard.writeText('jagmohandhaker@gmail.com'); return '📋 Email copied to clipboard: jagmohandhaker@gmail.com'; },
    whoami: () => `
╔══════════════════════════════════════╗
║          VISITOR PROFILE             ║
╠══════════════════════════════════════╣
║  Status: Exploring Jagmohan's World  ║
║  Access: GRANTED                     ║
║  Clearance: VIP                      ║
╚══════════════════════════════════════╝
    `,
    clear: () => { setHistory([]); return ''; },
    exit: () => { setIsOpen(false); return 'Closing terminal...'; },
    matrix: () => {
      document.body.classList.add('matrix-mode');
      setTimeout(() => document.body.classList.remove('matrix-mode'), 5000);
      return '🔴 Entering the Matrix... Reality is an illusion.';
    },
    hack: () => {
      return (
        <div className="font-mono text-xs">
          <div className="text-green-400 animate-pulse">
            [*] Initializing hack sequence...<br/>
            [*] Bypassing firewall... SUCCESS<br/>
            [*] Accessing mainframe... SUCCESS<br/>
            [*] Downloading secrets...<br/>
            [!] JK! This is just for fun 😄<br/>
            [*] No actual hacking occurred!
          </div>
        </div>
      );
    },
    'sudo rm -rf': () => '🚫 Nice try! But this terminal is protected.',
    hello: () => 'Hello there! 👋 Welcome to Jagmohan\'s portfolio!',
    hi: () => 'Hey! How can I help you today?',
    date: () => new Date().toLocaleString(),
    time: () => new Date().toLocaleTimeString(),
    ls: () => 'about.tsx  projects.tsx  skills.tsx  contact.tsx  blog.tsx',
    pwd: () => '/home/jagmohan/portfolio',
    cat: () => 'Usage: cat <filename> (Try: cat readme)',
    'cat readme': () => `
═══════════════════════════════════════
        JAGMOHAN'S PORTFOLIO
═══════════════════════════════════════
Full Stack Developer | Gaming Expert
Discord Automation | Minecraft Servers
Telegram Bots | AI Integration

Contact: jagmohandhaker@gmail.com
═══════════════════════════════════════
    `,
    version: () => 'JaguWorks Terminal v2.0.0 - Built with ❤️',
    credits: () => 'Built by Jagmohan with Lovable AI',
  };

  const executeCommand = useCallback((cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const commandFn = commands[trimmedCmd];
    
    let output: string | JSX.Element;
    if (commandFn) {
      output = commandFn();
    } else if (trimmedCmd === '') {
      output = '';
    } else {
      output = `Command not found: ${trimmedCmd}. Type 'help' for available commands.`;
    }

    if (trimmedCmd !== 'clear' && trimmedCmd !== '') {
      setHistory(prev => [...prev, { input: cmd, output }]);
      setCommandHistory(prev => [...prev, cmd]);
    }
    setHistoryIndex(-1);
  }, [navigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const matchingCommands = Object.keys(commands).filter(cmd => cmd.startsWith(input.toLowerCase()));
      if (matchingCommands.length === 1) {
        setInput(matchingCommands[0]);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
        >
          <motion.div
            className="w-full max-w-3xl h-[500px] rounded-lg overflow-hidden shadow-2xl shadow-green-500/20 border border-green-500/30"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            {/* Header */}
            <div className="bg-gray-900 px-4 py-2 flex items-center justify-between border-b border-green-500/30">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-mono text-sm">jagmohan@portfolio:~</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-mono">Press ESC or ` to close</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="bg-black/95 h-[calc(100%-40px)] font-mono text-sm">
              <div
                ref={scrollRef}
                className="h-[calc(100%-40px)] overflow-y-auto p-4 space-y-2"
              >
                {/* Welcome Message */}
                <div className="text-green-400">
                  <pre className="text-xs text-cyan-400">{`
     _                                       _                 
    | | __ _  __ _ _   _ _ __ ___   ___  | |__   __ _ _ __  
 _  | |/ _\` |/ _\` | | | | '_ \` _ \\ / _ \\ | '_ \\ / _\` | '_ \\ 
| |_| | (_| | (_| | |_| | | | | | | (_) || | | | (_| | | | |
 \\___/ \\__,_|\\__, |\\__,_|_| |_| |_|\\___/ |_| |_|\\__,_|_| |_|
             |___/                                           
                  `}</pre>
                  <p className="mt-2">Welcome to Jagmohan's Terminal! Type 'help' for commands.</p>
                </div>

                {/* Command History */}
                {history.map((cmd, index) => (
                  <div key={index}>
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400">❯</span>
                      <span className="text-white">{cmd.input}</span>
                    </div>
                    {cmd.output && (
                      <div className="text-green-400 pl-4 whitespace-pre-wrap">
                        {cmd.output}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="px-4 py-2 flex items-center gap-2 border-t border-green-500/20">
                <span className="text-cyan-400">❯</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-white outline-none font-mono"
                  autoComplete="off"
                  spellCheck="false"
                />
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandTerminal;
