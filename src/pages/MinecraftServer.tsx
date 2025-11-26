import { useState } from "react";
import { Server, Users, Globe, Star, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const MinecraftServer = () => {
  const [copiedIP, setCopiedIP] = useState(false);

  const serverIP = "play.yourserver.net";

  const serverInfo = {
    name: "JaguWorks MC Server",
    version: "1.21.6",
    playerCapacity: "500+",
    owner: "Jagmohan",
    requirements: "Minecraft Java or Bedrock Edition",
    lastUpdated: "November 2025",
    category: "Survival, Creative, PvP, Minigames",
    location: "India",
    features: "Cross-Play, Economy, Land Claim, Custom Plugins, Anti-Cheat",
    rating: 4.8
  };

  const handleCopyIP = () => {
    navigator.clipboard.writeText(serverIP);
    setCopiedIP(true);
    toast.success("Server IP copied to clipboard!");
    setTimeout(() => setCopiedIP(false), 2000);
  };

  const features = [
    {
      title: "Lag-Free Performance",
      description: "Experience smooth gameplay with our high-performance servers located in India."
    },
    {
      title: "24/7 Uptime",
      description: "Our servers are monitored round the clock to ensure maximum uptime and stability."
    },
    {
      title: "Active Community",
      description: "Join hundreds of active players in our friendly and vibrant community."
    },
    {
      title: "Custom Plugins",
      description: "Enjoy unique gameplay with our hand-crafted custom plugins and features."
    },
    {
      title: "Regular Events",
      description: "Participate in exciting events, competitions, and giveaways every week."
    },
    {
      title: "Anti-Cheat Protection",
      description: "Fair gameplay guaranteed with our advanced anti-cheat systems."
    }
  ];

  const gameModes = [
    { name: "Survival", description: "Classic survival with custom enhancements", icon: "⛏️" },
    { name: "Creative", description: "Build without limits in creative mode", icon: "🎨" },
    { name: "PvP Arena", description: "Test your combat skills against others", icon: "⚔️" },
    { name: "Minigames", description: "Enjoy various fun minigames", icon: "🎮" },
    { name: "SkyBlock", description: "Start on a floating island and expand", icon: "🏝️" },
    { name: "BedWars", description: "Protect your bed and destroy others", icon: "🛏️" }
  ];

  return (
    <PageTransition>
      <SEO 
        title="JaguWorks Minecraft Server - Best MC Server in India"
        description="Join JaguWorks Minecraft Server for lag-free gameplay, exciting game modes, and a vibrant community. Works on latest version with cross-play support."
        keywords="minecraft server, mc server, indian minecraft server, survival server, bedwars, pvp server, jagmohan minecraft"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
          
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                <Server className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Works on Latest Version</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent">
                JaguWorks MC Server
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Join our server to experience lag-free gameplay, exciting game modes, and a vibrant community!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
                <div className="flex items-center gap-3 px-6 py-3 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50">
                  <code className="text-lg font-mono text-primary">{serverIP}</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopyIP}
                    className="h-8 w-8 p-0"
                  >
                    {copiedIP ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                
                <Button size="lg" className="group relative overflow-hidden">
                  <span className="relative z-10">Join Server Now</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-glow to-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Server Info Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <Card className="p-8 bg-card/50 backdrop-blur-xl border-primary/20">
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Server className="w-8 h-8 text-primary" />
                Server Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Server Name", value: serverInfo.name },
                  { label: "Latest Version", value: serverInfo.version },
                  { label: "Player Capacity", value: serverInfo.playerCapacity },
                  { label: "Owner", value: serverInfo.owner },
                  { label: "Requirements", value: serverInfo.requirements },
                  { label: "Last Updated", value: serverInfo.lastUpdated },
                  { label: "Server Category", value: serverInfo.category },
                  { label: "Server Location", value: serverInfo.location },
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-start p-4 rounded-lg bg-background/50 border border-border/50">
                    <span className="text-muted-foreground font-medium">{item.label}</span>
                    <span className="text-foreground font-semibold text-right">{item.value}</span>
                  </div>
                ))}
                
                <div className="flex justify-between items-start p-4 rounded-lg bg-background/50 border border-border/50 md:col-span-2">
                  <span className="text-muted-foreground font-medium">Features</span>
                  <span className="text-foreground font-semibold text-right">{serverInfo.features}</span>
                </div>
                
                <div className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 md:col-span-2">
                  <span className="text-muted-foreground font-medium flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    Rating
                  </span>
                  <span className="text-2xl font-bold text-primary">{serverInfo.rating} / 5.0</span>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Game Modes Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-transparent to-background/50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Game Modes & Activities</h2>
              <p className="text-muted-foreground text-lg">Choose from various exciting game modes</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gameModes.map((mode, index) => (
                <Card key={index} className="p-6 bg-card/50 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all hover:scale-105 group">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{mode.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-primary">{mode.name}</h3>
                  <p className="text-muted-foreground">{mode.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Why Join Our Server?</h2>
              <p className="text-muted-foreground text-lg">Experience the best Minecraft has to offer</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="p-6 bg-card/50 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Community Stats */}
        <section className="py-16 px-4 bg-gradient-to-b from-background/50 to-transparent">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-8 text-center bg-card/50 backdrop-blur-xl border-primary/20">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-muted-foreground">Active Players</div>
              </Card>
              
              <Card className="p-8 text-center bg-card/50 backdrop-blur-xl border-primary/20">
                <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
                <div className="text-4xl font-bold mb-2">99.9%</div>
                <div className="text-muted-foreground">Server Uptime</div>
              </Card>
              
              <Card className="p-8 text-center bg-card/50 backdrop-blur-xl border-primary/20">
                <Star className="w-12 h-12 text-primary mx-auto mb-4" />
                <div className="text-4xl font-bold mb-2">{serverInfo.rating}</div>
                <div className="text-muted-foreground">Player Rating</div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <Card className="p-12 bg-gradient-to-br from-primary/10 via-card/50 to-secondary/10 backdrop-blur-xl border-primary/30">
              <h2 className="text-4xl font-bold mb-4">Ready to Join?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Start your adventure today and become part of our amazing community!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-3 px-6 py-3 bg-background/50 backdrop-blur-sm rounded-lg border border-border/50">
                  <code className="text-lg font-mono text-primary">{serverIP}</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopyIP}
                    className="h-8 w-8 p-0"
                  >
                    {copiedIP ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                
                <Button size="lg" className="group relative overflow-hidden">
                  <span className="relative z-10">Copy IP & Join Now</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-glow to-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </div>
            </Card>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default MinecraftServer;
