import { useEffect, useState } from "react";
import { Bot, Gamepad, MessageSquare, User, Code2, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PromoMessage {
  id: number;
  icon: any;
  title: string;
  message: string;
  link: string;
  gradient: string;
}

const PromoNotifications = () => {
  const navigate = useNavigate();
  const [currentPromo, setCurrentPromo] = useState<PromoMessage | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const promoMessages: PromoMessage[] = [
    {
      id: 1,
      icon: Gamepad,
      title: "Minecraft Plans",
      message: "Professional server setup from ₹49",
      link: "/minecraft-plans",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      id: 2,
      icon: MessageSquare,
      title: "Discord Plans",
      message: "Custom Discord server setup available",
      link: "/discord-plans",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      id: 3,
      icon: Bot,
      title: "Telegram Bots",
      message: "Check out my AI-powered bots",
      link: "/ai-telegram-bot",
      gradient: "from-green-500 to-cyan-500"
    },
    {
      id: 4,
      icon: Code2,
      title: "Featured Projects",
      message: "Explore my latest work",
      link: "/projects",
      gradient: "from-orange-500 to-red-500"
    },
    {
      id: 5,
      icon: User,
      title: "About Me",
      message: "Learn more about my journey",
      link: "/about",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      id: 6,
      icon: Trophy,
      title: "Achievements",
      message: "500+ projects completed",
      link: "/achievements",
      gradient: "from-pink-500 to-purple-500"
    }
  ];

  useEffect(() => {
    let promoIndex = 0;
    
    const showPromo = () => {
      setCurrentPromo(promoMessages[promoIndex]);
      setIsVisible(true);
      
      // Hide after 4 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 4000);
      
      promoIndex = (promoIndex + 1) % promoMessages.length;
    };

    // Show first promo after 5 seconds
    const initialTimeout = setTimeout(showPromo, 5000);
    
    // Then show every 15 seconds
    const interval = setInterval(showPromo, 15000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  const handleClick = () => {
    if (currentPromo) {
      navigate(currentPromo.link);
      setIsVisible(false);
    }
  };

  if (!currentPromo || !isVisible) return null;

  const Icon = currentPromo.icon;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 cursor-pointer transition-all duration-500 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
      onClick={handleClick}
    >
      <div className="glass-frost border border-border rounded-xl p-4 min-w-[280px] max-w-[320px] shadow-2xl hover:scale-105 transition-transform duration-300 group">
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 bg-gradient-to-br ${currentPromo.gradient} rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-foreground mb-1 text-sm">
              {currentPromo.title}
            </h3>
            <p className="text-xs text-muted-foreground">
              {currentPromo.message}
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(false);
            }}
            className="text-muted-foreground hover:text-foreground transition-colors text-xl leading-none"
            aria-label="Close notification"
          >
            ×
          </button>
        </div>

        <div className="mt-3 text-xs text-primary font-medium group-hover:underline">
          Click to explore →
        </div>

        {/* Progress bar */}
        <div className="mt-2 h-1 bg-muted/30 rounded-full overflow-hidden">
          <div className={`h-full bg-gradient-to-r ${currentPromo.gradient} animate-progress`}></div>
        </div>
      </div>
    </div>
  );
};

export default PromoNotifications;
