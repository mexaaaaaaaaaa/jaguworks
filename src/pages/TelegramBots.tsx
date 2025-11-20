import { ArrowLeft, Bot, Sparkles, Zap, Shield, Image, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const bots = [
  {
    name: "foll0wers_bot",
    link: "https://t.me/foll0wers_bot",
    description: "Tools for creators, follower insights, quick engagement utilities.",
    features: ["Creator Tools", "Follower Analytics", "Engagement Boost", "Quick Insights"],
    gradient: "from-purple-500/20 to-pink-500/20",
    glowColor: "shadow-purple-500/50",
    icon: Users,
  },
  {
    name: "BackgroundRemoveErrBot",
    link: "https://t.me/Backgroundremoveerrbot",
    description: "AI background remover with clean transparent-PNG output.",
    features: ["AI-Powered", "Transparent PNG", "Instant Processing", "High Quality", "Batch Support"],
    gradient: "from-cyan-500/20 to-blue-500/20",
    glowColor: "shadow-cyan-500/50",
    icon: Image,
  },
  {
    name: "AllInOneBot",
    link: "https://t.me/Allononebot",
    description: "A multi-purpose utility bot offering moderation, text tools, and content helpers.",
    features: ["Moderation Tools", "Text Utilities", "Content Helpers", "Multi-Purpose"],
    gradient: "from-blue-500/20 to-indigo-500/20",
    glowColor: "shadow-blue-500/50",
    icon: Zap,
  },
  {
    name: "MyVCardMakerBot",
    link: "https://t.me/MyVCardMakerBot",
    description: "AI-powered digital vCard generator with modern templates and instant export.",
    features: ["AI-Powered", "Modern Templates", "Instant Export", "Digital Cards", "Professional"],
    gradient: "from-violet-500/20 to-purple-500/20",
    glowColor: "shadow-violet-500/50",
    icon: FileText,
  },
];

const TelegramBots = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Floating background shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      {/* Back button */}
      <div className="relative z-10 container mx-auto px-4 pt-8">
        <Link to="/">
          <Button variant="ghost" className="gap-2 hover:bg-primary/10">
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <Bot className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Premium Bot Collection</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold gradient-text leading-tight">
            My Custom Telegram Bot Collection
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A showcase of advanced, hand-crafted bots built with precision, creativity, and AI-powered logic.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">Built with passion and skill</span>
            <Sparkles className="w-6 h-6 text-accent animate-pulse" style={{ animationDelay: "0.5s" }} />
          </div>
        </div>
      </section>

      {/* Bots Grid */}
      <section className="relative z-10 container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {bots.map((bot, index) => {
            const Icon = bot.icon;
            return (
              <div
                key={bot.name}
                className="group relative animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Glow effect */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${bot.gradient} rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500`} />
                
                {/* Card */}
                <div className="relative h-full bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${bot.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-foreground" />
                  </div>

                  {/* Bot name */}
                  <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                    {bot.name}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {bot.description}
                  </p>

                  {/* Feature badges */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {bot.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Open button */}
                  <a
                    href={bot.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button
                      variant="outline"
                      className={`w-full group/btn relative overflow-hidden border-2 border-primary/50 hover:border-primary ${bot.glowColor} hover:shadow-xl transition-all duration-300`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2 font-semibold">
                        Open Bot
                        <Bot className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                    </Button>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer section */}
      <section className="relative z-10 container mx-auto px-4 pb-20 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground">Crafted with precision and teamwork</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Each bot is carefully designed to provide exceptional user experience and powerful functionality
          </p>
        </div>
      </section>
    </div>
  );
};

export default TelegramBots;
