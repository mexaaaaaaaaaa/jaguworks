import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { lazy, Suspense } from "react";
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
import MinecraftPlans from "./pages/MinecraftPlans";
import DiscordPlans from "./pages/DiscordPlans";
import Cart from "./pages/Cart";
import CheckoutRedirect from "./pages/CheckoutRedirect";
import PaymentDetails from "./pages/PaymentDetails";
import PaymentReturn from "./pages/PaymentReturn";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Navigation from "./components/Navigation";
import PromoNotifications from "./components/PromoNotifications";
import { useConsoleMessage, useKonamiCode } from "./hooks/useEasterEggs";
import { toast } from "sonner";

// Lazy load blog pages
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));

const queryClient = new QueryClient();

const App = () => {
  useConsoleMessage();

  // Konami Code Easter Egg
  useKonamiCode(() => {
    // Create confetti effect
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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Analytics />
          <HashRouter>
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
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/projects" element={<FeaturedProjects />} />
                  <Route path="/skills" element={<SkillsPage />} />
                  <Route path="/achievements" element={<AchievementsPage />} />
                  <Route path="/goals" element={<FutureGoalsPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/ai-telegram-bots" element={<TelegramBots />} />
                  <Route path="/cinematic-reel" element={<CinematicReel />} />
                  <Route path="/discord-automation" element={<DiscordAutomation />} />
                  <Route path="/minecraft-plans" element={<MinecraftPlans />} />
                  <Route path="/discord-plans" element={<DiscordPlans />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout-redirect" element={<CheckoutRedirect />} />
                  <Route path="/payment-details" element={<PaymentDetails />} />
                  <Route path="/payment-return" element={<PaymentReturn />} />
                  <Route path="/auth" element={<Auth />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>
          </HashRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
