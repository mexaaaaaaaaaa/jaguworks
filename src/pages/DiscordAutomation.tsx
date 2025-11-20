import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Copy, MessageSquare, ChevronDown, Shield, Bot, Users, Calendar, Settings, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";

const DiscordAutomation = () => {
  const [expandedServer, setExpandedServer] = useState<string | null>(null);

  const experiences = [
    { server: "FleetMC", role: "Moderator", color: "from-blue-500 to-cyan-500" },
    { server: "FireMC", role: "Staff", color: "from-red-500 to-orange-500" },
    { server: "BattelPai", role: "Moderator", color: "from-purple-500 to-pink-500" },
    { server: "Creator", role: "10+ Discord Servers", color: "from-green-500 to-emerald-500" },
  ];

  const servers = [
    {
      id: "server-1",
      invite: "https://discord.gg/6GtfRUG7f8",
      name: "Gaming Community Hub",
      description: "Large active gaming community with 1000+ members. Focus on competitive gaming, events, and community engagement.",
      role: "Server Creator & Lead Moderator",
      badges: ["Automated Moderation", "Custom Bots", "Event Scheduler"],
      automations: [
        "Auto-moderation system with configurable word filters and spam detection",
        "Welcome flow with verification and role assignment",
        "Level/XP system with role rewards",
        "Event scheduling with automatic reminders",
        "Moderation logging with appeal system",
        "Anti-raid protection with configurable thresholds",
      ],
    },
    {
      id: "server-2",
      invite: "https://discord.gg/N7GSGYdhvg",
      name: "Community & Events Server",
      description: "Event-driven community server with automated scheduling and role management systems.",
      role: "Moderator & Automation Developer",
      badges: ["Reaction Roles", "Event Scheduler", "Custom Commands"],
      automations: [
        "Reaction role system for self-assignment",
        "Automated event announcements and reminders",
        "Custom command framework for moderation",
        "Welcome embeds with server rules",
        "Channel sync for cross-posting",
        "Ticket system for support requests",
      ],
    },
    {
      id: "server-3",
      invite: "https://discord.gg/fQ9WuSQcYF",
      name: "Utility & Staff Systems",
      description: "Staff-focused server with advanced moderation tools and automation systems.",
      role: "Staff Member & System Architect",
      badges: ["Automated Moderation", "Channel Syncs", "Custom Bots"],
      automations: [
        "Staff notification system with priority levels",
        "Automated backup and logging system",
        "Cross-channel message syncing",
        "Member verification with CAPTCHA",
        "Auto-role based on activity",
        "Moderation dashboard with statistics",
      ],
    },
    {
      id: "server-4",
      invite: "https://discord.gg/Vnu47bq4",
      name: "Active Gaming Community",
      description: "Dynamic gaming community with focus on player engagement and competitive events.",
      role: "Moderator",
      badges: ["Custom Bots", "Reaction Roles", "Automated Moderation"],
      automations: [
        "Tournament bracket automation",
        "Player ranking and leaderboard system",
        "Automated match scheduling",
        "Anti-cheat detection alerts",
        "Voice channel management automation",
        "Achievement system with role rewards",
      ],
    },
    {
      id: "server-5",
      invite: "https://discord.gg/yessmartypie",
      name: "SmartPie Community",
      description: "Tech-focused community server with educational resources and collaborative projects.",
      role: "Server Creator",
      badges: ["Event Scheduler", "Custom Commands", "Channel Syncs"],
      automations: [
        "Resource categorization and auto-tagging",
        "Study group scheduling automation",
        "Code snippet sharing system",
        "Project showcase automation",
        "Collaborative event planning tools",
        "Automated resource updates",
      ],
    },
    {
      id: "server-6",
      invite: "https://discord.gg/SKz5Qc3r",
      name: "Community Server",
      description: "General purpose community server with comprehensive moderation and engagement systems.",
      role: "Moderator & Bot Developer",
      badges: ["Automated Moderation", "Reaction Roles", "Event Scheduler"],
      automations: [
        "Multi-level moderation system",
        "Automated content filtering",
        "Member onboarding flow",
        "Community polls and voting system",
        "Birthday celebration automation",
        "Activity-based role progression",
      ],
    },
  ];

  const copyInvite = (invite: string, serverName: string) => {
    navigator.clipboard.writeText(invite);
    toast.success(`${serverName} invite copied!`);
  };

  const openDiscord = (invite: string) => {
    window.open(invite, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Portfolio
            </Button>
          </Link>
          <a href="mailto:your@email.com">
            <Button variant="neon" size="sm" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Hire Me
            </Button>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]"></div>

        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-12 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">Discord Automation</span>
              <br />
              <span className="text-foreground">& Server Work</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Moderation, automation bots, invites, and community systems
            </p>
            <p className="text-sm text-muted-foreground">
              Built and managed by <span className="text-primary font-semibold">Jagmohan</span>
            </p>
          </div>

          {/* Experience Strip */}
          <div className="flex flex-wrap justify-center gap-3 mb-16 animate-slide-in-up">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="group relative bg-card/50 backdrop-blur-sm border border-border rounded-full px-6 py-3 hover:border-primary transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${exp.color} opacity-0 group-hover:opacity-10 rounded-full transition-opacity duration-300`}></div>
                <div className="relative flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-foreground">{exp.server}</span>
                  <span className="text-muted-foreground">—</span>
                  <span className="text-sm text-muted-foreground">{exp.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Server Showcase */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {servers.map((server, index) => (
              <Card
                key={server.id}
                className="group relative bg-card/50 backdrop-blur-sm border border-border hover:border-primary transition-all duration-500 overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <CardHeader className="relative">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                        {server.name}
                      </CardTitle>
                      <CardDescription className="text-sm mb-3">
                        {server.description}
                      </CardDescription>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <Users className="w-3 h-3" />
                        <span className="font-medium text-primary">{server.role}</span>
                      </div>
                    </div>
                  </div>

                  {/* Feature Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {server.badges.map((badge, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>

                <CardContent className="relative space-y-4">
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="neon"
                      size="sm"
                      onClick={() => openDiscord(server.invite)}
                      className="flex-1 gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Join Server
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyInvite(server.invite, server.name)}
                      className="gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </Button>
                  </div>

                  {/* Expandable Automation Details */}
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="automation" className="border-border/50">
                      <AccordionTrigger className="text-sm font-medium hover:text-primary transition-colors py-3">
                        <div className="flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          View Automation Details
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-2 space-y-2">
                          <p className="text-xs text-muted-foreground mb-3 font-semibold">
                            Implemented Automation Features:
                          </p>
                          <ul className="space-y-2">
                            {server.automations.map((automation, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                                <Bot className="w-3 h-3 mt-0.5 text-primary flex-shrink-0" />
                                <span>{automation}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-3 gradient-text">
                Need Discord Automation?
              </h3>
              <p className="text-muted-foreground mb-6">
                I build custom moderation systems, automation bots, and community management tools.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="mailto:your@email.com">
                  <Button variant="neon" size="lg" className="gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Contact Me
                  </Button>
                </a>
                <a href="https://discord.gg/6CdCgjsVua" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg" className="gap-2">
                    <ExternalLink className="w-5 h-5" />
                    Join My Discord
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default DiscordAutomation;
