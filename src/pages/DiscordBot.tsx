import { motion } from "framer-motion";
import { 
  Shield, Coins, Smile, Ticket, Server, Heart,
  Ban, UserX, VolumeX, AlertTriangle,
  Wallet, Gift, Briefcase, ShoppingCart,
  Image, User, MessageSquare, Info,
  Gamepad2, Users, Settings, Zap,
  Github, ExternalLink
} from "lucide-react";
import { FaDiscord } from "react-icons/fa";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const features = [
  {
    category: "Moderation",
    icon: Shield,
    color: "from-red-500 to-orange-500",
    description: "Keep your server safe with powerful moderation tools",
    commands: [
      { name: "!ban", icon: Ban, desc: "Ban members with reason logging" },
      { name: "!kick", icon: UserX, desc: "Kick members from server" },
      { name: "!mute", icon: VolumeX, desc: "Temporary mute with auto-unmute" },
      { name: "!warn", icon: AlertTriangle, desc: "Warning system with history" },
    ]
  },
  {
    category: "Economy",
    icon: Coins,
    color: "from-yellow-500 to-amber-500",
    description: "Engaging economy system to boost activity",
    commands: [
      { name: "!balance", icon: Wallet, desc: "Check your coin balance" },
      { name: "!daily", icon: Gift, desc: "Claim daily rewards (100-300 coins)" },
      { name: "!work", icon: Briefcase, desc: "Work to earn coins (20-150)" },
      { name: "!shop", icon: ShoppingCart, desc: "Buy items and roles" },
    ]
  },
  {
    category: "Fun & Utility",
    icon: Smile,
    color: "from-green-500 to-emerald-500",
    description: "Entertainment and useful commands",
    commands: [
      { name: "!meme", icon: Image, desc: "Get random memes from Reddit" },
      { name: "!avatar", icon: User, desc: "Display user avatars" },
      { name: "!serverinfo", icon: Info, desc: "Server statistics" },
      { name: "!userinfo", icon: Users, desc: "User information" },
    ]
  },
  {
    category: "Ticket System",
    icon: Ticket,
    color: "from-blue-500 to-cyan-500",
    description: "Professional support ticket management",
    commands: [
      { name: "!ticket", icon: MessageSquare, desc: "Create private support tickets" },
      { name: "Auto-Channels", icon: Settings, desc: "Automatic ticket channels" },
      { name: "Permissions", icon: Shield, desc: "Role-based access control" },
      { name: "Logging", icon: Info, desc: "Full ticket history" },
    ]
  },
  {
    category: "Minecraft Status",
    icon: Gamepad2,
    color: "from-purple-500 to-pink-500",
    description: "Real-time Minecraft server monitoring",
    commands: [
      { name: "!mcstatus", icon: Server, desc: "Query any MC server" },
      { name: "Players", icon: Users, desc: "Online player count" },
      { name: "Version", icon: Info, desc: "Server version info" },
      { name: "MOTD", icon: MessageSquare, desc: "Server description" },
    ]
  },
  {
    category: "Reaction Roles",
    icon: Heart,
    color: "from-pink-500 to-rose-500",
    description: "Self-assignable roles via reactions",
    commands: [
      { name: "!reaction_role_add", icon: Zap, desc: "Setup reaction roles" },
      { name: "Auto-Assign", icon: Users, desc: "Automatic role assignment" },
      { name: "Auto-Remove", icon: UserX, desc: "Remove roles on unreact" },
      { name: "Multiple", icon: Settings, desc: "Multiple roles per message" },
    ]
  },
];

const stats = [
  { label: "Commands", value: "25+" },
  { label: "Uptime", value: "99.9%" },
  { label: "Response", value: "<1s" },
  { label: "Features", value: "6+" },
];

const DiscordBot = () => {
  return (
    <>
      <SEO 
        title="DarkMC Discord Bot - Moderation, Economy & Fun"
        description="Feature-rich Discord bot with moderation, economy system, fun commands, ticket system, Minecraft server status, and reaction roles. Built by Jagmohan."
        keywords="discord bot, darkmc bot, moderation bot, economy bot, minecraft discord bot, reaction roles"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-[#5865F2]/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
              ← Back to Portfolio
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#5865F2] to-[#7289DA] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#5865F2]/30"
              >
                <FaDiscord className="w-14 h-14 text-white" />
              </motion.div>

              <Badge className="mb-4 bg-[#5865F2]/20 text-[#5865F2] border-[#5865F2]/30">
                Open Source Discord Bot
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#5865F2] via-purple-400 to-pink-400 bg-clip-text text-transparent">
                DarkMC Bot
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                A powerful, feature-rich Discord bot with moderation, economy, fun commands, 
                ticket system, Minecraft integration, and reaction roles.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-[#5865F2] hover:bg-[#4752C4] gap-2"
                  onClick={() => window.open("https://discord.gg/6CdCgjsVua", "_blank")}
                >
                  <FaDiscord className="w-5 h-5" />
                  Join Support Server
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="gap-2 border-[#5865F2]/30 hover:bg-[#5865F2]/10"
                  onClick={() => window.open("https://github.com/theghoxt69-creator/FIRECRAFTX", "_blank")}
                >
                  <Github className="w-5 h-5" />
                  View Source
                </Button>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mt-12"
            >
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50"
                >
                  <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Everything you need to manage and engage your Discord community
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.category}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="h-full p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{feature.category}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>

                    {/* Commands */}
                    <div className="space-y-3">
                      {feature.commands.map((cmd, cmdIndex) => (
                        <div 
                          key={cmdIndex}
                          className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
                        >
                          <cmd.icon className="w-4 h-4 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <code className="text-sm font-mono text-primary">{cmd.name}</code>
                            <p className="text-xs text-muted-foreground truncate">{cmd.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Features */}
        <section className="py-20 bg-gradient-to-b from-transparent to-primary/5">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-3xl font-bold text-center mb-12">Additional Features</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { icon: Shield, title: "Auto-Moderation", desc: "Anti-spam protection with automatic muting" },
                  { icon: Users, title: "Welcome System", desc: "Custom welcome messages and auto-roles" },
                  { icon: MessageSquare, title: "Logging", desc: "Comprehensive mod-log channel" },
                  { icon: Settings, title: "Customizable", desc: "Easy to configure and extend" },
                  { icon: Zap, title: "Fast & Reliable", desc: "Built with discord.py for performance" },
                  { icon: Server, title: "SQLite Database", desc: "Persistent data storage" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-card/30 backdrop-blur-sm border border-border/30"
                  >
                    <div className="p-2 rounded-lg bg-primary/10">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[#5865F2]/20 to-purple-500/20 border border-[#5865F2]/30 backdrop-blur-sm"
            >
              <FaDiscord className="w-16 h-16 mx-auto mb-6 text-[#5865F2]" />
              <h2 className="text-3xl font-bold mb-4">Ready to Power Up Your Server?</h2>
              <p className="text-muted-foreground mb-8">
                Get the source code and host your own DarkMC bot, or join our support server for help.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  size="lg"
                  className="bg-[#5865F2] hover:bg-[#4752C4] gap-2"
                  onClick={() => window.open("https://discord.gg/6CdCgjsVua", "_blank")}
                >
                  <FaDiscord className="w-5 h-5" />
                  Join Discord
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="gap-2"
                  onClick={() => window.open("https://github.com/theghoxt69-creator/FIRECRAFTX", "_blank")}
                >
                  <ExternalLink className="w-5 h-5" />
                  Get Source Code
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default DiscordBot;
