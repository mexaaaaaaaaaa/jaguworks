import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, ExternalLink, Github, Play, Shield, Server, Users, 
  Zap, Settings, Lock, Bot, Globe, Database, Code, CheckCircle,
  MessageSquare, UserCheck, Bell, ToggleRight, Activity, Key
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';

const features = [
  {
    icon: UserCheck,
    title: 'Discord OAuth2 Login',
    description: 'Secure authentication using Discord OAuth2 for seamless user login and authorization flow.'
  },
  {
    icon: Server,
    title: 'Server List Detection',
    description: 'Automatically detects servers where user has Admin permissions for bot management.'
  },
  {
    icon: Bot,
    title: 'Add Bot to Server Flow',
    description: 'Streamlined process to invite and configure the bot with required permissions.'
  },
  {
    icon: Settings,
    title: 'Server Configuration Panel',
    description: 'Comprehensive dashboard for managing bot settings per server with real-time updates.'
  },
  {
    icon: Shield,
    title: 'Moderation & Automation',
    description: 'Advanced auto-mod, custom commands, welcome messages, and reaction roles system.'
  },
  {
    icon: Lock,
    title: 'Role & Permission Handling',
    description: 'Granular permission system respecting Discord hierarchy and server roles.'
  },
  {
    icon: Activity,
    title: 'Real-time Bot Status',
    description: 'Live monitoring of bot online/offline status, latency, and server statistics.'
  }
];

const techStack = [
  { name: 'Python', icon: '🐍', desc: 'discord.py' },
  { name: 'FastAPI', icon: '⚡', desc: 'Backend API' },
  { name: 'Discord OAuth2', icon: '🔐', desc: 'Authentication' },
  { name: 'REST API', icon: '🌐', desc: 'Communication' },
  { name: 'React', icon: '⚛️', desc: 'Frontend' },
  { name: 'Tailwind CSS', icon: '🎨', desc: 'Styling' }
];

const securityPoints = [
  'Bot token never exposed to client',
  'Role-based access control (RBAC)',
  'OAuth2 authentication flow',
  'API key protected endpoints',
  'Rate limiting & request validation',
  'Secure session management'
];

const mockServers = [
  { name: 'Gaming Community', icon: '🎮', members: '12.5K', status: 'configured' },
  { name: 'Tech Hub', icon: '💻', members: '8.2K', status: 'configured' },
  { name: 'Music Lovers', icon: '🎵', members: '5.1K', status: 'pending' }
];

