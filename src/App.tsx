import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { lazy, Suspense, useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import Index from "./pages/Index";
import AboutPage from "./pages/About";
import FeaturedProjects from "./pages/FeaturedProjects";
import SkillsPage from "./pages/SkillsPage";
import AchievementsPage from "./pages/AchievementsPage";
import FutureGoalsPage from "./pages/FutureGoalsPage";
import ContactPage from "./pages/ContactPage";
import TelegramBots from "./pages/TelegramBots";
import CinematicReel from "./pages/CinematicReel";
import DiscordAutomation from "./pages/DiscordAutomation";
import DiscordBot from "./pages/DiscordBot";
import DiscordBotPlatform from "./pages/DiscordBotPlatform";
import GlobalLeaderboard from "./pages/GlobalLeaderboard";
import MinecraftPlans from "./pages/MinecraftPlans";
import MinecraftServer from "./pages/MinecraftServer";
import DiscordPlans from "./pages/DiscordPlans";
import Cart from "./pages/Cart";
import CheckoutRedirect from "./pages/CheckoutRedirect";
import PaymentDetails from "./pages/PaymentDetails";
import PaymentReturn from "./pages/PaymentReturn";
import NotFound from "./pages/NotFound";
import NumberTracker from "./pages/NumberTracker";
import IpTracker from "./pages/IpTracker";
import UsernameChecker from "./pages/UsernameChecker";
import DeviceInfo from "./pages/DeviceInfo";
import PasswordGenerator from "./pages/PasswordGenerator";
import AiImageGenerator from "./pages/AiImageGenerator";
import MyStatus from "./pages/MyStatus";
import ShareAndEarn from "./pages/ShareAndEarn";
import RandomAiArt from "./pages/RandomAiArt";
import RandomQuote from "./pages/RandomQuote";
import ImageEnhancer from "./pages/ImageEnhancer";
import BackgroundRemover from "./pages/BackgroundRemover";
import SpeechToText from "./pages/SpeechToText";
import TextToSpeech from "./pages/TextToSpeech";
import Auth from "./pages/Auth";
import Navigation from "./components/Navigation";
import PromoNotifications from "./components/PromoNotifications";
import { useConsoleMessage, useKonamiCode } from "./hooks/useEasterEggs";
import { toast } from "sonner";
import VisibilityGuard from "./components/VisibilityGuard";

// New unique features
import AIChatAssistant from "./components/AIChatAssistant";
import CommandTerminal from "./components/CommandTerminal";
import CustomCursor from "./components/CustomCursor";
import CinematicIntro from "./components/CinematicIntro";
import VoiceNavigation from "./components/VoiceNavigation";
import InstallPrompt from "./components/InstallPrompt";

// Lazy load games
import Games from "./pages/Games";
import SnakeGame from "./pages/games/SnakeGame";
import MemoryGame from "./pages/games/MemoryGame";
import TypingTest from "./pages/games/TypingTest";
import PuzzleGame from "./pages/games/PuzzleGame";
import QuizGame from "./pages/games/QuizGame";
import FlappyGame from "./pages/games/FlappyGame";

// Lazy load blog pages
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));

