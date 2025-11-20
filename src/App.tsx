import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import Navigation from "./components/Navigation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navigation />
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/projects" element={<FeaturedProjects />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/goals" element={<FutureGoalsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/ai-telegram-bots" element={<TelegramBots />} />
            <Route path="/cinematic-reel" element={<CinematicReel />} />
            <Route path="/discord-automation" element={<DiscordAutomation />} />
            <Route path="/minecraft-plans" element={<MinecraftPlans />} />
            <Route path="/discord-plans" element={<DiscordPlans />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout-redirect" element={<CheckoutRedirect />} />
            <Route path="/payment-details" element={<PaymentDetails />} />
            <Route path="/payment-return" element={<PaymentReturn />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
