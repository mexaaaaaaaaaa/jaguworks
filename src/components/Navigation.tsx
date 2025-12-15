import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, User, Briefcase, Award, Target, Mail, Code, Menu, BookOpen, LogIn, LogOut, Phone, Globe, AtSign, Smartphone, Key, Sparkles, Wrench, Share2, Gift, Palette, Quote, Wand2, Eraser, Mic, Volume2, Gamepad2, Bot, Trophy } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import ThemeToggle from "./ThemeToggle";
import ScrollProgress from "./ScrollProgress";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useSectionVisibility } from "@/hooks/useSectionVisibility";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { isVisible } = useSectionVisibility();

  const handleAuthAction = async () => {
    if (user) {
      await signOut();
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
    } else {
      navigate("/auth");
    }
  };

  // Base nav items with visibility keys
  const allNavItems = [
    { path: "/", label: "Home", icon: Home, visibilityKey: null },
    { path: "/about", label: "About", icon: User, visibilityKey: "about" as const },
    { path: "/projects", label: "Projects", icon: Briefcase, visibilityKey: "projects" as const },
    { path: "/skills", label: "Skills", icon: Code, visibilityKey: "skills" as const },
    { path: "/blog", label: "Blog", icon: BookOpen, visibilityKey: "blog" as const },
    { path: "/achievements", label: "Achievements", icon: Award, visibilityKey: "achievements" as const },
    { path: "/goals", label: "Goals", icon: Target, visibilityKey: "future_goals" as const },
    { path: "/contact", label: "Contact", icon: Mail, visibilityKey: "contact" as const },
    { path: "/games", label: "Games", icon: Gamepad2, visibilityKey: null },
    { path: "/games/leaderboard", label: "Leaderboard", icon: Trophy, visibilityKey: null },
    { path: "/discord-bot-platform", label: "Bot Platform", icon: Bot, visibilityKey: null },
    { path: "/number-tracker", label: "Number Tracker", icon: Phone, visibilityKey: null },
    { path: "/ip-tracker", label: "IP Tracker", icon: Globe, visibilityKey: null },
    { path: "/username-checker", label: "Username Checker", icon: AtSign, visibilityKey: null },
    { path: "/device-info", label: "Device Info", icon: Smartphone, visibilityKey: null },
    { path: "/password-generator", label: "Password Gen", icon: Key, visibilityKey: null },
    { path: "/ai-image-generator", label: "AI Image Gen", icon: Sparkles, visibilityKey: null },
    { path: "/my-status", label: "My Status", icon: Share2, visibilityKey: null },
    { path: "/share-and-earn", label: "Share & Earn", icon: Gift, visibilityKey: null },
    { path: "/random-ai-art", label: "Random AI Art", icon: Palette, visibilityKey: null },
    { path: "/random-quote", label: "Random Quote", icon: Quote, visibilityKey: null },
    { path: "/image-enhancer", label: "Image Enhancer", icon: Wand2, visibilityKey: null },
    { path: "/background-remover", label: "BG Remover", icon: Eraser, visibilityKey: null },
    { path: "/speech-to-text", label: "Speech to Text", icon: Mic, visibilityKey: null },
    { path: "/text-to-speech", label: "Text to Speech", icon: Volume2, visibilityKey: null },
  ];

  // Filter nav items based on visibility
  const navItems = allNavItems.filter((item) => {
    if (item.visibilityKey === null) return true;
    return isVisible(item.visibilityKey);
  });

  return (
    <>
      <ScrollProgress />
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border shadow-lg">
        <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl md:text-2xl font-bold gradient-text">
            Jagmohan
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-1 max-w-[600px] overflow-x-auto scrollbar-hide">
              {navItems.slice(0, 8).map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 whitespace-nowrap text-sm ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
            {/* Tools Dropdown */}
            {navItems.length > 8 && (
              <Sheet>
                <SheetTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-300 text-sm">
                    <Wrench className="w-4 h-4" />
                    <span>Tools</span>
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] bg-card/95 backdrop-blur-lg">
                  <div className="flex flex-col gap-2 mt-8">
                    <h3 className="text-lg font-semibold mb-2 gradient-text">Tools</h3>
                    {navItems.slice(8).map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-base font-medium">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </SheetContent>
              </Sheet>
            )}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAuthAction}
              >
                {user ? (
                  <>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation - Hamburger Menu */}
          <div className="lg:hidden flex items-center gap-4">
            <ThemeToggle />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button className="p-2 text-foreground hover:bg-accent rounded-lg transition-colors">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] bg-card/95 backdrop-blur-lg overflow-y-auto">
                <div className="flex flex-col gap-2 mt-8 pb-8">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-base font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                  <div className="mt-4 pt-4 border-t border-border">
                    <Button
                      variant="ghost"
                      onClick={handleAuthAction}
                      className="w-full justify-start"
                    >
                      {user ? (
                        <>
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </>
                      ) : (
                        <>
                          <LogIn className="h-4 w-4 mr-2" />
                          Sign In
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      </nav>
    </>
  );
};

export default Navigation;