// Lazy load admin pages
import AdminLayout from "./components/admin/AdminLayout";
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminPlans = lazy(() => import("./pages/admin/AdminPlans"));
const AdminAddons = lazy(() => import("./pages/admin/AdminAddons"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog"));
const AdminTestimonials = lazy(() => import("./pages/admin/AdminTestimonials"));
const AdminStats = lazy(() => import("./pages/admin/AdminStats"));
const AdminAchievements = lazy(() => import("./pages/admin/AdminAchievements"));
const AdminCoupons = lazy(() => import("./pages/admin/AdminCoupons"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminSectionBuilder = lazy(() => import("./pages/admin/AdminSectionBuilder"));
const AdminSocialLinks = lazy(() => import("./pages/admin/AdminSocialLinks"));
const AdminTheme = lazy(() => import("./pages/admin/AdminTheme"));
const AdminHeroEditor = lazy(() => import("./pages/admin/AdminHeroEditor"));
const AdminAboutEditor = lazy(() => import("./pages/admin/AdminAboutEditor"));
const AdminSectionVisibility = lazy(() => import("./pages/admin/AdminSectionVisibility"));
const AdminPinSettings = lazy(() => import("./pages/admin/AdminPinSettings"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminMediaLibrary = lazy(() => import("./pages/admin/AdminMediaLibrary"));
const AdminBackup = lazy(() => import("./pages/admin/AdminBackup"));
const AdminTrash = lazy(() => import("./pages/admin/AdminTrash"));
const AdminNotes = lazy(() => import("./pages/admin/AdminNotes"));

const queryClient = new QueryClient();

const App = () => {
  const [showIntro, setShowIntro] = useState(false);
  
  useEffect(() => {
    // Check if first visit for cinematic intro
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    if (!hasVisited) {
      setShowIntro(true);
    }
  }, []);

  const handleIntroComplete = () => {
    localStorage.setItem('hasVisitedBefore', 'true');
    setShowIntro(false);
  };

  useConsoleMessage();

  // Konami Code Easter Egg
  useKonamiCode(() => {
    const colors = ['#ff006e', '#00ff9d', '#00d9ff', '#ff9f1c'];
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}%;
        top: -10px;
        z-index: 9999;
        animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
        transform: rotate(${Math.random() * 360}deg);
      `;
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 5000);
    }
    
    // Add confetti animation style
    if (!document.getElementById('confetti-style')) {
      const style = document.createElement('style');
      style.id = 'confetti-style';
      style.textContent = `
        @keyframes confettiFall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    toast.success('🎮 Konami Code Activated! You found the secret!', {
      duration: 5000,
    });
  });

  return (
    <>
      {/* Cinematic Intro for first-time visitors */}
      {showIntro && <CinematicIntro onComplete={handleIntroComplete} />}
      
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Analytics />
            
            {/* Global unique features - outside router */}
            <CustomCursor />
            <InstallPrompt />
            
            <HashRouter>
              {/* Components that use useNavigate must be inside Router */}
              <AIChatAssistant />
              <CommandTerminal />
              <VoiceNavigation />
              <Navigation />
              <PromoNotifications />
              <div className="pt-16">
                <Suspense fallback={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                }>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<VisibilityGuard section="about"><AboutPage /></VisibilityGuard>} />
                    <Route path="/projects" element={<VisibilityGuard section="projects"><FeaturedProjects /></VisibilityGuard>} />
                    <Route path="/skills" element={<VisibilityGuard section="skills"><SkillsPage /></VisibilityGuard>} />
                    <Route path="/achievements" element={<VisibilityGuard section="achievements"><AchievementsPage /></VisibilityGuard>} />
                    <Route path="/goals" element={<VisibilityGuard section="future_goals"><FutureGoalsPage /></VisibilityGuard>} />
                    <Route path="/contact" element={<VisibilityGuard section="contact"><ContactPage /></VisibilityGuard>} />
                    <Route path="/blog" element={<VisibilityGuard section="blog"><Blog /></VisibilityGuard>} />
                    <Route path="/blog/:slug" element={<VisibilityGuard section="blog"><BlogPost /></VisibilityGuard>} />
                    <Route path="/ai-telegram-bots" element={<VisibilityGuard section="telegram_bots"><TelegramBots /></VisibilityGuard>} />
                    <Route path="/cinematic-reel" element={<VisibilityGuard section="cinematic_reel"><CinematicReel /></VisibilityGuard>} />
                    <Route path="/discord-automation" element={<VisibilityGuard section="discord_automation"><DiscordAutomation /></VisibilityGuard>} />
                    <Route path="/discord-bot" element={<DiscordBot />} />
                    <Route path="/discord-bot-platform" element={<DiscordBotPlatform />} />
                    <Route path="/minecraft-plans" element={<VisibilityGuard section="minecraft_plans"><MinecraftPlans /></VisibilityGuard>} />
                    <Route path="/minecraft-server" element={<VisibilityGuard section="minecraft_server"><MinecraftServer /></VisibilityGuard>} />
                    <Route path="/discord-plans" element={<VisibilityGuard section="discord_plans"><DiscordPlans /></VisibilityGuard>} />
                    <Route path="/number-tracker" element={<NumberTracker />} />
                    <Route path="/ip-tracker" element={<IpTracker />} />
                    <Route path="/username-checker" element={<UsernameChecker />} />
                    <Route path="/device-info" element={<DeviceInfo />} />
                    <Route path="/password-generator" element={<PasswordGenerator />} />
                    <Route path="/ai-image-generator" element={<AiImageGenerator />} />
                    <Route path="/my-status" element={<MyStatus />} />
                    <Route path="/share-and-earn" element={<ShareAndEarn />} />
                    <Route path="/random-ai-art" element={<RandomAiArt />} />
                    <Route path="/random-quote" element={<RandomQuote />} />
                    <Route path="/image-enhancer" element={<ImageEnhancer />} />
                    <Route path="/background-remover" element={<BackgroundRemover />} />
                    <Route path="/speech-to-text" element={<SpeechToText />} />
                    <Route path="/text-to-speech" element={<TextToSpeech />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout-redirect" element={<CheckoutRedirect />} />
                    <Route path="/payment-details" element={<PaymentDetails />} />
                    <Route path="/payment-return" element={<PaymentReturn />} />
                    <Route path="/auth" element={<Auth />} />
                    {/* Games Routes */}
                    <Route path="/games" element={<Games />} />
                    <Route path="/games/leaderboard" element={<GlobalLeaderboard />} />
                    <Route path="/games/snake" element={<SnakeGame />} />
                    <Route path="/games/memory" element={<MemoryGame />} />
                    <Route path="/games/typing" element={<TypingTest />} />
                    <Route path="/games/puzzle" element={<PuzzleGame />} />
                    <Route path="/games/quiz" element={<QuizGame />} />
                    <Route path="/games/flappy" element={<FlappyGame />} />
                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="visibility" element={<AdminSectionVisibility />} />
                      <Route path="hero" element={<AdminHeroEditor />} />
                      <Route path="about" element={<AdminAboutEditor />} />
                      <Route path="sections" element={<AdminSectionBuilder />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="plans" element={<AdminPlans />} />
                      <Route path="addons" element={<AdminAddons />} />
                      <Route path="blog" element={<AdminBlog />} />
                      <Route path="testimonials" element={<AdminTestimonials />} />
                      <Route path="stats" element={<AdminStats />} />
                      <Route path="achievements" element={<AdminAchievements />} />
                      <Route path="social-links" element={<AdminSocialLinks />} />
                      <Route path="theme" element={<AdminTheme />} />
                      <Route path="coupons" element={<AdminCoupons />} />
                      <Route path="pin" element={<AdminPinSettings />} />
                      <Route path="analytics" element={<AdminAnalytics />} />
                      <Route path="media-library" element={<AdminMediaLibrary />} />
                      <Route path="backup" element={<AdminBackup />} />
                      <Route path="trash" element={<AdminTrash />} />
                      <Route path="notes" element={<AdminNotes />} />
                      <Route path="settings" element={<AdminSettings />} />
                      <Route path="users" element={<AdminUsers />} />
                    </Route>
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </div>
            </HashRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
};

export default App;