const DiscordBotPlatform = () => {
  return (
    <>
      <SEO
        title="Discord Bot Platform | Jagmohan - Full Stack Developer"
        description="Professional Discord bot system built in Python with a scalable web dashboard architecture. Featuring OAuth2, server management, and moderation tools."
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-24 px-4 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-background" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          
          <div className="container mx-auto max-w-6xl relative z-10">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Portfolio
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-4xl mx-auto"
            >
              <Badge className="mb-6 bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                Full Stack System
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Professional Discord Bot System
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Python-based Discord bot with a scalable web dashboard architecture, 
                inspired by platforms like Carl.gg
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                >
                  <Play className="w-4 h-4 mr-2" />
                  View Dashboard (Demo)
                </Button>
                <Button size="lg" variant="outline" className="border-primary/50 hover:bg-primary/10">
                  <Bot className="w-4 h-4 mr-2" />
                  Add Bot to Server
                </Button>
                <Button size="lg" variant="outline" className="border-primary/50 hover:bg-primary/10">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub Repo
                </Button>
              </div>

              <p className="text-sm text-muted-foreground italic">
                Demo UI — Backend connected via secure API
              </p>
            </motion.div>
          </div>
        </section>

        {/* Architecture Section */}
        <section className="py-20 px-4 bg-card/30">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  System Architecture
                </span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A secure, scalable architecture separating frontend, backend, and bot layers
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                { icon: Globe, title: 'Website (Frontend)', desc: 'React dashboard for server management', color: 'from-cyan-500 to-blue-500' },
                { icon: Database, title: 'Secure Backend API', desc: 'FastAPI handling all requests', color: 'from-purple-500 to-pink-500' },
                { icon: Bot, title: 'Python Discord Bot', desc: 'discord.py powering bot logic', color: 'from-indigo-500 to-violet-500' }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className={`absolute -inset-1 bg-gradient-to-r ${item.color} rounded-xl blur opacity-25 group-hover:opacity-50 transition-opacity`} />
                  <Card className="relative bg-card/80 border-border/50 h-full">
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                        <item.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Flow Arrows */}
            <div className="hidden md:flex justify-center items-center gap-4 text-muted-foreground mb-8">
              <span className="text-2xl">→</span>
              <span className="px-4 py-2 bg-primary/10 rounded-full text-sm">Secure Communication</span>
              <span className="text-2xl">→</span>
            </div>

            <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-primary/20 text-center">
              <p className="text-foreground">
                "The website communicates with the Discord bot through a <strong className="text-primary">secure backend API</strong>. 
                The bot never exposes its token and all actions are handled server-side."
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Features Showcase
                </span>
              </h2>
              <p className="text-muted-foreground">
                Professional-grade features for complete Discord server management
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-card/50 border-border/50 h-full hover:border-primary/50 transition-all group">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section className="py-20 px-4 bg-card/30">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  Dashboard Preview
                </span>
              </h2>
              <p className="text-muted-foreground">
                UI mockup representing server management interface
              </p>
            </motion.div>

            <div className="bg-gradient-to-br from-card via-card to-muted/20 rounded-2xl border border-border/50 overflow-hidden">
              {/* Mock Dashboard Header */}
              <div className="bg-muted/50 px-6 py-4 border-b border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bot className="w-8 h-8 text-primary" />
                  <span className="font-bold text-foreground">Bot Dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm text-muted-foreground">Online</span>
                </div>
              </div>

              {/* Mock Server Cards */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Your Servers</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {mockServers.map((server, index) => (
                    <motion.div
                      key={server.name}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-background/50 rounded-xl p-4 border border-border/50 hover:border-primary/50 transition-all"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl">
                          {server.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{server.name}</h4>
                          <p className="text-sm text-muted-foreground">{server.members} members</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {server.status === 'configured' ? (
                          <Button size="sm" className="flex-1 bg-primary/20 hover:bg-primary/30 text-primary">
                            <Settings className="w-4 h-4 mr-1" />
                            Manage
                          </Button>
                        ) : (
                          <Button size="sm" className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400">
                            <Bot className="w-4 h-4 mr-1" />
                            Add Bot
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Feature Toggles Mock */}
                <div className="mt-8 p-4 bg-background/30 rounded-xl border border-border/30">
                  <h4 className="font-semibold text-foreground mb-4">Quick Toggles</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Welcome Messages', 'Auto-Mod', 'Logging', 'Reaction Roles'].map((toggle) => (
                      <div key={toggle} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="text-sm text-foreground">{toggle}</span>
                        <ToggleRight className="w-5 h-5 text-green-400" />
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-center text-sm text-muted-foreground mt-6 italic">
                  This UI represents how server management works, similar to Carl.gg
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                  Tech Stack
                </span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {techStack.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card/50 border border-border/50 rounded-xl p-4 text-center hover:border-primary/50 hover:bg-card/80 transition-all"
                >
                  <div className="text-3xl mb-2">{tech.icon}</div>
                  <h4 className="font-bold text-foreground">{tech.name}</h4>
                  <p className="text-xs text-muted-foreground">{tech.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="py-20 px-4 bg-card/30">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  Security & Best Practices
                </span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {securityPoints.map((point, index) => (
                <motion.div
                  key={point}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-4 bg-card/50 border border-border/50 rounded-xl"
                >
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-foreground">{point}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Explanation */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-20" />
              <Card className="relative bg-card/80 border-primary/20">
                <CardContent className="p-8 md:p-12 text-center">
                  <Code className="w-12 h-12 mx-auto text-primary mb-6" />
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    Portfolio Showcase
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    "This project demonstrates my ability to design <strong className="text-foreground">scalable Discord bot systems</strong> with 
                    real-world architecture, combining <strong className="text-foreground">backend APIs</strong>, 
                    <strong className="text-foreground"> authentication</strong>, and 
                    <strong className="text-foreground"> modern frontend design</strong>."
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-4 mt-8">
                    <Link to="/contact">
                      <Button size="lg" className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Get in Touch
                      </Button>
                    </Link>
                    <Link to="/">
                      <Button size="lg" variant="outline" className="border-primary/50">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Portfolio
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default DiscordBotPlatform;
